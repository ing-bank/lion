import tr from './tr.js';

export default {
  ...tr,
  error: {
    ...tr.error,
    IsDate: 'Lütfen geçerli bir tarih girin (GG/AA/YYYY).',
  },
  warning: {
    ...tr.warning,
    IsDate: 'Lütfen geçerli bir tarih girin (GG/AA/YYYY).',
  },
};
