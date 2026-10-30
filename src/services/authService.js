import { STORAGE_KEYS, readStorage, writeStorage, removeStorage } from '../utils/storage';
import { isValidEmail, evaluatePasswordStrength } from '../utils/validators';

/**
 * OWJIFY Authentication & Role Service Layer
 * ---------------------------------------------------------------------------
 * IMPORTANT ARCHITECTURE & SECURITY NOTE:
 * This module operates in frontend simulation mode using browser localStorage
 * when no remote backend URL (VITE_API_BASE_URL) is configured.
 * Client-side localStorage persistence is strictly for UI demonstration and prototyping
 * and is NOT production-secure.
 *
 * REST / ASP.NET Core Integration Contract:
 * - POST /api/auth/login           -> User / Specialist / Admin JWT authentication
 * - POST /api/operator/auth/login  -> Dedicated Operator Support Console authentication
 * - POST /api/auth/register        -> Creates account + dispatches email verification code
 */

const API_BASE =
  typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : null;

export const AUTH_API_CONFIG = {
  mode: API_BASE ? 'LIVE_REST_API' : 'FRONTEND_SIMULATION',
  aspNetBaseUrl: API_BASE || '/api/auth',
  operatorLoginUrl: `${API_BASE || '/api'}/operator/auth/login`,
};

const DEFAULT_DEMO_USERS = [
  {
    id: 'user-admin-mahan',
    proId: null,
    fullName: 'ماهان اوجی | Mahan Owji',
    email: 'mahanowji1380@gmail.com',
    passwordSim: 'Owjify@2026',
    accountType: 'admin',
    crmStage: 'VIP',
    crmNotes: 'Founder & Lead Software Administrator of OWJIFY.',
    emailVerified: true,
    avatar:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    cover:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    title: 'بنیان‌گذار و مدیر ارشد نرم‌افزار اوجیفای | Founder & Platform Admin',
    locationId: 'tehran',
    bio: 'بنیان‌گذار اوجیفای؛ با هدف پیوند دادن انسان‌ها، مهارت‌ها و فرصت‌های واقعی به یکدیگر.',
    phone: '09120001380',
    experienceYears: 8,
    skills: ['مدیریت پلتفرم', 'معماری نرم‌افزار', 'راهبری محصول'],
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'user-operator-demo',
    proId: null,
    fullName: 'سحر پناهی | Sahar Panahi',
    email: 'operator@owjify.com',
    passwordSim: 'Owjify@2026',
    accountType: 'operator',
    crmStage: 'Active',
    crmNotes: 'Senior Trust, Safety & Support Operator.',
    emailVerified: true,
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    cover:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    title: 'اپراتور ارشد پشتیبانی و رسیدگی به گزارش‌ها | Support Operator',
    locationId: 'tehran',
    bio: 'پاسخ‌گویی سریع به تیکت‌های کاربران و بررسی گزارش‌های بازارگاه از طریق API پشتیبانی.',
    phone: '09121112233',
    experienceYears: 6,
    skills: ['پشتیبانی کاربران', 'رسیدگی به گزارش‌ها', 'کنترل کیفیت'],
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-pro-demo',
    proId: 'pro-1',
    fullName: 'آرین رادمهر | Arian Radmehr',
    email: 'pro@owjify.com',
    passwordSim: 'Owjify@2026',
    accountType: 'professional',
    crmStage: 'Verified',
    crmNotes: 'Top-performing HVAC & VRF specialist in Tehran.',
    emailVerified: true,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    cover:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    title: 'مهندس ارشد تهویه مطبوع و سیستم‌های VRF',
    locationId: 'tehran',
    bio: 'متخصص عیب‌یابی بردهای اینورتر، نصب و سرویس چیلر و سیستم‌های VRF با ۱۱ سال سابقه اجرایی.',
    phone: '09123456789',
    experienceYears: 11,
    skills: ['کولر گازی اینورتر', 'داکت اسپلیت و VRF', 'تعمیر برد الکترونیکی'],
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-client-demo',
    proId: null,
    fullName: 'پارسا نیک‌فر | Parsa Nikfar',
    email: 'client@owjify.com',
    passwordSim: 'Owjify@2026',
    accountType: 'customer',
    crmStage: 'VIP',
    crmNotes: 'Repeat enterprise & residential client.',
    emailVerified: true,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    cover:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    title: 'مدیر محصول و کارفرما',
    locationId: 'tehran',
    bio: 'همکاری مستمر با طراحان، معماران و مهندسان برتر در پلتفرم اوجیفای.',
    phone: '09129876543',
    experienceYears: 5,
    skills: ['مدیریت پروژه', 'سفارش خدمات سازمانی'],
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'cust-mahsa',
    proId: null,
    fullName: 'مهسا شریفی | Mahsa Sharifi',
    email: 'mahsa.sharifi@example.com',
    passwordSim: 'Owjify@2026',
    accountType: 'customer',
    crmStage: 'Active',
    crmNotes: 'Healthcare clinic operations manager in Jordan Ave.',
    emailVerified: true,
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    cover:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    title: 'مدیر کلینیک سلامت (کارفرما)',
    locationId: 'tehran',
    bio: 'کارفرمای بخش درمان و کلینیک تخصصی.',
    phone: '09124445566',
    experienceYears: 4,
    skills: [],
    createdAt: '2026-05-18T11:00:00Z',
  },
  {
    id: 'cust-amir',
    proId: null,
    fullName: 'امیرحسین توکلی | Amirhossein Tavakoli',
    email: 'amir.tavakoli@example.com',
    passwordSim: 'Owjify@2026',
    accountType: 'customer',
    crmStage: 'Active',
    crmNotes: 'Residential client in Isfahan & Tehran.',
    emailVerified: true,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    cover:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
    title: 'کارفرمای مسکونی',
    locationId: 'isfahan',
    bio: 'استفاده از خدمات فنی و بازسازی منزل در اوجیفای.',
    phone: '09133334455',
    experienceYears: 2,
    skills: [],
    createdAt: '2026-07-04T14:20:00Z',
  },
];

