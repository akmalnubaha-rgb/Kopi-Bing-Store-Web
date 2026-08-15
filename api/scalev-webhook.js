// Penerima webhook Scalev -> kirim event Purchase ke Meta Conversions API.
//
// Kenapa ada: event Purchase dari browser hanya menyala kalau pelanggan masih
// membuka halaman pesanan saat pembayarannya dikonfirmasi. Yang menutup halaman
// lalu transfer belakangan tidak pernah terhitung. Webhook ini menutup celah itu
// dari sisi server.
//
// Kenapa memanggil Meta langsung, bukan relay Scalev: dokumentasi Storefront API
// melarang menaruh API itu di belakang backend sendiri, dan relay mengisi IP/user
// agent dari request yang dia terima - kalau dipanggil dari server, yang tercatat
// IP server kita, bukan pelanggan.
//
// Dedup: event_id memakai pola yang sama dengan browser ({order_id}-Purchase),
// jadi kalau dua-duanya terkirim Meta menghitungnya satu.
//
// Environment variable yang WAJIB diisi di Vercel (jangan pernah ditulis di kode):
//   SCALEV_WEBHOOK_SECRET  - Signing Secret dari Settings > Developers > Webhooks
//   META_PIXEL_ID          - 1134999975422565
//   META_CAPI_TOKEN        - access token Conversions API
// Opsional:
//   META_TEST_EVENT_CODE   - isi saat menguji; event masuk ke Test Events saja

import crypto from 'node:crypto';

const GRAPH_VERSION = 'v21.0';
const STORE_URL = 'https://kopibing.id';

// Meta minta PII di-hash SHA-256 setelah dinormalkan.
const sha256 = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const norm = (s) => String(s == null ? '' : s).trim().toLowerCase();

function hashPlain(value) {
  const v = norm(value);
  return v ? sha256(v) : undefined;
}
function hashPhone(value) {
  const v = String(value == null ? '' : value).replace(/\D/g, '');
  return v ? sha256(v) : undefined;
}
// Kota & provinsi: huruf kecil, tanpa spasi dan tanda baca.
function hashPlace(value) {
  const v = norm(value).replace(/[^a-z0-9]/g, '');
  return v ? sha256(v) : undefined;
}

function splitName(full) {
  const parts = norm(full).split(/\s+/).filter(Boolean);
  if (!parts.length) return {};
  return { fn: sha256(parts[0]), ln: parts.length > 1 ? sha256(parts[parts.length - 1]) : undefined };
}

function verifySignature(rawBody, header, secret) {
  if (!header || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(header));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function buildPurchase(order) {
  const lines = Array.isArray(order.orderlines) ? order.orderlines : [];
  const contents = lines
    .filter((l) => l.variant_unique_id)
    .map((l) => ({
      id: l.variant_unique_id,
      quantity: Number(l.quantity) || 1,
      item_price: Number(l.variant_price) || 0,
    }));

  const dest = order.destination_address || {};
  const name = splitName(dest.name);

  const userData = {
    em: hashPlain(dest.email),
    ph: hashPhone(dest.phone),
    fn: name.fn,
    ln: name.ln,
    ct: hashPlace(dest.city),
    st: hashPlace(dest.province),
    country: sha256('id'),
    external_id: order.customer_id ? sha256(String(order.customer_id)) : undefined,
  };
  // Buang field kosong; Meta menolak nilai null.
  Object.keys(userData).forEach((k) => userData[k] === undefined && delete userData[k]);

  const paidAt = order.paid_time ? Math.floor(new Date(order.paid_time).getTime() / 1000) : null;

  return {
    event_name: 'Purchase',
    // Pola event_id HARUS sama dengan yang ditembakkan browser di pesanan.astro.
    event_id: `${order.order_id}-Purchase`,
    event_time: paidAt && !Number.isNaN(paidAt) ? paidAt : Math.floor(Date.now() / 1000),
    action_source: 'website',
    // Harus domain yang ada di Traffic Permissions pixel, kalau tidak Meta membuangnya.
    event_source_url: `${STORE_URL}/o/${order.secret_slug}`,
    user_data: userData,
    custom_data: {
      currency: 'IDR',
      value: Number(order.gross_revenue) || 0,
      content_type: 'product',
      content_ids: contents.map((c) => c.id),
      contents,
      num_items: contents.reduce((s, c) => s + c.quantity, 0),
      order_id: order.order_id,
    },
  };
}

async function sendToMeta(event) {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) throw new Error('META_PIXEL_ID atau META_CAPI_TOKEN belum diisi');

  const body = { data: [event] };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${text.slice(0, 300)}`);
  return text;
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Body mentah dibaca dulu: HMAC dihitung atas teks apa adanya, bukan hasil parse.
  const raw = await request.text();

  if (!verifySignature(raw, request.headers.get('x-scalev-hmac-sha256'), process.env.SCALEV_WEBHOOK_SECRET)) {
    return new Response('Invalid signature', { status: 401 });
  }

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const event = payload.event;
  const order = payload.data || {};

  // Dikirim Scalev saat pertama kali menyimpan pengaturan webhook. Harus 200.
  if (event === 'business.test_event') {
    return Response.json({ ok: true, note: 'test event diterima' });
  }

  const relevan = event === 'order.payment_status_changed' || event === 'order.status_changed';
  const lunas = String(order.payment_status || '').toLowerCase() === 'paid';
  const cod = String(order.payment_method || '').toLowerCase() === 'cod';

  // Alasan melewatkan, semuanya disengaja:
  // - COD sudah ditembakkan browser saat order dibuat (bayarnya ke kurir).
  // - Order spam jangan dijadikan sinyal optimasi.
  if (!relevan || !lunas || cod || order.is_probably_spam || !order.order_id) {
    return Response.json({ ok: true, skipped: true, event });
  }

  try {
    await sendToMeta(buildPurchase(order));
    // Sengaja tidak mencatat isi order: payload webhook memuat nama, alamat, dan HP.
    console.log(`Purchase terkirim ke Meta untuk order ${order.order_id}`);
    return Response.json({ ok: true, sent: order.order_id });
  } catch (err) {
    console.error(`Gagal kirim Purchase untuk order ${order.order_id}: ${err.message}`);
    // 500 supaya Scalev bisa mencoba ulang; event_id yang sama membuat kiriman
    // ulang tetap aman, Meta akan men-dedup.
    return new Response('Gagal meneruskan ke Meta', { status: 500 });
  }
}
