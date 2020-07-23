import { sanitizedDateTimeFormat } from './sanitizedDateTimeFormat.js';
import { splitDate } from './splitDate.js';

/**
 * To compute the localized date format
 *
 * @returns {string}
 */
export function getDateFormatBasedOnLocale() {
  /**
   *
   * @param {ArrayLike<string>} dateParts
   * @returns {Array<string>}
   */
  function computePositions(dateParts) {
    /**
     * @param {number} index
     * @returns {string}
     */
    function getPartByIndex(index) {
      /** @type {Object.<string, string>} */
      const template = {
        '2012': 'year',
        '12': 'month',
        '20': 'day',
      };
      const key = dateParts[index];
      return template[key];
    }

    return [1, 3, 5].map(getPartByIndex);
  }

  // Arbitrary date with different values for year,month,day
  const date = new Date();
  date.setDate(20);
  date.setMonth(11);
  date.setFullYear(2012);

  // Strange characters added by IE11 need to be taken into account here
  const formattedDate = sanitizedDateTimeFormat(date);

  // For Dutch locale, dateParts would match: [ 1:'20', 2:'-', 3:'12', 4:'-', 5:'2012' ]
  const dateParts = splitDate(formattedDate);

  const dateFormat = {};
  if (dateParts) {
    dateFormat.positions = computePositions(dateParts);
  }
  return `${dateFormat.positions[0]}-${dateFormat.positions[1]}-${dateFormat.positions[2]}`;
}
