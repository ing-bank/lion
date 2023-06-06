import { IsAllowedFile } from './validators.js';
// import { loc } from './validators.js';

/**
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorConfig} ValidatorConfig
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorParam} ValidatorParam
 * @typedef {import('../../form-core/types/validate/validate.js').ValidatorOutcome} ValidatorOutcome
 * @typedef {import('../types/index.js').AllowedFileCriteria} AllowedFileCriteria
 * @typedef {import('../types/index.js').AllowedFileCategory} AllowedFileCategory
 * @typedef {import('../types/index.js').ModelValueFile} ModelValueFile
 * @typedef {import('../types/index.js').ValidatorOutcomeOfIsAllowedFile} ValidatorOutcomeOfIsAllowedFile
 */

/**
 * @param {number} bytes
 * @param {number} decimals
 */
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [' bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`;
}

/**
 * @param {AllowedFileCriteria} AllowedFileCriteria
 * @protected
 */
/* eslint-disable no-param-reassign */
function getValidatorMessage(AllowedFileCriteria) {
  // fileHandle.validationFeedback = [];
  const maxFileSizeFormatted = formatBytes(AllowedFileCriteria.maxFileSize);

  /** @type {string[]} */
  let array = [];
  let arrayLength = 0;
  let lastItem;

  if (AllowedFileCriteria.allowedFileExtensions.length) {
    array = AllowedFileCriteria.allowedFileExtensions;
    // eslint-disable-next-line no-return-assign
    array = array.map(item => (item = `.${item}`));
    lastItem = array.pop();
    arrayLength = array.length;
  } else if (AllowedFileCriteria.allowedFileTypes.length) {
    for (const mimeTypeString of AllowedFileCriteria.allowedFileTypes) {
      if (mimeTypeString.endsWith('/*')) {
        array.push(mimeTypeString.slice(0, -2));
      } else if (mimeTypeString === 'text/plain') {
        array.push('text');
      } else {
        const index = mimeTypeString.indexOf('/');
        const subTypes = mimeTypeString.slice(index + 1);
        if (!subTypes.includes('+')) {
          array.push(`.${subTypes}`);
        } else {
          const subType = subTypes.split('+');
          array.push(`.${subType[0]}`);
        }
      }
    }
    lastItem = array.pop();
    arrayLength = array.length;
  }

  if (!lastItem) {
    return localize.msg('lion-input-file:allowedFileSize', {
      maxSize: maxFileSizeFormatted,
    });
  } else if (!arrayLength) {
    return localize.msg('lion-input-file:allowedFileValidatorSimple', {
      allowedType: lastItem,
      maxSize: maxFileSizeFormatted,
    });
  } else {
    return localize.msg('lion-input-file:allowedFileValidatorComplex', {
      allowedTypesArray: array.join(', '),
      allowedTypesLastItem: lastItem,
      maxSize: maxFileSizeFormatted,
    });
  }
}

IsAllowedFile.getMessage = async data => {
  await forMessagesToBeReady();
  const { type, outcome } = data;

  // if (outcome === 'too-long') {
  //   // TODO: get max-length of country and use MaxLength validator
  //   return localize.msg(`lion-validate:${type}.Pattern`, data);
  // }
  // if (outcome === 'too-short') {
  //   // TODO: get min-length of country and use MinLength validator
  //   return localize.msg(`lion-validate:${type}.Pattern`, data);
  // }
  // // TODO: add a more specific message here
  // if (outcome === 'invalid-country-code') {
  //   return localize.msg(`lion-validate:${type}.Pattern`, data);
  // }
  // return localize.msg(`lion-validate:${type}.Pattern`, data);
};
