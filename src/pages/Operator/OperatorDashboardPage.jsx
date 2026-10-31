import { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
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
  Headset,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  KeyRound,
  Server,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ArrowUpCircle,
} from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import SmartImage from '../../components/common/SmartImage';
import { SUPPORT_API_ENDPOINTS, supportApiService } from '../../services/supportApiService';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import { formatNumber, formatPrice, formatRelativeDate } from '../../utils/formatters';

export default function OperatorDashboardPage() {
  const { lang, l } = useLanguage();
  const {
    user,
    token,
    hasToken,
    canAccessOperatorDesk,
    isAdmin,
    login,
    logout,
  } = useAuth();
  const {
    advertisements,
    professionals,
    supportTickets,
    replySupportTicket,
    updateSupportTicketStatus,
    escalateSupportTicket,
  } = useMarketplace();
  const { showToast } = useToast();

  // Operator API Login Form State (only shown to unauthenticated Guests)
  const [apiEndpoint, setApiEndpoint] = useState(SUPPORT_API_ENDPOINTS.operatorLogin);
  const [email, setEmail] = useState('operator@owjify.com');
  const [password, setPassword] = useState('Owjify@2026');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Operator Desk State
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState(supportTickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [escalationOpen, setEscalationOpen] = useState(false);
  const [escalationNote, setEscalationNote] = useState('');
  const [sending, setSending] = useState(false);

  // Filtered Ticket Queue
  const filteredTickets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return supportTickets.filter((t) => {
      if (statusFilter === 'open' && t.status !== 'open' && t.status !== 'in_progress') {
        return false;
      }
      if (statusFilter === 'escalated' && t.status !== 'escalated') {
        return false;
      }
      if (statusFilter === 'reports' && t.category !== 'report_listing') {
        return false;
      }
      if (statusFilter === 'answered' && t.status !== 'answered') {
        return false;
      }
      if (statusFilter === 'resolved' && t.status !== 'resolved') {
        return false;
      }
      if (!q) return true;
      const hay = `${t.id} ${t.reporterName} ${t.reporterEmail} ${t.subject?.fa || ''} ${
        t.subject?.en || ''
      }`.toLowerCase();
      return hay.includes(q);
    });
  }, [supportTickets, statusFilter, searchQuery]);

  const activeTicket =
    filteredTickets.find((t) => t.id === activeId) ||
    supportTickets.find((t) => t.id === activeId) ||
    filteredTickets[0] ||
    null;

  const reportedListing = useMemo(() => {
    if (!activeTicket?.relatedAdId) return null;
    return advertisements.find((a) => a.id === activeTicket.relatedAdId) || null;
  }, [activeTicket, advertisements]);

  const reportedSpecialist = useMemo(() => {
    if (!reportedListing) return null;
    return professionals.find((p) => p.id === reportedListing.proId) || null;
  }, [reportedListing, professionals]);

  const stats = useMemo(() => {
    const total = supportTickets.length;
    const open = supportTickets.filter(
      (t) => t.status === 'open' || t.status === 'in_progress'
    ).length;
    const escalated = supportTickets.filter((t) => t.status === 'escalated').length;
    const answered = supportTickets.filter(
      (t) => t.status === 'answered' || t.status === 'resolved'
    ).length;
    return { total, open, escalated, answered };
  }, [supportTickets]);

  // Logged-in Customers & Professionals must never access Support Operator Console
  if (hasToken && !canAccessOperatorDesk) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleOperatorApiLogin = async (e) => {
    e?.preventDefault?.();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await login({
        email,
        password,
        rememberMe: true,
        endpointOverride: apiEndpoint.startsWith('http') ? apiEndpoint : null,
      });

      if (res.user.accountType !== 'operator' && res.user.accountType !== 'admin') {
        setAuthError(
          lang === 'fa'
            ? 'این حساب دسترسی اپراتور پشتیبانی ندارد. از حساب اپراتور یا ادمین استفاده کنید.'
            : 'This account does not have Operator privileges.'
        );
        setAuthLoading(false);
        return;
      }

      await supportApiService.fetchTickets(res.token);
      showToast({
        title:
          lang === 'fa'
            ? 'اتصال به کنسول اپراتور برقرار شد'
            : 'Operator API Session Active',
        message: l(res.user.fullName),
        type: 'success',
      });
    } catch {
      setAuthError(
        lang === 'fa'
          ? 'احراز هویت اپراتور ناموفق بود. ایمیل یا کلید دسترسی را بررسی کنید.'
          : 'Operator API authentication failed.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const quickTemplates =
    lang === 'fa'
      ? [
          'سلام، گزارش شما توسط واحد پشتیبانی اوجیفای بررسی شد و تذکر لازم به آگهی‌دهنده ثبت گردید.',
          'سلام وقت بخیر، موضوع شما در اولویت پیگیری قرار گرفت و نتیجه نهایی اطلاع‌رسانی خواهد شد.',
          'با سپاس از پیام شما؛ مشکل گزارش‌شده برطرف شد و وضعیت به حل‌شده تغییر یافت.',
        ]
      : [
          'Hello! Thank you for reporting this. Our Trust & Safety team reviewed the listing and took action.',
          'Hi there, we have placed your request under active investigation and are coordinating directly.',
          'Thank you for your patience—this issue has now been verified and resolved.',
        ];

  const handleSendReply = async (markResolved = false) => {
    if (!activeTicket || !replyText.trim()) return;
    setSending(true);
    await replySupportTicket({
      ticketId: activeTicket.id,
      replyText: replyText.trim(),
      authorName: user?.fullName || 'اپراتور پشتیبانی | Support Operator',
      authorRole: isAdmin ? 'admin' : 'operator',
      nextStatus: markResolved ? 'resolved' : 'answered',
    });
    setReplyText('');
    setSending(false);
    showToast({
      title:
        lang === 'fa'
          ? `پاسخ رسمی برای ${activeTicket.id} ارسال شد`
          : `Reply dispatched for ${activeTicket.id}`,
      type: 'success',
    });
  };

  const handleStatusChange = async (nextStatus) => {
    if (!activeTicket) return;
    await updateSupportTicketStatus(activeTicket.id, nextStatus);
    showToast({
      title: lang === 'fa' ? 'وضعیت تیکت بروزرسانی شد' : 'Ticket status updated',
      type: 'info',
    });
  };

  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    if (!activeTicket || !escalationNote.trim()) return;
    setSending(true);
    await escalateSupportTicket({
      ticketId: activeTicket.id,
      reason: escalationNote.trim(),
    });
    setEscalationNote('');
    setEscalationOpen(false);
    setSending(false);
    showToast({
      title:
        lang === 'fa'
          ? `تیکت ${activeTicket.id} به مدیر ارشد ارجاع شد`
          : `Ticket ${activeTicket.id} Escalated to Admin`,
      message:
        lang === 'fa'
          ? 'پرونده در صف فوری پنل ادمین قرار گرفت.'
          : 'Flagged in the Admin Moderation queue.',
      type: 'info',
    });
  };

  // GATE: Dedicated API Operator Login Screen if Guest (not authenticated yet)
  if (!hasToken) {
    return (
      <PageTransition>
        <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid rgba(17,18,15,0.1)',
              bgcolor: '#FFFFFF',
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  bgcolor: '#11120F',
                  color: '#C7F36B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Headset size={20} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {lang === 'fa'
                    ? 'ورود اپراتور پشتیبانی (مبتنی بر API)'
                    : 'Operator Support Console (API Login)'}
                </Typography>
                <Typography sx={{ fontSize: '0.76rem', color: '#666860' }}>
                  POST /api/operator/auth/login • Bearer Token Session
                </Typography>
              </Box>
            </Stack>

            <Typography sx={{ fontSize: '0.86rem', color: '#464841', mb: 2.2 }}>
              {lang === 'fa'
                ? 'اپراتورهای پشتیبانی از طریق این درگاه به API تیکت‌ها متصل شده و به گزارش‌ها و درخواست‌های کاربران پاسخ می‌دهند.'
                : 'Authenticate against the Operator REST API to inspect reports, respond to tickets, and escalate critical cases.'}
            </Typography>

            {authError && (
              <Box
                sx={{
                  p: 1.4,
                  mb: 2,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(217,72,72,0.1)',
                  color: '#D94848',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                {authError}
              </Box>
            )}

            <form onSubmit={handleOperatorApiLogin}>
              <Stack spacing={1.6}>
                <Box>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    {lang === 'fa' ? 'نشانی سرویس API اپراتور' : 'Operator Auth API Endpoint'}
                  </label>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.3,
                      py: 0.7,
                      borderRadius: 2.5,
                      bgcolor: '#F6F5F0',
                      border: '1px solid rgba(17,18,15,0.12)',
                    }}
                  >
                    <Server size={15} color="#464841" />
                    <input
                      dir="ltr"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                      }}
                    />
                  </Box>
                </Box>

                <Box>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    {lang === 'fa' ? 'ایمیل سازمانی اپراتور' : 'Operator Email'}
                  </label>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.68rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(17,18,15,0.15)',
                      fontSize: '0.86rem',
                    }}
                  />
                </Box>

                <Box>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 5 }}>
                    {lang === 'fa' ? 'رمز عبور / کلید API' : 'Password / API Secret'}
                  </label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.68rem 0.9rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(17,18,15,0.15)',
                      fontSize: '0.86rem',
                    }}
                  />
                </Box>

                <Stack direction="row" spacing={1} sx={{ pt: 0.5 }}>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="owj-btn owj-btn--lime"
                    style={{ flex: 1 }}
                  >
                    <KeyRound size={15} />
                    <span>
                      {lang === 'fa'
                        ? 'اتصال به API و ورود به میز کار'
                        : 'Connect via API & Sign In'}
                    </span>
                  </button>
                </Stack>
              </Stack>
            </form>

            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontSize: '0.76rem', color: '#666860' }}>
              {lang === 'fa'
                ? 'اطلاعات پیش‌فرض اپراتور جهت تست: operator@owjify.com / Owjify@2026'
                : 'Default Demo Operator: operator@owjify.com / Owjify@2026'}
            </Typography>
          </Paper>
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4.5 } }}>
        {/* Operator API Status Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.2, md: 3 },
            mb: 3,
            borderRadius: 4,
            bgcolor: '#11120F',
            color: '#F6F5F0',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
          >
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.6 }}>
                <Chip
                  size="small"
                  label={
                    lang === 'fa'
                      ? 'متصل به سرویس پشتیبانی API'
                      : 'Support Desk Active'
                  }
                  sx={{ bgcolor: '#C7F36B', color: '#11120F', fontWeight: 800, fontSize: '0.7rem' }}
                />
                <Typography
                  sx={{
                    fontSize: '0.73rem',
                    color: 'rgba(246,245,240,0.65)',
                    fontFamily: 'monospace',
                  }}
                  dir="ltr"
                >
                  Bearer {token?.slice(0, 18)}...
                </Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {lang === 'fa'
                  ? 'میز کار اپراتور پشتیبانی و بررسی گزارش‌ها'
                  : 'Support Operator Console'}
              </Typography>
              <Typography sx={{ fontSize: '0.84rem', color: 'rgba(246,245,240,0.72)', mt: 0.3 }}>
                {l(user.fullName)} ({user.email})
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
              {isAdmin && (
                <Link to="/admin" className="owj-btn owj-btn--lime owj-btn--sm">
                  <ShieldCheck size={14} />
                  <span>{lang === 'fa' ? 'پنل ادمین و CRM' : 'Admin & CRM'}</span>
                </Link>
              )}
              <Link to="/support" className="owj-btn owj-btn--outline-light owj-btn--sm">
                <ExternalLink size={14} />
                <span>{lang === 'fa' ? 'نمای صفحه پشتیبانی کاربر' : 'Public Support Page'}</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="owj-btn owj-btn--danger owj-btn--sm"
              >
                <LogOut size={14} />
                <span>{lang === 'fa' ? 'خروج اپراتور' : 'Sign Out'}</span>
              </button>
            </Stack>
          </Stack>
        </Paper>

        {/* KPI Strip */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            {
              label: lang === 'fa' ? 'کل تیکت‌ها و گزارش‌ها' : 'Total Tickets',
              val: stats.total,
              color: '#11120F',
            },
            {
              label: lang === 'fa' ? 'در انتظار پاسخ اپراتور' : 'Open / In Progress',
              val: stats.open,
              color: '#E59934',
            },
            {
              label: lang === 'fa' ? 'ارجاع‌شده به مدیر ارشد' : 'Escalated to Admin',
              val: stats.escalated,
              color: '#D94848',
            },
            {
              label: lang === 'fa' ? 'پاسخ‌داده‌شده و حل‌شده' : 'Answered & Resolved',
              val: stats.answered,
              color: '#289e67',
            },
          ].map((k, idx) => (
            <Grid key={idx} size={{ xs: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: 3.5,
                  border: '1px solid rgba(17,18,15,0.08)',
                }}
              >
                <Typography sx={{ fontSize: '1.65rem', fontWeight: 800, color: k.color }}>
                  {formatNumber(k.val, lang)}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: '#666860', fontWeight: 600 }}>
                  {k.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Split-Pane Queue + Ticket Answer Desk */}
        <Grid container spacing={2.5}>
          {/* Left Queue */}
          <Grid size={{ xs: 12, lg: 4.5 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: '1px solid rgba(17,18,15,0.09)',
              }}
            >
              {/* Filter Pills */}
              <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                {[
                  { id: 'all', label: lang === 'fa' ? 'همه' : 'All' },
                  { id: 'open', label: lang === 'fa' ? 'باز' : 'Open' },
                  { id: 'reports', label: lang === 'fa' ? 'گزارش آگهی' : 'Ad Reports' },
                  { id: 'escalated', label: lang === 'fa' ? 'ارجاع‌شده' : 'Escalated' },
                  { id: 'answered', label: lang === 'fa' ? 'پاسخ‌داده‌شده' : 'Answered' },
                  { id: 'resolved', label: lang === 'fa' ? 'حل‌شده' : 'Resolved' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStatusFilter(f.id)}
                    className={`owj-btn owj-btn--sm ${
                      statusFilter === f.id ? 'owj-btn--dark' : 'owj-btn--ghost'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </Stack>

              {/* Search */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.3,
                  py: 0.65,
                  borderRadius: 2.5,
                  bgcolor: '#F6F5F0',
                  mb: 1.6,
                }}
              >
                <Search size={15} color="#666860" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    lang === 'fa'
                      ? 'جستجوی کد، نام یا موضوع...'
                      : 'Search ID, user, or subject...'
                  }
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.82rem',
                  }}
                />
              </Box>

              {/* Ticket List */}
              <Stack spacing={1} sx={{ maxHeight: 520, overflowY: 'auto' }}>
                {filteredTickets.map((t) => {
                  const selected = activeTicket?.id === t.id;
                  const isEscalated = t.status === 'escalated';
                  return (
                    <Box
                      key={t.id}
                      onClick={() => {
                        setActiveId(t.id);
                        setEscalationOpen(false);
                      }}
                      sx={{
                        p: 1.5,
                        borderRadius: 3,
                        cursor: 'pointer',
                        bgcolor: selected ? '#11120F' : '#F6F5F0',
                        color: selected ? '#F6F5F0' : '#11120F',
                        border: isEscalated
                          ? '1.5px solid #D94848'
                          : '1px solid rgba(17,18,15,0.08)',
                        transition: 'all 0.18s ease',
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: selected ? '#C7F36B' : '#11120F',
                          }}
                          dir="ltr"
                        >
                          {t.id}
                        </Typography>
                        <Chip
                          size="small"
                          label={isEscalated ? 'ESCALATED' : t.priority.toUpperCase()}
                          sx={{
                            height: 19,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            bgcolor:
                              isEscalated || t.priority === 'urgent'
                                ? 'rgba(217,72,72,0.22)'
                                : selected
                                ? 'rgba(255,255,255,0.14)'
                                : 'rgba(17,18,15,0.08)',
                            color:
                              isEscalated || t.priority === 'urgent'
                                ? '#ff7b7b'
                                : selected
                                ? '#F6F5F0'
                                : '#464841',
                          }}
                        />
                      </Stack>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mb: 0.4 }}>
                        {l(t.subject)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.73rem',
                          color: selected ? 'rgba(246,245,240,0.68)' : '#666860',
                        }}
                      >
                        {l(t.reporterName)} • {formatRelativeDate(t.updatedAt, lang)}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Answer Desk */}
          <Grid size={{ xs: 12, lg: 7.5 }}>
            {activeTicket ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.2, md: 3 },
                  borderRadius: 4,
                  border: '1px solid rgba(17,18,15,0.09)',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={1.2}
                  sx={{ mb: 1.5 }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                      <Chip
                        size="small"
                        label={activeTicket.id}
                        sx={{ bgcolor: '#11120F', color: '#C7F36B', fontWeight: 800 }}
                      />
                      <Chip
                        size="small"
                        label={activeTicket.status.toUpperCase()}
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.66rem',
                          bgcolor:
                            activeTicket.status === 'escalated'
                              ? 'rgba(217,72,72,0.16)'
                              : 'rgba(17,18,15,0.08)',
                          color:
                            activeTicket.status === 'escalated' ? '#b83232' : '#11120F',
                        }}
                      />
                      <Typography sx={{ fontSize: '0.78rem', color: '#666860' }}>
                        {l(activeTicket.reporterName)} ({activeTicket.reporterEmail || 'N/A'})
                      </Typography>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.08rem' }}>
                      {l(activeTicket.subject)}
                    </Typography>
                  </Box>

                  {/* Status & Escalation Controls */}
                  <Stack direction="row" spacing={0.6} alignItems="center" flexWrap="wrap" useFlexGap>
                    <button
                      type="button"
                      onClick={() => handleStatusChange('in_progress')}
                      className="owj-btn owj-btn--outline owj-btn--sm"
                    >
                      <Clock size={13} />
                      <span>{lang === 'fa' ? 'در حال بررسی' : 'In Progress'}</span>
                    </button>
                    {activeTicket.status !== 'escalated' && (
                      <button
                        type="button"
                        onClick={() => setEscalationOpen((p) => !p)}
                        className="owj-btn owj-btn--danger owj-btn--sm"
                      >
                        <ArrowUpCircle size={13} />
                        <span>{lang === 'fa' ? 'ارجاع به ادمین' : 'Escalate'}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStatusChange('resolved')}
                      className="owj-btn owj-btn--dark owj-btn--sm"
                    >
                      <CheckCircle2 size={13} color="#C7F36B" />
                      <span>{lang === 'fa' ? 'بستن (حل‌شده)' : 'Mark Resolved'}</span>
                    </button>
                  </Stack>
                </Stack>

                {/* Inline Escalation Composer */}
                {escalationOpen && (
                  <Box
                    component="form"
                    onSubmit={handleEscalateSubmit}
                    sx={{
                      p: 1.6,
                      mb: 1.8,
                      borderRadius: 3,
                      bgcolor: 'rgba(217,72,72,0.08)',
                      border: '1px solid rgba(217,72,72,0.28)',
                    }}
                  >
                    <Stack direction="row" spacing={0.8} alignItems="center" sx={{ mb: 0.8 }}>
                      <AlertTriangle size={15} color="#b83232" />
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 800, color: '#b83232' }}>
                        {lang === 'fa'
                          ? 'ارجاع رسمی پرونده به مدیر ارشد (Admin)'
                          : 'Escalate Issue to Platform Administrator'}
                      </Typography>
                    </Stack>
                    <input
                      type="text"
                      required
                      value={escalationNote}
                      onChange={(e) => setEscalationNote(e.target.value)}
                      placeholder={
                        lang === 'fa'
                          ? 'علت ارجاع به ادمین (مثلاً: نیاز به تعلیق آگهی یا بررسی حساب)...'
                          : 'Reason for escalation (e.g. requires listing suspension or admin action)...'
                      }
                      style={{
                        width: '100%',
                        padding: '0.62rem 0.85rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(217,72,72,0.3)',
                        background: '#FFFFFF',
                        fontSize: '0.83rem',
                        marginBottom: '0.65rem',
                      }}
                    />
                    <Stack direction="row" spacing={0.8} justifyContent="flex-end">
                      <button
                        type="button"
                        onClick={() => setEscalationOpen(false)}
                        className="owj-btn owj-btn--ghost owj-btn--sm"
                      >
                        {lang === 'fa' ? 'انصراف' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={sending || !escalationNote.trim()}
                        className="owj-btn owj-btn--danger owj-btn--sm"
                      >
                        <ArrowUpCircle size={13} />
                        <span>
                          {lang === 'fa' ? 'تایید و ارجاع فوری' : 'Confirm Escalation'}
                        </span>
                      </button>
                    </Stack>
                  </Box>
                )}

                {/* Rich Reported Content Card */}
                {activeTicket.relatedAdId && (
                  <Box
                    sx={{
                      p: 1.4,
                      mb: 1.6,
                      borderRadius: 3,
                      bgcolor: 'rgba(199,243,107,0.22)',
                      border: '1px solid rgba(17,18,15,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={1.4} alignItems="center">
                      {reportedListing?.images?.[0] && (
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: 2,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <SmartImage
                            src={reportedListing.images[0]}
                            alt={l(reportedListing.title)}
                          />
                        </Box>
                      )}
                      <Box>
                        <Typography sx={{ fontSize: '0.73rem', fontWeight: 800, color: '#464841' }}>
                          {lang === 'fa' ? 'محتوای گزارش‌شده' : 'Reported Content Target'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.86rem', fontWeight: 800 }}>
                          {l(reportedListing?.title || activeTicket.relatedAdTitle)}
                        </Typography>
                        {reportedListing && (
                          <Typography sx={{ fontSize: '0.75rem', color: '#464841' }}>
                            {reportedSpecialist ? `${l(reportedSpecialist.name)} • ` : ''}
                            {formatPrice(reportedListing, lang)} •{' '}
                            {reportedListing.status === 'paused'
                              ? lang === 'fa'
                                ? 'متوقف‌شده'
                                : 'Paused'
                              : lang === 'fa'
                              ? 'فعال'
                              : 'Active'}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Link
                      to={`/services/${activeTicket.relatedAdId}`}
                      className="owj-btn owj-btn--dark owj-btn--sm"
                    >
                      <ExternalLink size={13} />
                      <span>{lang === 'fa' ? 'بررسی آگهی' : 'Inspect Listing'}</span>
                    </Link>
                  </Box>
                )}

                <Divider sx={{ my: 1.5 }} />

                {/* Messages Thread */}
                <Stack spacing={1.2} sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
                  {(activeTicket.messages || []).map((m) => {
                    const isOp = m.authorRole === 'operator' || m.authorRole === 'admin';
                    return (
                      <Box
                        key={m.id}
                        sx={{
                          p: 1.6,
                          borderRadius: 3,
                          bgcolor: m.isEscalationNote
                            ? 'rgba(217,72,72,0.1)'
                            : isOp
                            ? '#11120F'
                            : '#F6F5F0',
                          color: m.isEscalationNote
                            ? '#8f2222'
                            : isOp
                            ? '#F6F5F0'
                            : '#11120F',
                          border: m.isEscalationNote
                            ? '1px solid rgba(217,72,72,0.28)'
                            : 'none',
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mb: 0.4 }}
                        >
                          <Typography
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: m.isEscalationNote
                                ? '#b83232'
                                : isOp
                                ? '#C7F36B'
                                : '#464841',
                            }}
                          >
                            {l(m.authorName)}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: '0.68rem',
                              color: isOp && !m.isEscalationNote
                                ? 'rgba(246,245,240,0.6)'
                                : '#8B8D83',
                            }}
                          >
                            {formatRelativeDate(m.createdAt, lang)}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '0.86rem', lineHeight: 1.7 }}>
                          {l(m.text)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Stack>

                {/* Quick Canned Responses */}
                <Typography sx={{ fontSize: '0.76rem', fontWeight: 700, color: '#666860', mb: 0.8 }}>
                  {lang === 'fa' ? 'پاسخ‌های آماده اپراتور:' : 'Quick Operator Macros:'}
                </Typography>
                <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap sx={{ mb: 1.4 }}>
                  {quickTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(tpl)}
                      style={{
                        padding: '0.32rem 0.7rem',
                        borderRadius: '999px',
                        fontSize: '0.73rem',
                        background: '#F6F5F0',
                        border: '1px solid rgba(17,18,15,0.1)',
                      }}
                    >
                      + {tpl.slice(0, 46)}...
                    </button>
                  ))}
                </Stack>

                {/* API Reply Composer */}
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    lang === 'fa'
                      ? 'پاسخ رسمی اپراتور پشتیبانی را بنویسید...'
                      : 'Write official operator answer...'
                  }
                  style={{
                    width: '100%',
                    padding: '0.8rem 0.95rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(17,18,15,0.15)',
                    fontSize: '0.86rem',
                    marginBottom: '0.9rem',
                  }}
                />

                <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                  <button
                    type="button"
                    disabled={sending || !replyText.trim()}
                    onClick={() => handleSendReply(false)}
                    className="owj-btn owj-btn--lime owj-btn--sm"
                  >
                    <Send size={14} />
                    <span>{lang === 'fa' ? 'ارسال پاسخ به کاربر' : 'Send Answer'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={sending || !replyText.trim()}
                    onClick={() => handleSendReply(true)}
                    className="owj-btn owj-btn--dark owj-btn--sm"
                  >
                    <CheckCircle2 size={14} color="#C7F36B" />
                    <span>
                      {lang === 'fa' ? 'ارسال پاسخ و بستن تیکت' : 'Send & Resolve'}
                    </span>
                  </button>
                </Stack>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 4 }}>
                <Typography sx={{ color: '#666860' }}>
                  {lang === 'fa' ? 'تیکتی در این فیلتر یافت نشد.' : 'No tickets match this filter.'}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </PageTransition>
  );
}
