export const LOCATIONS = [
  { id: 'tehran', name: { fa: 'تهران', en: 'Tehran' } },
  { id: 'isfahan', name: { fa: 'اصفهان', en: 'Isfahan' } },
  { id: 'shiraz', name: { fa: 'شیراز', en: 'Shiraz' } },
  { id: 'mashhad', name: { fa: 'مشهد', en: 'Mashhad' } },
  { id: 'tabriz', name: { fa: 'تبریز', en: 'Tabriz' } },
  { id: 'karaj', name: { fa: 'کرج', en: 'Karaj' } },
  { id: 'kish', name: { fa: 'کیش', en: 'Kish Island' } },
  { id: 'rasht', name: { fa: 'رشت', en: 'Rasht' } },
  { id: 'remote', name: { fa: 'دورکاری / سراسر کشور', en: 'Remote / Nationwide' } },
];

export function getLocationById(id) {
  return LOCATIONS.find((l) => l.id === id) || LOCATIONS[0];
}
