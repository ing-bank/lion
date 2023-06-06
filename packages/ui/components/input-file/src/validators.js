import { Validator } from '@lion/ui/form-core.js';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorConfig} ValidatorConfig
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorParam} ValidatorParam
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorOutcome} ValidatorOutcome
 * @typedef {import('../types/index.js').AllowedFileCriteria} AllowedFileCriteria
 * @typedef {import('../types/index.js').AllowedFileCategory} AllowedFileCategory
 * @typedef {import('../types/index.js').ModelValueFile} ModelValueFile
 * @typedef {import('../types/index.js').ValidatorOutcomeOfIsAllowedFile} ValidatorOutcomeOfIsAllowedFile
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
export class IsAllowedFile extends Validator {
  static validatorName = 'IsAllowedFile';

  /**
   * Gets the extension of a file name
   * @param {string} fileName like myFile.txt
   * @return {string} like .txt
   */
  static getExtension(fileName) {
    return fileName?.slice(fileName.lastIndexOf('.'));
  }

  /**
   * @param {number} fileFileSize
   * @param {number} maxFileSize
   */
  static isBelowOrEqualToMaxSize(fileFileSize, maxFileSize) {
    return !maxFileSize || fileFileSize <= maxFileSize;
  }

  /**
   * @param {string} extension
   * @param {string[]} allowedFileExtensions
   */
  static isExtensionAllowed(extension, allowedFileExtensions) {
    return (
      !allowedFileExtensions?.length ||
      allowedFileExtensions?.find(
        allowedExtension => allowedExtension.toUpperCase() === extension.toUpperCase(),
      )
    );
  }

  /**
   * @param {string} type
   * @param {string[]} allowedFileTypes
   */
  static isFileTypeAllowed(type, allowedFileTypes) {
    return (
      !allowedFileTypes?.length ||
      allowedFileTypes?.find(allowedType => allowedType.toUpperCase() === type.toUpperCase())
    );
  }

  /**
   * @param {ModelValueFile[]} modelValueFiles array of file objects
   * @param {AllowedFileCriteria} AllowedFileCriteria
   * @returns {ValidatorOutcomeOfIsAllowedFile[]|false}
   */
  execute(modelValueFiles, AllowedFileCriteria = this.param) {
    /**
     * The array that will be returned by the execute function in case there are
     * errors found in any of the accept criteria categories ('type'|'extension'|'size')
     * @type {ValidatorOutcomeOfIsAllowedFile[]}
     */
    const outcomeForAllFiles = [];
    const ctor = /** @type {typeof IsAllowedFile} */ (this.constructor);

    /** @type {ValidatorOutcomeOfIsAllowedFile['id'][]} */
    const foundIds = [];
    for (const f of modelValueFiles) {
      /** @type {ValidatorOutcomeOfIsAllowedFile} */
      const file = {
        id: f.meta?.id,
        outcome: { failedOn: [] },
        meta: { AllowedFileCriteria, file: f },
      };

      if (foundIds.includes(file.id)) {
        file.outcome.failedOn.push('duplicate');
      } else {
        foundIds.push(file.id);
      }

      if (!ctor.isFileTypeAllowed(f.type, AllowedFileCriteria.types)) {
        file.outcome.failedOn.push('type');
      }
      if (!ctor.isExtensionAllowed(ctor.getExtension(f.name), AllowedFileCriteria.extensions)) {
        file.outcome.failedOn.push('extension');
      }
      if (!ctor.isBelowOrEqualToMaxSize(f.size, AllowedFileCriteria.size)) {
        file.outcome.failedOn.push('size');
      }
      if (file.outcome.failedOn.length) {
        outcomeForAllFiles.push(file);
      }
    }

    if (!outcomeForAllFiles.length) {
      return false;
    }

    return outcomeForAllFiles;
  }
}

export class HasDuplicateFiles extends Validator {
  static validatorName = 'HasDuplicateFiles';

  type = 'info';

  /**
   * @param {ModelValueFile[]} modelValue
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
