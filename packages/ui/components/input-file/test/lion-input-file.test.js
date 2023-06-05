import '@lion/ui/define/lion-input-file.js';
import { Required } from '@lion/ui/form-core.js';
import { getInputMembers } from '@lion/ui/input-test-helpers.js';
import { expect, fixture as _fixture, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';

/**
 * @typedef {import('../src/LionInputFile.js').LionInputFile} LionInputFile
 * @typedef {import('../types/input-file.js').InputFile} InputFile
 * @typedef {import('../types/input-file.js').SystemFile} SystemFile
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputFile>} */ (_fixture);

const filesListChanged = (/** @type {LionInputFile} */ el, /** @type { CustomEvent } */ ev) => {
  // eslint-disable-next-line no-param-reassign
  el._fileSelectResponse = [...ev.detail.newFiles];
};

function mimicSelectFile(
  /** @type {LionInputFile} */ formControl,
  /** @type {InputFile[]}  */ mockFiles,
) {
  // @ts-expect-error [allow-protected-in-tests]
  formControl._processFiles(mockFiles);
  // TODO: doesn't this set latest file.name only to formControl._inputNode.value?
  mockFiles.forEach(file => {
    // @ts-expect-error [allow-protected-in-tests]
    Object.defineProperty(formControl._inputNode, 'value', {
      value: `C:\\fakepath\\${file.name}`,
      writable: true,
    });
  });
  // @ts-expect-error [allow-protected-in-tests]
  Object.defineProperty(formControl._inputNode, 'files', { value: mockFiles, writable: true });
  // @ts-expect-error [allow-protected-in-tests]
  formControl._inputNode.dispatchEvent(new Event('input', { bubbles: true }));
}

const file = /** @type {InputFile} */ (
  new File(['foo'], 'foo.txt', {
    type: 'text/plain',
  })
);
const file2 = /** @type {InputFile} */ (
  new File(['bar'], 'bar.txt', {
    type: 'text/plain',
  })
);
const file3 = /** @type {InputFile} */ (
  new File(['foo3'], 'foo3.txt', {
    type: 'text/plain',
  })
);
const file4 = /** @type {InputFile} */ (
  new File(['foo4'], 'foo4.txt', {
    type: 'text/plain',
  })
);

describe('lion-input-file', () => {
  it('has a type of "file"', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);
    // @ts-expect-error [allow-protected-in-tests]
    const { _inputNode } = getInputMembers(el);
    expect(_inputNode.type).to.equal('file');
  });

  it('should add single file and dispatch "file-list-changed" event with newly added file', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    const fileListChangedEventPromise = oneEvent(el, 'file-list-changed');
    mimicSelectFile(el, [file]);
    const fileListChangedEvent = await fileListChangedEventPromise;
    // @ts-expect-error [allow-protected-in-tests]
    expect(el._selectedFilesMetaData.length).to.equal(1);
    expect(el._fileSelectResponse.length).to.equal(1);

    expect(fileListChangedEvent).to.exist;
    expect(fileListChangedEvent.detail.newFiles.length).to.equal(1);
    expect(fileListChangedEvent.detail.newFiles[0].name).to.equal('foo.txt');
  });

  it('should select 1 file', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);
    // @ts-expect-error [allow-protected-in-test]
    const processedFilesSpy = sinon.spy(el, '_processFiles');

    // @ts-expect-error [allow-protected-in-test]
    await el._onChange({ target: { files: [file] } });
    expect(processedFilesSpy).have.been.calledOnce;
    processedFilesSpy.restore();
  });

  it('should retain selected file when "Cancel" button is clicked in system file explorer dialog', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    mimicSelectFile(el, [file]);

    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData.length).to.equal(1);
    expect(el._fileSelectResponse.length).to.equal(1);

    // when cancel is clicked, native input value is blank which means modelValue is blank
    el.modelValue = [];

    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData.length).to.equal(1);
  });

  it('has an attribute focused when focused', async () => {
    const el = await fixture(html` <lion-input-file label="Select"></lion-input-file> `);

    // @ts-expect-error [allow-protected-in-test]
    el._buttonNode.focus();
    await el.updateComplete;
    expect(el.hasAttribute('focused')).to.be.true;

    // @ts-expect-error [allow-protected-in-test]
    el._buttonNode.blur();
    await el.updateComplete;
    expect(el.hasAttribute('focused')).to.be.false;
  });

  it('should set touched property true on change', async () => {
    const el = await fixture(html` <lion-input-file label="Select"></lion-input-file> `);
    expect(el.touched).to.be.false;

    // @ts-expect-error [allow-protected-in-test]
    await el._onChange({ target: { files: [file] } });
    expect(el.touched).to.be.true;
  });

  it('should replace previous file when new file is selected', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    mimicSelectFile(el, [file]);
    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData.length).to.equal(1);
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('foo.txt');

    mimicSelectFile(el, [file2]);
    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData.length).to.equal(1);
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('bar.txt');
  });

  describe('invalid file types', async () => {
    const fileWrongType = /** @type {InputFile} */ (
      new File(['foobar'], 'foobar.txt', {
        type: 'xxxxx',
      })
    );

    it('should not be added to the selected list', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/plain"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].failedProp?.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].validationFeedback).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].status).to.equal('FAIL');
      expect(el._fileSelectResponse[0].status).to.equal('FAIL');
    });

    it('error message should use main type when "/*" is used', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/*"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a(n) text file with max 500MB.');
      });
    });

    it('error message should use main type when "text/plain" is used', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/plain"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a(n) text file with max 500MB.');
      });
    });

    it('error message should use sub type when e.g. "text/html" is used', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/html"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a(n) .html file with max 500MB.');
      });
    });

    it('error message should use the first sub type when e.g. "image/svg+xml" is used', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="image/svg+xml"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a(n) .svg file with max 500MB.');
      });
    });

    it('can reflect multiple types in the error message', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/html, text/csv"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a .html or .csv file with max 500MB.');
      });
    });

    it('can reflect multiple types in the error message also with a space " "', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/html,text/csv"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a .html or .csv file with max 500MB.');
      });
    });

    it('can reflect multiple types in the error message with preference to extensions', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept=".jpg,image/svg+xml"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.deep.equal('Please select a(n) .jpg file with max 500MB.');
      });
    });
  });

  describe('invalid file extensions', async () => {
    const fileWrongType = /** @type {InputFile} */ (
      new File(['foobar'], 'foobar.txt', {
        type: 'xxxxx',
      })
    );

    it('should not be added to the selected list', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept=".jpg, .png, .pdf"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].failedProp?.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].validationFeedback).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].status).to.equal('FAIL');
      expect(el._fileSelectResponse[0].status).to.equal('FAIL');
    });

    it('error message should add the file extension to the validator message', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept=".jpg"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.equal('Please select a(n) .jpg file with max 500MB.');
      });
    });

    it('error message should add all file extensions to the validator message', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept=".jpg, .png, .pdf"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 500MB.');
      });
    });

    it('error message should add all file extensions to the validator message also works without spaces " "', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept=".jpg,.png,.pdf"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 500MB.');
      });
    });

    it('error message should add all file extensions to the validator message also works without dots "."', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="jpg, png, pdf"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 500MB.');
      });
    });
  });

  describe('invalid file sizes', async () => {
    // Size of this file is 4 bytes
    const fileWrongSize = /** @type {InputFile} */ (new File(['foobar'], 'foobar.txt'));

    it('should not be added to the selected list', async () => {
      const el = await fixture(html` <lion-input-file max-file-size="2"></lion-input-file> `);

      mimicSelectFile(el, [fileWrongSize]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].failedProp?.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].validationFeedback).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].status).to.equal('FAIL');
      expect(el._fileSelectResponse[0].status).to.equal('FAIL');
    });

    it('error message should show only the max file size if no type/extension restrictions are defined', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" max-file-size="2"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongSize]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.equal('Please select a file with max 2 bytes.');
      });
    });

    it('error message should show the correct max file size if type/extension restrictions are defined', async () => {
      const el = await fixture(html`
        <lion-input-file
          label="Select"
          max-file-size="2"
          accept=".jpg, .png, .pdf"
        ></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongSize]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      el._selectedFilesMetaData[0].validationFeedback?.forEach(error => {
        expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 2 bytes.');
      });
    });
  });

  it('should send "file-list-changed" event if selecting files succeeded partially', async () => {
    const el = await fixture(html`<lion-input-file multiple max-file-size="3"></lion-input-file>`);

    // Size of this file is 4 bytes
    const fileWrongSize = /** @type {InputFile} */ (new File(['foobar'], 'foobar.txt'));

    setTimeout(() => {
      mimicSelectFile(el, [fileWrongSize, file2]);
    });

    const fileListChangedEvent = await oneEvent(el, 'file-list-changed');

    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData.length).to.equal(2);
    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData[0].status).to.equal('FAIL');
    expect(el._fileSelectResponse[0].status).to.equal('FAIL');

    expect(fileListChangedEvent.detail.newFiles.length).to.equal(1);
  });

  it('should update downloadurl for successful files', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    setTimeout(() => {
      mimicSelectFile(el, [file]);
    });
    const fileListChangedEvent = await oneEvent(el, 'file-list-changed');
    filesListChanged(el, fileListChangedEvent);

    // @ts-expect-error [allow-protected-in-test]
    expect(el._selectedFilesMetaData[0].downloadUrl).to.exist;
  });

  describe('format', () => {
    it('modelValue is an array of files', async () => {
      const el = await fixture(html` <lion-input-file name="select"></lion-input-file> `);

      mimicSelectFile(el, [file]);
      await el.updateComplete;
      expect(el.modelValue).to.deep.equal([file]);
    });

    it('view value is a string', async () => {
      const el = await fixture(html` <lion-input-file name="select"></lion-input-file> `);

      mimicSelectFile(el, [file]);
      await el.updateComplete;

      expect(el.value).to.equal('C:\\fakepath\\foo.txt');
      // @ts-expect-error [allow-protected-in-tests]
      expect(el._inputNode.value).to.equal('C:\\fakepath\\foo.txt');
    });

    it('formattedValue is a string', async () => {
      const el = await fixture(html` <lion-input-file name="select"></lion-input-file> `);

      mimicSelectFile(el, [file]);
      await el.updateComplete;

      expect(el.formattedValue).to.equal('C:\\fakepath\\foo.txt');
    });

    it('serializedValue is an array of files', async () => {
      const el = await fixture(html` <lion-input-file name="select"></lion-input-file> `);

      mimicSelectFile(el, [file]);
      await el.updateComplete;
      expect(el.serializedValue).to.deep.equal([file]);
    });

    it('fires `model-value-changed` for every programmatic modelValue change', async () => {
      const el = await fixture(html` <lion-input-file name="select"></lion-input-file> `);
      let counter = 0;
      let isTriggeredByUser = false;

      el.addEventListener('model-value-changed', event => {
        counter += 1;
        isTriggeredByUser = /** @type {CustomEvent} */ (event).detail.isTriggeredByUser;
      });

      el.modelValue = [file];
      expect(counter).to.equal(1);
      expect(isTriggeredByUser).to.be.false;

      // TODO: should no change mean no event?
      // el.modelValue = [file];
      // expect(counter).to.equal(1);

      el.modelValue = [file, file2];
      expect(counter).to.equal(2);
    });

    it('fires `model-value-changed` for every user input, adding `isTriggeredByUser` in event detail', async () => {
      const el = await fixture(html` <lion-input-file name="select"></lion-input-file> `);
      let counter = 0;
      let isTriggeredByUser = false;

      el.addEventListener('model-value-changed', event => {
        counter += 1;
        isTriggeredByUser = /** @type {CustomEvent} */ (event).detail.isTriggeredByUser;
      });

      mimicSelectFile(el, [file]);
      await el.updateComplete;
      expect(counter).to.equal(1);
      expect(isTriggeredByUser).to.be.true;

      mimicSelectFile(el, [file, file2]);
      await el.updateComplete;
      expect(counter).to.equal(2);
    });
  });

  describe('multiple file select', () => {
    it('should add multiple files', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" .multiple="${true}"> </lion-input-file>
      `);

      mimicSelectFile(el, [file, file2]);

      await el.updateComplete;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(2);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('foo.txt');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[1].systemFile.name).to.equal('bar.txt');

      expect(el._fileSelectResponse.length).to.equal(2);
      expect(el._fileSelectResponse[0].name).to.equal('foo.txt');
      expect(el._fileSelectResponse[1].name).to.equal('bar.txt');
    });

    it('should add new files and retain previous files', async () => {
      const el = await fixture(html` <lion-input-file .multiple="${true}"></lion-input-file> `);

      setTimeout(() => {
        mimicSelectFile(el, [file, file2]);
      });
      const fileListChangedEvent = await oneEvent(el, 'file-list-changed');
      filesListChanged(el, fileListChangedEvent);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(2);

      setTimeout(() => {
        mimicSelectFile(el, [file3, file4]);
      });
      const fileListChangedEvent1 = await oneEvent(el, 'file-list-changed');
      filesListChanged(el, fileListChangedEvent1);
      await el.updateComplete;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(4);
    });

    it('should add multiple files and dispatch file-list-changed event ONLY with newly added file', async () => {
      const el = await fixture(html` <lion-input-file .multiple="${true}"></lion-input-file> `);

      setTimeout(() => {
        mimicSelectFile(el, [file, file2]);
      });
      const fileListChangedEvent = await oneEvent(el, 'file-list-changed');
      filesListChanged(el, fileListChangedEvent);

      setTimeout(() => {
        mimicSelectFile(el, [file3, file4]);
      });

      const fileListChangedEvent1 = await oneEvent(el, 'file-list-changed');
      filesListChanged(el, fileListChangedEvent1);

      expect(fileListChangedEvent1).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(4);
      expect(fileListChangedEvent1.detail.newFiles.length).to.equal(2);
      expect(fileListChangedEvent1.detail.newFiles[0].name).to.equal('foo3.txt');
      expect(fileListChangedEvent1.detail.newFiles[1].name).to.equal('foo4.txt');
    });

    it('should not allow duplicate files to be selected and show notification message', async () => {
      const el = await fixture(html` <lion-input-file .multiple="${true}"></lion-input-file> `);

      setTimeout(() => {
        mimicSelectFile(el, [file]);
      });

      // create condition to also show the feedback
      el.prefilled = true;
      const fileListChangedEvent = await oneEvent(el, 'file-list-changed');

      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('foo.txt');

      expect(fileListChangedEvent).to.exist;
      expect(fileListChangedEvent.detail.newFiles.length).to.equal(1);
      expect(fileListChangedEvent.detail.newFiles[0].name).to.equal('foo.txt');

      const fileDuplicate = /** @type {InputFile} */ (
        new File(['foo'], 'foo.txt', {
          type: 'text/plain',
        })
      );

      mimicSelectFile(el, [fileDuplicate]);
      await el.updateComplete;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      expect(el.hasFeedbackFor).to.deep.equals(['info'], 'hasFeedbackFor');
      expect(el.showsFeedbackFor).to.deep.equals(['info'], 'showsFeedbackFor');
    });

    it('should add valid files and skip invalid ones', async () => {
      const fileWrongSize = /** @type {InputFile} */ (new File(['foobar'], 'foobar.txt'));
      const fileWrongType = /** @type {InputFile} */ (
        new File(['foobar'], 'foobar.txt', {
          type: 'xxxxx',
        })
      );

      const el = await fixture(
        html` <lion-input-file multiple max-file-size="3" accept=".txt"></lion-input-file> `,
      );

      setTimeout(() => {
        mimicSelectFile(el, [file, fileWrongSize, file2, fileWrongType]);
      });

      const fileListChangedEvent = await oneEvent(el, 'file-list-changed');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(4);
      expect(fileListChangedEvent).to.exist;
      expect(fileListChangedEvent.detail.newFiles.length).to.equal(2);
      expect(fileListChangedEvent.detail.newFiles[0].name).to.equal('foo.txt');
      expect(fileListChangedEvent.detail.newFiles[1].name).to.equal('bar.txt');
    });
  });

  describe('status and error', () => {
    /**
     * @type {LionInputFile}
     */
    let el;
    beforeEach(async () => {
      el = await fixture(html`<lion-input-file accept="text/plain"></lion-input-file>`);
    });

    it('should set _fileSelectResponse data to _selectedFilesMetaData for rendering error and status', async () => {
      mimicSelectFile(el, [file]);

      el._fileSelectResponse = [{ name: 'foo.txt', status: 'LOADING', errorMessage: '500' }];

      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].status).to.equal('LOADING');
      // @ts-ignore
      expect(el._selectedFilesMetaData[0].validationFeedback[0].message).to.equal('500');
    });

    it('should not fire file-list-changed event if invalid file is selected', async () => {
      const filePdf = /** @type {InputFile} */ (
        new File(['foo'], 'foo.pdf', {
          type: 'application/pdf',
        })
      );
      // @ts-ignore
      const fileListChangedSpy = sinon.spy(el, '_dispatchFileListChangeEvent');

      mimicSelectFile(el, [filePdf]);

      expect(fileListChangedSpy).have.not.been.called;
      fileListChangedSpy.restore();
    });

    it('updates showFeedbackFor when a wrong file has been added/removed', async () => {
      const fileWrongType = /** @type {InputFile} */ (
        new File(['foobar'], 'foobar.txt', {
          type: 'xxxxx',
        })
      );

      // create condition to also show the feedback
      el.prefilled = true;

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;
      expect(el.hasFeedbackFor).to.deep.equals(['error'], 'hasFeedbackFor');
      expect(el.showsFeedbackFor).to.deep.equals(['error'], 'showsFeedbackFor');

      // on change the showsFeedbackFor should be empty again
      mimicSelectFile(el, [file]);
      await el.updateComplete;
      expect(el.hasFeedbackFor).to.deep.equals([]);
      expect(el.showsFeedbackFor).to.deep.equals([]);
    });
  });

  describe('validations when used with lion-form', () => {
    it('should throw error with Required validator', async () => {
      const el = await fixture(html`
        <lion-input-file
          name="myFileInput"
          .validators="${[new Required({}, { getMessage: () => 'FooBar' })]}"
        >
        </lion-input-file>
      `);

      el.touched = true;
      el.dirty = true;
      await el.updateComplete;
      await el.feedbackComplete;
      // @ts-ignore input type="file" is a specific input member
      const { _feedbackNode } = getInputMembers(el);
      expect(_feedbackNode.feedbackData?.[0].message).to.equal('FooBar');
      expect(el.hasFeedbackFor.includes('error')).to.be.true;
    });

    it('reset method should remove File from modelValue but keep _fileSelectResponse', async () => {
      const _fileSelectResponse = [
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          downloadUrl: '/downloadFile',
        },
      ];
      const el = await fixture(html`
        <lion-input-file
          label="Select"
          ._fileSelectResponse="${_fileSelectResponse}"
        ></lion-input-file>
      `);

      // @ts-expect-error [allow-protected-in-test]
      el._fileSelectResponse = _fileSelectResponse;
      await el.updateComplete;

      mimicSelectFile(el, [file]);
      await el.updateComplete;

      await el.reset();
      expect(el.modelValue).to.deep.equal([]);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData).to.deep.equal([]);
      expect(el._fileSelectResponse).to.deep.equal(_fileSelectResponse);
    });

    it('clear method should remove File from modelValue and _fileSelectResponse', async () => {
      const _fileSelectResponse = [
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          downloadUrl: '/downloadFile',
        },
      ];
      const el = await fixture(html` <lion-input-file label="Select"></lion-input-file> `);

      // @ts-expect-error [allow-protected-in-test]
      el._fileSelectResponse = _fileSelectResponse;

      setTimeout(() => {
        mimicSelectFile(el, [file]);
      });
      await oneEvent(el, 'file-list-changed');
      await el.clear();
      expect(el.modelValue).to.deep.equal([]);
      expect(el._fileSelectResponse).to.deep.equal([]);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData).to.deep.equal([]);
    });
  });

  describe('file select component with prefilled state', () => {
    /**
     * @type {LionInputFile}
     */
    let el;
    const _fileSelectResponse = [
      {
        name: 'file1.txt',
        status: 'SUCCESS',
        errorMessage: '',
        downloadUrl: '/downloadFile',
      },
      {
        name: 'file2.txt',
        status: 'FAIL',
        errorMessage: 'something went wrong',
      },
    ];

    beforeEach(async () => {
      el = await fixture(html`
        <lion-input-file name="myFiles" multiple="${true}"> </lion-input-file>
      `);

      // @ts-expect-error [allow-protected-in-test]
      el._fileSelectResponse = _fileSelectResponse;

      await el.updateComplete;
    });

    it('should update the _selectedFilesMetaData according to _fileSelectResponse', () => {
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(2);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('file1.txt');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].status).to.equal('SUCCESS');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].downloadUrl).to.equal('/downloadFile');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[1].validationFeedback[0].message).to.equal(
        'something went wrong',
      );
    });

    it('should remove file on click of cross button', async () => {
      /**
       * @type {Partial<InputFile>}
       */
      const removedFile = {
        name: 'file2.txt',
        status: 'FAIL',
        systemFile: { name: 'file2.txt' },
        response: { name: 'file2.txt', status: 'FAIL' },
      };
      // @ts-expect-error [allow-protected-in-test]
      const removeFileSpy = sinon.spy(el, '_removeFile');

      // assertion for displayed file list to be same
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(2);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[1].systemFile.name).to.equal('file2.txt');

      el.dispatchEvent(
        new CustomEvent('file-remove-requested', {
          composed: true,
          bubbles: true,
          detail: {
            removedFile,
            status: removedFile.status,
            _fileSelectResponse: removedFile.response,
          },
        }),
      );

      await el.updateComplete;
      expect(removeFileSpy).have.been.calledOnce;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      removeFileSpy.restore();
    });

    it('should fire file-removed event with _fileSelectResponse in the details', async () => {
      /**
       * @type {Partial<InputFile>}
       */
      const removedFile = {
        name: 'file2.txt',
        status: 'FAIL',
        systemFile: { name: 'file2.txt' },
        response: { name: 'file2.txt', status: 'FAIL' },
      };

      setTimeout(() => {
        // @ts-ignore ignore file typing
        el._removeFile(removedFile);
      });

      await el.updateComplete;

      const removeFileEvent = await oneEvent(el, 'file-removed');

      // assertion for event data
      expect(removeFileEvent).to.exist;
      expect(removeFileEvent.detail.removedFile).to.deep.equal({
        name: 'file2.txt',
        status: 'FAIL',
        systemFile: {
          name: 'file2.txt',
        },
        response: {
          name: 'file2.txt',
          status: 'FAIL',
        },
      });
      expect(removeFileEvent.detail.status).to.deep.equal('FAIL');
      expect(removeFileEvent.detail._fileSelectResponse).to.deep.equal({
        name: 'file2.txt',
        status: 'FAIL',
      });
    });
  });

  describe('drag and drop', () => {
    /**
     * @type {LionInputFile}
     */
    let el;
    beforeEach(async () => {
      el = await fixture(html`
        <lion-input-file name="myFiles" multiple enable-drop-zone></lion-input-file>
      `);

      await el.updateComplete;
    });

    it('should set "is-dragging" on dragenter', async () => {
      const dropzone = el.shadowRoot?.querySelector('.input-file__drop-zone');
      dropzone?.dispatchEvent(new Event('dragenter', { bubbles: true }));
      expect(el.hasAttribute('is-dragging')).to.equal(true);
    });

    it('should set "is-dragging" on dragover', async () => {
      const dropzone = el.shadowRoot?.querySelector('.input-file__drop-zone');
      dropzone?.dispatchEvent(new Event('dragover', { bubbles: true }));
      expect(el.hasAttribute('is-dragging')).to.equal(true);
    });

    it('should remove "is-dragging" on dragleave', async () => {
      const dropzone = el.shadowRoot?.querySelector('.input-file__drop-zone');
      dropzone?.dispatchEvent(new Event('dragenter', { bubbles: true }));
      await el.updateComplete;

      dropzone?.dispatchEvent(new Event('dragleave', { bubbles: true }));
      expect(el.hasAttribute('is-dragging')).to.equal(false);
    });

    it('should remove "is-dragging" on drop', async () => {
      const dropzone = el.shadowRoot?.querySelector('.input-file__drop-zone');
      dropzone?.dispatchEvent(new Event('dragenter', { bubbles: true }));
      await el.updateComplete;

      window.dispatchEvent(new Event('drop', { bubbles: true }));
      expect(el.hasAttribute('is-dragging')).to.equal(false);
    });

    it('should call _processFiles method', async () => {
      const list = new DataTransfer();
      // @ts-ignore
      list.items.add(file);
      const droppedFiles = list.files;
      // @ts-ignore
      const _processFilesSpy = sinon.spy(el, '_processFiles');

      // @ts-expect-error [allow-protected-in-test]
      await el._processDroppedFiles({
        // @ts-ignore
        dataTransfer: { files: droppedFiles, items: [{ name: 'test.txt' }] },
        preventDefault: () => {},
      });

      expect(_processFilesSpy).have.been.calledOnce;
      _processFilesSpy.restore();
    });
  });

  describe('uploadOnSelect as true', () => {
    it('should not remove file on click of cross button and fire file-removed event', async () => {
      /**
       * @type {Partial<InputFile>}
       */
      const removeFile = {
        name: 'foo.txt',
        status: 'SUCCESS',
        systemFile: { name: 'foo.txt' },
        response: { name: 'foo.txt', status: 'SUCCESS' },
      };

      const el = await fixture(html`
        <lion-input-file .uploadOnSelect="${true}"> </lion-input-file>
      `);

      el.modelValue = [file];
      mimicSelectFile(el, [file]);

      await el.updateComplete;

      setTimeout(() => {
        // @ts-ignore ignore file typing
        el._removeFile(removeFile);
      });

      const removeFileEvent = await oneEvent(el, 'file-removed');

      // assertion for displayed file list to be same
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('foo.txt');

      // assertion for event data
      expect(removeFileEvent).to.exist;
      expect(removeFileEvent.detail.removedFile).to.deep.equal({
        name: 'foo.txt',
        status: 'SUCCESS',
        systemFile: {
          name: 'foo.txt',
        },
        response: {
          name: 'foo.txt',
          status: 'SUCCESS',
        },
      });
      expect(removeFileEvent.detail.status).to.deep.equal('SUCCESS');
      expect(removeFileEvent.detail._fileSelectResponse).to.deep.equal({
        name: 'foo.txt',
        status: 'SUCCESS',
      });
    });

    it('should remove file from displayed list if not available in _fileSelectResponse array', async () => {
      const _fileSelectResponse = [
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          downloadUrl: '/downloadFile',
        },
        {
          name: 'file2.txt',
          status: 'FAIL',
          errorMessage: 'something went wrong',
        },
      ];

      const el = await fixture(html`
        <lion-input-file label="Select" .uploadOnSelect="${true}"> </lion-input-file>
      `);

      // @ts-expect-error [allow-protected-in-test]
      el._fileSelectResponse = _fileSelectResponse;

      await el.updateComplete;
      // assertion for displayed file list to be same
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(2);
      el._fileSelectResponse = [
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          downloadUrl: '/downloadFile',
        },
      ];
      await el.updateComplete;
      // assertion for displayed file list to be same
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._selectedFilesMetaData[0].systemFile.name).to.equal('file1.txt');
      // @ts-expect-error [allow-protected-in-tests]
      expect(el._inputNode.value).to.equal('');
    });
  });

  describe('Accessibility', async () => {
    it('is accessible', async () => {
      const el = await fixture(html`<lion-input-file label="Select"></lion-input-file>`);
      await expect(el).to.be.accessible();
    });

    it('is accessible when a file is selected', async () => {
      const _fileSelectResponse = [
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          downloadUrl: '/downloadFile',
        },
      ];
      const el = await fixture(html` <lion-input-file label="Select"></lion-input-file>`);

      // @ts-expect-error [allow-protected-in-test]
      el._fileSelectResponse = _fileSelectResponse;

      await expect(el).to.be.accessible();
    });

    it('is accessible with an selected file and disabled', async () => {
      const _fileSelectResponse = [
        {
          name: 'file1.txt',
          status: 'SUCCESS',
          errorMessage: '',
          downloadUrl: '/downloadFile',
        },
      ];

      const el = await fixture(html` <lion-input-file label="Select" disabled></lion-input-file> `);

      // @ts-expect-error [allow-protected-in-test]
      el._fileSelectResponse = _fileSelectResponse;

      await expect(el).to.be.accessible();
    });

    describe('has correct aria-roles', async () => {
      it('select-button has aria-labelledby set to itself and the label', async () => {
        const el = await fixture(html` <lion-input-file label="Select"></lion-input-file> `);
        // @ts-expect-error [allow-protected-in-test]
        expect(el._buttonNode?.getAttribute('aria-labelledby')).to.contain(
          // @ts-expect-error [allow-protected-in-test]
          `select-button-${el._inputId}`,
        );
        // @ts-expect-error [allow-protected-in-test]
        expect(el._buttonNode?.getAttribute('aria-labelledby')).to.contain(
          // @ts-expect-error [allow-protected-in-test]
          `label-${el._inputId}`,
        );
      });

      it('select-button has aria-describedby set to the help-text, selected list and the feedback message', async () => {
        const _fileSelectResponse = [
          {
            name: 'file1.txt',
            status: 'SUCCESS',
            errorMessage: '',
            downloadUrl: '/downloadFile',
          },
        ];
        const el = await fixture(html`
          <lion-input-file label="Select" help-text="foo"></lion-input-file>
        `);

        // @ts-expect-error [allow-protected-in-test]
        el._fileSelectResponse = _fileSelectResponse;

        // @ts-expect-error [allow-protected-in-test]
        expect(el._buttonNode?.getAttribute('aria-describedby')).to.contain(
          // @ts-expect-error [allow-protected-in-test]
          `help-text-${el._inputId}`,
        );
        // @ts-expect-error [allow-protected-in-test]
        expect(el._buttonNode?.getAttribute('aria-describedby')).to.contain(
          // @ts-expect-error [allow-protected-in-test]
          `feedback-${el._inputId}`,
        );
        await el.updateComplete;
        // @ts-expect-error [allow-protected-in-test]
        expect(el._buttonNode?.getAttribute('aria-describedby')).to.contain(
          // @ts-expect-error [allow-protected-in-test]
          `selected-file-list-${el._inputId}`,
        );
      });
    });
  });
});
