import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
} from '@mui/material';
import {
  LifeBuoy,
  Flag,
  Send,
  Search,
  CheckCircle2,
  Clock,
  Headset,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatRelativeDate } from '../../utils/formatters';

export default function SupportPage() {
  const { lang, l } = useLanguage();
  const { user, hasToken, canAccessOperatorDesk, isAdmin } = useAuth();
  const {
    advertisements,
    supportTickets,
    createSupportTicket,
    replySupportTicket,
  } = useMarketplace();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTicketId = searchParams.get('ticket') || '';

  // Submit Report / Support Form State
  const [category, setCategory] = useState('report_listing');
  const [priority, setPriority] = useState('normal');
  const [relatedAdId, setRelatedAdId] = useState('');
  const [guestName, setGuestName] = useState(user ? l(user.fullName) : '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tracking & Thread State
  const [lookupQuery, setLookupQuery] = useState(initialTicketId);
  const [selectedTicketId, setSelectedTicketId] = useState(initialTicketId);
  const [followUpText, setFollowUpText] = useState('');

  const categories = [
    {
      id: 'report_listing',
      label: lang === 'fa' ? 'گزارش تخلف آگهی یا کاربر' : 'Report Listing or User',
    },
    {
      id: 'dispute',
      label: lang === 'fa' ? 'پیگیری سفارش و هماهنگی' : 'Service & Booking Issue',
    },
    {
      id: 'technical',
      label: lang === 'fa' ? 'مشکل فنی در سایت' : 'Technical Support',
    },
    {
      id: 'general',
      label: lang === 'fa' ? 'پیشنهاد و سوال عمومی' : 'General Inquiry',
    },
  ];

  const statusMeta = (status) => {
    if (status === 'resolved') {
      return {
        label: lang === 'fa' ? 'حل‌شده' : 'Resolved',
        bg: 'rgba(40,158,103,0.14)',
        color: '#1b7a4c',
      };
    }
    if (status === 'escalated') {
      return {
        label: lang === 'fa' ? 'ارجاع به مدیریت ارشد' : 'Escalated to Admin',
        bg: 'rgba(217,72,72,0.14)',
        color: '#b83232',
      };
    }
    if (status === 'answered') {
      return {
        label: lang === 'fa' ? 'پاسخ اپراتور ثبت شد' : 'Answered by Operator',
        bg: 'rgba(199,243,107,0.45)',
        color: '#11120F',
      };
    }
    if (status === 'in_progress') {
      return {
        label: lang === 'fa' ? 'در حال پیگیری اپراتور' : 'In Progress',
        bg: 'rgba(229,153,52,0.18)',
        color: '#9e6210',
      };
    }
    return {
      label: lang === 'fa' ? 'در انتظار بررسی' : 'Open',
      bg: 'rgba(17,18,15,0.08)',
      color: '#11120F',
    };
  };

  // Tickets visible to the user (their own tickets + any ticket matched by tracking ID)
  const visibleTickets = useMemo(() => {
    const q = lookupQuery.trim().toUpperCase();
    return supportTickets.filter((t) => {
      if (q && t.id.toUpperCase().includes(q)) return true;
      if (hasToken && user) {
        if (canAccessOperatorDesk) return true;
        if (t.reporterUserId === user.id) return true;
        if (t.reporterEmail && user.email && t.reporterEmail.toLowerCase() === user.email.toLowerCase()) {
          return true;
        }
      }
      return false;
    });
  }, [supportTickets, lookupQuery, hasToken, user, canAccessOperatorDesk]);

  const activeTicket = useMemo(() => {
    if (selectedTicketId) {
      const exact = supportTickets.find(
        (t) => t.id.toUpperCase() === selectedTicketId.trim().toUpperCase()
      );
      if (exact) return exact;
    }
    return visibleTickets[0] || null;
  }, [supportTickets, selectedTicketId, visibleTickets]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);

    const linkedAd = relatedAdId
      ? advertisements.find((a) => a.id === relatedAdId)
      : null;

    const created = await createSupportTicket({
      category,
      priority,
      reporterName: hasToken
        ? user.fullName
        : guestName.trim() || (lang === 'fa' ? 'کاربر مهمان' : 'Guest User'),
      reporterEmail: hasToken ? user.email : guestEmail.trim(),
      relatedAdId: linkedAd?.id || null,
      relatedAdTitle: linkedAd?.title || null,
      subject: subject.trim(),
      message: message.trim(),
    });

    setSubmitting(false);
    setSubject('');
    setMessage('');
    setRelatedAdId('');
    setSelectedTicketId(created.id);
    setLookupQuery(created.id);
    setSearchParams({ ticket: created.id });

    showToast({
      title:
        lang === 'fa'
          ? `گزارش شما با کد ${created.id} ثبت شد`
          : `Ticket ${created.id} Created`,
      message:
        lang === 'fa'
          ? 'اپراتور پشتیبانی به‌زودی پاسخ رسمی را در همین صفحه ثبت خواهد کرد.'
          : 'Our support operators will respond directly in this thread.',
      type: 'success',
    });
  };

  const handleFollowUp = async (e) => {
    e.preventDefault();
    if (!activeTicket || !followUpText.trim()) return;
    await replySupportTicket({
      ticketId: activeTicket.id,
      replyText: followUpText.trim(),
      authorName: hasToken ? user.fullName : activeTicket.reporterName,
      authorRole: 'reporter',
      nextStatus: 'open',
    });
    setFollowUpText('');
    showToast({
      title: lang === 'fa' ? 'پاسخ تکمیلی ثبت شد' : 'Reply Sent',
      type: 'info',
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '0.68rem 0.9rem',
    borderRadius: '11px',
    border: '1px solid rgba(17,18,15,0.15)',
    background: '#FFFFFF',
    fontSize: '0.86rem',
  };

  return (
    <PageTransition>
      {/* Editorial Dark Header */}
      <Box
        sx={{
          bgcolor: '#11120F',
          color: '#F6F5F0',
          py: { xs: 4.5, md: 6 },
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <span className="owj-section-tag owj-section-tag--dark">
                {lang === 'fa' ? 'مرکز پشتیبانی و گزارش اوجیفای' : 'Trust, Safety & Support'}
              </span>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '1.75rem', md: '2.45rem' },
                  fontWeight: 800,
                  mt: 1.3,
                  mb: 0.7,
                }}
              >
                {lang === 'fa'
                  ? 'ثبت گزارش، پیگیری و ارتباط با پشتیبانی'
                  : 'Report an Issue & Track Support'}
              </Typography>
              <Typography sx={{ color: 'rgba(246,245,240,0.72)', maxWidth: 650, fontSize: '0.92rem' }}>
                {lang === 'fa'
                  ? 'هرگونه مغایرت در آگهی‌ها، مشکل فنی یا درخواست پیگیری را ثبت کنید؛ اپراتورهای پشتیبانی از طریق پنل اختصاصی پاسخ‌گوی شما هستند.'
                  : 'Report a listing issue, request assistance, and receive direct answers from OWJIFY support operators.'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              {(canAccessOperatorDesk || !hasToken) && (
                <Link to="/operator" className="owj-btn owj-btn--outline-light owj-btn--sm">
                  <Headset size={14} />
                  <span>
                    {canAccessOperatorDesk
                      ? lang === 'fa'
                        ? 'ورود به میز کار اپراتور'
                        : 'Open Operator Desk'
                      : lang === 'fa'
                      ? 'پرتال اپراتور پشتیبانی'
                      : 'Operator Portal'}
                  </span>
                </Link>
              )}
              <Link to="/faq" className="owj-btn owj-btn--lime owj-btn--sm">
                <LifeBuoy size={14} />
                <span>{lang === 'fa' ? 'سوالات متداول' : 'FAQ'}</span>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: { xs: 3.5, md: 5.5 } }}>
        <Grid container spacing={3}>
          {/* Left Column: Submit Report / Support Request */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 4,
                border: '1px solid rgba(17,18,15,0.09)',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Flag size={18} />
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.08rem' }}>
                  {lang === 'fa'
                    ? 'ارسال گزارش تخلف یا تیکت پشتیبانی جدید'
                    : 'Submit a Report or Support Ticket'}
                </Typography>
              </Stack>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={1.8}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      {lang === 'fa' ? 'نوع گزارش یا درخواست' : 'Report Category'}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={inputStyle}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 5 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      {lang === 'fa' ? 'سطح اولویت' : 'Priority'}
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="normal">{lang === 'fa' ? 'عادی' : 'Normal'}</option>
                      <option value="high">{lang === 'fa' ? 'مهم' : 'High'}</option>
                      <option value="urgent">{lang === 'fa' ? 'فوری' : 'Urgent'}</option>
                    </select>
                  </Grid>

                  {!hasToken && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                          {lang === 'fa' ? 'نام و نام خانوادگی' : 'Your Name'}
                        </label>
                        <input
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder={lang === 'fa' ? 'نام شما...' : 'Full name'}
                          style={inputStyle}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                          {lang === 'fa' ? 'نشانی ایمیل جهت پاسخ' : 'Your Email'}
                        </label>
                        <input
                          type="email"
                          required
                          dir="ltr"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="you@example.com"
                          style={inputStyle}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid size={{ xs: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      {lang === 'fa'
                        ? 'آگهی مرتبط (در صورت گزارش یک آگهی خاص — اختیاری)'
                        : 'Related Service Listing (Optional)'}
                    </label>
                    <select
                      value={relatedAdId}
                      onChange={(e) => setRelatedAdId(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="">
                        {lang === 'fa' ? '— بدون آگهی مشخص —' : '— General / Not specific to an ad —'}
                      </option>
                      {advertisements.map((ad) => (
                        <option key={ad.id} value={ad.id}>
                          {l(ad.title)}
                        </option>
                      ))}
                    </select>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      {lang === 'fa' ? 'عنوان موضوع *' : 'Subject *'}
                    </label>
                    <input
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'مثال: گزارش مغایرت قیمت در آگهی یا نیاز به راهنمایی...'
                          : 'Brief summary of what you want to report...'
                      }
                      style={inputStyle}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: 6 }}>
                      {lang === 'fa' ? 'شرح کامل گزارش یا پیام *' : 'Detailed Description *'}
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'جزئیات موضوع را بنویسید تا اپراتور پشتیبانی دقیق بررسی کند...'
                          : 'Provide clear details so our operator can investigate and answer...'
                      }
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </Grid>
                </Grid>

                <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="owj-btn owj-btn--dark"
                  >
                    {submitting ? <span className="owj-spinner" /> : <Send size={15} />}
                    <span>
                      {lang === 'fa' ? 'ثبت گزارش و دریافت کد پیگیری' : 'Submit Report'}
                    </span>
                  </button>
                </Stack>
              </form>
            </Paper>
          </Grid>

          {/* Right Column: Track Reports & View Operator Answers */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 4,
                border: '1px solid rgba(17,18,15,0.09)',
                height: '100%',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1.2}
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <MessageSquare size={18} />
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.06rem' }}>
                    {lang === 'fa'
                      ? 'پیگیری گزارش‌ها و پاسخ اپراتور'
                      : 'Track Tickets & Operator Answers'}
                  </Typography>
                </Stack>
              </Stack>

              {/* Lookup by Tracking Code */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.4,
                  py: 0.7,
                  borderRadius: 2.5,
                  bgcolor: '#F6F5F0',
                  border: '1px solid rgba(17,18,15,0.1)',
                  mb: 2,
                }}
              >
                <Search size={16} color="#666860" />
                <input
                  dir="ltr"
                  value={lookupQuery}
                  onChange={(e) => {
                    setLookupQuery(e.target.value);
                    setSelectedTicketId(e.target.value);
                  }}
                  placeholder={
                    lang === 'fa'
                      ? 'جستجو با کد پیگیری (مثال: SUP-1041)'
                      : 'Enter Tracking ID (e.g. SUP-1041)'
                  }
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.84rem',
                  }}
                />
                {lookupQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setLookupQuery('');
                      setSelectedTicketId('');
                    }}
                    className="owj-btn owj-btn--ghost owj-btn--sm"
                  >
                    {lang === 'fa' ? 'پاک کردن' : 'Clear'}
                  </button>
                )}
              </Box>

              {/* Ticket Selector Chips */}
              {visibleTickets.length > 0 && (
                <Stack
                  direction="row"
                  spacing={0.75}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mb: 2 }}
                >
                  {visibleTickets.map((t) => {
                    const isSelected = activeTicket?.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTicketId(t.id)}
                        className={`owj-btn owj-btn--sm ${
                          isSelected ? 'owj-btn--dark' : 'owj-btn--outline'
                        }`}
                      >
                        <span dir="ltr">{t.id}</span>
                      </button>
                    );
                  })}
                </Stack>
              )}

              {activeTicket ? (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#F6F5F0',
                    border: '1px solid rgba(17,18,15,0.08)',
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={activeTicket.id}
                        sx={{ fontWeight: 800, bgcolor: '#11120F', color: '#C7F36B' }}
                      />
                      <Chip
                        size="small"
                        label={statusMeta(activeTicket.status).label}
                        sx={{
                          fontWeight: 700,
                          bgcolor: statusMeta(activeTicket.status).bg,
                          color: statusMeta(activeTicket.status).color,
                        }}
                      />
                    </Stack>
                    <Typography sx={{ fontSize: '0.74rem', color: '#666860' }}>
                      {formatRelativeDate(activeTicket.updatedAt, lang)}
                    </Typography>
                  </Stack>

                  <Typography sx={{ fontWeight: 800, fontSize: '0.96rem', mb: 0.6 }}>
                    {l(activeTicket.subject)}
                  </Typography>

                  {activeTicket.relatedAdId && (
                    <Box sx={{ mb: 1.2 }}>
                      <Link
                        to={`/services/${activeTicket.relatedAdId}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: '#289e67',
                        }}
                      >
                        <ExternalLink size={13} />
                        <span>
                          {lang === 'fa' ? 'مشاهده آگهی گزارش‌شده: ' : 'Reported Ad: '}
                          {l(activeTicket.relatedAdTitle)}
                        </span>
                      </Link>
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  {/* Conversation Thread */}
                  <Stack spacing={1.2} sx={{ maxHeight: 280, overflowY: 'auto', mb: 1.8 }}>
                    {(activeTicket.messages || []).map((m) => {
                      const isOperatorReply =
                        m.authorRole === 'operator' || m.authorRole === 'admin';
                      return (
                        <Box
                          key={m.id}
                          sx={{
                            p: 1.5,
                            borderRadius: 2.5,
                            bgcolor: isOperatorReply ? '#11120F' : '#FFFFFF',
                            color: isOperatorReply ? '#F6F5F0' : '#11120F',
                            border: '1px solid rgba(17,18,15,0.08)',
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <Stack direction="row" spacing={0.6} alignItems="center">
                              {isOperatorReply && <Headset size={13} color="#C7F36B" />}
                              <Typography
                                sx={{
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  color: isOperatorReply ? '#C7F36B' : '#464841',
                                }}
                              >
                                {l(m.authorName)}
                              </Typography>
                            </Stack>
                            <Typography
                              sx={{
                                fontSize: '0.68rem',
                                color: isOperatorReply
                                  ? 'rgba(246,245,240,0.6)'
                                  : '#8B8D83',
                              }}
                            >
                              {formatRelativeDate(m.createdAt, lang)}
                            </Typography>
                          </Stack>
                          <Typography sx={{ fontSize: '0.84rem', lineHeight: 1.7 }}>
                            {l(m.text)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>

                  {/* User Follow-up Input */}
                  {activeTicket.status !== 'resolved' && (
                    <form onSubmit={handleFollowUp}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <input
                          value={followUpText}
                          onChange={(e) => setFollowUpText(e.target.value)}
                          placeholder={
                            lang === 'fa'
                              ? 'ارسال توضیح تکمیلی برای اپراتور...'
                              : 'Add a follow-up message...'
                          }
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        <button
                          type="submit"
                          disabled={!followUpText.trim()}
                          className="owj-btn owj-btn--lime owj-btn--sm"
                        >
                          <Send size={14} />
                          <span>{lang === 'fa' ? 'ارسال' : 'Send'}</span>
                        </button>
                      </Stack>
                    </form>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    py: 5,
                    px: 2,
                    textAlign: 'center',
                    borderRadius: 3,
                    bgcolor: '#F6F5F0',
                  }}
                >
                  <Clock size={26} color="#8B8D83" style={{ margin: '0 auto 0.6rem' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', mb: 0.5 }}>
                    {lang === 'fa'
                      ? 'برای مشاهده وضعیت، کد پیگیری خود را وارد کنید'
                      : 'Enter your tracking code or sign in to view tickets'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#666860' }}>
                    {lang === 'fa'
                      ? 'نمونه کد پیگیری فعال جهت تست: SUP-1041 یا SUP-1039'
                      : 'Try sample ticket ID: SUP-1041 or SUP-1039'}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageTransition>
  );
}
