import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import PasswordStrength from '../../components/forms/PasswordStrength';
import { authService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import styles from './AuthPages.module.scss';

export default function ResetPasswordPage() {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stored = authService.getPendingResetToken();
  const token = searchParams.get('token') || stored?.token || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!token) {
    return (
      <PageTransition>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h2 className={styles.title}>
            {lang === 'fa' ? 'لینک بازیابی معتبر نیست' : 'Invalid or Expired Reset Token'}
          </h2>
          <p className={styles.subtitle}>
            {lang === 'fa'
              ? 'لطفاً مجدداً از صفحه فراموشی رمز عبور درخواست دهید.'
              : 'Please request a new password reset link.'}
          </p>
          <Link to="/auth/forgot-password" className="owj-btn owj-btn--lime">
            {lang === 'fa' ? 'درخواست مجدد لینک' : 'Forgot Password'}
          </Link>
        </div>
      </PageTransition>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword({ token, password, confirmPassword });
      showToast({
        title: lang === 'fa' ? 'رمز عبور با موفقیت تغییر یافت' : 'Password Reset Complete',
        type: 'success',
      });
      navigate('/auth/login');
    } catch (err) {
      if (err.message === 'PASSWORD_MISMATCH') {
        setError(lang === 'fa' ? 'رمز عبور و تکرار آن مطابقت ندارند.' : 'Passwords do not match.');
      } else if (err.message === 'WEAK_PASSWORD') {
        setError(
          lang === 'fa'
            ? 'رمز عبور باید حداقل ۸ کاراکتر شامل حروف و عدد باشد.'
            : 'Choose a stronger password (min 8 chars + numbers).'
        );
      } else {
        navigate('/auth/error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {lang === 'fa' ? 'تعیین رمز عبور جدید' : 'Set New Password'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'fa'
            ? 'رمز عبور جدید و ایمن برای حساب اوجیفای خود انتخاب کنید.'
            : 'Choose a strong new password for your OWJIFY account.'}
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>{lang === 'fa' ? 'رمز عبور جدید' : 'New Password'}</label>
            <input
              type="password"
              required
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
          </div>

          <div className={styles.field}>
            <label>{lang === 'fa' ? 'تکرار رمز عبور جدید' : 'Confirm New Password'}</label>
            <input
              type="password"
              required
              dir="ltr"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="owj-btn owj-btn--lime">
            {loading ? <span className="owj-spinner" /> : <ShieldCheck size={17} />}
            <span>{lang === 'fa' ? 'ذخیره رمز جدید' : 'Reset Password'}</span>
          </button>
        </form>
      </div>
    </PageTransition>
  );
}
