/**
 * Get the full locale for a region.
 * As we don't know the language for that region, we first set it as 'und', which stands for 'undetermined'.
 * @param {string} regionCode
 */
export function regionCodeToLocale(regionCode) {
  const locale = new Intl.Locale('und', { region: regionCode }); // Set language as undetermined.
  const maximizedLocale = locale.maximize(); // Determine the most likely full locale for a region with an undetermined language.
  return maximizedLocale.baseName;
}
