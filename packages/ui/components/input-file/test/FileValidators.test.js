import { expect, fixture, html } from '@open-wc/testing';
import { MaxFileCount } from '@lion/ui/input-file.js';
import '@lion/ui/define/lion-input-file.js';
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

  describe('Max File Count', () => {
    /**
     *
     * @param {string} filename
     * @returns {File}
     */
    const newFile = filename => new File([], filename);

    it('Allow up to 2 files', () => {
      const validator = new MaxFileCount(2);
      expect(MaxFileCount.validatorName).to.equal('MaxFileCount');

      let isEnabled = validator.execute([newFile('file1.txt'), newFile('file2.txt')]);
      expect(isEnabled).to.be.false;

      isEnabled = validator.execute([
        newFile('file1.txt'),
        newFile('file2.txt'),
        newFile('file3.txt'),
      ]);
      expect(isEnabled).to.be.true;
    });

    it('Allow any number of files with empty param', () => {
      const validator = new MaxFileCount();
      const isEnabled = validator.execute([newFile('file1.txt'), newFile('file2.txt')]);
      expect(isEnabled).to.be.false;
    });

    it('provides a message with the max file count', async () => {
      // the lion-input-file namespace is loaded by the element
      const el = /** @type {import('@lion/ui/input-file.js').LionInputFile} */ (
        await fixture(html`<lion-input-file></lion-input-file>`)
      );
      await el.localizeNamespacesLoaded;
      expect(await MaxFileCount.getMessage({ params: 2 })).to.equal(
        'The number of uploaded files must not exceed 2.',
      );
    });

    it('provides a configuration hint as message for an invalid max file count', async () => {
      const hint = 'Invalid MaxFileCount parameter. Please provide a valid number greater than 0.';
      expect(await MaxFileCount.getMessage()).to.equal(hint);
      expect(await MaxFileCount.getMessage({ params: 0 })).to.equal(hint);
      expect(await MaxFileCount.getMessage({ params: '2' })).to.equal(hint);
    });
  });
});
