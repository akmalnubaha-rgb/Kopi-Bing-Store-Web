// Konfigurasi & koneksi Storefront API Scalev untuk Kopi Bing
export const SCALEV = {
  base: "https://api.scalev.com",
  storeId: "store_8uaXOGu6tb9RH0CEOdEoEscx",
  apiKey: "sfpk_DnazlVlJQBAjgrNapSi66nllu4yVaJjutan47bScNkwuViWJ5wSxwaw6UnAhIVDn",
};

export const VARIANT_G = {
  "robusta-java-perfecto": { "Halus":[550587,550588,550589,550590], "Sedang":[553322,553323,553324,553325], "Kasar":[553326,553327,553328,553329], "Biji utuh":[553330,553331,553332,553333] },
  "robusta-sidikalang": { "Halus":[550596,550597,550598,550599], "Sedang":[553310,553311,553312,553313], "Kasar":[553314,553315,553316,553317], "Biji utuh":[553318,553319,553320,553321] },
  "robusta-gayo": { "Halus":[550600,550601,550602,550603], "Sedang":[553142,553143,553144,553145], "Kasar":[553146,553147,553148,553149], "Biji utuh":[553150,553151,553152,553153] },
  "robusta-lampung": { "Halus":[550604,550605,550606,550607], "Sedang":[553334,553335,553336,553337], "Kasar":[553338,553339,553340,553341], "Biji utuh":[553342,553343,553344,553345] },
  "robusta-toraja": { "Halus":[550608,550609,550610,550611], "Sedang":[553358,553359,553360,553361], "Kasar":[553362,553363,553364,553365], "Biji utuh":[553366,553367,553368,553369] },
  "robusta-lanang": { "Halus":[550612,550613,550614,550615], "Sedang":[553370,553371,553372,553373], "Kasar":[553374,553375,553376,553377], "Biji utuh":[553378,553379,553380,553381] },
  "arabika-aceh-gayo": { "Halus":[550616,550617,550618,550619], "Sedang":[553382,553383,553384,553386], "Kasar":[553387,553388,553389,553390], "Biji utuh":[553391,553392,553393,553394] },
  "arabika-gayo-wine": { "Halus":[550620,550621,550622,550623], "Sedang":[553395,553396,553397,553398], "Kasar":[553399,553400,553401,553402], "Biji utuh":[553403,553404,553405,553406] },
  "arabika-ijen-geisha": { "Halus":[550624,550625,550626,550627], "Sedang":[553407,553408,553409,553410], "Kasar":[553411,553412,553413,553414], "Biji utuh":[553415,553416,553417,553418] },
  "arabika-java-ijen": { "Halus":[550631,550632,550633,550634], "Sedang":[553419,553420,553421,553422], "Kasar":[553423,553424,553425,553426], "Biji utuh":[553427,553428,553429,553430] },
  "arabika-yellow-caturra": { "Halus":[550635,550636,550637,550638], "Sedang":[553431,553432,553433,553434], "Kasar":[553435,553436,553437,553438], "Biji utuh":[553439,553440,553441,553442] },
  "arabika-gn-halu": { "Halus":[550639,550640,550641,550642], "Sedang":[553443,553444,553445,553446], "Kasar":[553447,553448,553449,553450], "Biji utuh":[553451,553452,553453,553454] },
  "arabika-gn-puntang": { "Halus":[550643,550644,550645,550646], "Sedang":[553455,553456,553457,553458], "Kasar":[553459,553460,553461,553462], "Biji utuh":[553463,553464,553465,553466] },
  "arabika-papua-wamena": { "Halus":[550647,550648,550649,550650], "Sedang":[553467,553468,553469,553470], "Kasar":[553471,553472,553473,553474], "Biji utuh":[553475,553476,553477,553478] },
  "arabika-toraja": { "Halus":[550651,550652,550653,550654], "Sedang":[553479,553480,553481,553482], "Kasar":[553483,553484,553485,553486], "Biji utuh":[553487,553508,553509,553510] },
  "espresso-bold-blend": { "Halus":[550655,550656,550657,550658], "Sedang":[553511,553512,553513,553514], "Kasar":[553515,553516,553517,553518], "Biji utuh":[553519,553520,553521,553522] },
  "arabusta-blend-50-50": { "Halus":[550659,550660,550661,550662], "Sedang":[553523,553524,553525,553526], "Kasar":[553527,553528,553529,553530], "Biji utuh":[553531,553532,553533,553534] },
  "premium-blend-a70": { "Halus":[550663,550664,550665,550666], "Sedang":[553535,553536,553537,553538], "Kasar":[553539,553540,553541,553542], "Biji utuh":[553543,553544,553545,553546] },
  "robusta-temanggung": { "Halus":[552206,552207,552208,552209], "Sedang":[553346,553347,553348,553349], "Kasar":[553350,553351,553352,553353], "Biji utuh":[553354,553355,553356,553357] },
};

