import { Container } from '@mui/material';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StaticPages.module.scss';

export default function PrivacyPage() {
  const { lang } = useLanguage();

  return (
    <PageTransition>
      <section className={styles.hero}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'شفافیت داده' : 'Data Transparency'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'fa' ? 'سیاست حفظ حریم خصوصی' : 'Privacy Policy'}
          </h1>
        </Container>
      </section>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <div className={styles.legalDoc}>
          <h2>
            {lang === 'fa'
              ? '۱. اطلاعاتی که گردآوری می‌شود'
              : '1. Information Collected'}
          </h2>
          <p>
            {lang === 'fa'
              ? 'تنها اطلاعات ضروری جهت نمایش پروفایل تخصصی، آگهی‌های خدمات و برقراری گفتگوهای داخلی ثبت می‌شود. ایمیل کاربران هرگز در اختیار اشخاص ثالث تبلیغاتی قرار نمی‌گیرد.'
              : 'We collect only the profile details, service listings, and conversation history needed to operate the marketplace.'}
          </p>

          <h2>
            {lang === 'fa'
              ? '۲. ذخیره‌سازی محلی در نسخه فرانت‌اند'
              : '2. Local Demo Persistence Notice'}
          </h2>
          <p>
            {lang === 'fa'
              ? 'این نسخه نمایشی کاملاً در سمت کاربر اجرا می‌شود و داده‌ها در حافظه مرورگر (localStorage) دستگاه شما نگهداری می‌گردند. از بخش تنظیمات حساب می‌توانید در هر لحظه تمامی داده‌های آزمایشی را بازنشانی کنید.'
              : 'In this standalone frontend build, demo data is stored locally in your browser localStorage and can be reset anytime from Account Settings.'}
          </p>
        </div>
      </Container>
    </PageTransition>
  );
}
