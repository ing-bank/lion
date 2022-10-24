import { localize } from '@lion/ui/localize.js';

export const localizeTearDown = () => {
  // makes sure that between tests the localization is reset to default state
  // @ts-ignore
  localize._teardownHtmlLangAttributeObserver();
  document.documentElement.lang = 'en-GB';
  // @ts-ignore
  localize._setupHtmlLangAttributeObserver();
  localize.reset();
};
