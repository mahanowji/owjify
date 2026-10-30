import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck, RefreshCw } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import styles from './AuthPages.module.scss';

export default function VerifyEmailPage() {
  const { lang } = useLanguage();
  const { verifyEmail } = useAuth();
  const { syncUserToProfessional } = useMarketplace();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [pending, setPending] = useState(() => authService.getPendingVerification());
  const [codeInput, setCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!pending) {
    return (
      <PageTransition>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h2 className={styles.title}>
            {lang === 'fa' ? 'درخواست تایید فعالی یافت نشد' : 'No Pending Verification'}
          </h2>
          <p className={styles.subtitle}>
            {lang === 'fa'
              ? 'لطفاً ابتدا ثبت‌نام کنید یا وارد حساب خود شوید.'
              : 'Please register an account or log in first.'}
          </p>
          <Link to="/auth/signup" className="owj-btn owj-btn--lime">
            {lang === 'fa' ? 'صفحه عضویت' : 'Go to Sign Up'}
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyEmail({ email: pending.email, code: codeInput });
      if (res.user.accountType === 'professional') {
        syncUserToProfessional(res.user);
      }
      showToast({
        title: lang === 'fa' ? 'ایمیل شما با موفقیت تایید شد!' : 'Email Verified!',
        type: 'success',
      });
      navigate('/auth/verify-success');
    } catch {
      setError(
        lang === 'fa'
          ? 'کد واردشده صحیح نیست. از کد شبیه‌ساز توسعه در کادر پایین استفاده کنید.'
          : 'Invalid verification code. Use the simulated dev code shown below.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const next = await authService.resendVerificationCode(pending.email);
    setPending(next);
    setCodeInput(next.code);
    showToast({
      title: lang === 'fa' ? 'کد جدید تولید شد' : 'New Code Generated',
      type: 'info',
    });
  };

  return (
    <PageTransition>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {lang === 'fa' ? 'تایید نشانی ایمیل' : 'Verify Your Email'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'fa'
            ? `کد ۶ رقمی ارسال‌شده به ${pending.email} را وارد نمایید.`
            : `Enter the 6-digit verification code sent to ${pending.email}.`}
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form className={styles.form} onSubmit={handleVerify}>
          <div className={styles.field}>
            <label>{lang === 'fa' ? 'کد تایید ۶ رقمی' : '6-Digit Code'}</label>
            <input
              type="text"
              required
              dir="ltr"
              maxLength={6}
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="123456"
              style={{ letterSpacing: '0.3em', textAlign: 'center', fontWeight: 800 }}
            />
          </div>

          <button type="submit" disabled={loading} className="owj-btn owj-btn--lime">
            {loading ? <span className="owj-spinner" /> : <MailCheck size={17} />}
            <span>{lang === 'fa' ? 'تایید و فعال‌سازی حساب' : 'Verify Email'}</span>
          </button>
        </form>

        {/* Development Simulated Email Preview */}
        <div className={styles.devBox}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>
            {lang === 'fa'
              ? 'صندوق پیام شبیه‌ساز توسعه (Development-Only Preview):'
              : 'Development Simulated Inbox:'}
          </div>
          <div>
            {lang === 'fa' ? 'کد فعال‌سازی شما: ' : 'Your verification code: '}
            <strong style={{ fontSize: '1rem', letterSpacing: '0.12em' }}>{pending.code}</strong>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 8 }}>
            <button
              type="button"
              onClick={() => setCodeInput(pending.code)}
              className="owj-btn owj-btn--dark owj-btn--sm"
            >
              {lang === 'fa' ? 'جای‌گذاری خودکار کد' : 'Auto-Fill Code'}
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="owj-btn owj-btn--outline owj-btn--sm"
            >
              <RefreshCw size={13} />
              <span>{lang === 'fa' ? 'ارسال مجدد' : 'Resend'}</span>
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