const WEIGHTS = [100,250,500,1000];
export function variantId(slug, g, grind){
  const m = VARIANT_G[slug]; if(!m) return null;
  const arr = m[grind] || m["Sedang"] || m["Halus"]; if(!arr) return null;
  const i = WEIGHTS.indexOf(Number(g)); return i<0 ? null : arr[i];
}

function url(path){ return `${SCALEV.base}/v3/stores/${SCALEV.storeId}${path}`; }
function headers(json){
  const h = { "X-Scalev-Storefront-Api-Key": SCALEV.apiKey };
  if(json) h["Content-Type"] = "application/json";
  return h;
}
async function get(path){
  const r = await fetch(url(path), { credentials:"omit", headers:headers(false) });
  if(!r.ok) throw new Error("Scalev GET "+path+" gagal ("+r.status+")");
  return r.json();
}
async function post(path, body){
  const r = await fetch(url(path), { method:"POST", credentials:"omit", headers:headers(true), body:JSON.stringify(body) });
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error((j && j.error) ? j.error : ("Scalev POST "+path+" gagal ("+r.status+")"));
  return j;
}

// items dari cart -> format Scalev
export function toItems(cart){
  return cart.map(it => ({ type:"variant", variant_id: it.vid || variantId(it.slug, it.g, it.grind), quantity: it.qty }));
}

export function searchLocations(q){ return get(`/public/locations?search=${encodeURIComponent(q)}`).then(j=>j.data||[]); }
export function postalCodes(locId){ return get(`/public/locations/${locId}/postal-codes`).then(j=>j.data||[]); }
export function getOrder(secret_slug){ return get(`/public/orders/${secret_slug}`); }
export function paymentMethods(){ return get(`/public/payment-methods`).then(j=>j.data||[]); }
// Bikin instruksi bayar (nomor VA / link e-wallet / QR). Idempoten: kalau sudah ada, yang lama dikembalikan.
export function createPayment(secret_slug){ return post(`/public/orders/${secret_slug}/payment`, {}).then(j=>j.data||j); }

export function shippingOptions(items, location_id, postal_code, payment_method="bank_transfer"){
  return post(`/public/checkout/shipping-options`, { items, destination:{ location_id, postal_code }, payment_method }).then(j=>j.data||[]);
}
export function createOrder(payload){
  return post(`/public/checkout`, payload);
}

async function patch(path, body){
  const r = await fetch(url(path), { method:"PATCH", credentials:"omit", headers:headers(true), body:JSON.stringify(body) });
  const j = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error((j && j.error) ? j.error : ("Scalev PATCH "+path+" gagal ("+r.status+")"));
  return j;
}
export function patchOrder(secret_slug, body){ return patch(`/public/orders/${secret_slug}`, body); }

// --- Bukti transfer manual ---
// Alurnya 3 langkah: minta URL upload -> kirim filenya ke URL itu -> tempelkan file_url ke order.
export function transferProofUpload(secret_slug, meta){
  return post(`/public/orders/${secret_slug}/transfer-proof-upload`, meta).then(j=>j.data||j);
}
// upload_url sudah bertanda tangan, jadi JANGAN dikirimi API key. Content-Type wajib sama persis.
export async function putFile(upload_url, file){
  const r = await fetch(upload_url, { method:"PUT", credentials:"omit", headers:{ "Content-Type": file.type }, body:file });
  if(!r.ok) throw new Error("Upload bukti gagal ("+r.status+")");
  return true;
}

// --- Meta Conversions API (server relay via Scalev) + atribusi ---
function _cookie(n){ try{ return document.cookie.split('; ').find(function(r){return r.indexOf(n+'=')===0;}); }catch(e){ return null; } }
export function fbAttribution(){
  function val(n){ const c=_cookie(n); return c ? decodeURIComponent(c.split('=')[1]) : ''; }
  return { fbc: val('_fbc'), fbp: val('_fbp') };
}
export async function metaEvent(payload){
  try{
    await fetch(url('/public/analytics/meta/events'), { method:'POST', credentials:'omit', headers:headers(true), body:JSON.stringify(payload) });
  }catch(e){}
}

