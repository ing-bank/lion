import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { browserDetection } from '@lion/ui/core.js';
import { OverlayController, OverlaysManager } from '@lion/ui/overlays.js';

/**
 * @typedef {import('../types/OverlayConfig.js').OverlayConfig} OverlayConfig
 */

describe('OverlaysManager', () => {
  /** @type {OverlayConfig} */
  let defaultOptions;
  /** @type {OverlaysManager} */
  let mngr;

  beforeEach(async () => {
    const contentNode = /** @type {HTMLElement} */ (await fixture(html`<p>my content</p>`));

    defaultOptions = {
      placementMode: 'global',
      contentNode,
    };
    mngr = new OverlaysManager();
  });

  afterEach(() => {
    mngr.teardown();
  });

  it('provides global stylesheet for arrangement of body scroll', () => {
    expect(document.head.querySelectorAll('[data-overlays]').length).to.equal(1);
  });

  it('provides .teardown() for cleanup', () => {
    expect(document.head.querySelector('[data-overlays=""]')).not.be.undefined;

    mngr.teardown();
    expect(document.head.querySelector('[data-overlays=""]')).be.null;

    // safety check via private access (do not use this)
    expect(OverlaysManager.__globalStyleNode).to.be.undefined;

    // @ts-ignore [allow-private-in-test]
    expect(mngr.__list).to.be.empty;
    // @ts-ignore [allow-private-in-test]
    expect(mngr.__shownList).to.be.empty;
    // @ts-ignore [allow-private-in-test]
    expect(mngr.__siblingsInert).to.be.false;
  });

  it('can add/remove controllers', () => {
    // OverlayControllers will add themselves
    const dialog = new OverlayController(defaultOptions, mngr);
    const popup = new OverlayController(defaultOptions, mngr);

    expect(mngr.list).to.deep.equal([dialog, popup]);

    mngr.remove(popup);
    expect(mngr.list).to.deep.equal([dialog]);

    mngr.remove(dialog);
    expect(mngr.list).to.deep.equal([]);
  });

  it('throws if you try to add the same controller', () => {
    const ctrl = new OverlayController(defaultOptions, mngr);
    expect(() => mngr.add(ctrl)).to.throw('controller instance is already added');
  });

  it('throws if you try to remove a non existing controller', () => {
    // we do not pass one our own manager so it will not be added to it
    const ctrl = new OverlayController(defaultOptions);
    expect(() => mngr.remove(ctrl)).to.throw('could not find controller to remove');
  });

  it('adds a reference to the manager to the controller', () => {
    const dialog = new OverlayController(defaultOptions, mngr);

    expect(dialog.manager).to.equal(mngr);
  });

  it('has a .shownList which is ordered based on last shown', async () => {
    const dialog = new OverlayController(defaultOptions, mngr);
    const dialog2 = new OverlayController(defaultOptions, mngr);
    expect(mngr.shownList).to.deep.equal([]);

    await dialog.show();
    expect(mngr.shownList).to.deep.equal([dialog]);

    await dialog2.show();
    expect(mngr.shownList).to.deep.equal([dialog2, dialog]);

    await dialog.show();
    expect(mngr.shownList).to.deep.equal([dialog, dialog2]);

    await dialog.hide();
    expect(mngr.shownList).to.deep.equal([dialog2]);

    await dialog2.hide();
    expect(mngr.shownList).to.deep.equal([]);
  });

  describe('Browser/device edge cases', () => {
    const isIOSDetectionStub = sinon.stub(browserDetection, 'isIOS');
    const isMacSafariDetectionStub = sinon.stub(browserDetection, 'isMacSafari');

    function mockIOS() {
      isIOSDetectionStub.value(true);
      isMacSafariDetectionStub.value(false);
    }

    function mockMacSafari() {
      // When we are iOS
      isIOSDetectionStub.value(false);
      isMacSafariDetectionStub.value(true);
    }

    afterEach(() => {
      // Restore original values
      isIOSDetectionStub.restore();
      isMacSafariDetectionStub.restore();
    });

    describe('When initialized with "preventsScroll: true"', () => {
      it('adds class "overlays-scroll-lock-ios-fix" to body and html on iOS', async () => {
        mockIOS();
        const dialog = new OverlayController({ ...defaultOptions, preventsScroll: true }, mngr);
        await dialog.show();
        expect(Array.from(document.body.classList)).to.contain('overlays-scroll-lock-ios-fix');
        expect(Array.from(document.documentElement.classList)).to.contain(
          'overlays-scroll-lock-ios-fix',
        );
        await dialog.hide();
        expect(Array.from(document.body.classList)).to.not.contain('overlays-scroll-lock-ios-fix');
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'overlays-scroll-lock-ios-fix',
        );

        // When we are not iOS nor MacSafari
        isIOSDetectionStub.value(false);
        isMacSafariDetectionStub.value(false);

        const dialog2 = new OverlayController({ ...defaultOptions, preventsScroll: true }, mngr);
        await dialog2.show();
        expect(Array.from(document.body.classList)).to.not.contain('overlays-scroll-lock-ios-fix');
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'overlays-scroll-lock-ios-fix',
        );
      });

      it('adds class "overlays-scroll-lock-ios-fix" to body on MacSafari', async () => {
        mockMacSafari();
        const dialog = new OverlayController({ ...defaultOptions, preventsScroll: true }, mngr);
        await dialog.show();
        expect(Array.from(document.body.classList)).to.contain('overlays-scroll-lock-ios-fix');
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'overlays-scroll-lock-ios-fix',
        );
        await dialog.hide();
        expect(Array.from(document.body.classList)).to.not.contain('overlays-scroll-lock-ios-fix');
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'overlays-scroll-lock-ios-fix',
        );
      });
    });
  });
});
