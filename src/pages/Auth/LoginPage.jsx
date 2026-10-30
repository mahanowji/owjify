import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Grid, Stack } from '@mui/material';
import { Eye, EyeOff, LogIn, Briefcase, UserCheck, Headset, ShieldCheck } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './AuthPages.module.scss';

export default function LoginPage() {
  const { lang } = useLanguage();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resolveDestination = (loggedUser) => {
    if (location.state?.from) return location.state.from;
    if (loggedUser?.accountType === 'admin') return '/admin';
    if (loggedUser?.accountType === 'operator') return '/operator';
    return '/dashboard';
  };

  const mapError = (code) => {
    const dict = {
      INVALID_EMAIL:
        lang === 'fa' ? 'فرمت نشانی ایمیل معتبر نیست.' : 'Please enter a valid email address.',
      PASSWORD_REQUIRED:
        lang === 'fa' ? 'وارد کردن رمز عبور الزامی است.' : 'Password is required.',
      INVALID_CREDENTIALS:
        lang === 'fa'
          ? 'ایمیل یا رمز عبور اشتباه است.'
          : 'Incorrect email or password.',
      EMAIL_NOT_VERIFIED:
        lang === 'fa'
          ? 'ایمیل شما هنوز تایید نشده است. کد تایید جدید ارسال شد.'
          : 'Email not verified yet. Redirecting to verification...',
    };
    return dict[code] || (lang === 'fa' ? 'خطا در ورود به حساب.' : 'Authentication failed.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password, rememberMe });
      showToast({
        title: lang === 'fa' ? 'خوش آمدید!' : 'Welcome back!',
        message: res.user.fullName,
        type: 'success',
      });
      navigate(resolveDestination(res.user), { replace: true });
    } catch (err) {
      setError(mapError(err.message));
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setTimeout(() => navigate('/auth/verify-email'), 900);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Owjify@2026');
    setError('');
    setLoading(true);
    try {
      const res = await login({
        email: demoEmail,
        password: 'Owjify@2026',
        rememberMe: true,
      });
      showToast({
        title: lang === 'fa' ? 'ورود سریع انجام شد' : 'Signed in',
        message: res.user.fullName,
        type: 'success',
      });
      navigate(resolveDestination(res.user), { replace: true });
    } catch (err) {
      setError(mapError(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {lang === 'fa' ? 'ورود به حساب کاربری' : 'Sign in to OWJIFY'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'fa'
            ? 'با ورود به حساب، به پیام‌ها، علاقه‌مندی‌ها و پنل اختصاصی نقش خود دسترسی خواهید داشت.'
            : 'Sign in to access messaging, saved favorites, and your role-specific workspace.'}
        </p>

        {/* Demo Quick Login Cards (4 Roles: Specialist, Client, Support Operator, Admin Mahan Owji) */}
        <div
          style={{
            padding: '0.85rem',
            borderRadius: '14px',
            background: '#F6F5F0',
            border: '1px solid rgba(17,18,15,0.08)',
            marginBottom: '1.1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#464841',
              marginBottom: '0.6rem',
            }}
          >
            {lang === 'fa'
              ? 'ورود یک‌کلیکی نقش‌های سامانه (جهت تست کامل):'
              : 'Instant Role Demo Accounts:'}
          </div>
          <Grid container spacing={0.85}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillDemo('pro@owjify.com')}
                className="owj-btn owj-btn--dark owj-btn--sm"
                style={{ width: '100%' }}
              >
                <Briefcase size={14} />
                <span>{lang === 'fa' ? 'دمو متخصص' : 'Demo Specialist'}</span>
              </button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillDemo('client@owjify.com')}
                className="owj-btn owj-btn--outline owj-btn--sm"
                style={{ width: '100%', background: '#FFFFFF' }}
              >
                <UserCheck size={14} />
                <span>{lang === 'fa' ? 'دمو کارفرما' : 'Demo Client'}</span>
              </button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillDemo('operator@owjify.com')}
                className="owj-btn owj-btn--outline owj-btn--sm"
                style={{ width: '100%', background: '#FFFFFF' }}
              >
                <Headset size={14} />
                <span>{lang === 'fa' ? 'اپراتور پشتیبانی (API)' : 'Support Operator'}</span>
              </button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <button
                type="button"
                disabled={loading}
                onClick={() => fillDemo('mahanowji1380@gmail.com')}
                className="owj-btn owj-btn--lime owj-btn--sm"
                style={{ width: '100%' }}
              >
                <ShieldCheck size={14} />
                <span>{lang === 'fa' ? 'ادمین (ماهان اوجی)' : 'Admin (Mahan Owji)'}</span>
              </button>
            </Grid>
          </Grid>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>{lang === 'fa' ? 'نشانی ایمیل' : 'Email Address'}</label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className={styles.field}>
            <label>{lang === 'fa' ? 'رمز عبور' : 'Password'}</label>
            <div className={styles.passWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((p) => !p)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
            sx={{ fontSize: '0.82rem' }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>{lang === 'fa' ? 'مرا به خاطر بسپار' : 'Remember me'}</span>
            </label>

            <Link to="/auth/forgot-password" style={{ fontWeight: 700 }}>
              {lang === 'fa' ? 'فراموشی رمز عبور؟' : 'Forgot password?'}
            </Link>
          </Stack>

          <button
            type="submit"
            disabled={loading}
            className="owj-btn owj-btn--lime"
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? <span className="owj-spinner" /> : <LogIn size={16} />}
            <span>{lang === 'fa' ? 'ورود به اوجیفای' : 'Log In'}</span>
          </button>
        </form>

        <div className={styles.devBox}>
          {lang === 'fa'
            ? 'ساختار احراز هویت و تیکتینگ آماده اتصال مستقیم به API بک‌اند (VITE_API_BASE_URL) است و در حالت پیش‌نمایش با شبیه‌سازی محلی اجرا می‌شود.'
            : 'Service layer is REST API-ready (VITE_API_BASE_URL) with automatic local simulation fallback.'}
        </div>

        <p className={styles.footerNote}>
          {lang === 'fa' ? 'حساب کاربری ندارید؟ ' : "Don't have an account? "}
          <Link to="/auth/signup">{lang === 'fa' ? 'عضویت رایگان' : 'Create Account'}</Link>
        </p>
      </div>
    </PageTransition>
  );
}
