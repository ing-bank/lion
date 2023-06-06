import '@lion/ui/define/lion-selected-file-list.js';
import { expect, fixture as _fixture, html, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';

/**
 * @typedef {import('../src/LionSelectedFileList.js').LionSelectedFileList} LionSelectedFileList
 * @typedef {import('../types/index.js').InputFile} InputFile
 * @typedef {import('lit').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionSelectedFileList>} */ (
  _fixture
);

describe('lion-selected-file-list', () => {
  /**
   * @type {Partial<InputFile>}
   */
  const fileSuccess = {
    name: 'foo.txt',
    status: 'SUCCESS',
    downloadUrl: '#foo',
    systemFile: {
      name: 'foo.txt',
      type: 'text/plain',
      size: 1000,
      status: 'SUCCESS',
    },
    response: {
      name: 'foo',
      type: 'text/plain',
      size: 1000,
      status: 'SUCCESS',
    },
  };

  /**
   * @type {Partial<InputFile>}
   */
  const fileLoading = {
    status: 'LOADING',
    systemFile: {
      name: 'bar.txt',
      type: 'text/plain',
      size: 100,
      status: 'LOADING',
    },
  };

  /**
   * @type {Partial<InputFile>}
   */
  const fileFail = {
    systemFile: {
      name: 'foobar.txt',
      type: 'text/plain',
      size: 1000,
      status: 'FAIL',
    },
    status: 'FAIL',
    validationFeedback: [{ message: 'foobar', type: 'error' }],
  };

  it('when empty show nothing', async () => {
    const el = await fixture(html`<lion-selected-file-list></lion-selected-file-list>`);
    expect(el.children.length).to.equal(0);
  });

  it('can have 1 item', async () => {
    const el = await fixture(html`
      <lion-selected-file-list .fileList="${[fileSuccess]}"></lion-selected-file-list>
    `);
    const fileItems = el.shadowRoot?.querySelectorAll('.selected__list__item');
    expect(fileItems?.length).to.equal(1);
  });

  it('shows a list when multiple', async () => {
    const el = await fixture(html`
      <lion-selected-file-list
        .fileList="${[fileSuccess, fileLoading]}"
        .multiple="${true}"
      ></lion-selected-file-list>
    `);
    const fileItems = el.shadowRoot?.querySelectorAll('.selected__list__item');
    expect(fileItems?.length).to.equal(2);
    const fileList = el.shadowRoot?.querySelector('.selected__list');
    expect(fileList?.tagName).to.equal('UL');
  });

  it('displays an anchor when status="SUCCESS" and a downloadUrl is available', async () => {
    const el = await fixture(html`
      <lion-selected-file-list
        .fileList="${[fileSuccess, fileLoading, fileFail]}"
        .multiple="${true}"
      ></lion-selected-file-list>
    `);
    const fileItems = el.shadowRoot?.querySelectorAll('.selected__list__item');
    // @ts-ignore
    expect(fileItems[0].querySelector('.selected__list__item__label__link')).to.exist;
    // @ts-ignore
    expect(fileItems[1].querySelector('.selected__list__item__label__link')).to.not.exist;
    // @ts-ignore
    expect(fileItems[2].querySelector('.selected__list__item__label__link')).to.not.exist;
  });

  it('displays a feedback message when status="FAIL"', async () => {
    const el = await fixture(html`
      <lion-selected-file-list .fileList="${[fileFail]}"></lion-selected-file-list>
    `);
    const fileItems = el.shadowRoot?.querySelectorAll('.selected__list__item');
    const feedback = fileItems ? fileItems[0].querySelector('lion-validation-feedback') : undefined;
    // @ts-ignore
    expect(feedback).to.exist;
    expect(feedback).shadowDom.to.equal('foobar');
  });

  it('should call removeFile method on click of remove button', async () => {
    const el = await fixture(html`
      <lion-selected-file-list .fileList="${[fileSuccess, fileLoading]}"></lion-selected-file-list>
    `);

    /**
     * @type {HTMLButtonElement | null | undefined}
     */
    const removeButton = el.shadowRoot?.querySelector('.selected__list__item__remove-button');
    const removeFileSpy = sinon.spy(el, '_removeFile');
    removeButton?.click();
    expect(removeFileSpy).have.been.calledOnce;
    removeFileSpy.restore();
  });

  it('should fire file-remove-requested event with removed file data', async () => {
    const el = await fixture(html`
      <lion-selected-file-list .fileList="${[fileSuccess, fileLoading]}"></lion-selected-file-list>
    `);

    /**
     * @type {Partial<InputFile>}
     */
    const removedFile = {
      name: el.fileList[0].name,
      status: el.fileList[0].status,
      systemFile: {
        name: el.fileList[0].name,
      },
      response: {
        name: el.fileList[0].name,
        status: el.fileList[0].status,
      },
    };

    setTimeout(() => {
      // @ts-ignore ignore file typing
      el._removeFile(removedFile);
    });

    const removeFileEvent = await oneEvent(el, 'file-remove-requested');
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

  describe('Accessibility', async () => {
    it('is accessible', async () => {
      const el = await fixture(
        html`<lion-selected-file-list
          .fileList="${[fileSuccess, fileLoading, fileFail]}"
        ></lion-selected-file-list>`,
      );
      await expect(el).to.be.accessible();
    });

    it(`adds aria-live="polite" to the feedback slot on focus, aria-live="assertive" to the feedback slot on blur,
        so error messages appearing on blur will be read before those of the next input`, async () => {
      const el = await fixture(html`
        <lion-selected-file-list .fileList="${[fileFail]}"></lion-selected-file-list>
      `);
      const fileFeedback = el?.shadowRoot?.querySelectorAll('[id^="file-feedback"]')[0];
      const removeButton = /** @type {HTMLButtonElement} */ (
        el.shadowRoot?.querySelector('.selected__list__item__remove-button')
      );
      // @ts-ignore
      expect(fileFeedback.getAttribute('aria-live')).to.equal('assertive');

      removeButton?.focus();
      // @ts-ignore
      expect(fileFeedback.getAttribute('aria-live')).to.equal('polite');

      removeButton?.blur();
      // @ts-ignore
      expect(fileFeedback.getAttribute('aria-live')).to.equal('assertive');
    });
  });
});
