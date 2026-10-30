import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import styles from './AuthPages.module.scss';

export default function AuthErrorPage() {
  const { lang } = useLanguage();

  return (
    <PageTransition>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <AlertTriangle size={50} color="#d94848" style={{ marginInline: 'auto' }} />
        <h2 className={styles.title} style={{ marginTop: '0.8rem' }}>
          {lang === 'fa' ? 'خطا در نشست یا لینک احراز هویت' : 'Authentication Error'}
        </h2>
        <p className={styles.subtitle}>
          {lang === 'fa'
            ? 'نشست امنیتی منقضی شده یا توکن واردشده دیگر معتبر نیست. لطفاً مجدداً وارد شوید.'
            : 'The verification or reset token has expired or is invalid. Please sign in or request a fresh link.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <Link to="/auth/login" className="owj-btn owj-btn--lime">
            {lang === 'fa' ? 'ورود به حساب' : 'Back to Login'}
          </Link>
          <Link to="/auth/forgot-password" className="owj-btn owj-btn--outline">
            {lang === 'fa' ? 'ارسال مجدد لینک بازیابی' : 'Request New Reset Link'}
          </Link>
          <Link to="/" className="owj-btn owj-btn--ghost">
            {lang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Return Home'}
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
