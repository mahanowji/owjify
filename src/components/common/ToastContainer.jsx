import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle, Sparkles, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import styles from './ToastContainer.module.scss';

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className={styles.stack} aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon =
            toast.type === 'error'
              ? AlertCircle
              : toast.type === 'info'
              ? Sparkles
              : Check;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`${styles.toast} ${styles[toast.type] || styles.success}`}
            >
              <span className={styles.iconWrap}>
                <Icon size={16} />
              </span>
              <div className={styles.content}>
                <div className={styles.title}>{toast.title}</div>
                {toast.message && <div className={styles.msg}>{toast.message}</div>}
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
