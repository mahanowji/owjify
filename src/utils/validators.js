export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function evaluatePasswordStrength(password = '') {
  const checks = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (checks.minLength) score += 1;
  if (checks.hasUpper && checks.hasLower) score += 1;
  if (checks.hasNumber) score += 1;
  if (checks.hasSpecial || password.length >= 12) score += 1;

  const labels = {
    0: { fa: 'بسیار ضعیف', en: 'Very Weak' },
    1: { fa: 'ضعیف', en: 'Weak' },
    2: { fa: 'متوسط', en: 'Fair' },
    3: { fa: 'قوی', en: 'Strong' },
    4: { fa: 'بسیار قوی', en: 'Excellent' },
  };

  return {
    score,
    checks,
    isAcceptable: checks.minLength && score >= 2,
    label: labels[score],
  };
}
