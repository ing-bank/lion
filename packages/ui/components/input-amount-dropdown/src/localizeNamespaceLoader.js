/* eslint-disable import/no-extraneous-dependencies */
export const localizeNamespaceLoader = /** @param {string} locale */ locale => {
  switch (locale) {
    default:
      return import('@lion/ui/input-amount-dropdown-translations/en.js');
  }
};
