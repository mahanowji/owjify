import { Link } from 'react-router-dom';
import { Container, Grid, Box, Paper, Stack, Typography, Chip } from '@mui/material';
import {
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Mail,
  Copy,
  Users,
  Compass,
  Quote,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function AboutPage() {
  const { lang } = useLanguage();
  const { showToast } = useToast();

  const adminEmail = 'mahanowji1380@gmail.com';

  const copyAdminEmail = () => {
    navigator.clipboard?.writeText(adminEmail);
    showToast({
      title: lang === 'fa' ? 'نشانی ایمیل کپی شد' : 'Email Copied',
      message: adminEmail,
      type: 'success',
    });
  };

  const inspirationalQuotes =
    lang === 'fa'
      ? [
          {
            quote:
              '«زیباترین رسالت فناوری، کوتاه کردن فاصله‌ها و پیوند دادن انسان‌هایی است که می‌توانند زندگی یکدیگر را بهتر کنند.»',
            tag: 'فلسفه اوجیفای',
          },
          {
            quote:
              '«پشتِ هر مهارت، سال‌ها تجربه و عشق یک انسان ایستاده است؛ و پشتِ هر نیاز، داستانی که شایسته‌ی بهترین همراهی است.»',
            tag: 'ارزش مهارت انسانی',
          },
          {
            quote:
              '«وقتی اعتماد، شفافیت و احترام متقابل کنار هم قرار می‌گیرند، هر ارتباط ساده به یک همکاری ماندگار تبدیل می‌شود.»',
            tag: 'اعتماد و همبستگی',
          },
          {
            quote:
              '«هیچ استعدادی نباید در انزوا بماند و هیچ انسانی نباید در یافتن همراهِ متخصص تنها باشد؛ ما برای ساختن این پل اینجاییم.»',
            tag: 'چشم‌انداز ما',
          },
        ]
      : [
          {
            quote:
              '“Technology’s highest calling is closing the distance between people who can make each other’s lives better.”',
            tag: 'Our Philosophy',
          },
          {
            quote:
              '“Behind every craft stands years of human dedication; behind every request stands a goal worthy of genuine care.”',
            tag: 'Human Craft',
          },
          {
            quote:
              '“When transparency and mutual respect meet, a simple introduction blossoms into lasting collaboration.”',
            tag: 'Trust & Belonging',
          },
          {
            quote:
              '“No talent should go unseen, and no person should search alone—we exist to build bridges between people.”',
            tag: 'Our Vision',
          },
        ];

  const pillars =
    lang === 'fa'
      ? [
          {
            icon: HeartHandshake,
            title: 'پیوند مستقیم انسان‌ها با یکدیگر',
            desc: 'اوجیفای ساخته شده تا انسان‌ها بدون واسطه‌های پیچیده، مستقیم، محترمانه و شفاف یکدیگر را پیدا کنند و با هم گفتگو کنند.',
          },
          {
            icon: ShieldCheck,
            title: 'اعتماد، امنیت و پشتیبانی پاسخ‌گو',
            desc: 'با احراز صلاحیت متخصصان، دیدگاه‌های واقعی و مرکز پشتیبانی فعال، کیفیت هر ارتباط تضمین می‌شود.',
          },
          {
            icon: Compass,
            title: 'فرصت برابر برای درخشش مهارت‌ها',
            desc: 'از مهندسان تأسیسات تا طراحان، معماران و مدرسان؛ هر فرد ماهر فضای حرفه‌ای شایسته‌ای برای معرفی توانایی خود دارد.',
          },
        ]
      : [
          {
            icon: HeartHandshake,
            title: 'Connecting People Directly',
            desc: 'OWJIFY exists to bring real people together—connecting skilled professionals and everyday clients directly, warmly, and transparently.',
          },
          {
            icon: ShieldCheck,
            title: 'Trust, Safety & Responsive Care',
            desc: 'Verified credentials, authentic community reviews, and dedicated operator support safeguard every human interaction.',
          },
          {
            icon: Compass,
            title: 'Empowering Every Craft',
            desc: 'From technical engineers to architects, designers, and educators—every craftsperson deserves an editorial stage to shine.',
          },
        ];

  return (
    <PageTransition>
      {/* Hero Banner */}
      <Box
        sx={{
          bgcolor: '#11120F',
          color: '#F6F5F0',
          py: { xs: 5.5, md: 8 },
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Container maxWidth="lg">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'داستان و رسالت اوجیفای' : 'About OWJIFY'}
          </span>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.95rem', md: '3rem' },
              fontWeight: 800,
              mt: 1.6,
              mb: 1.5,
              lineHeight: 1.3,
              maxWidth: 820,
            }}
          >
            {lang === 'fa'
              ? 'ما اوجیفای را ساختیم تا انسان‌ها، مهارت‌ها و قلب‌های پرتلاش را به یکدیگر متصل کنیم.'
              : 'Built to connect people with each other through skill, trust, and human warmth.'}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(246,245,240,0.76)',
              fontSize: { xs: '0.95rem', md: '1.08rem' },
              lineHeight: 1.85,
              maxWidth: 760,
            }}
          >
            {lang === 'fa'
              ? 'در دنیای پرشتاب امروز، یافتن انسانی کاربلد و قابل‌اعتماد نباید دشوار باشد. اوجیفای پلی زنده میان مردم است؛ جایی که هر نیاز به یک مهارت اصیل می‌رسد و هر گفتگو آغازگر یک همکاری ارزشمند است.'
              : 'In a fast-moving world, finding a capable, trustworthy person should feel effortless and human. OWJIFY bridges people who need help with dedicated specialists ready to make a difference.'}
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4.5, md: 7 } }}>
        {/* Core Pillars */}
        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          {pillars.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <Grid key={idx} size={{ xs: 12, md: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(17,18,15,0.08)',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 3,
                      bgcolor: '#11120F',
                      color: '#C7F36B',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <IconComp size={21} />
                  </Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.06rem', mb: 1 }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.88rem', color: '#464841', lineHeight: 1.8 }}>
                    {p.desc}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* Inspirational Sentences / Manifesto Grid */}
        <Box sx={{ mb: 5.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.2 }}>
            <Sparkles size={18} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {lang === 'fa'
                ? 'جملات الهام‌بخش و باورهای بنیادین ما'
                : 'Words That Inspire Our Mission'}
            </Typography>
          </Stack>

          <Grid container spacing={2.2}>
            {inspirationalQuotes.map((item, i) => (
              <Grid key={i} size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: i % 2 === 0 ? '#FFFFFF' : '#EEEDE6',
                    border: '1px solid rgba(17,18,15,0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Quote size={20} color="#8B8D83" style={{ marginBottom: 10 }} />
                    <Typography
                      sx={{
                        fontSize: '0.96rem',
                        fontWeight: 700,
                        lineHeight: 1.85,
                        color: '#11120F',
                        mb: 1.8,
                      }}
                    >
                      {item.quote}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={item.tag}
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: 'rgba(17,18,15,0.07)',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Founder & Software Administrator Card — Mahan Owji */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4.5 },
            borderRadius: 4,
            bgcolor: '#11120F',
            color: '#F6F5F0',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7.5 }}>
              <Chip
                size="small"
                label={
                  lang === 'fa'
                    ? 'مدیریت و معماری پلتفرم'
                    : 'Founder & Software Administration'
                }
                sx={{
                  bgcolor: '#C7F36B',
                  color: '#11120F',
                  fontWeight: 800,
                  mb: 1.5,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.8 }}>
                {lang === 'fa' ? 'ماهان اوجی (Mahan Owji)' : 'Mahan Owji'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: '#C7F36B',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                {lang === 'fa'
                  ? 'بنیان‌گذار و مدیر ارشد نرم‌افزار اوجیفای'
                  : 'Founder & Lead Software Administrator of OWJIFY'}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: 'rgba(246,245,240,0.78)',
                  lineHeight: 1.85,
                }}
              >
                {lang === 'fa'
                  ? 'اوجیفای با چشم‌انداز و مدیریت ماهان اوجی طراحی و توسعه یافته است تا بستری امن، مدرن و انسانی برای ارتباط مستقیم مردم با متخصصان در سراسر کشور فراهم کند. برای پیشنهادهای راهبردی، همکاری و ارتباط مستقیم با مدیریت می‌توانید از طریق ایمیل رسمی در تماس باشید.'
                  : 'Designed and led by Mahan Owji, OWJIFY brings people together in a trusted, bilingual digital space where human talent meets real-world opportunity. Reach out directly anytime for partnerships, feedback, or inquiries.'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 4.5 }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3.5,
                  bgcolor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Typography
                  sx={{ fontSize: '0.75rem', color: 'rgba(246,245,240,0.65)', mb: 0.6 }}
                >
                  {lang === 'fa'
                    ? 'ایمیل رسمی مدیر ارشد سامانه:'
                    : 'Official Administrator Email:'}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    color: '#C7F36B',
                    mb: 1.8,
                    wordBreak: 'break-all',
                  }}
                  dir="ltr"
                >
                  {adminEmail}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <a
                    href={`mailto:${adminEmail}`}
                    className="owj-btn owj-btn--lime owj-btn--sm"
                  >
                    <Mail size={14} />
                    <span>{lang === 'fa' ? 'ارسال ایمیل' : 'Email Admin'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={copyAdminEmail}
                    className="owj-btn owj-btn--outline-light owj-btn--sm"
                  >
                    <Copy size={14} />
                    <span>{lang === 'fa' ? 'کپی ایمیل' : 'Copy'}</span>
                  </button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Bottom CTA */}
        <Stack
          direction="row"
          justifyContent="center"
          spacing={1.2}
          flexWrap="wrap"
          useFlexGap
          sx={{ mt: 4 }}
        >
          <Link to="/explore" className="owj-btn owj-btn--dark">
            <Users size={15} />
            <span>{lang === 'fa' ? 'کاوش متخصصان اوجیفای' : 'Explore Specialists'}</span>
          </Link>
          <Link to="/support" className="owj-btn owj-btn--outline">
            <span>{lang === 'fa' ? 'مرکز پشتیبانی و گزارش' : 'Support Center'}</span>
          </Link>
        </Stack>
      </Container>
    </PageTransition>
  );
}
