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
   * @param {FileHandle} fileHandle
   * @protected
   */
  /* eslint-disable no-param-reassign */
  _validateAgainstAcceptCriteria(fileHandle) {
    fileHandle.validationFeedback = [];
    const { allowedFileExtensions, allowedFileTypes } = this._acceptCriteria;
    /**
     * @type {string[]}
     */
    let array = [];
    let arrayLength = 0;
    let lastItem;

    if (allowedFileExtensions.length) {
      array = allowedFileExtensions;
      // eslint-disable-next-line no-return-assign
      array = array.map(item => (item = `.${item}`));
      lastItem = array.pop();
      arrayLength = array.length;
    } else if (allowedFileTypes.length) {
      allowedFileTypes.forEach(MIMETypes => {
        if (MIMETypes.endsWith('/*')) {
          array.push(MIMETypes.slice(0, -2));
        } else if (MIMETypes === 'text/plain') {
          array.push('text');
        } else {
          const index = MIMETypes.indexOf('/');
          const subTypes = MIMETypes.slice(index + 1);

          if (!subTypes.includes('+')) {
            array.push(`.${subTypes}`);
          } else {
            const subType = subTypes.split('+');
            array.push(`.${subType[0]}`);
          }
        }
      });
      lastItem = array.pop();
      arrayLength = array.length;
    }
    let message = '';
    if (!lastItem) {
      return 'too-large';
      // message = this.msgLit('lion-input-file:allowedFileSize', {
      //   maxSize: formatBytes(this.maxFileSize),
      // });
    } else if (!arrayLength) {
      return 'simple';

      // message = this.msgLit('lion-input-file:allowedFileValidatorSimple', {
      //   allowedType: lastItem,
      //   maxSize: formatBytes(this.maxFileSize),
      // });
    } else {
      return 'complex';

      // message = this.msgLit('lion-input-file:allowedFileValidatorComplex', {
      //   allowedTypesArray: array.join(', '),
      //   allowedTypesLastItem: lastItem,
      //   maxSize: formatBytes(this.maxFileSize),
      // });
    }

    const errorObj = {
      message,
      type: 'error',
    };
    fileHandle.validationFeedback?.push(errorObj);
  }

  /**
   * @param {Array<File>} modelValue array of file objects
   * @param {{ allowedFileTypes: string[]; allowedFileExtensions: string[]; maxFileSize: number; }} params
   * @returns {Boolean}
   */
  execute(modelValue, params = this.param) {
    let isInvalidType;
    let isInvalidFileExt;

    console.log('hhmm ja');

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

/** @param {FeedbackMessageData} data */
// @ts-ignore
IsAcceptedFile.getMessage = async data => {
  await forMessagesToBeReady();
  const { type, outcome } = data;
  if (outcome === 'too-long') {
    // TODO: get max-length of country and use MaxLength validator
    return localize.msg(`lion-validate:${type}.Pattern`, data);
  }
  if (outcome === 'too-short') {
    // TODO: get min-length of country and use MinLength validator
    return localize.msg(`lion-validate:${type}.Pattern`, data);
  }
  // TODO: add a more specific message here
  if (outcome === 'invalid-country-code') {
    return localize.msg(`lion-validate:${type}.Pattern`, data);
  }
  return localize.msg(`lion-validate:${type}.Pattern`, data);
};

export class DuplicateFileNames extends Validator {
  static validatorName = 'DuplicateFileNames';

  type = 'info';

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
