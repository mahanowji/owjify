import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import Modal from '../common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';

export default function ShareModal({ isOpen, onClose, title, shareUrl }) {
  const { lang } = useLanguage();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const url =
    shareUrl || (typeof window !== 'undefined' ? window.location.href : 'https://owjify.ir');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback ignored
    }
    setCopied(true);
    showToast({
      title: lang === 'fa' ? 'لینک در کلیپ‌بورد کپی شد' : 'Link Copied',
      type: 'success',
      duration: 2200,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'fa' ? 'اشتراک‌گذاری در شبکه‌ها' : 'Share Link'}
    >
      <p style={{ fontSize: '0.9rem', color: '#464841', marginBottom: '1rem' }}>{title}</p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 0.75rem',
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid rgba(17,18,15,0.14)',
          direction: 'ltr',
        }}
      >
        <input
          type="text"
          readOnly
          value={url}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: '0.82rem',
            outline: 'none',
          }}
        />
        <button type="button" onClick={handleCopy} className="owj-btn owj-btn--dark owj-btn--sm">
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? (lang === 'fa' ? 'کپی شد' : 'Copied') : lang === 'fa' ? 'کپی لینک' : 'Copy'}</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.1rem', flexWrap: 'wrap' }}>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || 'OWJIFY')}`}
          target="_blank"
          rel="noreferrer"
          className="owj-btn owj-btn--outline owj-btn--sm"
        >
          <span>Telegram</span>
          <ExternalLink size={14} />
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${title || 'OWJIFY'} - ${url}`)}`}
          target="_blank"
          rel="noreferrer"
          className="owj-btn owj-btn--outline owj-btn--sm"
        >
          <span>WhatsApp</span>
          <ExternalLink size={14} />
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent(title || 'OWJIFY')}&body=${encodeURIComponent(url)}`}
          className="owj-btn owj-btn--outline owj-btn--sm"
        >
          <span>Email</span>
          <ExternalLink size={14} />
        </a>
      </div>
    </Modal>
  );
}
