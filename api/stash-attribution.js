// Menitipkan penanda iklan dari browser, supaya webhook Purchase bisa memakainya nanti.
//
// Kenapa ada: webhook dipanggil server Scalev, bukan browser pembeli. Jadi waktu Purchase
// ditembakkan, kita sudah tidak punya `_fbc` (ID klik iklan), `_fbp`, IP, maupun user agent
// pelanggan. Akibatnya match quality Purchase tertahan di 3,7 sementara OrderCreated -
// yang ditembakkan langsung dari browser - dapat 7,8. Selisihnya hampir seluruhnya dari
// empat field itu, dan `fbc` yang paling menentukan: tanpa dia Meta tidak bisa
// menghubungkan pembelian ke klik iklan yang menyebabkannya.
//
// Alurnya: checkout memanggil endpoint ini tepat setelah order dibuat, lalu webhook
// mengambilnya lagi lewat `order_id`.
//
// IP dan user agent DIBACA DARI PERMINTAAN INI, bukan dikirim browser dan bukan dibaca
// di webhook. Ini permintaan pelanggan sendiri, jadi nilainya benar. Kalau dibaca di
// webhook, yang tercatat IP server Scalev - salah, dan justru memperburuk pencocokan.

export const config = { runtime: 'edge' };

// 7 hari, sama dengan umur klik yang masih diakui Meta.
const TTL_DETIK = 7 * 24 * 3600;

// Batas panjang, supaya endpoint publik ini tidak bisa dipakai menjejali penyimpanan.
const MAKS = { order_id: 64, fbc: 255, fbp: 128, ua: 512, ip: 64 };

const potong = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');

export function kvConfig() {
  // Integrasi Vercel memberi nama berbeda tergantung versi marketplace-nya, jadi
  // dua-duanya diterima. Kalau belum tersambung, pemanggil harus tetap jalan.
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

/** Jalankan satu perintah Redis lewat REST Upstash (Edge tidak bisa koneksi TCP). */
export async function kvCommand(cfg, perintah) {
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(perintah),
  });
  if (!res.ok) throw new Error(`KV ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).result;
}

export const kunciAtribusi = (orderId) => `kb:attr:${orderId}`;

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Body bukan JSON', { status: 400 });
  }

  // Hanya bentuk order_id Scalev yang diterima - angka, huruf, dan tanda hubung.
  const orderId = potong(body && body.order_id, MAKS.order_id);
  if (!orderId || !/^[A-Za-z0-9-]+$/.test(orderId)) {
    return new Response('order_id tidak sah', { status: 400 });
  }

  const cfg = kvConfig();
  // Sengaja membalas 204, bukan error: checkout TIDAK BOLEH gagal cuma karena
  // penyimpanan penanda iklan belum tersambung. Ini pelengkap, bukan syarat.
  if (!cfg) return new Response(null, { status: 204 });

  const fwd = req.headers.get('x-forwarded-for') || '';
  const nilai = {
    fbc: potong(body.fbc, MAKS.fbc),
    fbp: potong(body.fbp, MAKS.fbp),
    ip: potong(fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || '', MAKS.ip),
    ua: potong(req.headers.get('user-agent') || '', MAKS.ua),
    t: Date.now(),
  };

  // Kalau tidak ada satu pun yang berguna, tidak usah menulis apa-apa.
  if (!nilai.fbc && !nilai.fbp && !nilai.ip && !nilai.ua) {
    return new Response(null, { status: 204 });
  }

  try {
    await kvCommand(cfg, ['SET', kunciAtribusi(orderId), JSON.stringify(nilai), 'EX', String(TTL_DETIK)]);
  } catch (err) {
    // Dicatat supaya kelihatan di log Vercel, tapi tetap 204 - lihat alasan di atas.
    console.error(`Gagal menyimpan penanda iklan untuk order ${orderId}: ${err.message}`);
  }

  return new Response(null, { status: 204 });
}
