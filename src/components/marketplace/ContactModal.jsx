import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MessageSquare } from 'lucide-react';
import Modal from '../common/Modal';
import SmartImage from '../common/SmartImage';
import { useLanguage } from '../../context/LanguageContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useToast } from '../../context/ToastContext';

export default function ContactModal({ isOpen, onClose, pro, serviceTitle }) {
  const { lang, l } = useLanguage();
  const { startOrSendConversation } = useMarketplace();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!pro) return null;

  const quickPrompts =
    lang === 'fa'
      ? [
          'سلام، برای استعلام زمان آزاد و تعرفه دقیق پیام می‌دهم.',
          'سلام، امکان مشاوره تلفنی کوتاه یا بازدید اولیه این هفته هست؟',
        ]
      : [
          'Hi! Reaching out to check your availability and exact quote this week.',
          'Hello, could we schedule a brief scoping call for my project?',
        ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      const convId = startOrSendConversation({
        pro,
        serviceTitle,
        messageText: message.trim(),
      });
      setSending(false);
      setMessage('');
      onClose?.();
      showToast({
        title: lang === 'fa' ? 'پیام شما ارسال شد' : 'Message Sent',
        message:
          lang === 'fa'
            ? `گفتگو با ${l(pro.name)} در بخش پیام‌ها باز شد.`
            : `Conversation with ${l(pro.name)} saved in Messages.`,
        type: 'success',
      });
      navigate(`/messages?conv=${convId}`);
    }, 320);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'fa' ? `ارسال پیام به ${l(pro.name)}` : `Message ${l(pro.name)}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '0.85rem',
          background: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid rgba(17,18,15,0.08)',
          marginBottom: '1rem',
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <SmartImage src={pro.avatar} alt={l(pro.name)} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>{l(pro.name)}</div>
          <div style={{ fontSize: '0.8rem', color: '#666860' }}>
            {l(pro.responseTime)} • {l(pro.title)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.9rem' }}>
        {quickPrompts.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setMessage(q)}
            style={{
              padding: '0.38rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.76rem',
              background: 'rgba(17,18,15,0.06)',
              textAlign: 'start',
            }}
          >
            + {q}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.45rem' }}>
          {lang === 'fa' ? 'شرح درخواست یا سوال شما' : 'Project details or question'}
        </label>
        <textarea
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            lang === 'fa'
              ? 'جزئیات کار، زمان مدنظر و محدوده مکانی خود را بنویسید...'
              : 'Describe your scope, preferred timeline, and location...'
          }
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            borderRadius: '14px',
            border: '1px solid rgba(17,18,15,0.16)',
            background: '#FFFFFF',
            resize: 'vertical',
            marginBottom: '1.1rem',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
          <button type="button" onClick={onClose} className="owj-btn owj-btn--outline owj-btn--sm">
            {lang === 'fa' ? 'انصراف' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="owj-btn owj-btn--lime owj-btn--sm"
          >
            {sending ? <span className="owj-spinner" /> : <Send size={15} />}
            <span>{lang === 'fa' ? 'ارسال و باز کردن گفتگو' : 'Send & Open Chat'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
