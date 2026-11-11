import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';

export const localizeTearDown = () => {
  const localizeManager = getLocalizeManager();
  // makes sure that between tests the localization is reset to default state
  // @ts-ignore
  localizeManager._teardownHtmlLangAttributeObserver();
  document.documentElement.lang = 'en-GB';
  // @ts-ignore
  localizeManager._setupHtmlLangAttributeObserver();
  localizeManager.reset();
};
