import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpLeft, ArrowUpRight, CheckCircle2, Mail } from 'lucide-react';
import { OwjifyMark } from '../../assets/brandMarks';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { marketplaceService } from '../../services/marketplaceService';
import { isValidEmail } from '../../utils/validators';
import styles from './Footer.module.scss';

export default function Footer() {
  const { lang, isRTL, ui } = useLanguage();
  const { hasToken, isProfessional, isOperator, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      showToast({
        title: lang === 'fa' ? 'ایمیل نامعتبر است' : 'Invalid email address',
        message:
          lang === 'fa'
            ? 'لطفاً یک نشانی ایمیل معتبر وارد کنید.'
            : 'Please enter a valid email address.',
        type: 'error',
      });
      return;
    }
    marketplaceService.subscribeNewsletter(email.trim());
    setSubscribed(true);
    setEmail('');
    showToast({
      title: lang === 'fa' ? 'عضویت با موفقیت انجام شد' : 'Subscribed to OWJIFY',
      message:
        lang === 'fa'
          ? 'جدیدترین متخصصان منتخب و راهنماها برای شما ارسال خواهد شد.'
          : 'You will receive curated marketplace highlights.',
      type: 'success',
    });
  };

  const ArrowIcon = isRTL ? ArrowUpLeft : ArrowUpRight;

  return (
    <footer className={styles.footer}>
      <div className="owj-container">
        <div className={styles.topGrid}>
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brandLink}>
              <OwjifyMark size={36} darkBg />
              <div>
                <div className={styles.brandTitle}>{lang === 'fa' ? 'اوجیفای' : 'OWJIFY'}</div>
                <div className={styles.brandSub}>
                  {lang === 'fa'
                    ? 'پلتفرم ارتباط مستقیم انسان‌ها و مهارت‌ها'
                    : 'Connecting People & Trusted Skills'}
                </div>
              </div>
            </Link>
            <p className={styles.tagline}>{ui.footer.tagline}</p>

            <a
              href="mailto:mahanowji1380@gmail.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                color: '#C7F36B',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              <Mail size={14} />
              <span>mahanowji1380@gmail.com</span>
            </a>

            <div className={styles.newsletterBox}>
              <div className={styles.newsletterTitle}>{ui.footer.newsletterTitle}</div>
              <form className={styles.newsletterForm} onSubmit={handleNewsletter}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={ui.footer.newsletterPlaceholder}
                  aria-label={ui.footer.newsletterPlaceholder}
                />
                <button type="submit" className="owj-btn owj-btn--lime owj-btn--sm">
                  {subscribed ? <CheckCircle2 size={15} /> : <span>{ui.footer.newsletterBtn}</span>}
                  {!subscribed && <ArrowIcon size={14} />}
                </button>
              </form>
            </div>
          </div>

          <div className={styles.linksCol}>
            <h4>{ui.footer.marketplaceCol}</h4>
            <ul>
              <li>
                <Link to="/explore">{ui.nav.explore}</Link>
              </li>
              <li>
                <Link to="/categories">{ui.nav.categories}</Link>
              </li>
              {(!hasToken || isProfessional) && (
                <li>
                  <Link
                    to={hasToken && isProfessional ? '/create-ad' : '/auth/register'}
                  >
                    {ui.nav.createAd}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/how-it-works">{ui.nav.howItWorks}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4>{ui.footer.companyCol}</h4>
            <ul>
              <li>
                <Link to="/about">{ui.nav.about}</Link>
              </li>
              <li>
                <Link to="/support">
                  {lang === 'fa' ? 'پشتیبانی و ثبت گزارش' : 'Support & Report Issue'}
                </Link>
              </li>
              <li>
                <Link to="/contact">{ui.nav.contact}</Link>
              </li>
              <li>
                <Link to="/faq">{ui.nav.faq}</Link>
              </li>
            </ul>
          </div>

          <div className={styles.linksCol}>
            <h4>{lang === 'fa' ? 'سامانه‌های مدیریتی و قوانین' : 'Portals & Legal'}</h4>
            <ul>
              <li>
                <Link to="/operator">
                  {lang === 'fa' ? 'ورود اپراتور پشتیبانی (API)' : 'Support Operator Portal'}
                </Link>
              </li>
              <li>
                <Link to={isAdmin ? '/admin' : '/auth/login'}>
                  {lang === 'fa' ? 'پنل مدیریت و CRM' : 'Admin & CRM Dashboard'}
                </Link>
              </li>
              <li>
                <Link to="/terms">{ui.nav.terms}</Link>
              </li>
              <li>
                <Link to="/privacy">{ui.nav.privacy}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>{ui.footer.rights}</span>
          <div className={styles.bottomPills}>
            <span className={styles.pill}>
              {lang === 'fa' ? 'بنیان‌گذار: ماهان اوجی' : 'Founded by Mahan Owji'}
            </span>
            <span className={styles.pill}>FA / EN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
