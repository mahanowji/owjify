const PREFIX = 'owjify_v3_';

export const STORAGE_KEYS = {
  LANG: `${PREFIX}lang`,
  USERS: `${PREFIX}users`,
  SESSION: `${PREFIX}session`,
  PENDING_VERIFY: `${PREFIX}pending_verify`,
  RESET_TOKENS: `${PREFIX}reset_tokens`,
  ADS: `${PREFIX}advertisements`,
  AD_DRAFT: `${PREFIX}ad_draft`,
  PROFESSIONALS: `${PREFIX}professionals`,
  REVIEWS: `${PREFIX}reviews`,
  FAVORITE_ADS: `${PREFIX}fav_ads`,
  FAVORITE_PROS: `${PREFIX}fav_pros`,
  CONVERSATIONS: `${PREFIX}conversations`,
  SKILL_REQUESTS: `${PREFIX}skill_requests`,
  SUPPORT_TICKETS: `${PREFIX}support_tickets`,
  CRM_META: `${PREFIX}crm_meta`,
  NOTIFICATIONS: `${PREFIX}notifications`,
  INQUIRIES: `${PREFIX}inquiries`,
  NEWSLETTER: `${PREFIX}newsletter`,
  REPORTS: `${PREFIX}reports`,
  CONTACT_TICKETS: `${PREFIX}contact_tickets`,
  SETTINGS: `${PREFIX}user_settings`,
};

export function readStorage(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

export function clearAllDemoStorage() {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
  } catch {
    // ignore
  }
}
