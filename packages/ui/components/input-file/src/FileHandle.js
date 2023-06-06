import { IsAcceptedFile } from './validators.js';

/**
 * @typedef {import('../types/input-file.js').SystemFile} SystemFile
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
   * @param {{ allowedFileTypes: Array<string>; allowedFileExtensions: Array<string>; maxFileSize: number; }} _acceptCriteria
   */
  constructor(systemFile, _acceptCriteria) {
    /**
     * @type {Array<string>}
     */
    this.failedProp = [];
    this.systemFile = systemFile;
    this._acceptCriteria = _acceptCriteria;
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
    if (this._acceptCriteria.allowedFileExtensions.length) {
      const fileExtension = this._getFileNameExtension(this.systemFile.name);
      if (
        !IsAcceptedFile.isExtensionAllowed(
          fileExtension,
          this._acceptCriteria.allowedFileExtensions,
        )
      ) {
        this.status = UPLOAD_FILE_STATUS.fail;
        this.failedProp.push(FILE_FAILED_PROP.type);
      }
    } else if (this._acceptCriteria.allowedFileTypes.length) {
      const fileType = this.systemFile.type;
      if (!IsAcceptedFile.isFileTypeAllowed(fileType, this._acceptCriteria.allowedFileTypes)) {
        this.status = UPLOAD_FILE_STATUS.fail;
        this.failedProp.push(FILE_FAILED_PROP.type);
      }
    }

    if (IsAcceptedFile.checkFileSize(this.systemFile.size, this._acceptCriteria.maxFileSize)) {
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