export const META_STD=['PageView','ViewContent','AddToCart','InitiateCheckout','AddPaymentInfo','Purchase','Lead','Contact','Search','Subscribe','CompleteRegistration'];
// Satu event dikirim lewat dua jalur: pixel browser + CAPI server (relay Scalev).
// eventId WAJIB sama di dua jalur itu, kalau tidak Meta menghitungnya dua kali.
// Nama di luar META_STD dikirim sebagai custom event.
// `items` (variants / bundle_price_options) hanya dikirim ke relay server, bukan ke pixel browser.
export function trackMeta(name, parameters, eventId, userData, items){
  const at=fbAttribution();
  if(typeof window!=='undefined' && window.fbq) window.fbq(META_STD.indexOf(name)>=0?'track':'trackCustom', name, parameters, {eventID:eventId});
  return metaEvent(Object.assign({
    event_source_url:location.href, referrer_url:document.referrer||undefined,
    user_data:Object.assign({country:'id', fbp:at.fbp||undefined, fbc:at.fbc||undefined}, userData||{}),
    events:[{ event_id:eventId, event_name:name, parameters:parameters }],
  }, items||{}));
}

// Payload analytics Scalev memakai unique id (`variant_xxx`), BUKAN id numerik yang dipakai checkout.
// Untungnya respons order (checkout maupun getOrder) sudah memuat peta `variants` berisi unique id itu,
// jadi tidak perlu menyimpan peta terjemahan sendiri di frontend.
export function analyticsItems(order){
  const pick=(map, key)=> Object.keys(map||{}).map(function(k){
    const v=map[k]||{};
    return { id:v[key], quantity:Number(v.quantity)||1 };
  }).filter(function(x){ return !!x.id; });

  const variants=pick(order&&order.variants, 'variant_unique_id');
  const bundles=pick(order&&order.bundle_price_options, 'bundle_price_option_unique_id');

  const items={};
  if(variants.length) items.variants=variants.map(function(v){ return { variant_unique_id:v.id, quantity:v.quantity }; });
  if(bundles.length) items.bundle_price_options=bundles.map(function(b){ return { bundle_price_option_unique_id:b.id, quantity:b.quantity }; });

  const all=variants.concat(bundles);
  return {
    items:items,
    content_ids: all.map(function(x){ return x.id; }),
    num_items: all.reduce(function(s,x){ return s+x.quantity; }, 0),
  };
}

// Payload order publik menyensor HP & alamat, dan orderline-nya tidak memuat variant_id.
// Jadi data untuk Purchase dititipkan dari checkout, dipakai lagi di halaman pesanan.
// Titipan ini memuat nomor HP pelanggan, jadi umurnya dibatasi dan dihapus
// begitu Purchase berhasil ditembakkan. Jangan biarkan mengendap di HP bersama.
const OMETA_PREFIX='kb_ometa_';
const OMETA_TTL=7*24*60*60*1000; // 7 hari

export function stashOrderMeta(orderId, data){
  try{ localStorage.setItem(OMETA_PREFIX+orderId, JSON.stringify(Object.assign({t:Date.now()}, data))); }catch(e){}
}
export function readOrderMeta(orderId){
  try{
    const raw=localStorage.getItem(OMETA_PREFIX+orderId);
    if(!raw) return null;
    const d=JSON.parse(raw);
    if(!d || !d.t || (Date.now()-d.t)>OMETA_TTL){ clearOrderMeta(orderId); return null; }
    return d;
  }catch(e){ return null; }
}
export function clearOrderMeta(orderId){
  try{ localStorage.removeItem(OMETA_PREFIX+orderId); }catch(e){}
}
// Sapu titipan kedaluwarsa, termasuk sisa versi lama yang belum punya stempel waktu.
export function sweepOrderMeta(){
  try{
    for(let i=localStorage.length-1;i>=0;i--){
      const k=localStorage.key(i);
      if(!k || k.indexOf(OMETA_PREFIX)!==0) continue;
      let d=null;
      try{ d=JSON.parse(localStorage.getItem(k)||'null'); }catch(e){}
      if(!d || !d.t || (Date.now()-d.t)>OMETA_TTL) localStorage.removeItem(k);
    }
  }catch(e){}
}

// `lp` (mode corong iklan) disusun jadi tautan "/{lp}". Tanpa penyaringan, nilai
// seperti "/situs-lain.com" menghasilkan "//situs-lain.com" yang dibaca browser
// sebagai alamat eksternal - open redirect memakai nama domain kita.
export function safeLp(value){
  const v=String(value||'');
  return /^[a-z0-9-]{1,64}$/i.test(v) ? v : '';
}
// Penjaga supaya satu order cuma menembakkan Purchase sekali per browser.
export function purchaseFired(orderId){
  try{ return !!localStorage.getItem('kb_purchase_'+orderId); }catch(e){ return false; }
}
export function markPurchaseFired(orderId){
  try{ localStorage.setItem('kb_purchase_'+orderId,'1'); }catch(e){}
}
