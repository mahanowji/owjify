import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Stack, Chip } from '@mui/material';
import { Send, MessageSquare, ArrowRight, ArrowLeft } from 'lucide-react';
import SmartImage from '../common/SmartImage';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatTimeClock } from '../../utils/formatters';
import styles from './ChatThread.module.scss';

export default function ChatThread({ conversation, onSend, onMobileBack }) {
  const { lang, isRTL, l } = useLanguage();
  const { isProfessional } = useAuth();
  const [draft, setDraft] = useState('');
  const areaRef = useRef(null);

  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }
  }, [conversation?.id, conversation?.messages?.length]);

  if (!conversation) {
    return (
      <div className={styles.emptyState}>
        <MessageSquare size={38} />
        <h3>
          {lang === 'fa' ? 'یک گفتگو را برای نمایش انتخاب کنید' : 'Select a conversation'}
        </h3>
        <p style={{ fontSize: '0.86rem', maxWidth: 340 }}>
          {isProfessional
            ? lang === 'fa'
              ? 'پیام‌های دریافتی شما و درخواست‌هایی که به سایر متخصصان ارسال کرده‌اید در اینجا قابل مشاهده است.'
              : 'View your incoming inquiries alongside requests you sent to other specialists.'
            : lang === 'fa'
            ? 'پیام‌ها و استعلام‌هایی که برای متخصصان ارسال کرده‌اید در این بخش نمایش داده می‌شود.'
            : 'View the messages and inquiries you have sent to OWJIFY specialists.'}
        </p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(conversation.id, draft);
    setDraft('');
  };

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;
  const isIncoming = conversation.direction === 'received';

  const badgeLabel = isIncoming
    ? lang === 'fa'
      ? 'پیام دریافتی متخصص'
      : 'Received Inquiry'
    : isProfessional
    ? lang === 'fa'
      ? 'درخواست من به متخصص دیگر'
      : 'Request to Specialist'
    : lang === 'fa'
    ? 'ارسالی به متخصص'
    : 'Sent to Specialist';

  return (
    <div className={styles.chatPane}>
      <div className={styles.header}>
        <div className={styles.person}>
          {onMobileBack && (
            <button
              type="button"
              onClick={onMobileBack}
              className="owj-btn owj-btn--ghost owj-btn--sm"
              aria-label="Back to list"
            >
              <BackIcon size={17} />
            </button>
          )}
          <div className={styles.avatar}>
            <SmartImage
              src={conversation.participantAvatar}
              alt={l(conversation.participantName)}
            />
          </div>
          <div>
            <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap" useFlexGap>
              <span className={styles.name}>{l(conversation.participantName)}</span>
              <Chip
                size="small"
                label={badgeLabel}
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  bgcolor: isIncoming
                    ? 'rgba(40, 158, 103, 0.14)'
                    : isProfessional
                    ? '#C7F36B'
                    : 'rgba(17, 18, 15, 0.08)',
                  color: isIncoming ? '#1e7e50' : '#11120F',
                }}
              />
            </Stack>
            <div className={styles.serviceSub}>{l(conversation.serviceTitle)}</div>
          </div>
        </div>

        {conversation.proId ? (
          <Link
            to={`/professionals/${conversation.proId}`}
            className="owj-btn owj-btn--outline owj-btn--sm"
          >
            {lang === 'fa' ? 'پروفایل متخصص' : 'View Profile'}
          </Link>
        ) : (
          <span
            style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#666860',
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              background: '#F6F5F0',
            }}
          >
            {l(conversation.participantRole) ||
              (lang === 'fa' ? 'کاربر متقاضی' : 'Client')}
          </span>
        )}
      </div>

      <div className={styles.messagesArea} ref={areaRef}>
        {(conversation.messages || []).length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: '#92948c',
              marginTop: '2rem',
              fontSize: '0.88rem',
            }}
          >
            {lang === 'fa'
              ? 'اولین پیام خود را برای شروع گفتگو بنویسید...'
              : 'Send your first message to start the conversation...'}
          </p>
        ) : (
          conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.bubbleRow} ${
                msg.sender === 'me' ? styles.mine : styles.theirs
              }`}
            >
              <div className={styles.bubble}>{l(msg.text)}</div>
              <span className={styles.time}>{formatTimeClock(msg.createdAt, lang)}</span>
            </div>
          ))
        )}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            isIncoming
              ? lang === 'fa'
                ? 'پاسخ خود را بنویسید...'
                : 'Write your reply...'
              : lang === 'fa'
              ? 'پیام خود را بنویسید و Enter بزنید...'
              : 'Write a message...'
          }
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="owj-btn owj-btn--lime owj-btn--sm"
        >
          <Send size={15} />
          <span>{lang === 'fa' ? 'ارسال' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
