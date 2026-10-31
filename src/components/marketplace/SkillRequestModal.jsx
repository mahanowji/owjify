import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Stack, Chip, Box } from '@mui/material';
import { Sparkles, Send, Users, Award } from 'lucide-react';
import Modal from '../common/Modal';
import { CATEGORIES } from '../../data/categories';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';

export default function SkillRequestModal() {
  const { lang, l } = useLanguage();
  const { user, hasToken, isProfessional, isMarketplaceMember } = useAuth();
  const {
    activeCategories,
    professionals,
    skillModalState,
    closeSkillRequestModal,
    createSkillRequest,
  } = useMarketplace();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { open, presetPro } = skillModalState;

  const [requestType, setRequestType] = useState('specialist_collaboration');
  const [categoryId, setCategoryId] = useState('technology');
  const [skillName, setSkillName] = useState('');
  const [targetProId, setTargetProId] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [budget, setBudget] = useState('');
  const [details, setDetails] = useState('');
  const [addToMyProfile, setAddToMyProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const otherProfessionals = useMemo(
    () => professionals.filter((p) => p.id !== user?.proId),
    [professionals, user?.proId]
  );

  useEffect(() => {
    if (open) {
      if (presetPro) {
        setRequestType('specialist_collaboration');
        setTargetProId(presetPro.id);
        setCategoryId(presetPro.categoryId || 'technology');
        const firstSkill = presetPro.skills?.[0] ? l(presetPro.skills[0]) : '';
        setSkillName(firstSkill);
      } else {
        const defaultTarget = otherProfessionals[0]?.id || '';
        setTargetProId(defaultTarget);
      }
    }
  }, [open, presetPro, otherProfessionals, l]);

  if (!hasToken || !isMarketplaceMember) return null;

  const activeCategory =
    activeCategories.find((c) => c.id === categoryId) ||
    activeCategories[0] ||
    CATEGORIES[0];

  const suggestedSkills = (activeCategory?.subcategories || []).map((sub) =>
    l(sub.name)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = createSkillRequest({
        requestType,
        categoryId,
        skillName: skillName.trim(),
        targetProId,
        urgency,
        budget,
        details: details.trim(),
        addToMyProfile,
      });

      setSubmitting(false);
      setSkillName('');
      setDetails('');
      setBudget('');
      closeSkillRequestModal();

      showToast({
        title:
          lang === 'fa'
            ? 'درخواست مهارت با موفقیت ارسال شد'
            : 'Skill Request Submitted',
        message:
          requestType === 'specialist_collaboration'
            ? lang === 'fa'
              ? 'این درخواست در بخش «پیام‌های ارسالی» و «درخواست‌های مهارت» شما ثبت شد.'
              : 'Saved in your Sent Messages and Skill Requests tab.'
            : lang === 'fa'
            ? 'پیشنهاد مهارت جدید در پنل تخصصی شما ثبت گردید.'
            : 'New skill request logged in your Provider Dashboard.',
        type: 'success',
      });

      if (created.conversationId) {
        navigate(`/messages?conv=${created.conversationId}`);
      } else {
        navigate('/dashboard?tab=skill-requests');
      }
    }, 320);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.78rem 0.95rem',
    borderRadius: '12px',
    border: '1px solid rgba(17,18,15,0.16)',
    background: '#FFFFFF',
    fontSize: '0.9rem',
  };

  return (
    <Modal
      isOpen={open}
      onClose={closeSkillRequestModal}
      title={
        isProfessional
          ? lang === 'fa'
            ? 'ارسال درخواست مهارت و همکاری تخصصی'
            : 'Send a Skill Request (Provider Tool)'
          : lang === 'fa'
          ? 'ثبت درخواست مهارت سفارشی'
          : 'Request a Custom Skill'
      }
      wide
    >
      {/* Mode Selector */}
      <Grid container spacing={1.2} sx={{ mb: 2.2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <button
            type="button"
            onClick={() => setRequestType('specialist_collaboration')}
            style={{
              width: '100%',
              padding: '0.78rem 0.95rem',
              borderRadius: '14px',
              border:
                requestType === 'specialist_collaboration'
                  ? '2px solid #11120F'
                  : '1px solid rgba(17,18,15,0.12)',
              background:
                requestType === 'specialist_collaboration' ? '#11120F' : '#FFFFFF',
              color:
                requestType === 'specialist_collaboration' ? '#C7F36B' : '#11120F',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Users size={16} />
            <span>
              {lang === 'fa'
                ? 'درخواست مهارت از متخصص دیگر'
                : 'Request Skill from Specialist'}
            </span>
          </button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <button
            type="button"
            onClick={() => setRequestType('platform_skill')}
            style={{
              width: '100%',
              padding: '0.78rem 0.95rem',
              borderRadius: '14px',
              border:
                requestType === 'platform_skill'
                  ? '2px solid #11120F'
                  : '1px solid rgba(17,18,15,0.12)',
              background:
                requestType === 'platform_skill' ? '#11120F' : '#FFFFFF',
              color: requestType === 'platform_skill' ? '#C7F36B' : '#11120F',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <Award size={16} />
            <span>
              {lang === 'fa'
                ? 'درخواست افزودن مهارت جدید به پلتفرم'
                : 'Request New Platform Skill'}
            </span>
          </button>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              {lang === 'fa' ? 'حوزه تخصصی' : 'Discipline / Category'}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={inputStyle}
            >
              {activeCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {l(cat.name)}
                </option>
              ))}
            </select>
          </Grid>

          {requestType === 'specialist_collaboration' ? (
            <Grid size={{ xs: 12, sm: 6 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  marginBottom: 6,
                }}
              >
                {lang === 'fa' ? 'ارسال به متخصص منتخب' : 'Target Specialist'}
              </label>
              <select
                value={targetProId}
                onChange={(e) => setTargetProId(e.target.value)}
                style={inputStyle}
              >
                {otherProfessionals.map((pro) => (
                  <option key={pro.id} value={pro.id}>
                    {l(pro.name)} — {l(pro.title)}
                  </option>
                ))}
              </select>
            </Grid>
          ) : isProfessional ? (
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.78rem 0.9rem',
                  borderRadius: '12px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(17,18,15,0.12)',
                  width: '100%',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={addToMyProfile}
                  onChange={(e) => setAddToMyProfile(e.target.checked)}
                />
                <span>
                  {lang === 'fa'
                    ? 'افزودن هم‌زمان به پروفایل تخصصی من'
                    : 'Also add to my Specialist Profile'}
                </span>
              </label>
            </Grid>
          ) : null}

          <Grid size={{ xs: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              {lang === 'fa' ? 'عنوان مهارت موردنیاز *' : 'Requested Skill Name *'}
            </label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder={
                lang === 'fa'
                  ? 'مثلاً: طراحی داشبورد IoT، محاسبات سازه، عکاسی معماری...'
                  : 'e.g. IoT Dashboard Engineering, BIM Modeling, Architectural Photo...'
              }
              style={inputStyle}
            />

            {suggestedSkills.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <span style={{ fontSize: '0.75rem', color: '#666860', display: 'block', marginBottom: 4 }}>
                  {lang === 'fa' ? 'انتخاب سریع مهارت‌های پیشنهادی:' : 'Suggested skills:'}
                </span>
                <Stack direction="row" spacing={0.7} flexWrap="wrap" useFlexGap>
                  {suggestedSkills.map((sk) => (
                    <Chip
                      key={sk}
                      label={sk}
                      size="small"
                      onClick={() => setSkillName(sk)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: skillName === sk ? '#C7F36B' : '#FFFFFF',
                        fontWeight: 700,
                        border: '1px solid rgba(17,18,15,0.12)',
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>

          {requestType === 'specialist_collaboration' && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  {lang === 'fa' ? 'اولویت زمانی' : 'Urgency'}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  style={inputStyle}
                >
                  <option value="normal">
                    {lang === 'fa' ? 'هماهنگی عادی پروژه' : 'Standard Schedule'}
                  </option>
                  <option value="urgent">
                    {lang === 'fa' ? 'فوری / اولویت بالا' : 'Urgent / Express'}
                  </option>
                </select>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    marginBottom: 6,
                  }}
                >
                  {lang === 'fa'
                    ? 'بودجه پیشنهادی همکاری (تومان - اختیاری)'
                    : 'Estimated Collaboration Budget (Optional)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={lang === 'fa' ? 'مثلاً: 15000000' : 'e.g. 15000000'}
                  style={inputStyle}
                />
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12 }}>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              {lang === 'fa'
                ? 'شرح نیاز مهارتی و جزئیات همکاری'
                : 'Skill Scope & Collaboration Notes'}
            </label>
            <textarea
              rows={3}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={
                requestType === 'specialist_collaboration'
                  ? lang === 'fa'
                    ? 'توضیح دهید برای کدام بخش از پروژه به این مهارت نیاز دارید و زمان‌بندی مدنظرتان چیست...'
                    : 'Describe what skill deliverables you need from this specialist and your timeline...'
                  : lang === 'fa'
                  ? 'دلیل نیاز به ثبت این مهارت تخصصی جدید در دسته‌بندی‌های اوجیفای را بنویسید...'
                  : 'Explain why this specialized skill should be added to OWJIFY categories...'
              }
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end" spacing={1.2} sx={{ mt: 2.5 }}>
          <button
            type="button"
            onClick={closeSkillRequestModal}
            className="owj-btn owj-btn--outline owj-btn--sm"
          >
            {lang === 'fa' ? 'انصراف' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={submitting || !skillName.trim()}
            className="owj-btn owj-btn--lime owj-btn--sm"
          >
            {submitting ? <span className="owj-spinner" /> : <Sparkles size={15} />}
            <span>
              {requestType === 'specialist_collaboration'
                ? lang === 'fa'
                  ? 'ارسال درخواست مهارت و آغاز گفتگو'
                  : 'Send Skill Request & Message'
                : lang === 'fa'
                ? 'ثبت درخواست مهارت جدید'
                : 'Submit Skill Request'}
            </span>
          </button>
        </Stack>
      </form>
    </Modal>
  );
}
