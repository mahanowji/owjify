import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Grid, Stack, Switch } from '@mui/material';
import { Globe, ShieldCheck, RotateCcw, LogOut } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import PasswordStrength from '../../components/forms/PasswordStrength';
import { STORAGE_KEYS, readStorage, writeStorage, clearAllDemoStorage } from '../../utils/storage';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import styles from './SettingsPages.module.scss';

export default function SettingsPage() {
  const { lang, setLang } = useLanguage();
  const { user, changePassword, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(() =>
    readStorage(STORAGE_KEYS.SETTINGS, {
      emailAlerts: true,
      messageAlerts: true,
      reviewAlerts: true,
    })
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const togglePref = (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    writeStorage(STORAGE_KEYS.SETTINGS, next);
    showToast({
      title: lang === 'fa' ? 'تنظیمات اعلان ذخیره شد' : 'Notification Preferences Saved',
      type: 'success',
      duration: 2000,
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      showToast({
        title: lang === 'fa' ? 'رمز عبور با موفقیت تغییر یافت' : 'Password Changed',
        type: 'success',
      });
    } catch (err) {
      showToast({
        title:
          err.message === 'WRONG_CURRENT_PASSWORD'
            ? lang === 'fa'
              ? 'رمز عبور فعلی نادرست است'
              : 'Current password is incorrect'
            : lang === 'fa'
            ? 'رمز عبور جدید باید قوی‌تر باشد'
            : 'Please choose a stronger password',
        type: 'error',
      });
    } finally {
      setPassLoading(false);
    }
  };

  const handleRoleSwitch = async (role) => {
    await updateProfile({ accountType: role });
    showToast({
      title:
        lang === 'fa'
          ? 'نوع حساب کاربری به‌روزرسانی شد'
          : 'Account Role Updated',
      type: 'success',
    });
  };

  const handleResetDemo = () => {
    clearAllDemoStorage();
    window.location.href = '/';
  };

  return (
    <PageTransition>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 }, pb: { xs: 6, md: 9 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <h1 style={{ fontSize: 'clamp(1.45rem, 2.5vw, 1.85rem)', fontWeight: 900 }}>
            {lang === 'fa' ? 'تنظیمات حساب کاربری' : 'Account Settings'}
          </h1>
          <Link to="/profile/edit" className="owj-btn owj-btn--dark owj-btn--sm">
            {lang === 'fa' ? 'ویرایش اطلاعات پروفایل' : 'Edit Profile'}
          </Link>
        </Stack>

        <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
          {/* Language & Direction */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className={styles.panel} style={{ height: '100%', marginBottom: 0 }}>
              <h2 className={styles.secTitle}>
                <Globe size={18} style={{ display: 'inline', marginInlineEnd: 6 }} />
                {lang === 'fa' ? 'زبان رابط کاربری و جهت چیدمان' : 'Interface Language & Layout'}
              </h2>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <button
                  type="button"
                  onClick={() => setLang('fa')}
                  className={`owj-btn ${lang === 'fa' ? 'owj-btn--lime' : 'owj-btn--outline'} owj-btn--sm`}
                >
                  فارسی (RTL)
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`owj-btn ${lang === 'en' ? 'owj-btn--lime' : 'owj-btn--outline'} owj-btn--sm`}
                >
                  English (LTR)
                </button>
              </Stack>
            </div>
          </Grid>

          {/* Account Role */}
          <Grid size={{ xs: 12, md: 6 }}>
            <div className={styles.panel} style={{ height: '100%', marginBottom: 0 }}>
              <h2 className={styles.secTitle}>
                {lang === 'fa' ? 'نقش حساب در اوجیفای' : 'Marketplace Account Type'}
              </h2>
              {user?.accountType === 'admin' || user?.accountType === 'operator' ? (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    background: '#11120F',
                    color: '#C7F36B',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                  }}
                >
                  <ShieldCheck size={15} />
                  <span>
                    {user?.accountType === 'admin'
                      ? lang === 'fa'
                        ? 'مدیر ارشد سامانه (Admin & CRM)'
                        : 'Platform Administrator (Admin & CRM)'
                      : lang === 'fa'
                      ? 'اپراتور پشتیبانی (Support Operator)'
                      : 'Support Operator'}
                  </span>
                </div>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('customer')}
                    className={`owj-btn ${
                      user?.accountType === 'customer' ? 'owj-btn--dark' : 'owj-btn--outline'
                    } owj-btn--sm`}
                  >
                    {lang === 'fa' ? 'کارفرما / مشتری' : 'Customer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSwitch('professional')}
                    className={`owj-btn ${
                      user?.accountType === 'professional' ? 'owj-btn--dark' : 'owj-btn--outline'
                    } owj-btn--sm`}
                  >
                    {lang === 'fa' ? 'متخصص / ارائه‌دهنده' : 'Professional'}
                  </button>
                </Stack>
              )}
            </div>
          </Grid>
        </Grid>

        {/* Notifications */}
        <div className={styles.panel}>
          <h2 className={styles.secTitle}>
            {lang === 'fa' ? 'تنظیمات دریافت اعلان‌ها' : 'Notification Preferences'}
          </h2>
          <Stack spacing={1}>
            {[
              {
                key: 'messageAlerts',
                fa: 'اعلان پیام‌های مستقیم جدید',
                en: 'Direct message notifications',
              },
              {
                key: 'reviewAlerts',
                fa: 'اعلان ثبت امتیاز و دیدگاه مشتریان',
                en: 'New client review alerts',
              },
              {
                key: 'emailAlerts',
                fa: 'خبرنامه و گزارش عملکرد هفتگی',
                en: 'Weekly performance digest',
              },
            ].map((item) => (
              <Stack
                key={item.key}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item[lang]}</span>
                <Switch
                  checked={Boolean(prefs[item.key])}
                  onChange={() => togglePref(item.key)}
                  color="primary"
                />
              </Stack>
            ))}
          </Stack>
        </div>

        {/* Security / Change Password */}
        <div className={styles.panel}>
          <h2 className={styles.secTitle}>
            <ShieldCheck size={18} style={{ display: 'inline', marginInlineEnd: 6 }} />
            {lang === 'fa' ? 'امنیت و تغییر رمز عبور' : 'Change Password'}
          </h2>
          <form onSubmit={handlePasswordChange}>
            <Grid container spacing={2} sx={{ mb: 1.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className={styles.field}>
                  <label>{lang === 'fa' ? 'رمز عبور فعلی' : 'Current Password'}</label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className={styles.field}>
                  <label>{lang === 'fa' ? 'رمز عبور جدید' : 'New Password'}</label>
                  <input
                    type="password"
                    required
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </Grid>
            </Grid>
            <PasswordStrength password={newPassword} />
            <button
              type="submit"
              disabled={passLoading}
              className="owj-btn owj-btn--dark owj-btn--sm"
              style={{ marginTop: '0.75rem' }}
            >
              {lang === 'fa' ? 'به‌روزرسانی رمز عبور' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Demo Reset & Sign Out */}
        <div className={styles.panel}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <button
              type="button"
              onClick={handleResetDemo}
              className="owj-btn owj-btn--outline owj-btn--sm"
            >
              <RotateCcw size={15} />
              <span>
                {lang === 'fa' ? 'بازگردانی داده‌های نمایشی اولیه' : 'Reset Demo Data'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="owj-btn owj-btn--danger owj-btn--sm"
            >
              <LogOut size={15} />
              <span>{lang === 'fa' ? 'خروج از حساب کاربری' : 'Sign Out'}</span>
            </button>
          </Stack>
        </div>
      </Container>
    </PageTransition>
  );
}
