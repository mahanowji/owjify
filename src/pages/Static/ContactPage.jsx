import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Stack } from '@mui/material';
import { Send, Mail, MapPin, ShieldCheck, LifeBuoy } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { marketplaceService } from '../../services/marketplaceService';
import { isValidEmail } from '../../utils/validators';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import styles from './StaticPages.module.scss';

export default function ContactPage() {
  const { lang } = useLanguage();
  const { createSupportTicket } = useMarketplace();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      showToast({
        title: lang === 'fa' ? 'نشانی ایمیل معتبر نیست' : 'Invalid email address',
        type: 'error',
      });
      return;
    }
    setSending(true);
    marketplaceService.submitContactTicket({ name, email, subject, message });
    const created = await createSupportTicket({
      category: 'general',
      priority: 'normal',
      reporterName: name.trim(),
      reporterEmail: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setSending(false);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    showToast({
      title:
        lang === 'fa'
          ? `پیام شما ثبت شد (${created.id})`
          : `Message Received (${created.id})`,
      message:
        lang === 'fa'
          ? 'پاسخ اپراتور پشتیبانی در بخش پشتیبانی قابل پیگیری است.'
          : 'You can track our operator response in the Support Center.',
      type: 'success',
    });
    navigate(`/support?ticket=${created.id}`);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.72rem 0.95rem',
    borderRadius: 11,
    border: '1px solid rgba(17,18,15,0.16)',
    background: '#F6F5F0',
    marginBottom: '0.9rem',
    fontSize: '0.86rem',
  };

  return (
    <PageTransition>
      <section className={styles.hero}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'ارتباط با مدیریت و پشتیبانی' : 'Contact Us'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'fa' ? 'همیشه آماده شنیدن صدای شما هستیم' : 'Get in touch with OWJIFY'}
          </h1>
        </Container>
      </section>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <form className={styles.card} onSubmit={handleSubmit}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
                {lang === 'fa' ? 'ارسال پیام به تیم اوجیفای' : 'Send Us a Message'}
              </h2>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'fa' ? 'نام و نام خانوادگی' : 'Full Name'}
                    style={inputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={inputStyle}
                  />
                </Grid>
              </Grid>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={lang === 'fa' ? 'موضوع پیام' : 'Subject'}
                style={inputStyle}
              />
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'fa' ? 'متن پیام یا پیشنهاد شما...' : 'How can we help?'}
                style={inputStyle}
              />
              <button type="submit" disabled={sending} className="owj-btn owj-btn--lime">
                {sending ? <span className="owj-spinner" /> : <Send size={15} />}
                <span>{lang === 'fa' ? 'ارسال پیام' : 'Submit Message'}</span>
              </button>
            </form>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <div className={styles.card} style={{ height: '100%' }}>
              <Stack spacing={2}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {lang === 'fa' ? 'مدیریت و ارتباط مستقیم' : 'Administration & Support'}
                </h2>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <ShieldCheck size={19} />
                  <span>
                    {lang === 'fa'
                      ? 'مدیر ارشد نرم‌افزار: ماهان اوجی (Mahan Owji)'
                      : 'Software Admin: Mahan Owji'}
                  </span>
                </Stack>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Mail size={19} />
                  <a href="mailto:mahanowji1380@gmail.com" dir="ltr" style={{ fontWeight: 700 }}>
                    mahanowji1380@gmail.com
                  </a>
                </Stack>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <LifeBuoy size={19} />
                  <span>
                    {lang === 'fa'
                      ? 'پشتیبانی آنلاین و گزارش تخلفات از طریق بخش پشتیبانی'
                      : '24/7 Ticket & Report Desk via /support'}
                  </span>
                </Stack>
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <MapPin size={19} />
                  <span>
                    {lang === 'fa'
                      ? 'سراسر ایران • پلتفرم ارتباط مستقیم مردم و متخصصان'
                      : 'Nationwide Digital Platform Connecting People'}
                  </span>
                </Stack>
              </Stack>
            </div>
          </Grid>
        </Grid>
      </Container>
    </PageTransition>
  );
}
