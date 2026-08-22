import { Language } from '@/types/game';

export function fmt(n: number): string {
  if (n < 0) return '0.00';
  if (n < 1000) return n.toFixed(n < 10 ? 2 : 1);
  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  let u = -1;
  let val = n;
  while (val >= 1000 && u < units.length - 1) {
    val /= 1000;
    u++;
  }
  return val.toFixed(2) + units[u];
}

export function fmtInt(n: number): string {
  if (n < 1000) return String(Math.round(n));
  return fmt(n);
}

export function formatDuration(sec: number, lang: Language = 'th'): string {
  sec = Math.round(sec);
  const isEn = lang === 'en';

  if (sec < 60) {
    return isEn ? `${sec}s` : `${sec} วินาที`;
  }
  const m = Math.floor(sec / 60);
  if (m < 60) {
    return isEn ? `${m}m` : `${m} นาที`;
  }
  const h = Math.floor(m / 60);
  const rm = m % 60;
  if (h < 24) {
    return isEn ? `${h}h ${rm}m` : `${h} ชม. ${rm} นาที`;
  }
  const d = Math.floor(h / 24);
  const rh = h % 24;
  return isEn ? `${d}d ${rh}h` : `${d} วัน ${rh} ชม.`;
}
