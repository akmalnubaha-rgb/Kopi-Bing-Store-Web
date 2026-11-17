// Satu set ikon untuk seluruh situs (gaya Lucide: kotak 24, garis currentColor, ujung bulat).
// Dipakai lewat <Icon name="..."> di markup Astro, atau svgIkon('...') di skrip yang
// membangun HTML sendiri (checkout, pesanan, kuis). Ukuran bawaan 1em: ikut besar huruf.
// Ikon merek (WhatsApp, TikTok, Facebook) sengaja tetap bentuk isi supaya mudah dikenali.

const GARIS = {
  'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  'arrow-down': '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  'cart': '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'paperclip': '<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  'copy': '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  'instagram': '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  'shopee': '<path d="M4.5 8h15l-1.2 11.2a2 2 0 0 1-2 1.8H7.7a2 2 0 0 1-2-1.8L4.5 8Z"/><path d="M8.5 8V7a3.5 3.5 0 0 1 7 0v1"/><path d="M14.3 12.3c-.5-.6-1.3-.9-2.2-.9-1.1 0-1.9.6-1.9 1.4 0 1.9 4.2 1 4.2 3 0 .9-.9 1.6-2.2 1.6-1 0-1.9-.4-2.4-1"/>',
};

const ISI = {
  'star': '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
  'whatsapp': '<path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8.9-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2 0-.2 0-.3-.1-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.3 1 2.6 1.1 2.8.2.2 2 3 4.7 4.2 1.7.7 2.3.8 3.1.7.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.4-.3Z"/>',
  'tiktok': '<path d="M16.5 3c.3 2.1 1.6 3.6 3.5 3.9v2.6c-1.3 0-2.5-.4-3.5-1v5.9c0 3.2-2.4 5.6-5.5 5.6A5.5 5.5 0 0 1 5.5 14c0-3 2.3-5.4 5.3-5.5v2.7a2.8 2.8 0 1 0 2 2.7V3h3.7Z"/>',
  'facebook': '<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z"/>',
};

export const STROKE = 1.75;

/**
 * @param {string} name
 * @param {{ size?: number|string, cls?: string, stroke?: number, draw?: boolean, label?: string }} [o]
 *   draw: tiap garis diberi pathLength=1 supaya bisa "digambar" lewat stroke-dashoffset.
 */
export function svgIkon(name, o = {}) {
  const isi = ISI[name];
  let dalam = isi || GARIS[name];
  if (!dalam) return '';
  if (o.draw) dalam = dalam.replace(/<(path|circle|rect)\s/g, '<$1 pathLength="1" ');
  const s = o.size ?? '1em';
  const cat = isi
    ? 'fill="currentColor"'
    : `fill="none" stroke="currentColor" stroke-width="${o.stroke ?? STROKE}" stroke-linecap="round" stroke-linejoin="round"`;
  const a11y = o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"';
  return `<svg class="ik ik-${name}${o.cls ? ' ' + o.cls : ''}" viewBox="0 0 24 24" width="${s}" height="${s}" ${cat} ${a11y} focusable="false">${dalam}</svg>`;
}
