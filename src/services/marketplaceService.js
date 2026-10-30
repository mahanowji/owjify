import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from '../utils/storage';
import { SEED_PROFESSIONALS } from '../data/professionals';
import { SEED_ADVERTISEMENTS } from '../data/advertisements';
import { SEED_REVIEWS } from '../data/reviews';
import { SEED_CONVERSATIONS } from '../data/conversations';
import { SEED_SKILL_REQUESTS } from '../data/skillRequests';
import { SEED_NOTIFICATIONS, SEED_INQUIRIES } from '../data/notifications';

function ensureSeeded(key, seedArray) {
  const stored = readStorage(key, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    writeStorage(key, seedArray);
    return seedArray;
  }
  return stored;
}

export const marketplaceService = {
  getProfessionals() {
    return ensureSeeded(STORAGE_KEYS.PROFESSIONALS, SEED_PROFESSIONALS);
  },

  saveProfessionals(list) {
    writeStorage(STORAGE_KEYS.PROFESSIONALS, list);
    return list;
  },

  getAdvertisements() {
    return ensureSeeded(STORAGE_KEYS.ADS, SEED_ADVERTISEMENTS);
  },

  // Alias for getAdvertisements
  getAds() {
    return this.getAdvertisements();
  },

  saveAdvertisements(list) {
    writeStorage(STORAGE_KEYS.ADS, list);
    return list;
  },

  getAdDraft() {
    return readStorage(STORAGE_KEYS.AD_DRAFT, null);
  },

  saveAdDraft(draft) {
    writeStorage(STORAGE_KEYS.AD_DRAFT, {
      ...draft,
      savedAt: new Date().toISOString(),
    });
  },

  clearAdDraft() {
    removeStorage(STORAGE_KEYS.AD_DRAFT);
  },

  getReviews() {
    return ensureSeeded(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  },

  saveReviews(list) {
    writeStorage(STORAGE_KEYS.REVIEWS, list);
    return list;
  },

  getFavoriteAds() {
    return readStorage(STORAGE_KEYS.FAVORITE_ADS, ['ad-102', 'ad-103']);
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
    return ensureSeeded(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  },

  saveConversations(list) {
    writeStorage(STORAGE_KEYS.CONVERSATIONS, list);
    return list;
  },

  getSkillRequests() {
    return ensureSeeded(STORAGE_KEYS.SKILL_REQUESTS, SEED_SKILL_REQUESTS);
  },

  saveSkillRequests(list) {
    writeStorage(STORAGE_KEYS.SKILL_REQUESTS, list);
    return list;
  },

  getNotifications() {
    return ensureSeeded(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  },

  saveNotifications(list) {
    writeStorage(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },

  getInquiries() {
    return ensureSeeded(STORAGE_KEYS.INQUIRIES, SEED_INQUIRIES);
  },

  saveInquiries(list) {
    writeStorage(STORAGE_KEYS.INQUIRIES, list);
    return list;
  },

  subscribeNewsletter(email) {
    const list = readStorage(STORAGE_KEYS.NEWSLETTER, []);
    if (!list.includes(email)) {
      list.push(email);
      writeStorage(STORAGE_KEYS.NEWSLETTER, list);
    }
    return list;
  },

  submitReport(report) {
    const list = readStorage(STORAGE_KEYS.REPORTS, []);
    const entry = { id: `rep_${Date.now()}`, ...report, createdAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.REPORTS, [entry, ...list]);
    return entry;
  },

  submitContactTicket(ticket) {
    const list = readStorage(STORAGE_KEYS.CONTACT_TICKETS, []);
    const entry = { id: `tkt_${Date.now()}`, ...ticket, createdAt: new Date().toISOString() };
    writeStorage(STORAGE_KEYS.CONTACT_TICKETS, [entry, ...list]);
    return entry;
  },
};
