import { Validator } from '@lion/ui/form-core.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorConfig} ValidatorConfig
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorParam} ValidatorParam
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorOutcome} ValidatorOutcome
 * @typedef {import('../types/input-file.js').AcceptCriteria} AcceptCriteria
 * @typedef {import('../types/input-file.js').AcceptCategory} AcceptCategory
 * @typedef {import('../types/input-file.js').ModelValueFile} ModelValueFile
 * @typedef {import('../types/input-file.js').ValidatorOutcomeOfIsAcceptedFile} ValidatorOutcomeOfIsAcceptedFile
 */

// /**
//  *
//  * @param {string[]} allowedFileTypes
//  */
// function getMessageMetaAllowedFileTypes(allowedFileTypes) {
//   const array = [];
//   for (const mimeTypeString of allowedFileTypes) {
//     if (mimeTypeString.endsWith('/*')) {
//       array.push(mimeTypeString.slice(0, -2));
//     } else if (mimeTypeString === 'text/plain') {
//       array.push('text');
//     } else {
//       const index = mimeTypeString.indexOf('/');
//       const subTypes = mimeTypeString.slice(index + 1);
//       if (!subTypes.includes('+')) {
//         array.push(`.${subTypes}`);
//       } else {
//         const subType = subTypes.split('+');
//         array.push(`.${subType[0]}`);
//       }
//     }
//   }
//   const lastItem = array.pop();
//   // arrayLength = array.length;

//   return {};
// }

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
   * @param {File[]} modelValue array of file objects
   * @param {AcceptCriteria} acceptCriteria
   * @returns {ValidatorOutcomeOfIsAcceptedFile|false}
   */
  execute(modelValue, acceptCriteria = this.param) {
    /**
     * The array that will be returned by the execute function in case there are
     * errors found in any of the accept criteria categories ('type'|'extension'|'size')
     * @type {ValidatorOutcomeOfIsAcceptedFile}
     */
    const outcomeForAllFiles = [];
    const ctor = /** @type {typeof IsAcceptedFile} */ (this.constructor);

    /**
     * @param {AcceptCategory} acceptCategory
     * @param {File[]} filesInvalidForCategory
     */
    const addValidatorOutcomeForCategory = (acceptCategory, filesInvalidForCategory) => {
      for (const f of filesInvalidForCategory) {
        // Did we already add this file for a different AcceptCategory?
        const foundItem = outcomeForAllFiles.find(o => o.name === f.name && o.size === f.size);
        const item = foundItem || { ...f, validatorOutcome: [] };
        item.validatorOutcome.push({ name: acceptCategory, acceptCriteria });
      }
    };

    if (acceptCriteria.allowedFileTypes?.length) {
      const filesWithInvalidType = modelValue.filter(
        f => !ctor.isFileTypeAllowed(f.type, acceptCriteria.allowedFileTypes),
      );
      addValidatorOutcomeForCategory('type', filesWithInvalidType);
    }

    if (acceptCriteria.allowedFileExtensions?.length) {
      const filesWithInvalidExt = modelValue.filter(
        f =>
          !ctor.isExtensionAllowed(ctor.getExtension(f.name), acceptCriteria.allowedFileExtensions),
      );
      addValidatorOutcomeForCategory('extension', filesWithInvalidExt);
    }

    const filesWithInvalidSize = modelValue.filter(
      file => !ctor.checkFileSize(file.size, acceptCriteria.maxFileSize),
    );
    addValidatorOutcomeForCategory('size', filesWithInvalidSize);

    if (!outcomeForAllFiles.length) {
      return false;
    }

    return outcomeForAllFiles;
  }
}
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
