import { localize } from '../src/localize.js';

export const localizeTearDown = () => {
  // makes sure that between tests the localization is reset to default state
  localize._teardownHtmlLangAttributeObserver();
  document.documentElement.lang = 'en-GB';
  localize._setupHtmlLangAttributeObserver();
  localize.reset();
};
