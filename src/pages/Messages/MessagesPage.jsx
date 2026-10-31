import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Stack,
  Tabs,
  Tab,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, Compass, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import SmartImage from '../../components/common/SmartImage';
import ChatThread from '../../components/messaging/ChatThread';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatRelativeTime, formatNumber } from '../../utils/formatters';
import styles from './MessagesPage.module.scss';

export default function MessagesPage() {
  const { lang, l } = useLanguage();
  const { isProfessional } = useAuth();
  const {
    conversations,
    sendMessageInConversation,
    markConversationRead,
  } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const initialBox = searchParams.get('box') || 'all';
  const [boxFilter, setBoxFilter] = useState(initialBox);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const paramBox = searchParams.get('box');
    if (paramBox && ['all', 'received', 'sent'].includes(paramBox)) {
      setBoxFilter(paramBox);
    }
  }, [searchParams]);

  const receivedCount = useMemo(
    () => conversations.filter((c) => c.direction === 'received').length,
    [conversations]
  );
  const sentCount = useMemo(
    () => conversations.filter((c) => c.direction === 'sent').length,
    [conversations]
  );

  const filteredConvs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return conversations.filter((c) => {
      if (isProfessional) {
        if (boxFilter === 'received' && c.direction !== 'received') return false;
        if (boxFilter === 'sent' && c.direction !== 'sent') return false;
      }
      if (!q) return true;
      const text = `${c.participantName?.fa || ''} ${c.participantName?.en || ''} ${
        c.serviceTitle?.fa || ''
      } ${c.serviceTitle?.en || ''}`.toLowerCase();
      return text.includes(q);
    });
  }, [conversations, isProfessional, boxFilter, searchTerm]);

  const initialConvId =
    searchParams.get('conv') || filteredConvs[0]?.id || conversations[0]?.id || null;
  const [selectedId, setSelectedId] = useState(initialConvId);
  const [mobileViewingChat, setMobileViewingChat] = useState(
    Boolean(searchParams.get('conv'))
  );

  useEffect(() => {
    const paramId = searchParams.get('conv');
    if (paramId) {
      setSelectedId(paramId);
      setMobileViewingChat(true);
    } else if (filteredConvs.length > 0 && !filteredConvs.some((c) => c.id === selectedId)) {
      setSelectedId(filteredConvs[0].id);
    }
  }, [searchParams, filteredConvs, selectedId]);

  useEffect(() => {
    if (selectedId) {
      markConversationRead(selectedId);
    }
  }, [selectedId, markConversationRead]);

  const activeConv = conversations.find((c) => c.id === selectedId) || null;

  const handleSelect = (id) => {
    setSelectedId(id);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('conv', id);
    setSearchParams(nextParams);
    setMobileViewingChat(true);
  };

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 2.5, md: 4 }, pb: { xs: 5, md: 7 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 2.2 }}
        >
          <div>
            <h1 style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', fontWeight: 900 }}>
              {isProfessional
                ? lang === 'fa'
                  ? 'پیام‌های متخصص'
                  : 'Specialist Messages'
                : lang === 'fa'
                ? 'پیام‌های من به متخصصان'
                : 'My Messages'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#666860' }}>
              {isProfessional
                ? lang === 'fa'
                  ? 'تفکیک پیام‌های دریافتی شما از درخواست‌هایی که به سایر متخصصان ارسال کرده‌اید'
                  : 'Incoming inquiries separated from requests you sent to other specialists'
                : lang === 'fa'
                ? 'گفتگوها و استعلام‌هایی که برای متخصصان ارسال کرده‌اید'
                : 'Conversations and inquiries you have sent to specialists'}
            </p>
          </div>

          <Link to="/explore" className="owj-btn owj-btn--dark owj-btn--sm">
            <Compass size={15} />
            <span>
              {lang === 'fa' ? 'مشاهده آگهی‌ها' : 'Browse Listings'}
            </span>
          </Link>
        </Stack>

        {/* Specialist Two-Bucket Distinction: Received vs Requests to Other Specialists */}
        {isProfessional && (
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid rgba(17,18,15,0.08)',
              px: 1,
              mb: 2.2,
              display: 'inline-block',
              maxWidth: '100%',
            }}
          >
            <Tabs
              value={boxFilter}
              onChange={(_, val) => setBoxFilter(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  minHeight: 44,
                  color: '#666860',
                },
                '& .Mui-selected': {
                  color: '#11120F !important',
                },
              }}
            >
              <Tab
                value="all"
                label={
                  lang === 'fa'
                    ? `همه (${formatNumber(conversations.length, lang)})`
                    : `All (${conversations.length})`
                }
              />
              <Tab
                value="received"
                label={
                  lang === 'fa'
                    ? `پیام‌های دریافتی من (${formatNumber(receivedCount, lang)})`
                    : `Received Inquiries (${receivedCount})`
                }
              />
              <Tab
                value="sent"
                label={
                  lang === 'fa'
                    ? `درخواست‌های من به سایر متخصصان (${formatNumber(sentCount, lang)})`
                    : `Requests to Other Specialists (${sentCount})`
                }
              />
            </Tabs>
          </Box>
        )}

        <Grid container spacing={2.5} sx={{ minHeight: { xs: '72vh', md: '660px' } }}>
          {/* Conversation List */}
          {(!isMobile || !mobileViewingChat) && (
            <Grid size={{ xs: 12, md: 4.4, lg: 3.9 }}>
              <aside className={styles.listPane} style={{ height: '100%' }}>
                <div className={styles.searchBar}>
                  <Search size={16} color="#666860" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={
                      lang === 'fa' ? 'جستجو در گفتگوها...' : 'Search conversations...'
                    }
                  />
                </div>

                <div className={styles.convList}>
                  {filteredConvs.length === 0 ? (
                    <div
                      style={{
                        padding: '2.2rem 1.2rem',
                        textAlign: 'center',
                        color: '#666860',
                        fontSize: '0.86rem',
                      }}
                    >
                      <p style={{ marginBottom: '0.9rem' }}>
                        {isProfessional
                          ? boxFilter === 'received'
                            ? lang === 'fa'
                              ? 'هنوز پیام دریافتی جدیدی ندارید.'
                              : 'No incoming messages yet.'
                            : boxFilter === 'sent'
                            ? lang === 'fa'
                              ? 'هنوز درخواستی برای سایر متخصصان ارسال نکرده‌اید.'
                              : 'You have not contacted other specialists yet.'
                            : lang === 'fa'
                            ? 'گفتگویی یافت نشد.'
                            : 'No matching conversations.'
                          : lang === 'fa'
                          ? 'هنوز پیامی برای متخصصان ارسال نکرده‌اید.'
                          : 'You have not sent any messages to specialists yet.'}
                      </p>
                      <Link to="/explore" className="owj-btn owj-btn--dark owj-btn--sm">
                        {lang === 'fa' ? 'مشاهده آگهی‌ها' : 'Explore Listings'}
                      </Link>
                    </div>
                  ) : (
                    filteredConvs.map((conv) => {
                      const lastMsg = conv.messages?.[conv.messages.length - 1];
                      const isIncoming = conv.direction === 'received';

                      return (
                        <button
                          key={conv.id}
                          type="button"
                          onClick={() => handleSelect(conv.id)}
                          className={`${styles.convItem} ${
                            selectedId === conv.id ? styles.active : ''
                          }`}
                        >
                          <div className={styles.avatarWrap}>
                            <SmartImage
                              src={conv.participantAvatar}
                              alt={l(conv.participantName)}
                            />
                            {conv.online && <span className={styles.onlineDot} />}
                          </div>

                          <div className={styles.info}>
                            <div className={styles.topRow}>
                              <span className={styles.name}>{l(conv.participantName)}</span>
                              <span className={styles.time}>
                                {formatRelativeTime(conv.updatedAt, lang)}
                              </span>
                            </div>

                            {/* Simple, Crystal-Clear Direction Badge */}
                            <div style={{ marginTop: 2, marginBottom: 3 }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 3,
                                  padding: '1px 8px',
                                  borderRadius: 999,
                                  fontSize: '0.67rem',
                                  fontWeight: 800,
                                  background: isIncoming
                                    ? 'rgba(40, 158, 103, 0.14)'
                                    : isProfessional
                                    ? '#C7F36B'
                                    : 'rgba(17, 18, 15, 0.08)',
                                  color: isIncoming ? '#1c7c4d' : '#11120F',
                                }}
                              >
                                {isIncoming ? (
                                  <>
                                    <ArrowDownLeft size={11} />
                                    {lang === 'fa' ? 'پیام دریافتی متخصص' : 'Received Inquiry'}
                                  </>
                                ) : isProfessional ? (
                                  <>
                                    <ArrowUpRight size={11} />
                                    {lang === 'fa'
                                      ? 'درخواست من به متخصص دیگر'
                                      : 'Sent to Specialist'}
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpRight size={11} />
                                    {lang === 'fa' ? 'ارسالی به متخصص' : 'Sent to Specialist'}
                                  </>
                                )}
                              </span>
                            </div>

                            <div className={styles.preview}>
                              {lastMsg ? l(lastMsg.text) : l(conv.serviceTitle)}
                            </div>
                          </div>

                          {conv.unread > 0 && (
                            <span className={styles.unreadBadge}>
                              {formatNumber(conv.unread, lang)}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </aside>
            </Grid>
          )}

          {/* Active Chat Window */}
          {(!isMobile || mobileViewingChat) && (
            <Grid size={{ xs: 12, md: 7.6, lg: 8.1 }}>
              <div className={styles.threadWrap} style={{ height: '100%' }}>
                <ChatThread
                  conversation={activeConv}
                  onSend={sendMessageInConversation}
                  onMobileBack={() => setMobileViewingChat(false)}
                />
              </div>
            </Grid>
          )}
        </Grid>
      </Container>
    </PageTransition>
  );
}
