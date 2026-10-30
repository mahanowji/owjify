import { evaluatePasswordStrength } from '../../utils/validators';
import { useLanguage } from '../../context/LanguageContext';
import styles from './PasswordStrength.module.scss';

export default function PasswordStrength({ password }) {
  const { lang } = useLanguage();
  if (!password) return null;

  const { score, label } = evaluatePasswordStrength(password);

  return (
    <div className={styles.wrap}>
      <div className={styles.bars}>
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={`${styles.bar} ${score >= level ? styles[`score${score}`] : ''}`}
          />
        ))}
      </div>
      <div className={styles.meta}>
        <span>{lang === 'fa' ? 'قدرت رمز عبور:' : 'Password strength:'}</span>
        <strong>{label[lang]}</strong>
      </div>
    </div>
  );
}
