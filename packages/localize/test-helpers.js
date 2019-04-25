import { localize } from './src/localize.js';

export const localizeTearDown = () => {
  // makes sure that between tests the localization is reset to default state
  document.documentElement.lang = 'en-GB';
  localize.reset();
};
