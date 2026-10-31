
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Stack, Chip } from '@mui/material';
import { Save, Upload, Plus, BriefcaseBusiness } from 'lucide-react';
import PageTransition from '../../components/common/PageTransition';
import SmartImage from '../../components/common/SmartImage';
import { LOCATIONS } from '../../data/locations';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';
import styles from './SettingsPages.module.scss';

export default function EditProfilePage() {
  const { lang, l } = useLanguage();
  const {
    user,
    isProfessional,
    isAdmin,
    isOperator,
    updateProfile,
  } = useAuth();

  const { syncUserToProfessional } = useMarketplace();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [dirty, setDirty] = useState(false);
  const [fullName, setFullName] = useState(() => l(user?.fullName || ''));
  const [title, setTitle] = useState(() => l(user?.title || ''));
  const [locationId, setLocationId] = useState(user?.locationId || 'tehran');
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || 5);
  const [bio, setBio] = useState(() => l(user?.bio || ''));
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [skills, setSkills] = useState(() => (user?.skills || []).map((s) => l(s)));
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const [becomeProfessional, setBecomeProfessional] = useState(false);

  const professionalMode = isProfessional || becomeProfessional;

  useEffect(() => {
    if (!dirty && user) {
      setFullName(l(user.fullName || ''));
      setTitle(l(user.title || ''));
      setBio(l(user.bio || ''));
      setSkills((user.skills || []).map((s) => l(s)));
    }
  }, [lang, user, dirty, l]);

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDirty(true);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const clean = skillInput.trim();

    if (!clean || skills.includes(clean)) return;

    setDirty(true);
    setSkills((p) => [...p, clean]);
    setSkillInput('');
  };

  const handleBecomeProfessional = () => {
    const confirmed = window.confirm(
      lang === 'fa'
        ? 'آیا مطمئن هستید که می‌خواهید حساب کاربری خود را به حساب متخصص تبدیل کنید؟'
        : 'Are you sure you want to convert your account to a professional account?'
    );

    if (!confirmed) return;

    setBecomeProfessional(true);
    setDirty(true);

    showToast({
      title:
        lang === 'fa'
          ? 'اطلاعات تخصصی را تکمیل کرده و ذخیره کنید'
          : 'Complete your professional information and save',
      type: 'success',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    try {
      const updated = await updateProfile({
        fullName,
        title,
        locationId,
        experienceYears: Number(experienceYears),
        bio,
        avatar,
        skills,

        ...(becomeProfessional && {
          accountType: 'professional',
        }),
      });

      if (professionalMode) {
        syncUserToProfessional(updated);
      }

      showToast({
        title:
          lang === 'fa'
            ? 'پروفایل شما با موفقیت ذخیره شد'
            : 'Profile Updated',
        type: 'success',
      });

      navigate(
        isAdmin
          ? '/admin'
          : isOperator
            ? '/operator'
            : '/dashboard'
      );
    } catch (error) {
      showToast({
        title:
          lang === 'fa'
            ? 'خطا در ذخیره اطلاعات پروفایل'
            : 'Failed to update profile',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <Container
        maxWidth="md"
        sx={{ py: { xs: 3, md: 5 }, pb: { xs: 6, md: 9 } }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.45rem, 2.5vw, 1.85rem)',
            fontWeight: 900,
            marginBottom: '1.4rem',
          }}
        >
          {professionalMode
            ? lang === 'fa'
              ? 'ویرایش پروفایل تخصصی و کاربری'
              : 'Edit Specialist Profile'
            : lang === 'fa'
              ? 'ویرایش اطلاعات حساب کاربری'
              : 'Edit Account Profile'}
        </h1>

        <form className={styles.panel} onSubmit={handleSubmit}>
          {!isProfessional && !becomeProfessional && user?.accountType === 'customer' && (
            <div
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'rgba(199, 243, 107, 0.10)',
                border: '1px solid rgba(199, 243, 107, 0.35)',
                marginBottom: '24px',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={2}
              >
                <div>
                  <strong>
                    {lang === 'fa'
                      ? 'می‌خواهید متخصص شوید؟'
                      : 'Want to become a professional?'}
                  </strong>

                  <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>
                    {lang === 'fa'
                      ? 'با تبدیل حساب خود به متخصص، می‌توانید مهارت‌ها و سوابق کاری خود را معرفی کنید.'
                      : 'Convert your account to showcase your skills and experience.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBecomeProfessional}
                  className="owj-btn owj-btn--lime"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <BriefcaseBusiness size={16} />
                  <span>
                    {lang === 'fa'
                      ? 'تبدیل به متخصص'
                      : 'Become Professional'}
                  </span>
                </button>
              </Stack>
            </div>
          )}

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 3 }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: 22,
                overflow: 'hidden',
                border: '3px solid #C7F36B',
              }}
            >
              <SmartImage src={avatar} alt={fullName} />
            </div>

            <label
              className="owj-btn owj-btn--outline owj-btn--sm"
              style={{ cursor: 'pointer' }}
            >
              <Upload size={15} />

              <span>
                {lang === 'fa'
                  ? 'تغییر تصویر پروفایل'
                  : 'Upload Avatar'}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                style={{ display: 'none' }}
              />
            </label>
          </Stack>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <div className={styles.field}>
                <label>
                  {lang === 'fa'
                    ? 'نام و نام خانوادگی'
                    : 'Full Name'}
                </label>

                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setDirty(true);
                    setFullName(e.target.value);
                  }}
                />
              </div>
            </Grid>

            {professionalMode && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className={styles.field}>
                  <label>
                    {lang === 'fa'
                      ? 'عنوان شغلی / تخصص'
                      : 'Professional Headline'}
                  </label>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setDirty(true);
                      setTitle(e.target.value);
                    }}
                  />
                </div>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <div className={styles.field}>
                <label>
                  {lang === 'fa' ? 'شهر' : 'City'}
                </label>

                <select
                  value={locationId}
                  onChange={(e) => {
                    setDirty(true);
                    setLocationId(e.target.value);
                  }}
                >
                  {LOCATIONS.map((locItem) => (
                    <option key={locItem.id} value={locItem.id}>
                      {l(locItem.name)}
                    </option>
                  ))}
                </select>
              </div>
            </Grid>

            {professionalMode && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className={styles.field}>
                  <label>
                    {lang === 'fa'
                      ? 'سابقه فعالیت (سال)'
                      : 'Years of Experience'}
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="45"
                    value={experienceYears}
                    onChange={(e) => {
                      setDirty(true);
                      setExperienceYears(e.target.value);
                    }}
                  />
                </div>
              </Grid>
            )}
          </Grid>

          <div className={styles.field}>
            <label>
              {professionalMode
                ? lang === 'fa'
                  ? 'درباره من و سوابق اجرایی'
                  : 'About & Specialist Bio'
                : lang === 'fa'
                  ? 'درباره من / معرفی کوتاه'
                  : 'Short Bio'}
            </label>

            <textarea
              rows={4}
              value={bio}
              onChange={(e) => {
                setDirty(true);
                setBio(e.target.value);
              }}
            />
          </div>

          {professionalMode && (
            <div className={styles.field}>
              <label>
                {lang === 'fa'
                  ? 'مهارت‌های تخصصی'
                  : 'Skills'}
              </label>

              <Stack direction="row" spacing={1}>
                <input
                  type="text"
                  style={{ flex: 1 }}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder={
                    lang === 'fa'
                      ? 'افزودن مهارت جدید...'
                      : 'Add skill...'
                  }
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="owj-btn owj-btn--dark owj-btn--sm"
                >
                  <Plus size={15} />
                </button>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 1.5 }}
              >
                {skills.map((sk) => (
                  <Chip
                    key={sk}
                    label={sk}
                    onDelete={() => {
                      setDirty(true);
                      setSkills((p) => p.filter((item) => item !== sk));
                    }}
                    color="primary"
                    size="small"
                  />
                ))}
              </Stack>
            </div>
          )}

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1.2}
            sx={{ mt: 3 }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="owj-btn owj-btn--outline"
            >
              {lang === 'fa' ? 'انصراف' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="owj-btn owj-btn--lime"
            >
              {saving ? (
                <span className="owj-spinner" />
              ) : (
                <Save size={16} />
              )}

              <span>
                {lang === 'fa'
                  ? 'ذخیره تغییرات'
                  : 'Save Profile'}
              </span>
            </button>
          </Stack>
        </form>
      </Container>
    </PageTransition>
  );
}
