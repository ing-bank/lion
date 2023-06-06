import { expect } from '@open-wc/testing';
import { IsAllowedFile } from '../src/validators.js';
import { createModelValueFile } from '../src/LionInputFile.js';

describe('lion-input-file: IsAllowedFile', () => {
  describe('valid file type', () => {
    it('should return false for allowed file extension .csv', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foobar'], 'foobar.csv'))];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        extensions: ['.csv'],
        types: undefined,
      });
      expect(feedback).to.be.false;
    });

    it('should return false for allowed file extension .csv and .pdf', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foo'], 'foo.pdf'))];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        extensions: ['.csv', '.pdf'],
        types: undefined,
      });
      expect(feedback).to.be.false;
    });

    it('should return true for not allowed file extension .csv and .pdf', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foo'], 'foo.pdf'))];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        extensions: ['.txt'],
        types: undefined,
      });

      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['extension']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({
        extensions: ['.txt'],
        types: undefined,
      });
    });

    it('should return false for valid file type for single file', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'foo' }))];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo'],
      });

      expect(feedback).to.be.false;
    });

    it('should return false for valid file type for multiple file', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foo'], 'foo.pdf', { type: 'foo' })),
        createModelValueFile(new File(['bar'], 'bar.pdf', { type: 'foo' })),
      ];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo'],
      });

      expect(feedback).to.be.false;
    });

    it('should return failed outcome for valid file type for multiple file', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foo'], 'foo.pdf', { type: 'foo' })),
        createModelValueFile(new File(['foo2'], 'foo2.pdf', { type: 'foo' })),
      ];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo'],
      });

      expect(feedback).to.be.false;
    });

    it('should return false if no file types are defined, and has small file size', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foo'], 'foo.pdf', { type: 'foo' })),
        createModelValueFile(new File(['foo2'], 'foo2.pdf', { type: 'foo' })),
      ];
      Object.defineProperty(value[0], 'size', { value: 1, writable: true });
      Object.defineProperty(value[1], 'size', { value: 1, writable: true });

      const feedback = IsAllowedFileValidator.execute(value, {
        types: [],
        size: 1028,
      });

      expect(feedback).to.be.false;
    });

    it('should return false for valid file type for multiple file and multiple allowed types', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'foo' })),
        createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'bar' })),
      ];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo', 'bar'],
      });

      expect(feedback).to.be.false;
    });
  });

  describe('invalid file type', () => {
    it('should return true for invalid file type for single file', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'bar' }))];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo'],
      });

      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['type']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({
        types: ['foo'],
      });
    });

    it('should return false for invalid file type for multiple file', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'foo' })),
        createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'bar' })),
      ];

      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo'],
      });

      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['type']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({
        types: ['foo'],
      });
    });

    it('should return false for invalid file type for multiple file and multiple allowed types', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'foo' })),
        createModelValueFile(new File(['foobar'], 'foobar.txt', { type: 'pdf' })),
      ];
      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, {
        types: ['foo', 'bar'],
      });

      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['type']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({
        types: ['foo', 'bar'],
      });
    });

    it('should return true for invalid file type for empty type', async () => {
      const IsAllowedFileValidator = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foobar'], 'foobar.txt', { type: '' }))];
      // @ts-ignore ignore file typing
      const feedback = IsAllowedFileValidator.execute(value, { types: ['foo'] });
      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['type']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({ types: ['foo'] });
    });
  });

  describe('valid file size', () => {
    it('should return false for valid file size for single file', async () => {
      const fileSizeObj = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foobar'], 'foobar.txt'))];
      Object.defineProperty(value[0], 'size', { value: 5, writable: true });

      // @ts-ignore ignore file typing
      const feedback = fileSizeObj.execute(value, { size: 10 });
      expect(feedback).to.be.false;
    });

    it('should return false for valid file size for multiple file', async () => {
      const fileSizeObj = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foobar'], 'foobar.txt')),
        createModelValueFile(new File(['foobar'], 'foobar.txt')),
      ];
      Object.defineProperty(value[0], 'size', { value: 5, writable: true });
      Object.defineProperty(value[1], 'size', { value: 9, writable: true });

      // @ts-ignore ignore file typing
      const feedback = fileSizeObj.execute(value, {
        size: 10,
      });

      expect(feedback).to.be.false;
    });
  });

  describe('invalid file size', () => {
    it('should return true for invalid file size for single file', async () => {
      const fileSizeObj = new IsAllowedFile();
      const value = [createModelValueFile(new File(['foobar'], 'foobar.txt'))];
      Object.defineProperty(value[0], 'size', { value: 5, writable: true });

      // @ts-ignore ignore file typing
      const feedback = fileSizeObj.execute(value, { size: 3 });
      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['size']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({ size: 3 });
    });

    it('should return false for invalid file size for multiple file', async () => {
      const fileSizeObj = new IsAllowedFile();
      const value = [
        createModelValueFile(new File(['foobar'], 'foobar.txt')),
        createModelValueFile(new File(['foobar'], 'foobar.txt')),
      ];
      Object.defineProperty(value[0], 'size', { value: 5, writable: true });
      Object.defineProperty(value[1], 'size', { value: 9, writable: true });

      // @ts-ignore ignore file typing
      const feedback = fileSizeObj.execute(value, { size: 7 });

      expect(feedback.length).to.equal(1);
      expect(feedback[0].outcome.failedOn).to.deep.equal(['size']);
      expect(typeof feedback[0].id).to.equal('number');
      expect(feedback[0].meta.AllowedFileCriteria).to.deep.equal({ size: 7 });
    });
  });
});
