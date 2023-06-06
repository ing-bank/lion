import { IsAllowedFile } from './validators.js';

/**
 * @typedef {import('../types/index.js').SystemFile} SystemFile
 */

// Do these global constants add value? They are only used in this file
// Typing filehandle would be enough

/**
 * 500MB in bytes
 */
export const MAX_FILE_SIZE = 524288000;

/**
 * @typedef {Object} property
 * @property {string} type
 * @property {string} size
 */
export const FILE_FAILED_PROP = {
  type: 'FILE_TYPE',
  size: 'FILE_SIZE',
};

export const UPLOAD_FILE_STATUS = {
  fail: 'FAIL',
  pass: 'SUCCESS',
};

export class FileHandle {
  /**
   * @param {SystemFile} systemFile
   * @param {{ allowedFileTypes: Array<string>; allowedFileExtensions: Array<string>; maxFileSize: number; }} _allowedFileCriteria
   */
  constructor(systemFile, _allowedFileCriteria) {
    /**
     * @type {Array<string>}
     */
    this.failedProp = [];
    this.systemFile = systemFile;
    this._allowedFileCriteria = _allowedFileCriteria;
    this.uploadFileStatus();
    if (this.failedProp.length === 0) {
      this.createDownloadUrl(systemFile);
    }
  }

  // TDOO: same util as in validators.js
  /**
   * @param {string} fileName
   * @return {string}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _getFileNameExtension(fileName) {
    return fileName.slice(fileName.lastIndexOf('.') + 1);
  }

  // TODO: seems to suggest upload is going on...
  // checks the file size and type to set failedProp property
  uploadFileStatus() {
    if (this._allowedFileCriteria.allowedFileExtensions.length) {
      const fileExtension = this._getFileNameExtension(this.systemFile.name);
      if (
        !IsAllowedFile.isExtensionAllowed(
          fileExtension,
          this._allowedFileCriteria.allowedFileExtensions,
        )
      ) {
        this.status = UPLOAD_FILE_STATUS.fail;
        this.failedProp.push(FILE_FAILED_PROP.type);
      }
    } else if (this._allowedFileCriteria.allowedFileTypes.length) {
      const fileType = this.systemFile.type;
      if (!IsAllowedFile.isFileTypeAllowed(fileType, this._allowedFileCriteria.allowedFileTypes)) {
        this.status = UPLOAD_FILE_STATUS.fail;
        this.failedProp.push(FILE_FAILED_PROP.type);
      }
    }

    if (
      IsAllowedFile.isBelowOrEqualToMaxSize(
        this.systemFile.size,
        this._allowedFileCriteria.maxFileSize,
      )
    ) {
      if (this.status !== UPLOAD_FILE_STATUS.fail) {
        this.status = UPLOAD_FILE_STATUS.pass;
      }
    } else {
      this.status = UPLOAD_FILE_STATUS.fail;
      this.failedProp.push(FILE_FAILED_PROP.size);
    }
  }

  /**
   * @param {SystemFile} file
   */
  createDownloadUrl(file) {
    // @ts-ignore
    this.downloadUrl = window.URL.createObjectURL(file);
  }
}
