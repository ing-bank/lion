import { Validator } from '@lion/ui/form-core.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorConfig} ValidatorConfig
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorParam} ValidatorParam
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorOutcome} ValidatorOutcome
 * @typedef {import('../types/input-file.js').InputFile} InputFile
 */

/* eslint max-classes-per-file: ["error", 2] */
export class FileValidation extends Validator {
  static get validatorName() {
    return 'FileValidation';
  }

  /**
   * Syntactic sugar for getting the file extension
   * @param {typeof File.name} fileName
   * @return {string}
   */
  // eslint-disable-next-line class-methods-use-this
  _getExtension = fileName => fileName?.slice(fileName.lastIndexOf('.'));

  /**
   * @param {string} extension
   * @param {string[]} allowedFileExtensions
   */
  // eslint-disable-next-line class-methods-use-this
  isExtensionAllowed(extension, allowedFileExtensions) {
    return allowedFileExtensions?.find(
      allowedExtension => allowedExtension.toUpperCase() === extension.toUpperCase(),
    );
  }

  /**
   * @param {string} type
   * @param {string[]} allowedFileTypes
   */
  // eslint-disable-next-line class-methods-use-this
  isFileTypeAllowed(type, allowedFileTypes) {
    return allowedFileTypes?.find(allowedType => allowedType.toUpperCase() === type.toUpperCase());
  }

  /**
   * @param {number} fileFileSize
   * @param {number} maxFileSize
   */
  // eslint-disable-next-line class-methods-use-this
  checkFileSize(fileFileSize, maxFileSize) {
    return fileFileSize <= maxFileSize;
  }

  /**
   * @param {Array.<File>} modelValue array of file objects
   * @param {*} params
   * @returns {Boolean}
   */
  execute(modelValue, params = this.param) {
    let isInvalidType;
    let isInvalidFileExt;
    const { allowedFileTypes, allowedFileExtensions, maxFileSize } = params;
    if (allowedFileTypes && allowedFileTypes.length !== 0) {
      isInvalidType = modelValue.some(file => !this.isFileTypeAllowed(file.type, allowedFileTypes));
      return isInvalidType;
    }
    if (allowedFileExtensions && allowedFileExtensions.length !== 0) {
      isInvalidFileExt = modelValue.some(
        file => !this.isExtensionAllowed(this._getExtension(file.name), allowedFileExtensions),
      );
      return isInvalidFileExt;
    }
    const invalidFileSize = modelValue.findIndex(
      file => !this.checkFileSize(file.size, maxFileSize),
    );
    return invalidFileSize > -1;
  }
}

export class DuplicateFileNames extends Validator {
  static get validatorName() {
    return 'DuplicateFileNames';
  }

  /**
   * @param {ValidatorParam} [param]
   * @param {ValidatorConfig} [config]
   */
  constructor(param, config) {
    super(param, config);
    this.type = 'info';
  }

  /**
   * @param {InputFile[]} modelValue
   * @param {ValidatorParam} [params]
   * @returns {ValidatorOutcome|Promise<ValidatorOutcome>}
   */
  execute(modelValue, params = this.param) {
    return params.show;
  }

  /**
   * @returns {Promise<string|Element>}
   */
  static async getMessage() {
    const localizeManager = getLocalizeManager();
    return localizeManager.msg('lion-input-file:uploadTextDuplicateFileName');
  }
}
