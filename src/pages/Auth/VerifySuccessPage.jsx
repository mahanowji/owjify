import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.scss';

export default function VerifySuccessPage() {
  const { lang } = useLanguage();
  const { isProfessional } = useAuth();

  return (
    <PageTransition>
      <div className={styles.card} style={{ textAlign: 'center' }}>
        <CheckCircle2 size={54} color="#289e67" style={{ marginInline: 'auto' }} />
        <h2 className={styles.title} style={{ marginTop: '0.85rem' }}>
          {lang === 'fa' ? 'حساب شما با موفقیت تایید شد!' : 'Verification Successful!'}
        </h2>
        <p className={styles.subtitle}>
          {isProfessional
            ? lang === 'fa'
              ? 'اکنون به داشبورد متخصص، ثبت آگهی و صندوق پیام‌ها دسترسی دارید.'
              : 'Your Specialist account is active. Publish services and manage messages.'
            : lang === 'fa'
            ? 'اکنون می‌توانید با متخصصان گفتگو کنید و خدمات موردعلاقه خود را ذخیره نمایید.'
            : 'Your Customer account is active. Message providers directly and save favorite services.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Link to="/dashboard" className="owj-btn owj-btn--lime">
            {isProfessional
              ? lang === 'fa'
                ? 'ورود به داشبورد متخصص'
                : 'Open Provider Dashboard'
              : lang === 'fa'
              ? 'ورود به داشبورد کارفرما'
              : 'Open Customer Dashboard'}
          </Link>

          {isProfessional && (
            <Link to="/create-ad" className="owj-btn owj-btn--dark">
              {lang === 'fa' ? 'ثبت اولین آگهی خدمت' : 'Publish a Service'}
            </Link>
          )}

          <Link to="/explore" className="owj-btn owj-btn--outline">
            {lang === 'fa' ? 'کاوش بازارگاه' : 'Explore Marketplace'}
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
