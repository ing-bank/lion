import { splitDate } from './splitDate.js';
import { pad } from './pad.js';

/**
 * To add a leading zero to a single number
 *
 * @param dateString
 * @returns {*}
 */
export function addLeadingZero(dateString) {
  const dateParts = splitDate(dateString);
  const delimiter = dateParts ? dateParts[2] : '';
  const uniformDateString = dateString.replace(/[.\-/\s]/g, delimiter);
  const dateArray = uniformDateString.split && uniformDateString.split(delimiter);
  if (!dateArray || dateArray.length !== 3) {
    // prevent fail on invalid dates
    return '';
  }
  return dateArray.map(pad).join('-');
}