function delay(ms = 340) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStoredUsers() {
  const existing = readStorage(STORAGE_KEYS.USERS, null);
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    writeStorage(STORAGE_KEYS.USERS, DEFAULT_DEMO_USERS);
    return DEFAULT_DEMO_USERS;
  }
  return existing;
}

function sanitizeUser(user) {
  if (!user) return null;
  const copy = { ...user };
  delete copy.passwordSim;
  return copy;
}

export const authService = {
  getCurrentSession() {
    const session = readStorage(STORAGE_KEYS.SESSION, null);
    if (!session || !session.userId || !session.token) return null;
    const users = getStoredUsers();
    const found = users.find((u) => u.id === session.userId);
    if (!found) {
      removeStorage(STORAGE_KEYS.SESSION);
      return null;
    }
    return {
      token: session.token,
      rememberMe: Boolean(session.rememberMe),
      user: sanitizeUser(found),
    };
  },

  getAllUsers() {
    return getStoredUsers().map(sanitizeUser);
  },

  adminUpdateUser(userId, patch) {
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) return this.getAllUsers();
    users[idx] = { ...users[idx], ...patch };
    writeStorage(STORAGE_KEYS.USERS, users);
    return users.map(sanitizeUser);
  },

  async register({ fullName, email, password, confirmPassword, accountType, acceptTerms }) {
    await delay(420);

    if (!fullName || fullName.trim().length < 2) {
      throw new Error('INVALID_NAME');
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      throw new Error('INVALID_EMAIL');
    }
    const strength = evaluatePasswordStrength(password);
    if (!strength.isAcceptable) {
      throw new Error('WEAK_PASSWORD');
    }
    if (password !== confirmPassword) {
      throw new Error('PASSWORD_MISMATCH');
    }
    if (!acceptTerms) {
      throw new Error('TERMS_REQUIRED');
    }

    const users = getStoredUsers();
    const duplicate = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (duplicate) {
      throw new Error('DUPLICATE_EMAIL');
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const token = `verify_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newId = `user_${Date.now()}`;
    const newProId = accountType === 'professional' ? `pro_${Date.now()}` : null;

    const newUser = {
      id: newId,
      proId: newProId,
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordSim: password,
      accountType: accountType === 'professional' ? 'professional' : 'customer',
      crmStage: 'New',
      crmNotes: '',
      emailVerified: false,
      avatar:
        accountType === 'professional'
          ? 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      cover:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80',
      title:
        accountType === 'professional'
          ? 'متخصص حرفه‌ای در اوجیفای'
          : 'عضو بازارگاه اوجیفای',
      locationId: 'tehran',
      bio: '',
      phone: '',
      experienceYears: 3,
      skills: [],
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    writeStorage(STORAGE_KEYS.USERS, updatedUsers);

    const pending = {
      email: cleanEmail,
      userId: newId,
      code,
      token,
      createdAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.PENDING_VERIFY, pending);

    return {
      user: sanitizeUser(newUser),
      verification: pending,
    };
  },

  getPendingVerification() {
    return readStorage(STORAGE_KEYS.PENDING_VERIFY, null);
  },

  async resendVerificationCode(email) {
    await delay(300);
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const token = `verify_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const pending = {
      email: cleanEmail,
      userId: user.id,
      code,
      token,
      createdAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.PENDING_VERIFY, pending);
    return pending;
  },

  async verifyEmail({ email, code }) {
    await delay(360);
    const pending = readStorage(STORAGE_KEYS.PENDING_VERIFY, null);
    const cleanEmail = (email || pending?.email || '').trim().toLowerCase();
    if (!pending || pending.email !== cleanEmail) {
      throw new Error('VERIFY_SESSION_EXPIRED');
    }
    if (String(code).trim() !== String(pending.code)) {
      throw new Error('INVALID_VERIFY_CODE');
    }

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
    if (idx === -1) {
      throw new Error('USER_NOT_FOUND');
    }
    users[idx] = { ...users[idx], emailVerified: true };
    writeStorage(STORAGE_KEYS.USERS, users);
    removeStorage(STORAGE_KEYS.PENDING_VERIFY);

    const sessionPayload = {
      userId: users[idx].id,
      token: `sim_jwt_${Date.now()}`,
      rememberMe: true,
      issuedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.SESSION, sessionPayload);

    return {
      user: sanitizeUser(users[idx]),
      token: sessionPayload.token,
    };
  },

  async login({ email, password, rememberMe = true, endpointOverride = null }) {
    await delay(340);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      throw new Error('INVALID_EMAIL');
    }
    if (!password) {
      throw new Error('PASSWORD_REQUIRED');
    }

    // If a live REST backend endpoint is configured or passed for Operator/Admin API login
    if (API_BASE || endpointOverride) {
      try {
        const res = await fetch(endpointOverride || `${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.token && data?.user) {
            writeStorage(STORAGE_KEYS.SESSION, {
              userId: data.user.id,
              token: data.token,
              rememberMe: Boolean(rememberMe),
              issuedAt: new Date().toISOString(),
            });
            return { user: data.user, token: data.token };
          }
        }
      } catch {
        // Fall through cleanly to local simulation mode when backend is offline
      }
    }

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user || user.passwordSim !== password) {
      throw new Error('INVALID_CREDENTIALS');
    }

    if (!user.emailVerified) {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      const pending = {
        email: cleanEmail,
        userId: user.id,
        code,
        token: `verify_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      writeStorage(STORAGE_KEYS.PENDING_VERIFY, pending);
      const err = new Error('EMAIL_NOT_VERIFIED');
      err.email = cleanEmail;
      throw err;
    }

    const prefix =
      user.accountType === 'operator'
        ? 'op_api_jwt'
        : user.accountType === 'admin'
        ? 'adm_jwt'
        : 'sim_jwt';

    const sessionPayload = {
      userId: user.id,
      token: `${prefix}_${Date.now()}`,
      rememberMe: Boolean(rememberMe),
      issuedAt: new Date().toISOString(),
    };
    writeStorage(STORAGE_KEYS.SESSION, sessionPayload);

    return {
      user: sanitizeUser(user),
      token: sessionPayload.token,
    };
  },

  async requestPasswordReset(email) {
    await delay(340);
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      throw new Error('INVALID_EMAIL');
    }
    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const resetToken = `rst_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
    const payload = {
      email: cleanEmail,
      token: resetToken,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };
    writeStorage(STORAGE_KEYS.RESET_TOKENS, payload);
    return payload;
  },

  getPendingResetToken() {
    return readStorage(STORAGE_KEYS.RESET_TOKENS, null);
  },

  async resetPassword({ token, password, confirmPassword }) {
    await delay(380);
    const stored = readStorage(STORAGE_KEYS.RESET_TOKENS, null);
    if (!stored || !token || stored.token !== token || Date.now() > stored.expiresAt) {
      throw new Error('INVALID_RESET_TOKEN');
    }
    const strength = evaluatePasswordStrength(password);
    if (!strength.isAcceptable) {
      throw new Error('WEAK_PASSWORD');
    }
    if (password !== confirmPassword) {
      throw new Error('PASSWORD_MISMATCH');
    }

    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === stored.email);
    if (idx === -1) {
      throw new Error('USER_NOT_FOUND');
    }
    users[idx] = { ...users[idx], passwordSim: password };
    writeStorage(STORAGE_KEYS.USERS, users);
    removeStorage(STORAGE_KEYS.RESET_TOKENS);
    return sanitizeUser(users[idx]);
  },

  async updateProfile(userId, updates) {
    await delay(280);
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('USER_NOT_FOUND');

    const nextAccountType = updates.accountType || users[idx].accountType;
    const nextProId =
      nextAccountType === 'professional'
        ? users[idx].proId || `pro_${Date.now()}`
        : users[idx].proId;

    users[idx] = {
      ...users[idx],
      ...updates,
      accountType: nextAccountType,
      proId: nextProId,
    };
    writeStorage(STORAGE_KEYS.USERS, users);
    return sanitizeUser(users[idx]);
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    await delay(300);
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('USER_NOT_FOUND');
    if (users[idx].passwordSim !== currentPassword) {
      throw new Error('WRONG_CURRENT_PASSWORD');
    }
    const strength = evaluatePasswordStrength(newPassword);
    if (!strength.isAcceptable) {
      throw new Error('WEAK_PASSWORD');
    }
    users[idx] = { ...users[idx], passwordSim: newPassword };
    writeStorage(STORAGE_KEYS.USERS, users);
    return true;
  },

  logout() {
    removeStorage(STORAGE_KEYS.SESSION);
  },
};
