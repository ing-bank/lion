import en from './en.js';

export default {
  ...en,
  error: {
    ...en.error,
    isDate: 'Please enter a valid date (MM/DD/YYYY).',
  },
  warning: {
    ...en.warning,
    isDate: 'Please enter a valid date (MM/DD/YYYY).',
  },
};
