import { expect } from '@open-wc/testing';
import { css } from 'lit';
import sinon from 'sinon';
import {
  adoptStyle,
  adoptStyles,
  serializeConstructableStylesheet,
  _adoptStyleUtils,
} from '../../src/utils/adopt-styles.js';
import { createShadowHost } from '../../test-helpers/createShadowHost.js';

function mockNoSupportAdoptedStylesheets() {
  _adoptStyleUtils.supportsAdoptingStyleSheets = false;
}

function restoreMockNoSupportAdoptedStylesheets() {
  _adoptStyleUtils.supportsAdoptingStyleSheets = true;
}

describe('adoptStyle()', () => {
  it('adds a stylesheet from a CSSResult to the shadowRoot', async () => {
    const { shadowHost, cleanupShadowHost } = createShadowHost();
    const myCssResult = css``;
    const root = /** @type {ShadowRoot} */ (shadowHost.shadowRoot);

    adoptStyle(root, myCssResult);
    expect(root.adoptedStyleSheets).to.include(myCssResult.styleSheet);

    cleanupShadowHost();
  });

  it('adds a stylesheet from a CSSStyleSheet to the shadowRoot', async () => {
    const { shadowHost, cleanupShadowHost } = createShadowHost();
    const myCSSStyleSheet = new CSSStyleSheet();
    const root = /** @type {ShadowRoot} */ (shadowHost.shadowRoot);

    adoptStyle(root, myCSSStyleSheet);
    expect(root.adoptedStyleSheets).to.include(myCSSStyleSheet);

    cleanupShadowHost();
  });

  it('does not add same stylesheet twice', async () => {
    const { shadowHost, cleanupShadowHost } = createShadowHost();
    const myCssResult = css``;
    const root = /** @type {ShadowRoot} */ (shadowHost.shadowRoot);

    adoptStyle(root, myCssResult);
    const amountOfStylesheetsAfterOneInit = root.adoptedStyleSheets.length;
    adoptStyle(root, myCssResult);
    expect(root.adoptedStyleSheets.length).to.equal(amountOfStylesheetsAfterOneInit);

    cleanupShadowHost();
  });

  it('works as well when document is the root', async () => {
    const myCssResult = css``;
    const root = document;

    adoptStyle(root, myCssResult);
    expect(root.adoptedStyleSheets).to.include(myCssResult.styleSheet);
  });

  describe('Teardown', () => {
    it('removes stylesheets from the shadowRoot', async () => {
      const { shadowHost, cleanupShadowHost } = createShadowHost();
      const myCssResult = css``;
      const root = /** @type {ShadowRoot} */ (shadowHost.shadowRoot);

      adoptStyle(root, myCssResult);
      expect(root.adoptedStyleSheets).to.include(myCssResult.styleSheet);
      adoptStyle(root, myCssResult, { teardown: true });
      expect(root.adoptedStyleSheets).to.not.include(myCssResult.styleSheet);

      const myCSSStyleSheet = new CSSStyleSheet();
      adoptStyle(root, myCSSStyleSheet);
      expect(root.adoptedStyleSheets).to.include(myCSSStyleSheet);
      adoptStyle(root, myCSSStyleSheet, { teardown: true });
      expect(root.adoptedStyleSheets).to.not.include(myCSSStyleSheet);

      cleanupShadowHost();
    });
  });

  describe('Fallback when adoptedStyleSheets are not supported', () => {
    beforeEach(() => {
      mockNoSupportAdoptedStylesheets();
    });

    afterEach(() => {
      restoreMockNoSupportAdoptedStylesheets();
    });

    it('adds a "traditional" stylesheet to the shadowRoot', async () => {
      const { shadowHost, cleanupShadowHost } = createShadowHost();
      const myCssResult = css`
        .check {
          color: blue;
        }
      `;
      const root = /** @type {ShadowRoot} */ (shadowHost.shadowRoot);

      adoptStyle(root, myCssResult);
      const sheets = Array.from(root.querySelectorAll('style'));
      const lastAddedSheet = sheets[sheets.length - 1];
      expect(lastAddedSheet.textContent).to.equal(myCssResult.cssText);

      cleanupShadowHost();
    });

    it('adds a "traditional" stylesheet to the body', async () => {
      mockNoSupportAdoptedStylesheets();

      const myCssResult = css`
        .check {
          color: blue;
        }
      `;
      const root = document;
      adoptStyle(root, myCssResult);

      const sheets = Array.from(document.body.querySelectorAll('style'));
      const lastAddedSheet = sheets[sheets.length - 1];
      expect(lastAddedSheet.textContent).to.equal(myCssResult.cssText);
      restoreMockNoSupportAdoptedStylesheets();
    });

    describe('Teardown', () => {
      it('removes a "traditional" stylesheet from the shadowRoot', async () => {
        const { shadowHost, cleanupShadowHost } = createShadowHost();
        const myCssResult = css`
          .check {
            color: blue;
          }
        `;
        const root = /** @type {ShadowRoot} */ (shadowHost.shadowRoot);

        adoptStyle(root, myCssResult);
        const sheets1 = Array.from(root.querySelectorAll('style'));
        const lastAddedSheet1 = sheets1[sheets1.length - 1];
        expect(lastAddedSheet1.textContent).to.equal(myCssResult.cssText);
        adoptStyle(root, myCssResult, { teardown: true });
        const sheets2 = Array.from(root.querySelectorAll('style'));
        const lastAddedSheet2 = sheets2[sheets2.length - 1];
        expect(lastAddedSheet2?.textContent).to.not.equal(myCssResult.cssText);

        const myCSSStyleSheet = new CSSStyleSheet();
        myCSSStyleSheet.insertRule('.check { color: blue; }');

        adoptStyle(root, myCSSStyleSheet);
        const sheets3 = Array.from(root.querySelectorAll('style'));
        const lastAddedSheet3 = sheets3[sheets3.length - 1];
        expect(lastAddedSheet3.textContent).to.equal(
          serializeConstructableStylesheet(myCSSStyleSheet),
        );
        adoptStyle(root, myCSSStyleSheet, { teardown: true });
        const sheets4 = Array.from(root.querySelectorAll('style'));
        const lastAddedSheet4 = sheets4[sheets4.length - 1];
        expect(lastAddedSheet4?.textContent).to.not.equal(myCSSStyleSheet);

        cleanupShadowHost();
      });
    });
  });
});

describe('adoptStyles()', () => {
  it('calls "adoptStyle" for all entries in CSSResult|CSSStylesheet[]', async () => {
    const spy = sinon.spy(_adoptStyleUtils, 'adoptStyle');

    const myCssResult = css``;
    const myCSSStyleSheet = new CSSStyleSheet();

    adoptStyles(document, [myCssResult, myCSSStyleSheet]);
    expect(spy).to.have.been.calledTwice;
  });
});
