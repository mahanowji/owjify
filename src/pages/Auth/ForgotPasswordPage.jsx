import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AuthPages.module.scss';

export default function ForgotPasswordPage() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('pro@owjify.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetPayload, setResetPayload] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = await authService.requestPasswordReset(email);
      setResetPayload(payload);
    } catch (err) {
      setError(
        err.message === 'USER_NOT_FOUND'
          ? lang === 'fa'
            ? 'حسابی با این ایمیل یافت نشد (می‌توانید از pro@owjify.com استفاده کنید).'
            : 'No account found with this email (try pro@owjify.com).'
          : lang === 'fa'
          ? 'نشانی ایمیل معتبر نیست.'
          : 'Please enter a valid email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {lang === 'fa' ? 'بازیابی رمز عبور' : 'Forgot Password'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'fa'
            ? 'ایمیل حساب خود را وارد کنید تا لینک بازنشانی ایجاد شود.'
            : 'Enter your registered email to receive a password reset token.'}
        </p>

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
            />
          </div>

          <button type="submit" disabled={loading} className="owj-btn owj-btn--lime">
            {loading ? <span className="owj-spinner" /> : <KeyRound size={17} />}
            <span>{lang === 'fa' ? 'ارسال لینک بازیابی' : 'Generate Reset Link'}</span>
          </button>
        </form>

        {resetPayload && (
          <div className={styles.devBox}>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              {lang === 'fa'
                ? 'لینک شبیه‌سازی ایمیل بازیابی آماده شد:'
                : 'Simulated Password Reset Link Ready:'}
            </div>
            <Link
              to={`/auth/reset-password?token=${encodeURIComponent(resetPayload.token)}`}
              className="owj-btn owj-btn--dark owj-btn--sm"
            >
              {lang === 'fa' ? 'باز کردن فرم تغییر رمز عبور' : 'Open Reset Password Page'}
            </Link>
          </div>
        )}

        <p className={styles.footerNote}>
          <Link to="/auth/login">
            {lang === 'fa' ? 'بازگشت به صفحه ورود' : 'Back to Login'}
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
