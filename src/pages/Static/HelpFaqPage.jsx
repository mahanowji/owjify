import { useState, useMemo } from 'react';
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ChevronDown, Search } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { SEED_FAQS } from '../../data/faqs';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StaticPages.module.scss';

export default function HelpFaqPage() {
  const { lang, l } = useLanguage();
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(SEED_FAQS[0]?.id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEED_FAQS;
    return SEED_FAQS.filter(
      (f) =>
        f.q.fa.toLowerCase().includes(q) ||
        f.q.en.toLowerCase().includes(q) ||
        f.a.fa.toLowerCase().includes(q) ||
        f.a.en.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <PageTransition>
      <section className={styles.hero}>
        <Container maxWidth="xl">
          <span className="owj-section-tag owj-section-tag--dark">
            {lang === 'fa' ? 'مرکز راهنما و سوالات متداول' : 'Help Center & FAQ'}
          </span>
          <h1 className={styles.heroTitle}>
            {lang === 'fa' ? 'چگونه می‌توانیم کمکتان کنیم؟' : 'Answers to common questions'}
          </h1>

          <div
            style={{
              marginTop: '1.5rem',
              maxWidth: 520,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.75rem 1.1rem',
              borderRadius: 999,
              background: '#F6F5F0',
              color: '#11120F',
            }}
          >
            <Search size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === 'fa' ? 'جستجو در سوالات متداول...' : 'Search help articles...'
              }
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
            />
          </div>
        </Container>
      </section>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        {filtered.map((item) => (
          <Accordion
            key={item.id}
            expanded={openId === item.id}
            onChange={(_, isExpanded) => setOpenId(isExpanded ? item.id : null)}
            disableGutters
            elevation={0}
            sx={{
              mb: 1.5,
              borderRadius: '16px !important',
              border: '1px solid rgba(17,18,15,0.08)',
              bgcolor: '#FFFFFF',
              '&::before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ChevronDown size={18} />}
              sx={{
                px: 2.5,
                py: 1,
                fontWeight: 800,
                fontSize: '0.96rem',
              }}
            >
              {l(item.q)}
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2.5, pb: 2.5, pt: 0, color: '#464841', lineHeight: 1.85 }}>
              {l(item.a)}
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </PageTransition>
  );
}
