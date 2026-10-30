import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { UserPlus } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import PasswordStrength from '../../components/forms/PasswordStrength';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './AuthPages.module.scss';

export default function SignUpPage() {
  const { lang } = useLanguage();
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState(
    searchParams.get('role') === 'professional' ? 'professional' : 'customer'
  );
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapError = (code) => {
    const dict = {
      INVALID_NAME:
        lang === 'fa' ? 'نام و نام خانوادگی معتبر وارد کنید.' : 'Enter your full name.',
      INVALID_EMAIL:
        lang === 'fa' ? 'فرمت نشانی ایمیل صحیح نیست.' : 'Invalid email format.',
      WEAK_PASSWORD:
        lang === 'fa'
          ? 'رمز عبور باید حداقل ۸ کاراکتر و ترکیبی از حروف و اعداد باشد.'
          : 'Password must be at least 8 characters with mixed letters/numbers.',
      PASSWORD_MISMATCH:
        lang === 'fa' ? 'رمز عبور و تکرار آن یکسان نیستند.' : 'Passwords do not match.',
      TERMS_REQUIRED:
        lang === 'fa'
          ? 'پذیرش قوانین و مقررات الزامی است.'
          : 'Please accept the Terms & Conditions.',
      DUPLICATE_EMAIL:
        lang === 'fa'
          ? 'این ایمیل قبلاً در اوجیفای ثبت شده است.'
          : 'An account with this email already exists.',
    };
    return dict[code] || (lang === 'fa' ? 'خطا در ثبت‌نام.' : 'Registration failed.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName,
        email,
        password,
        confirmPassword,
        accountType,
        acceptTerms,
      });
      showToast({
        title: lang === 'fa' ? 'کد تایید ایمیل ایجاد شد' : 'Verification Code Sent',
        type: 'info',
      });
      navigate('/auth/verify-email');
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
          {lang === 'fa' ? 'عضویت در اوجیفای' : 'Create your OWJIFY account'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'fa'
            ? 'نوع حساب خود را انتخاب کرده و در کمتر از یک دقیقه شروع کنید.'
            : 'Choose your role to start hiring or offering specialist services.'}
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>{lang === 'fa' ? 'نوع حساب کاربری' : 'Account Type'}</label>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <button
                  type="button"
                  onClick={() => setAccountType('customer')}
                  className={`${styles.roleOption} ${
                    accountType === 'customer' ? styles.roleActive : ''
                  }`}
                  style={{ width: '100%' }}
                >
                  {lang === 'fa' ? 'کارفرما / مشتری' : 'Customer'}
                </button>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <button
                  type="button"
                  onClick={() => setAccountType('professional')}
                  className={`${styles.roleOption} ${
                    accountType === 'professional' ? styles.roleActive : ''
                  }`}
                  style={{ width: '100%' }}
                >
                  {lang === 'fa' ? 'متخصص / ارائه‌دهنده' : 'Professional'}
                </button>
              </Grid>
            </Grid>
          </div>

          <div className={styles.field}>
            <label>{lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={lang === 'fa' ? 'مثلاً: مریم راد' : 'e.g. Maryam Rad'}
            />
          </div>

          <div className={styles.field}>
            <label>{lang === 'fa' ? 'نشانی ایمیل' : 'Email Address'}</label>
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
            />
          </div>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'رمز عبور' : 'Password'}</label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars"
                />
              </div>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <div className={styles.field}>
                <label>{lang === 'fa' ? 'تکرار رمز عبور' : 'Confirm Password'}</label>
                <input
                  type="password"
                  required
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat"
                />
              </div>
            </Grid>
          </Grid>
          <PasswordStrength password={password} />

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <span>
              {lang === 'fa' ? (
                <>
                  <Link to="/terms" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                    قوانین و مقررات
                  </Link>{' '}
                  و{' '}
                  <Link to="/privacy" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                    حریم خصوصی
                  </Link>{' '}
                  را می‌پذیرم.
                </>
              ) : (
                <>
                  I agree to the{' '}
                  <Link to="/terms" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ fontWeight: 700, textDecoration: 'underline' }}>
                    Privacy Policy
                  </Link>
                  .
                </>
              )}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="owj-btn owj-btn--lime"
            style={{ width: '100%' }}
          >
            {loading ? <span className="owj-spinner" /> : <UserPlus size={17} />}
            <span>{lang === 'fa' ? 'ایجاد حساب و ادامه' : 'Sign Up & Verify Email'}</span>
          </button>
        </form>

        <p className={styles.footerNote}>
          {lang === 'fa' ? 'قبلاً عضو شده‌اید؟ ' : 'Already have an account? '}
          <Link to="/auth/login">{lang === 'fa' ? 'وارد شوید' : 'Log In'}</Link>
        </p>
      </div>
    </PageTransition>
  );
}
