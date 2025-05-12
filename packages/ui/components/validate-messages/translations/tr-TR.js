import tr from './tr.js';

export default {
  ...tr,
  error: {
    ...tr.error,
    IsDate: 'Please enter a valid date (MM/DD/YYYY).',
  },
  warning: {
    ...tr.warning,
    IsDate: 'Please enter a valid date (MM/DD/YYYY).',
  },
};
