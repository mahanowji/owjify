import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag } from 'lucide-react';
import Modal from '../common/Modal';
import { marketplaceService } from '../../services/marketplaceService';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function ReportModal({ isOpen, onClose, adId, adTitle }) {
  const { lang } = useLanguage();
  const { createSupportTicket } = useMarketplace();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [reason, setReason] = useState('pricing');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const reasons = [
    { id: 'pricing', label: { fa: 'مغایرت تعرفه با شرح آگهی', en: 'Misleading pricing' } },
    { id: 'spam', label: { fa: 'محتوای تکراری یا اسپم', en: 'Spam or duplicate listing' } },
    { id: 'quality', label: { fa: 'اطلاعات نادرست یا غیرواقعی', en: 'Inaccurate information' } },
    { id: 'other', label: { fa: 'سایر موارد', en: 'Other issue' } },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const chosenReason = reasons.find((r) => r.id === reason) || reasons[0];

    marketplaceService.submitReport({ adId, adTitle, reason, details });
    const createdTicket = await createSupportTicket({
      category: 'report_listing',
      priority: 'high',
      relatedAdId: adId,
      relatedAdTitle: { fa: adTitle, en: adTitle },
      subject: {
        fa: `گزارش آگهی: ${chosenReason.label.fa}`,
        en: `Listing Report: ${chosenReason.label.en}`,
      },
      message: {
        fa: details.trim()
          ? `${chosenReason.label.fa} — ${details.trim()}`
          : chosenReason.label.fa,
        en: details.trim()
          ? `${chosenReason.label.en} — ${details.trim()}`
          : chosenReason.label.en,
      },
    });

    setLoading(false);
    setDetails('');
    onClose?.();
    showToast({
      title:
        lang === 'fa'
          ? `گزارش ثبت شد (${createdTicket.id})`
          : `Report Submitted (${createdTicket.id})`,
      message:
        lang === 'fa'
          ? 'اپراتور پشتیبانی بررسی و پاسخ را در بخش پشتیبانی ثبت خواهد کرد.'
          : 'Support operators will review and respond in the Support Center.',
      type: 'info',
    });
    navigate(`/support?ticket=${createdTicket.id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'fa' ? 'گزارش تخلف آگهی به پشتیبانی' : 'Report Advertisement to Support'}
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.95rem' }}>
          {reasons.map((r) => (
            <label
              key={r.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.85rem',
                background: reason === r.id ? '#11120F' : '#FFFFFF',
                color: reason === r.id ? '#F6F5F0' : '#11120F',
                borderRadius: '11px',
                cursor: 'pointer',
                border: '1px solid rgba(17,18,15,0.1)',
                fontSize: '0.84rem',
                fontWeight: 600,
              }}
            >
              <input
                type="radio"
                name="reportReason"
                value={r.id}
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
              />
              <span>{r.label[lang]}</span>
            </label>
          ))}
        </div>

        <textarea
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder={
            lang === 'fa'
              ? 'توضیحات تکمیلی برای اپراتور پشتیبانی (اختیاری)...'
              : 'Additional context for support operator (optional)...'
          }
          style={{
            width: '100%',
            padding: '0.75rem 0.9rem',
            borderRadius: '11px',
            border: '1px solid rgba(17,18,15,0.14)',
            background: '#FFFFFF',
            marginBottom: '1rem',
            fontSize: '0.86rem',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.55rem' }}>
          <button type="button" onClick={onClose} className="owj-btn owj-btn--outline owj-btn--sm">
            {lang === 'fa' ? 'انصراف' : 'Cancel'}
          </button>
          <button type="submit" disabled={loading} className="owj-btn owj-btn--danger owj-btn--sm">
            {loading ? <span className="owj-spinner" /> : <Flag size={14} />}
            <span>{lang === 'fa' ? 'ارسال گزارش' : 'Submit Report'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
