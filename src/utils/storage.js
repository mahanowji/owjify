// Persistent Storage Utility with Graceful In-Memory Fallback
const memoryFallback = new Map();

const PREFIX = 'owjify_v6_';

export const STORAGE_KEYS = {
  LANG: 'owjify_lang',
  USERS: `${PREFIX}users`,
  SESSION: `${PREFIX}session`,
  VERIFICATION: `${PREFIX}verification`,
  RESET_TOKENS: `${PREFIX}reset_tokens`,
  CATEGORIES: `${PREFIX}categories`,
  ADS: `${PREFIX}advertisements`,
  AD_DRAFT: `${PREFIX}ad_draft`,
  PROFESSIONALS: `${PREFIX}professionals`,
  REVIEWS: `${PREFIX}reviews`,
  FAVORITE_ADS: `${PREFIX}fav_ads`,
  FAVORITE_PROS: `${PREFIX}fav_pros`,
  CONVERSATIONS: `${PREFIX}conversations`,
  NOTIFICATIONS: `${PREFIX}notifications`,
  REPORTS: `${PREFIX}reports`,
  SUPPORT_TICKETS: `${PREFIX}support_tickets`,
  INQUIRIES: `${PREFIX}inquiries`,
  SETTINGS: `${PREFIX}settings`,
};

export function readStorage(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return memoryFallback.has(key) ? memoryFallback.get(key) : defaultValue;
    }
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return memoryFallback.has(key) ? memoryFallback.get(key) : defaultValue;
  }
}

export function writeStorage(key, value) {
  try {
    memoryFallback.set(key, value);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  try {
    memoryFallback.delete(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore storage quota / privacy mode errors
  }
}

export function clearAllDemoStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    if (key !== STORAGE_KEYS.LANG) {
      removeStorage(key);
    }
  });
}
