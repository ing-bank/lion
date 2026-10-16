import { Validator } from './Validator.js';

export class FileLastModifiedDateValidator extends Validator {
  static validatorName = 'FileLastModifiedDate';

  /**
   * Checks if the file's last modified date is within the specified range.
   * @param {Date} fileLastModifiedDate - The file's last modified date.
   * @param {Date} startDate - The start date of the allowed range.
   * @param {Date} endDate - The end date of the allowed range.
   * @returns {boolean}
   */
  static isDateWithinRange(fileLastModifiedDate, startDate, endDate) {
    return fileLastModifiedDate >= startDate && fileLastModifiedDate <= endDate;
  }

  /**
   * @param {Array<File>} modelValue - Array of file objects.
   * @param {{ startDate: Date; endDate: Date; }} params - Validation parameters.
   * @returns {boolean}
   */
  execute(modelValue, params = this.param) {
    const ctor = /** @type {typeof FileLastModifiedDateValidator} */ (this.constructor);
    return modelValue.every(file => {
      const fileDate = new Date(file.lastModified);
      return ctor.isDateWithinRange(fileDate, params.startDate, params.endDate);
    });
  }

  static async getMessage() {
    return 'The file must have been last modified within the specified date range.';
  }
}
