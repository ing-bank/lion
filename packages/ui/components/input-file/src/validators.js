import { Validator } from '@lion/ui/form-core.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorConfig} ValidatorConfig
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorParam} ValidatorParam
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorOutcome} ValidatorOutcome
 * @typedef {import('../types/input-file.js').InputFile} InputFile
 */

/* eslint max-classes-per-file: ["error", 2] */
export class IsAcceptedFile extends Validator {
  static validatorName = 'IsAcceptedFile';

  /**
   * @param {number} fileFileSize
   * @param {number} maxFileSize
   */
  static checkFileSize(fileFileSize, maxFileSize) {
    return fileFileSize <= maxFileSize;
  }

  /**
   * Gets the extension of a file name
   * @param {string} fileName like myFile.txt
   * @return {string} like .txt
   */
  static getExtension(fileName) {
    return fileName?.slice(fileName.lastIndexOf('.'));
  }

  /**
   * @param {string} extension
   * @param {string[]} allowedFileExtensions
   */
  static isExtensionAllowed(extension, allowedFileExtensions) {
    return allowedFileExtensions?.find(
      allowedExtension => allowedExtension.toUpperCase() === extension.toUpperCase(),
    );
  }

  /**
   * @param {string} type
   * @param {string[]} allowedFileTypes
   */
  static isFileTypeAllowed(type, allowedFileTypes) {
    return allowedFileTypes?.find(allowedType => allowedType.toUpperCase() === type.toUpperCase());
  }

  /**
   * @param {Array<File>} modelValue array of file objects
   * @param {{ allowedFileTypes: string[]; allowedFileExtensions: string[]; maxFileSize: number; }} params
   * @returns {Boolean}
   */
  execute(modelValue, params = this.param) {
    let isInvalidType;
    let isInvalidFileExt;

    const ctor = /** @type {typeof IsAcceptedFile} */ (this.constructor);
    const { allowedFileTypes, allowedFileExtensions, maxFileSize } = params;
    if (allowedFileTypes?.length) {
      isInvalidType = modelValue.some(file => !ctor.isFileTypeAllowed(file.type, allowedFileTypes));
      return isInvalidType;
    }
    if (allowedFileExtensions?.length) {
      isInvalidFileExt = modelValue.some(
        file => !ctor.isExtensionAllowed(ctor.getExtension(file.name), allowedFileExtensions),
      );
      return isInvalidFileExt;
    }
    const invalidFileSize = modelValue.findIndex(
      file => !ctor.checkFileSize(file.size, maxFileSize),
    );
    return invalidFileSize > -1;
  }
}

export class DuplicateFileNames extends Validator {
  static validatorName = 'DuplicateFileNames';

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
    // TODO: we need to make sure namespace is loaded
    // TODO: keep Validators localize system agnostic
    return localizeManager.msg('lion-input-file:uploadTextDuplicateFileName');
  }
}
