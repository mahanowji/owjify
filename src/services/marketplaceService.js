import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from '../utils/storage';
import { CATEGORIES } from '../data/categories';
import { SEED_ADVERTISEMENTS } from '../data/advertisements';
import { SEED_PROFESSIONALS } from '../data/professionals';
import { SEED_REVIEWS } from '../data/reviews';
import { SEED_CONVERSATIONS } from '../data/conversations';
import { SEED_NOTIFICATIONS, SEED_INQUIRIES } from '../data/notifications';

const DEFAULT_CATEGORIES = CATEGORIES.map((cat) => ({
  ...cat,
  active: cat.active !== false,
}));

export const marketplaceService = {
  getCategories() {
    const saved = readStorage(STORAGE_KEYS.CATEGORIES, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return saved;
  },

  saveCategories(list) {
    writeStorage(STORAGE_KEYS.CATEGORIES, list);
    return list;
  },

  getAdvertisements() {
    const saved = readStorage(STORAGE_KEYS.ADS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.ADS, SEED_ADVERTISEMENTS);
      return SEED_ADVERTISEMENTS;
    }
    return saved;
  },

  saveAdvertisements(ads) {
    writeStorage(STORAGE_KEYS.ADS, ads);
    return ads;
  },

  getProfessionals() {
    const saved = readStorage(STORAGE_KEYS.PROFESSIONALS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.PROFESSIONALS, SEED_PROFESSIONALS);
      return SEED_PROFESSIONALS;
    }
    return saved;
  },

  saveProfessionals(pros) {
    writeStorage(STORAGE_KEYS.PROFESSIONALS, pros);
    return pros;
  },

  getReviews() {
    const saved = readStorage(STORAGE_KEYS.REVIEWS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
      return SEED_REVIEWS;
    }
    return saved;
  },

  saveReviews(reviews) {
    writeStorage(STORAGE_KEYS.REVIEWS, reviews);
    return reviews;
  },

  getFavoriteAds() {
    return readStorage(STORAGE_KEYS.FAVORITE_ADS, ['ad-1', 'ad-3']);
  },

  saveFavoriteAds(ids) {
    writeStorage(STORAGE_KEYS.FAVORITE_ADS, ids);
    return ids;
  },

  getFavoritePros() {
    return readStorage(STORAGE_KEYS.FAVORITE_PROS, ['pro-2']);
  },

  saveFavoritePros(ids) {
    writeStorage(STORAGE_KEYS.FAVORITE_PROS, ids);
    return ids;
  },

  getConversations() {
    const saved = readStorage(STORAGE_KEYS.CONVERSATIONS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
      return SEED_CONVERSATIONS;
    }
    return saved;
  },

  saveConversations(convs) {
    writeStorage(STORAGE_KEYS.CONVERSATIONS, convs);
    return convs;
  },

  getNotifications() {
    const saved = readStorage(STORAGE_KEYS.NOTIFICATIONS, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
      return SEED_NOTIFICATIONS;
    }
    return saved;
  },

  saveNotifications(items) {
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, items);
    return items;
  },

  getInquiries() {
    const saved = readStorage(STORAGE_KEYS.INQUIRIES, null);
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      writeStorage(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
      return SEED_INQUIRIES;
    }
    return saved;
  },

  saveInquiries(items) {
    writeStorage(STORAGE_KEYS.INQUIRIES, items);
    return items;
  },

  getReports() {
    return readStorage(STORAGE_KEYS.REPORTS, []);
  },

  saveReports(list) {
    writeStorage(STORAGE_KEYS.REPORTS, list);
    return list;
  },

  getAdDraft() {
    return readStorage(STORAGE_KEYS.AD_DRAFT, null);
  },

  saveAdDraft(draft) {
    writeStorage(STORAGE_KEYS.AD_DRAFT, draft);
  },

  clearAdDraft() {
    removeStorage(STORAGE_KEYS.AD_DRAFT);
  },

  submitReport(report) {
    const list = readStorage(STORAGE_KEYS.REPORTS, []);
    const item = {
      id: `rep_${Date.now()}`,
      status: 'open',
      ...report,
      createdAt: new Date().toISOString(),
    };
    list.unshift(item);
    writeStorage(STORAGE_KEYS.REPORTS, list);
    return item;
  },
};
