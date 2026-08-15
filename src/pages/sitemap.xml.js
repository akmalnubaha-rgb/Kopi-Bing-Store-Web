import { products } from '../data/products.js';

// Sitemap dibuat saat build. Halaman keranjang/checkout/pesanan sengaja tidak dimasukkan.
export function GET({ site }) {
  const base = (site ?? new URL('https://kopibing.id')).href.replace(/\/$/, '');
  const paths = [
    { loc: '/', priority: '1.0' },
    { loc: '/temukan', priority: '0.6' },
    ...products.map(p => ({ loc: `/produk/${p.slug}`, priority: '0.8' })),
  ];
  const today = new Date().toISOString().slice(0, 10);
  const urls = paths.map(p =>
    `  <url>\n    <loc>${base}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } }
  );
}
