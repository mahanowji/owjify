const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

export function formatNumber(num, lang = 'fa') {
  if (num === null || num === undefined || Number.isNaN(Number(num))) return '';
  const formatted = Number(num).toLocaleString('en-US');
  return lang === 'fa' ? toPersianDigits(formatted) : formatted;
}

export function loc(value, lang = 'fa') {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.fa || value.en || '';
  }
  return String(value);
}

export function formatPrice(adOrAmount, lang = 'fa') {
  if (!adOrAmount && adOrAmount !== 0) return '';
  let toman = 0;
  let usd = 0;

  if (typeof adOrAmount === 'object') {
    toman = Number(adOrAmount.price || 0);
    usd = Number(adOrAmount.priceUsd || Math.max(15, Math.round(toman / 50000)));
  } else {
    toman = Number(adOrAmount);
    usd = Math.max(15, Math.round(toman / 50000));
  }

  if (lang === 'fa') {
    return `${toPersianDigits(toman.toLocaleString('en-US'))} تومان`;
  }
  return `$${usd.toLocaleString('en-US')}`;
}

export function formatRelativeTime(isoDate, lang = 'fa') {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const now = new Date('2026-10-30T14:00:00Z');
  const realNow = Date.now() > now.getTime() ? Date.now() : now.getTime();
  const diffMs = Math.max(0, realNow - date.getTime());
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 2) {
    return lang === 'fa' ? 'لحظاتی پیش' : 'Just now';
  }
  if (mins < 60) {
    return lang === 'fa' ? `${toPersianDigits(mins)} دقیقه پیش` : `${mins}m ago`;
  }
  if (hours < 24) {
    return lang === 'fa' ? `${toPersianDigits(hours)} ساعت پیش` : `${hours}h ago`;
  }
  if (days < 30) {
    return lang === 'fa' ? `${toPersianDigits(days)} روز پیش` : `${days}d ago`;
  }
  const months = Math.max(1, Math.floor(days / 30));
  return lang === 'fa' ? `${toPersianDigits(months)} ماه پیش` : `${months}mo ago`;
}

export function formatTimeClock(isoDate, lang = 'fa') {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const clock = `${hh}:${mm}`;
  return lang === 'fa' ? toPersianDigits(clock) : clock;
}

export const formatRelativeDate = formatRelativeTime;
