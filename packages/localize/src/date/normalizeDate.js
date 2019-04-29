/**
 * To filter out some added characters in IE
 *
 * @param str
 * @returns {string}
 */
export function normalizeDate(str) {
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

  return dateString.join('');
}
