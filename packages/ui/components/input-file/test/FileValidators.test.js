import { expect } from '@open-wc/testing';
import { IsAcceptedFile } from '../src/validators.js';

describe('lion-input-file: IsAcceptedFile', () => {
  describe('valid file type', () => {
    it('should return false for allowed file extension .csv', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ name: 'foo.csv' }], {
        allowedFileExtensions: ['.csv'],
        allowedFileTypes: undefined,
      });
      expect(returnVal).to.be.false;
    });

    it('should return false for allowed file extension .csv and .pdf', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ name: 'foo.pdf' }], {
        allowedFileExtensions: ['.csv', '.pdf'],
        allowedFileTypes: undefined,
      });
      expect(returnVal).to.be.false;
    });

    it('should return true for not allowed file extension .csv and .pdf', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ name: 'foo.pdf' }], {
        allowedFileExtensions: ['.txt'],
        allowedFileTypes: undefined,
      });
      expect(returnVal).to.be.true;
    });

    it('should return false for valid file type for single file', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: 'foo' }], {
        allowedFileTypes: ['foo'],
      });

      expect(returnVal).to.be.false;
    });

    it('should return false for valid file type for multiple file', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: 'foo' }, { type: 'foo' }], {
        allowedFileTypes: ['foo'],
      });

      expect(returnVal).to.be.false;
    });

    it('should return false if no file types are defined, and has small file size', async () => {
      const fileTypeObj = new IsAcceptedFile();
      const returnVal = fileTypeObj.execute(
        [
          // @ts-ignore ignore file typing
          { type: 'foo', size: 1 },
          // @ts-ignore ignore file typing
          { type: 'foo', size: 1 },
        ],
        {
          allowedFileTypes: [],
          maxFileSize: 1028,
        },
      );

      expect(returnVal).to.be.false;
    });

    it('should return false for valid file type for multiple file and multiple allowed types', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: 'foo' }, { type: 'bar' }], {
        allowedFileTypes: ['foo', 'bar'],
      });

      expect(returnVal).to.be.false;
    });
  });

  describe('invalid file type', () => {
    it('should return true for invalid file type for single file', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: 'bar' }], {
        allowedFileTypes: ['foo'],
      });

      expect(returnVal).to.be.true;
    });

    it('should return false for invalid file type for multiple file', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: 'foo' }, { type: 'bar' }], {
        allowedFileTypes: ['foo'],
      });

      expect(returnVal).to.be.true;
    });

    it('should return false for invalid file type for multiple file and multiple allowed types', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: 'foo' }, { type: 'pdf' }], {
        allowedFileTypes: ['foo', 'bar'],
      });

      expect(returnVal).to.be.true;
    });

    it('should return true for invalid file type for empty type', async () => {
      const fileTypeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileTypeObj.execute([{ type: '' }], {
        allowedFileTypes: ['foo'],
      });

      expect(returnVal).to.be.true;
    });
  });

  describe('valid file size', () => {
    it('should return false for valid file size for single file', async () => {
      const fileSizeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileSizeObj.execute([{ size: 5 }], {
        maxFileSize: 10,
      });

      expect(returnVal).to.be.false;
    });

    it('should return false for valid file size for multiple file', async () => {
      const fileSizeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileSizeObj.execute([{ size: 5 }, { size: 9 }], {
        maxFileSize: 10,
      });

      expect(returnVal).to.be.false;
    });
  });

  describe('invalid file size', () => {
    it('should return true for invalid file size for single file', async () => {
      const fileSizeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileSizeObj.execute([{ size: 5 }], {
        maxFileSize: 3,
      });

      expect(returnVal).to.be.true;
    });

    it('should return false for invalid file size for multiple file', async () => {
      const fileSizeObj = new IsAcceptedFile();
      // @ts-ignore ignore file typing
      const returnVal = fileSizeObj.execute([{ size: 5 }, { size: 9 }], {
        maxFileSize: 7,
      });

      expect(returnVal).to.be.true;
    });
  });
});
