const STORAGE_KEY = 'schedule_data';

const defaultLessons = [
  { id: '1', name: 'Математика', category: 'Основные', duration: 90, color: '#FF6B6B' },
  { id: '2', name: 'Физика', category: 'Основные', duration: 90, color: '#4ECDC4' },
  { id: '3', name: 'Английский', category: 'Языки', duration: 60, color: '#45B7D1' },
  { id: '4', name: 'Программирование', category: 'IT', duration: 120, color: '#96CEB4' },
  { id: '5', name: 'История', category: 'Гуманитарные', duration: 60, color: '#FFEAA7' },
  { id: '6', name: 'Литература', category: 'Гуманитарные', duration: 60, color: '#DDA0DD' },
];

const defaultSchedule = {
  'Понедельник': [],
  'Вторник': [],
  'Среда': [],
  'Четверг': [],
  'Пятница': [],
  'Суббота': [],
  'Воскресенье': [],
};

export const loadData = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    lessons: defaultLessons,
    schedule: defaultSchedule,
  };
};

export const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};