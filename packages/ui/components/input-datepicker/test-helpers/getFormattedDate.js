/* eslint-disable no-param-reassign */
/**
 * Get formatted date (MM-DD-YYYY)
 * @param {string} format
 * @param {Date} date
 * @returns {string}
 */
export function getFormattedDate(format, date) {
  if (!format) format = 'MM/dd/yyyy';

  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  format = format.replace('MM', month.toString().padStart(2, '0'));

  if (format.includes('yyyy')) {
    format = format.replace('yyyy', year.toString());
  } else if (format.includes('yy')) {
    format = format.replace('yy', year.toString().slice(-2));
  }

  format = format.replace('dd', date.getDate().toString().padStart(2, '0'));

  if (format.includes('t')) {
    format = format.replace('t', hours >= 12 ? 'pm' : 'am');
  }

  if (format.includes('HH')) {
    format = format.replace('HH', hours.toString().padStart(2, '0'));
  }

  if (format.includes('hh')) {
    const twelveHourFormat = hours % 12 || 12;
    format = format.replace('hh', twelveHourFormat.toString().padStart(2, '0'));
  }

  if (format.includes('mm')) {
    format = format.replace('mm', minutes.toString().padStart(2, '0'));
  }

  if (format.includes('ss')) {
    format = format.replace('ss', seconds.toString().padStart(2, '0'));
  }

  return format;
}
