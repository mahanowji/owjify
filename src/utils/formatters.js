const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const DAY_LABELS = {
  sat: { fa: 'شنبه', en: 'Sat' },
  sun: { fa: 'یکشنبه', en: 'Sun' },
  mon: { fa: 'دوشنبه', en: 'Mon' },
  tue: { fa: 'سه‌شنبه', en: 'Tue' },
  wed: { fa: 'چهارشنبه', en: 'Wed' },
  thu: { fa: 'پنج‌شنبه', en: 'Thu' },
  fri: { fa: 'جمعه', en: 'Fri' },
};

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
  if (typeof value === 'string') {
    if (value.includes('|')) {
      const parts = value
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      if (parts.length >= 2) {
        return lang === 'en' ? parts[1] : parts[0];
      }
    }
    return value;
  }
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.fa || value.en || '';
  }
  return String(value);
}

export function toLocalizedPair(value, fallbackFa = '', fallbackEn = '') {
  if (!value) {
    return { fa: fallbackFa, en: fallbackEn || fallbackFa };
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return {
      fa: value.fa || value.en || fallbackFa,
      en: value.en || value.fa || fallbackEn || fallbackFa,
    };
  }
  const str = String(value).trim();
  if (str.includes('|')) {
    const [faPart, enPart] = str.split('|').map((s) => s.trim());
    return {
      fa: faPart || enPart || fallbackFa,
      en: enPart || faPart || fallbackEn,
    };
  }
  return { fa: str, en: str };
}

export function formatAvailabilityDays(days, lang = 'fa') {
  if (!days) return '';
  if (Array.isArray(days)) {
    const mapped = days.map((d) => DAY_LABELS[d]?.[lang] || d);
    return lang === 'fa' ? mapped.join('، ') : mapped.join(', ');
  }
  return loc(days, lang);
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

export const formatRelativeDate = formatRelativeTime;

export function formatTimeClock(isoDate, lang = 'fa') {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const clock = `${hh}:${mm}`;
  return lang === 'fa' ? toPersianDigits(clock) : clock;
}
