import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Stack, Tabs, Tab, Box } from '@mui/material';
import {
  MessageSquare,
  Star,
  Layers,
  Eye,
  ShieldCheck,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatRelativeTime } from '../../utils/formatters';
import styles from './NotificationsPage.module.scss';

const TYPE_ICONS = {
  message: MessageSquare,
  review: Star,
  ad_status: Layers,
  profile: Eye,
  account: ShieldCheck,
};

export default function NotificationsPage() {
  const { lang, l } = useLanguage();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
  } = useMarketplace();
  const { showToast } = useToast();

  const [filterType, setFilterType] = useState('all');

  const filtered = useMemo(() => {
    if (filterType === 'all') return notifications;
    return notifications.filter((n) => n.type === filterType);
  }, [notifications, filterType]);

  const tabs = [
    { id: 'all', fa: 'همه اعلان‌ها', en: 'All' },
    { id: 'message', fa: 'پیام‌ها', en: 'Messages' },
    { id: 'review', fa: 'دیدگاه‌ها', en: 'Reviews' },
    { id: 'ad_status', fa: 'وضعیت آگهی', en: 'Advertisements' },
    { id: 'profile', fa: 'تعامل پروفایل', en: 'Profile' },
    { id: 'account', fa: 'حساب کاربری', en: 'Account' },
  ];

  return (
    <PageTransition>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, pb: { xs: 6, md: 9 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <div>
            <h1 style={{ fontSize: 'clamp(1.45rem, 2.5vw, 1.8rem)', fontWeight: 900 }}>
              {lang === 'fa' ? 'مرکز اعلان‌ها' : 'Notification Center'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#666860' }}>
              {lang === 'fa'
                ? 'پیگیری پیام‌های جدید، وضعیت انتشار آگهی‌ها و دیدگاه کارفرمایان'
                : 'Stay updated on messages, listing approvals, and client reviews'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              markAllNotificationsRead();
              showToast({
                title:
                  lang === 'fa'
                    ? 'همه اعلان‌ها خوانده‌شده علامت خوردند'
                    : 'All notifications marked as read',
                type: 'info',
              });
            }}
            className="owj-btn owj-btn--dark owj-btn--sm"
          >
            <CheckCheck size={15} />
            <span>{lang === 'fa' ? 'خوانده‌شدن همه' : 'Mark All Read'}</span>
          </button>
        </Stack>

        <Box
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid rgba(17,18,15,0.08)',
            px: 1,
            mb: 3,
          }}
        >
          <Tabs
            value={filterType}
            onChange={(_, val) => setFilterType(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.88rem',
                minHeight: 46,
                color: '#666860',
              },
              '& .Mui-selected': {
                color: '#11120F !important',
              },
            }}
          >
            {tabs.map((t) => (
              <Tab key={t.id} value={t.id} label={t[lang]} />
            ))}
          </Tabs>
        </Box>

        <Stack spacing={1.5}>
          {filtered.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                background: '#fff',
                borderRadius: 18,
              }}
            >
              {lang === 'fa' ? 'اعلانی در این بخش وجود ندارد.' : 'No notifications here.'}
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = TYPE_ICONS[item.type] || ShieldCheck;
              return (
                <div
                  key={item.id}
                  className={`${styles.item} ${!item.read ? styles.unread : ''}`}
                >
                  <div style={{ display: 'flex', gap: '0.9rem', flex: 1 }}>
                    <span className={styles.iconCircle}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <Link
                        to={item.link || '/dashboard'}
                        onClick={() => markNotificationRead(item.id, true)}
                        style={{ fontWeight: 800, fontSize: '0.95rem' }}
                      >
                        {l(item.title)}
                      </Link>
                      <p style={{ fontSize: '0.85rem', color: '#464841', marginTop: 3 }}>
                        {l(item.body)}
                      </p>
                      <span style={{ fontSize: '0.73rem', color: '#92948c' }}>
                        {formatRelativeTime(item.createdAt, lang)}
                      </span>
                    </div>
                  </div>

                  <Stack direction="row" spacing={0.8} alignItems="center">
                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => markNotificationRead(item.id, true)}
                        className="owj-btn owj-btn--outline owj-btn--sm"
                      >
                        {lang === 'fa' ? 'خوانده شد' : 'Mark Read'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteNotification(item.id)}
                      className="owj-btn owj-btn--ghost owj-btn--sm"
                      aria-label="Delete notification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </Stack>
                </div>
              );
            })
          )}
        </Stack>
      </Container>
    </PageTransition>
  );
}
