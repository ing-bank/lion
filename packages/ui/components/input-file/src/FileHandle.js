import { FileValidation } from './validators.js';

/**
 * @typedef {import('../types/input-file.js').SystemFile} SystemFile
 */

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
   * @param {{ allowedFileTypes: Array.<string>; allowedFileExtensions: Array.<string>; maxFileSize: number; }} fileLimit
   */
  constructor(systemFile, fileLimit) {
    /**
     * @type {Array.<string>}
     */
    this.failedProp = [];
    this.systemFile = systemFile;
    this.fileLimit = fileLimit;
    this.uploadFileStatus();
    if (this.failedProp.length === 0) {
      this.createDownloadUrl(systemFile);
    }
  }

  /**
   * @param {string} fileName
   * @return {string}
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _getFileNameExtension(fileName) {
    return fileName.slice(fileName.lastIndexOf('.') + 1);
  }

  // checks the file size and type to set failedProp property
  uploadFileStatus() {
    const fileValidation = new FileValidation();
    if (this.fileLimit.allowedFileExtensions.length !== 0) {
      const fileExtension = this._getFileNameExtension(this.systemFile.name);
      if (!fileValidation.isExtensionAllowed(fileExtension, this.fileLimit.allowedFileExtensions)) {
        this.status = UPLOAD_FILE_STATUS.fail;
        this.failedProp.push(FILE_FAILED_PROP.type);
      }
    } else if (this.fileLimit.allowedFileTypes.length !== 0) {
      const fileType = this.systemFile.type;
      if (!fileValidation.isFileTypeAllowed(fileType, this.fileLimit.allowedFileTypes)) {
        this.status = UPLOAD_FILE_STATUS.fail;
        this.failedProp.push(FILE_FAILED_PROP.type);
      }
    }

    if (fileValidation.checkFileSize(this.systemFile.size, this.fileLimit.maxFileSize)) {
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
