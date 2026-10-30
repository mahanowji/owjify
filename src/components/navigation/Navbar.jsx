import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Stack,
  IconButton,
  Badge,
  Drawer,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  X,
  Plus,
  Bell,
  MessageSquare,
  Heart,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  LogIn,
  ChevronDown,
  Globe,
  Headset,
  ShieldCheck,
  LifeBuoy,
} from 'lucide-react';
import { OwjifyMark } from '../../assets/brandMarks';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { formatNumber } from '../../utils/formatters';

export default function Navbar() {
  const { lang, isRTL, toggleLanguage, ui, l } = useLanguage();
  const {
    user,
    hasToken,
    isProfessional,
    isCustomer,
    isOperator,
    isAdmin,
    logout,
  } = useAuth();
  const {
    favoriteAds,
    favoritePros,
    unreadMessagesCount,
    unreadNotificationsCount,
    openSupportTicketsCount,
  } = useMarketplace();

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setMobileOpen(false);
    setAnchorEl(null);
  }, [location.pathname]);

  const totalSaved = hasToken ? favoriteAds.length + favoritePros.length : 0;

  const navLinks = [
    { to: '/', label: ui.nav.home, end: true },
    { to: '/explore', label: ui.nav.explore },
    { to: '/categories', label: ui.nav.categories },
    { to: '/support', label: lang === 'fa' ? 'پشتیبانی و گزارش' : 'Support' },
    { to: '/about', label: ui.nav.about },
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    setMobileOpen(false);
    logout();
    navigate('/');
  };

  const roleBadgeLabel = isAdmin
    ? lang === 'fa'
      ? 'مدیر ارشد'
      : 'Admin'
    : isOperator
    ? lang === 'fa'
      ? 'اپراتور'
      : 'Operator'
    : isProfessional
    ? lang === 'fa'
      ? 'متخصص'
      : 'Provider'
    : lang === 'fa'
    ? 'کارفرما'
    : 'Client';

  const primaryWorkspacePath = isAdmin
    ? '/admin'
    : isOperator
    ? '/operator'
    : '/dashboard';

  const primaryWorkspaceLabel = isAdmin
    ? lang === 'fa'
      ? 'پنل مدیریت و CRM'
      : 'Admin & CRM'
    : isOperator
    ? lang === 'fa'
      ? 'پنل اپراتور پشتیبانی'
      : 'Operator Console'
    : ui.nav.dashboard;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(246, 245, 240, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(17, 18, 15, 0.08)',
          color: '#11120F',
          zIndex: (t) => t.zIndex.drawer - 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 62, md: 70 },
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            {/* Brand Identity */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
              }}
              aria-label="OWJIFY Home"
            >
              <OwjifyMark size={32} />
              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
                <Box
                  component="span"
                  sx={{ fontSize: '1.06rem', fontWeight: 800, letterSpacing: '-0.02em' }}
                >
                  {lang === 'fa' ? 'اوجیفای' : 'OWJIFY'}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    color: '#666860',
                    textTransform: 'uppercase',
                    letterSpacing: lang === 'fa' ? 0 : '0.08em',
                  }}
                >
                  {lang === 'fa' ? 'پیوند مهارت و اعتماد' : 'Connecting People'}
                </Box>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Stack direction="row" spacing={0.4} alignItems="center">
                {navLinks.map((item) => (
                  <Box
                    key={item.to}
                    component={NavLink}
                    to={item.to}
                    end={item.end}
                    sx={{
                      px: 1.4,
                      py: 0.7,
                      borderRadius: '999px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      lineHeight: 1.25,
                      color: '#464841',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                      '&:hover': {
                        color: '#11120F',
                        bgcolor: 'rgba(17, 18, 15, 0.05)',
                      },
                      '&.active': {
                        bgcolor: '#11120F',
                        color: '#F6F5F0',
                      },
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </Stack>
            )}

            {/* Right Actions Cluster */}
            <Stack direction="row" spacing={0.75} alignItems="center">
              {/* Language Switcher */}
              <Box
                component="button"
                type="button"
                onClick={toggleLanguage}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.15,
                  height: 33,
                  borderRadius: '999px',
                  border: '1px solid rgba(17, 18, 15, 0.14)',
                  bgcolor: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#11120F',
                    bgcolor: '#EEEDE6',
                  },
                }}
              >
                <Globe size={13} />
                <span>{lang === 'fa' ? 'EN' : 'فا'}</span>
              </Box>

              {/* Mobile Top-Bar Quick Log In Button (Always directly accessible at top!) */}
              {isMobile && !hasToken && (
                <Link to="/auth/login" className="owj-btn owj-btn--dark owj-btn--sm">
                  <LogIn size={13} />
                  <span>{ui.nav.login}</span>
                </Link>
              )}

              {/* Authenticated Actions: strictly gated by valid user token */}
              {hasToken && !isMobile && (
                <>
                  {/* Admin CRM Quick Button */}
                  {isAdmin && (
                    <Link to="/admin" className="owj-btn owj-btn--lime owj-btn--sm">
                      <ShieldCheck size={14} />
                      <span>{lang === 'fa' ? 'پنل ادمین و CRM' : 'Admin & CRM'}</span>
                    </Link>
                  )}

                  {/* Operator Support Console Quick Button */}
                  {isOperator && (
                    <Link to="/operator" className="owj-btn owj-btn--dark owj-btn--sm">
                      <Headset size={14} color="#C7F36B" />
                      <span>
                        {lang === 'fa' ? 'پنل اپراتور' : 'Operator'}
                        {openSupportTicketsCount > 0
                          ? ` (${formatNumber(openSupportTicketsCount, lang)})`
                          : ''}
                      </span>
                    </Link>
                  )}

                  {/* Saved / Likes + Messages for Customer & Provider */}
                  {(isCustomer || isProfessional) && (
                    <>
                      <IconButton
                        component={Link}
                        to="/saved"
                        aria-label={ui.nav.saved}
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: '#FFFFFF',
                          border: '1px solid rgba(17, 18, 15, 0.1)',
                          color: '#11120F',
                          '&:hover': { bgcolor: '#11120F', color: '#C7F36B' },
                        }}
                      >
                        <Badge
                          badgeContent={
                            totalSaved > 0 ? formatNumber(totalSaved, lang) : null
                          }
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: '#C7F36B',
                              color: '#11120F',
                              fontWeight: 800,
                              fontSize: '0.64rem',
                            },
                          }}
                        >
                          <Heart size={15} />
                        </Badge>
                      </IconButton>

                      <IconButton
                        component={Link}
                        to="/messages"
                        aria-label={ui.nav.messages}
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: '#FFFFFF',
                          border: '1px solid rgba(17, 18, 15, 0.1)',
                          color: '#11120F',
                          '&:hover': { bgcolor: '#11120F', color: '#C7F36B' },
                        }}
                      >
                        <Badge
                          badgeContent={
                            unreadMessagesCount > 0
                              ? formatNumber(unreadMessagesCount, lang)
                              : null
                          }
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: '#C7F36B',
                              color: '#11120F',
                              fontWeight: 800,
                              fontSize: '0.64rem',
                            },
                          }}
                        >
                          <MessageSquare size={15} />
                        </Badge>
                      </IconButton>

                      <IconButton
                        component={Link}
                        to="/notifications"
                        aria-label={ui.nav.notifications}
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: '#FFFFFF',
                          border: '1px solid rgba(17, 18, 15, 0.1)',
                          color: '#11120F',
                          '&:hover': { bgcolor: '#11120F', color: '#C7F36B' },
                        }}
                      >
                        <Badge
                          badgeContent={
                            unreadNotificationsCount > 0
                              ? formatNumber(unreadNotificationsCount, lang)
                              : null
                          }
                          sx={{
                            '& .MuiBadge-badge': {
                              bgcolor: '#C7F36B',
                              color: '#11120F',
                              fontWeight: 800,
                              fontSize: '0.64rem',
                            },
                          }}
                        >
                          <Bell size={15} />
                        </Badge>
                      </IconButton>
                    </>
                  )}

                  {/* Create Advertisement ONLY for Providers */}
                  {isProfessional && (
                    <Link to="/create-ad" className="owj-btn owj-btn--lime owj-btn--sm">
                      <Plus size={14} />
                      <span>{ui.nav.createAd}</span>
                    </Link>
                  )}
                </>
              )}

              {/* User Profile Chip OR Desktop Guest Auth Actions */}
              {!isMobile &&
                (hasToken ? (
                  <>
                    <Box
                      component="button"
                      type="button"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        p: '3px 9px 3px 4px',
                        borderRadius: '999px',
                        border: '1px solid rgba(17, 18, 15, 0.13)',
                        bgcolor: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease',
                        '&:hover': { borderColor: '#11120F' },
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        alt={user.fullName}
                        sx={{ width: 27, height: 27 }}
                      />
                      <Box
                        component="span"
                        sx={{
                          maxWidth: 105,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                        }}
                      >
                        {user.fullName?.split('|')[0]?.trim()}
                      </Box>
                      <Chip
                        size="small"
                        label={roleBadgeLabel}
                        sx={{
                          height: 19,
                          fontSize: '0.64rem',
                          fontWeight: 800,
                          bgcolor:
                            isAdmin || isProfessional
                              ? 'rgba(199,243,107,0.55)'
                              : 'rgba(17,18,15,0.08)',
                          color: '#11120F',
                        }}
                      />
                      <ChevronDown size={13} />
                    </Box>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      transformOrigin={{
                        horizontal: isRTL ? 'left' : 'right',
                        vertical: 'top',
                      }}
                      anchorOrigin={{
                        horizontal: isRTL ? 'left' : 'right',
                        vertical: 'bottom',
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          minWidth: 235,
                          borderRadius: 3,
                          p: 0.6,
                          border: '1px solid rgba(17, 18, 15, 0.1)',
                          boxShadow: '0 18px 48px rgba(17, 18, 15, 0.14)',
                        },
                      }}
                    >
                      <Box sx={{ px: 1.5, py: 0.9 }}>
                        <Box sx={{ fontWeight: 800, fontSize: '0.84rem' }}>
                          {user.fullName?.split('|')[0]?.trim()}
                        </Box>
                        <Box sx={{ fontSize: '0.72rem', color: '#666860' }}>
                          {user.email}
                        </Box>
                      </Box>
                      <Divider sx={{ my: 0.5 }} />

                      <MenuItem
                        component={Link}
                        to={primaryWorkspacePath}
                        sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 700 }}
                      >
                        {isAdmin ? (
                          <ShieldCheck size={15} />
                        ) : isOperator ? (
                          <Headset size={15} />
                        ) : (
                          <LayoutDashboard size={15} />
                        )}
                        {primaryWorkspaceLabel}
                      </MenuItem>

                      {isAdmin && (
                        <MenuItem
                          component={Link}
                          to="/operator"
                          sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 600 }}
                        >
                          <Headset size={15} />
                          {lang === 'fa' ? 'کنسول اپراتور پشتیبانی' : 'Operator Console'}
                        </MenuItem>
                      )}

                      {isProfessional && (
                        <MenuItem
                          component={Link}
                          to="/create-ad"
                          sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 600 }}
                        >
                          <Plus size={15} />
                          {ui.nav.createAd}
                        </MenuItem>
                      )}

                      {isProfessional && user.proId && (
                        <MenuItem
                          component={Link}
                          to={`/professionals/${user.proId}`}
                          sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 600 }}
                        >
                          <User size={15} />
                          {ui.nav.myProfile}
                        </MenuItem>
                      )}

                      {(isCustomer || isProfessional) && (
                        <MenuItem
                          component={Link}
                          to="/messages"
                          sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 600 }}
                        >
                          <MessageSquare size={15} />
                          {isCustomer
                            ? lang === 'fa'
                              ? 'پیام‌های ارسالی به متخصصان'
                              : 'Sent Messages'
                            : ui.nav.messages}
                        </MenuItem>
                      )}

                      <MenuItem
                        component={Link}
                        to="/support"
                        sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 600 }}
                      >
                        <LifeBuoy size={15} />
                        {lang === 'fa' ? 'پشتیبانی و پیگیری گزارش' : 'Support & Reports'}
                      </MenuItem>

                      <MenuItem
                        component={Link}
                        to="/settings"
                        sx={{ borderRadius: 2, gap: 1.1, fontSize: '0.83rem', fontWeight: 600 }}
                      >
                        <Settings size={15} />
                        {ui.nav.settings}
                      </MenuItem>

                      <Divider sx={{ my: 0.5 }} />

                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          borderRadius: 2,
                          gap: 1.1,
                          fontSize: '0.83rem',
                          fontWeight: 600,
                          color: '#D94848',
                        }}
                      >
                        <LogOut size={15} />
                        {ui.nav.logout}
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Link to="/auth/login" className="owj-btn owj-btn--ghost owj-btn--sm">
                      {ui.nav.login}
                    </Link>
                    <Link to="/auth/register" className="owj-btn owj-btn--dark owj-btn--sm">
                      {ui.nav.register}
                    </Link>
                  </Stack>
                ))}

              {/* Mobile Burger Toggle */}
              {isMobile && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(17, 18, 15, 0.14)',
                    color: '#11120F',
                  }}
                >
                  <MenuIcon size={18} />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Responsive MUI Mobile Drawer */}
      <Drawer
        anchor={isRTL ? 'right' : 'left'}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '84vw', sm: 340 },
            bgcolor: '#F6F5F0',
            p: 2.2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <OwjifyMark size={28} />
            <Box sx={{ fontWeight: 800, fontSize: '1rem' }}>
              {lang === 'fa' ? 'اوجیفای' : 'OWJIFY'}
            </Box>
          </Stack>
          <IconButton onClick={() => setMobileOpen(false)} size="small">
            <X size={19} />
          </IconButton>
        </Stack>

        {/* TOP OF DRAWER: Auth Buttons OR Logged-in User Card (Never buried at the bottom!) */}
        {!hasToken ? (
          <Box
            sx={{
              p: 1.5,
              borderRadius: 3,
              bgcolor: '#11120F',
              color: '#F6F5F0',
            }}
          >
            <Box sx={{ fontSize: '0.76rem', color: 'rgba(246,245,240,0.75)', mb: 1.1 }}>
              {lang === 'fa'
                ? 'برای ارسال پیام و مدیریت حساب وارد شوید:'
                : 'Sign in to connect with specialists:'}
            </Box>
            <Stack direction="row" spacing={1}>
              <Link
                to="/auth/login"
                className="owj-btn owj-btn--lime owj-btn--sm"
                style={{ flex: 1 }}
              >
                <LogIn size={14} />
                <span>{ui.nav.login}</span>
              </Link>
              <Link
                to="/auth/register"
                className="owj-btn owj-btn--outline-light owj-btn--sm"
                style={{ flex: 1 }}
              >
                <span>{ui.nav.register}</span>
              </Link>
            </Stack>
          </Box>
        ) : (
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            sx={{
              p: 1.3,
              borderRadius: 3,
              bgcolor: '#FFFFFF',
              border: '1px solid rgba(17, 18, 15, 0.08)',
            }}
          >
            <Avatar src={user.avatar} alt={user.fullName} sx={{ width: 38, height: 38 }} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.fullName?.split('|')[0]?.trim()}
              </Box>
              <Box sx={{ fontSize: '0.72rem', color: '#666860' }}>{roleBadgeLabel}</Box>
            </Box>
          </Stack>
        )}

        <Divider />

        {/* Primary Navigation */}
        <Stack spacing={0.4}>
          {navLinks.map((item) => (
            <Box
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.end}
              sx={{
                px: 1.6,
                py: 1,
                borderRadius: 2.2,
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#11120F',
                textDecoration: 'none',
                '&.active': {
                  bgcolor: '#11120F',
                  color: '#C7F36B',
                },
              }}
            >
              {item.label}
            </Box>
          ))}
        </Stack>

        {/* Authenticated Links */}
        {hasToken && (
          <>
            <Divider />
            <Stack spacing={0.5}>
              <Box
                component={Link}
                to={primaryWorkspacePath}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.6,
                  py: 0.95,
                  borderRadius: 2.2,
                  bgcolor: '#11120F',
                  color: '#C7F36B',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {isAdmin ? (
                  <ShieldCheck size={16} />
                ) : isOperator ? (
                  <Headset size={16} />
                ) : (
                  <LayoutDashboard size={16} />
                )}
                <span>{primaryWorkspaceLabel}</span>
              </Box>

              {isAdmin && (
                <Box
                  component={Link}
                  to="/operator"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.6,
                    py: 0.9,
                    borderRadius: 2.2,
                    bgcolor: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                  }}
                >
                  <Headset size={16} />
                  <span>{lang === 'fa' ? 'کنسول اپراتور پشتیبانی' : 'Operator Console'}</span>
                </Box>
              )}

              {(isCustomer || isProfessional) && (
                <>
                  <Box
                    component={Link}
                    to="/messages"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1.6,
                      py: 0.9,
                      borderRadius: 2.2,
                      bgcolor: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <MessageSquare size={16} />
                      <span>
                        {isCustomer
                          ? lang === 'fa'
                            ? 'پیام‌های ارسالی'
                            : 'Sent Messages'
                          : ui.nav.messages}
                      </span>
                    </Stack>
                    {unreadMessagesCount > 0 && (
                      <Box
                        component="span"
                        sx={{
                          px: 0.9,
                          py: 0.1,
                          borderRadius: '999px',
                          bgcolor: '#C7F36B',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        {formatNumber(unreadMessagesCount, lang)}
                      </Box>
                    )}
                  </Box>

                  <Box
                    component={Link}
                    to="/saved"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 1.6,
                      py: 0.9,
                      borderRadius: 2.2,
                      bgcolor: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.84rem',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Heart size={16} />
                      <span>{ui.nav.saved}</span>
                    </Stack>
                    {totalSaved > 0 && (
                      <Box
                        component="span"
                        sx={{
                          px: 0.9,
                          py: 0.1,
                          borderRadius: '999px',
                          bgcolor: '#EEEDE6',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                        }}
                      >
                        {formatNumber(totalSaved, lang)}
                      </Box>
                    )}
                  </Box>
                </>
              )}

              {isProfessional && (
                <Link
                  to="/create-ad"
                  className="owj-btn owj-btn--lime owj-btn--sm"
                  style={{ width: '100%', marginTop: 4 }}
                >
                  <Plus size={15} />
                  <span>{ui.nav.createAd}</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="owj-btn owj-btn--danger owj-btn--sm"
                style={{ width: '100%', marginTop: 6 }}
              >
                <LogOut size={14} />
                <span>{ui.nav.logout}</span>
              </button>
            </Stack>
          </>
        )}
      </Drawer>
    </>
  );
}
