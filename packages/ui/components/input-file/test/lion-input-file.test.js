import '@lion/ui/define/lion-input-file.js';
import { Required } from '@lion/ui/form-core.js';
import { getInputMembers } from '@lion/ui/input-test-helpers.js';
import { expect, fixture as _fixture, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';

/**
 * @typedef {import('../src/LionInputFile.js').LionInputFile} LionInputFile
 * @typedef {import('../types/index.js').InputFile} InputFile
 * @typedef {import('../types/index.js').SystemFile} SystemFile
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionInputFile>} */ (_fixture);

const filesListChanged = (/** @type {LionInputFile} */ el, /** @type { CustomEvent } */ ev) => {
  // eslint-disable-next-line no-param-reassign
  el._fileSelectResponse = [...ev.detail.newFiles];
};

function mimicSelectFile(
  /** @type {LionInputFile} */ formControl,
  /** @type {File[]}  */ mockFiles,
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

  it('adds single file and dispatch "file-list-changed" event with newly added file', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    const fileListChangedEventPromise = oneEvent(el, 'file-list-changed');
    mimicSelectFile(el, [file]);
    const fileListChangedEvent = await fileListChangedEventPromise;
    // @ts-expect-error [allow-protected-in-tests]
    expect(el._fileViewList.length).to.equal(1);
    expect(el._fileSelectResponse.length).to.equal(1);

    expect(fileListChangedEvent).to.exist;
    expect(fileListChangedEvent.detail.newFiles.length).to.equal(1);
    expect(fileListChangedEvent.detail.newFiles[0].name).to.equal('foo.txt');
  });

  // TODO: we actually test whether a method is called on change
  it('selects 1 file', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);
    // @ts-expect-error [allow-protected-in-test]
    const processedFilesSpy = sinon.spy(el, '_processFiles');

    // @ts-expect-error [allow-protected-in-test]
    await el._onChange({ target: { files: [file] } });
    expect(processedFilesSpy).have.been.calledOnce;
    processedFilesSpy.restore();
  });

  // TODO: what is the purpose of this test?
  // Should the list view not always correspond with the value?
  it('retains selected file when "Cancel" button is clicked in system file explorer dialog', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    mimicSelectFile(el, [file]);

    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList.length).to.equal(1);
    expect(el._fileSelectResponse.length).to.equal(1);

    // when cancel is clicked, native input value is blank which means modelValue is blank
    el.modelValue = [];

    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList.length).to.equal(1);
  });

  it('has an attribute "focused" when button is focused', async () => {
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

  it('sets touched property true on change', async () => {
    const el = await fixture(html` <lion-input-file label="Select"></lion-input-file> `);
    expect(el.touched).to.be.false;

    // @ts-expect-error [allow-protected-in-test]
    await el._onChange({ target: { files: [file] } });
    expect(el.touched).to.be.true;
  });

  it('replaces previous file when new file is selected', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    mimicSelectFile(el, [file]);
    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList.length).to.equal(1);
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList[0].systemFile.name).to.equal('foo.txt');

    mimicSelectFile(el, [file2]);
    await el.updateComplete;
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList.length).to.equal(1);
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList[0].systemFile.name).to.equal('bar.txt');
  });

  describe('Invalid file types', async () => {
    const fileWrongType = /** @type {InputFile} */ (
      new File(['foobar'], 'foobar.txt', {
        type: 'xxxxx',
      })
    );

    // TODO: it seems that it IS actually added? (do we mean it's marked as failed?)
    it('will not be added to the selected list', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept="text/plain"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].failedProp?.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].validationFeedback).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].status).to.equal('FAIL');
      expect(el._fileSelectResponse[0].status).to.equal('FAIL');
    });

    describe('Error messages', () => {
      it('for "/*" uses main type ("text")', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="text/*"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.deep.equal('Please select a(n) text file with max 500MB.');
        });
      });

      it('for "text/plain", uses main type ("text")', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="text/plain"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.deep.equal('Please select a(n) text file with max 500MB.');
        });
      });

      it('for "text/html", uses sub type ("html")', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="text/html"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.deep.equal('Please select a(n) .html file with max 500MB.');
        });
      });

      it('for "image/svg+xml", uses first sub type (".svg")', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="image/svg+xml"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.deep.equal('Please select a(n) .svg file with max 500MB.');
        });
      });

      it('can reflect multiple types', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="text/html, text/csv"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal('Please select a .html or .csv file with max 500MB.');
        });
      });

      it('can reflect multiple types, also with a space " "', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="text/html,text/csv"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.deep.equal('Please select a .html or .csv file with max 500MB.');
        });
      });

      it('can reflect multiple types with preference to extensions', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept=".jpg,image/svg+xml"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.deep.equal('Please select a(n) .jpg file with max 500MB.');
        });
      });
    });
  });

  describe('Invalid file extensions', async () => {
    const fileWrongType = /** @type {InputFile} */ (
      new File(['foobar'], 'foobar.txt', {
        type: 'xxxxx',
      })
    );

    // TODO: it seems that it IS actually added? (do we mean it's marked as failed?)
    it('will not be added to the selected list', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" accept=".jpg, .png, .pdf"></lion-input-file>
      `);

      mimicSelectFile(el, [fileWrongType]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].failedProp?.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].validationFeedback).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].status).to.equal('FAIL');
      expect(el._fileSelectResponse[0].status).to.equal('FAIL');
    });

    describe('Error messages', () => {
      it('adds the file extension', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept=".jpg"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal('Please select a(n) .jpg file with max 500MB.');
        });
      });

      it('adds all file extensions', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept=".jpg, .png, .pdf"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 500MB.');
        });
      });

      it('adds all file extensions, also works without spaces " "', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept=".jpg,.png,.pdf"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 500MB.');
        });
      });

      it('adds all file extensions, also works without dots "."', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" accept="jpg, png, pdf"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongType]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal('Please select a .jpg, .png or .pdf file with max 500MB.');
        });
      });
    });
  });

  describe('Invalid file sizes', async () => {
    // Size of this file is 4 bytes
    const fileWrongSize = /** @type {InputFile} */ (new File(['foobar'], 'foobar.txt'));

    // TODO: it seems that it IS actually added? (do we mean it's marked as failed?)
    it('will not be added to the selected list', async () => {
      const el = await fixture(html` <lion-input-file max-file-size="2"></lion-input-file> `);

      mimicSelectFile(el, [fileWrongSize]);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].failedProp?.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].validationFeedback).to.exist;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].status).to.equal('FAIL');
      expect(el._fileSelectResponse[0].status).to.equal('FAIL');
    });

    describe('Error messages', () => {
      it('shows only the max file size if no type/extension restrictions are defined', async () => {
        const el = await fixture(html`
          <lion-input-file label="Select" max-file-size="2"></lion-input-file>
        `);

        mimicSelectFile(el, [fileWrongSize]);
        await el.updateComplete;

        // @ts-expect-error [allow-protected-in-test]
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal('Please select a file with max 2 bytes.');
        });
      });

      it('shows the correct max file size if type/extension restrictions are defined', async () => {
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
        el._fileViewList[0].validationFeedback?.forEach(error => {
          expect(error.message).to.equal(
            'Please select a .jpg, .png or .pdf file with max 2 bytes.',
          );
        });
      });
    });
  });

  it('sends "file-list-changed" event if selecting files succeeded partially', async () => {
    const el = await fixture(html`<lion-input-file max-file-size="2"></lion-input-file>`);

    // Size of this file is 4 bytes
    const fileWrongSize = /** @type {InputFile} */ (new File(['foobar'], 'foobar.txt'));

    setTimeout(() => {
      mimicSelectFile(el, [fileWrongSize, file2]);
    });

    const fileListChangedEvent = await oneEvent(el, 'file-list-changed');

    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList.length).to.equal(1);
    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList[0].status).to.equal('FAIL');
    expect(el._fileSelectResponse[0].status).to.equal('FAIL');

    expect(fileListChangedEvent.detail.newFiles.length).to.equal(1);
  });

  it('updates downloadUrl for successful files', async () => {
    const el = await fixture(html`<lion-input-file></lion-input-file>`);

    setTimeout(() => {
      mimicSelectFile(el, [file]);
    });
    const fileListChangedEvent = await oneEvent(el, 'file-list-changed');
    filesListChanged(el, fileListChangedEvent);

    // @ts-expect-error [allow-protected-in-test]
    expect(el._fileViewList[0].downloadUrl).to.exist;
  });

  describe('Format', () => {
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

  describe('Multiple file select', () => {
    it('adds multiple files', async () => {
      const el = await fixture(html`
        <lion-input-file label="Select" multiple> </lion-input-file>
      `);

      mimicSelectFile(el, [file, file2]);

      await el.updateComplete;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(2);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].systemFile.name).to.equal('foo.txt');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[1].systemFile.name).to.equal('bar.txt');

      expect(el._fileSelectResponse.length).to.equal(2);
      expect(el._fileSelectResponse[0].name).to.equal('foo.txt');
      expect(el._fileSelectResponse[1].name).to.equal('bar.txt');
    });

    it('adds new files and retains previous files', async () => {
      const el = await fixture(html` <lion-input-file multiple></lion-input-file> `);

      setTimeout(() => {
        mimicSelectFile(el, [file, file2]);
      });
      const fileListChangedEvent = await oneEvent(el, 'file-list-changed');
      filesListChanged(el, fileListChangedEvent);
      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(2);

      setTimeout(() => {
        mimicSelectFile(el, [file3, file4]);
      });
      const fileListChangedEvent1 = await oneEvent(el, 'file-list-changed');
      filesListChanged(el, fileListChangedEvent1);
      await el.updateComplete;
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(4);
    });

    it('adds multiple files and dispatch file-list-changed event ONLY with newly added file', async () => {
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
      expect(el._fileViewList.length).to.equal(4);
      expect(fileListChangedEvent1.detail.newFiles.length).to.equal(2);
      expect(fileListChangedEvent1.detail.newFiles[0].name).to.equal('foo3.txt');
      expect(fileListChangedEvent1.detail.newFiles[1].name).to.equal('foo4.txt');
    });

    it('disallows duplicate files to be selected and show notification message', async () => {
      const el = await fixture(html` <lion-input-file multiple></lion-input-file> `);

      setTimeout(() => {
        mimicSelectFile(el, [file]);
      });

      // create condition to also show the feedback
      el.prefilled = true;
      const fileListChangedEvent = await oneEvent(el, 'file-list-changed');

      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].systemFile.name).to.equal('foo.txt');

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
      expect(el._fileViewList.length).to.equal(1);
      expect(el.hasFeedbackFor).to.deep.equals(['info'], 'hasFeedbackFor');
      expect(el.showsFeedbackFor).to.deep.equals(['info'], 'showsFeedbackFor');
    });
  });

  describe('Status and error', () => {
    /**
     * @type {LionInputFile}
     */
    let el;
    beforeEach(async () => {
      el = await fixture(html`<lion-input-file accept="text/plain"></lion-input-file>`);
    });

    it('should set _fileSelectResponse data to _fileViewList for rendering error and status', async () => {
      mimicSelectFile(el, [file]);

      el._fileSelectResponse = [{ name: 'foo.txt', status: 'LOADING', errorMessage: '500' }];

      await el.updateComplete;

      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].status).to.equal('LOADING');
      // @ts-ignore
      expect(el._fileViewList[0].validationFeedback[0].message).to.equal('500');
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

  describe('Validations when used with lion-form', () => {
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

      mimicSelectFile(el, [file]);
      await el.updateComplete;

      await el.reset();
      expect(el.modelValue).to.deep.equal([]);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList).to.deep.equal([]);
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
      const el = await fixture(html`
        <lion-input-file
          label="Select"
          ._fileSelectResponse="${_fileSelectResponse}"
        ></lion-input-file>
      `);

      setTimeout(() => {
        mimicSelectFile(el, [file]);
      });
      await oneEvent(el, 'file-list-changed');
      await el.clear();
      expect(el.modelValue).to.deep.equal([]);
      expect(el._fileSelectResponse).to.deep.equal([]);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList).to.deep.equal([]);
    });
  });

  describe('File select component with prefilled state', () => {
    /**
     * @type {LionInputFile}
     */
    let el;
    beforeEach(async () => {
      el = await fixture(html`
        <lion-input-file
          name="myFiles"
          multiple="${true}"
          ._fileSelectResponse="${[
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
          ]}"
        >
        </lion-input-file>
      `);

      await el.updateComplete;
    });

    it('should update the _fileViewList according to _fileSelectResponse', () => {
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(2);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].systemFile.name).to.equal('file1.txt');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].status).to.equal('SUCCESS');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].downloadUrl).to.equal('/downloadFile');
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[1].validationFeedback[0].message).to.equal('something went wrong');
    });

    // TODO: test by triggering a click on the cross button
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
      expect(el._fileViewList.length).to.equal(2);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[1].systemFile.name).to.equal('file2.txt');

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
      expect(el._fileViewList.length).to.equal(1);
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

  describe('Drag and drop', () => {
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

  describe('uploadOnSelect', () => {
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

      const el = await fixture(
        html` <lion-input-file .uploadOnSelect="${true}"> </lion-input-file> `,
      );

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
      expect(el._fileViewList.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].systemFile.name).to.equal('foo.txt');

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
      const el = await fixture(html`
        <lion-input-file
          label="Select"
          upload-on-select
          ._fileSelectResponse="${[
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
          ]}"
        >
        </lion-input-file>
      `);
      await el.updateComplete;
      // assertion for displayed file list to be same
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList.length).to.equal(2);
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
      expect(el._fileViewList.length).to.equal(1);
      // @ts-expect-error [allow-protected-in-test]
      expect(el._fileViewList[0].systemFile.name).to.equal('file1.txt');
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
      const el = await fixture(html` <lion-input-file
        label="Select"
        ._fileSelectResponse="${_fileSelectResponse}"
      ></lion-input-file>`);
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
      const el = await fixture(html`
        <lion-input-file
          label="Select"
          ._fileSelectResponse="${_fileSelectResponse}"
          disabled
        ></lion-input-file>
      `);
      await expect(el).to.be.accessible();
    });

    describe('Aria roles', async () => {
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
          <lion-input-file
            label="Select"
            help-text="foo"
            ._fileSelectResponse="${_fileSelectResponse}"
          ></lion-input-file>
        `);
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
