export const API_BASE_URL = 'http://localhost:3000/api';

export const COLORS = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  accent: '#FF9800',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FF9800',
  border: '#E0E0E0',
};

export const MEAL_TYPES = [
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '加餐' },
];

export const DIET_MODES = [
  {
    value: 'nutrition_label',
    label: '营养价值表',
    description: '拍摄包装食品的营养成分表',
    icon: '📋',
  },
  {
    value: 'reference_photo',
    label: '参考物拍照',
    description: '使用拳头或硬币作为参考物',
    icon: '✊',
  },
  {
    value: 'quick',
    label: '快捷模式',
    description: '快速拍照存档，稍后补录',
    icon: '⚡',
  },
];
