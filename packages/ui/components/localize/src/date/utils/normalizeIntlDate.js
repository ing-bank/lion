/**
 * To filter out some added characters in IE
 *
 * @param {string} str
 * @param {string} [locale='']
 * @param {import('../../../types/LocalizeMixinTypes.js').FormatDateOptions} options Intl options are available
 * @returns {string}
 */
export function normalizeIntlDate(str, locale = '', { weekday, year, month, day } = {}) {
  const dateString = [];
  for (let i = 0, n = str.length; i < n; i += 1) {
    // remove unicode 160
    if (str.charCodeAt(i) === 160) {
      dateString.push(' ');
      // remove unicode 8206
    } else if (str.charCodeAt(i) === 8206) {
      dateString.push('');
    } else {
      dateString.push(str.charAt(i));
    }
  }

  const result = dateString.join('');

  // Normalize webkit date formatting without year
  if (!year && weekday === 'long' && month === 'long' && day === '2-digit') {
    const CHINESE_LOCALES = [
      // Webkit has a space while chrome and firefox not. Example: ("10月12日 星期六")
      'zh-CN',
      'zh-Hans',
      'zh-Hans-CN',
      'zh-Hans-HK',
      'zh-Hans-MO',
      'zh-Hans-SG',
      // Skip 'zh-Hant' and 'zh-Hant-TW', since webkit/firefox/chromium are aligned.
      // 'zh-Hant',
      // 'zh-Hant-TW',
      'zh-Hant-HK',
      'zh-Hant-MO',
    ];

    if (CHINESE_LOCALES.includes(locale)) {
      return result.replace(' ', '');
    }

    if (result.indexOf(',') === -1 && locale === 'en-GB') {
      // Saturday 12 October -> Saturday, 12 October
      const match = result.match(/^(\w*) (\d*) (\w*)$/);
      if (match !== null) {
        return `${match[1]}, ${match[2]} ${match[3]}`;
      }
    }

    if (result.indexOf(', ') !== -1 && locale === 'sk-SK') {
      // sobota, 12. októbra -> sobota 12. októbra
      return result.replace(', ', ' ');
    }

    if (locale === 'en-PH') {
      // Saturday, October 12 -> Saturday, 12 October
      const match = result.match(/^(\w*), (\w*) (\d*)$/);
      if (match !== null) {
        return `${match[1]}, ${match[3]} ${match[2]}`;
      }
    }
  }

  return result;
}
