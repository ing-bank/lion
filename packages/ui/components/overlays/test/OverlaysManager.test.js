import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { OverlayController, OverlaysManager } from '@lion/ui/overlays.js';
import { _browserDetection } from '../src/OverlaysManager.js';

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

  it('provides .globalRootNode as a render target on first access', () => {
    expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
    const rootNode = mngr.globalRootNode;
    expect(document.body.querySelector('.global-overlays')).to.equal(rootNode);
  });

  it('provides .teardown() for cleanup', () => {
    const rootNode = mngr.globalRootNode;
    expect(document.body.querySelector('.global-overlays')).to.equal(rootNode);
    expect(document.head.querySelector('[data-global-overlays=""]')).not.be.undefined;

    mngr.teardown();
    expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
    expect(document.head.querySelector('[data-global-overlays=""]')).be.null;

    // safety check via private access (do not use this)
    expect(OverlaysManager.__globalRootNode).to.be.undefined;
    expect(OverlaysManager.__globalStyleNode).to.be.undefined;
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
    const isIOSOriginal = _browserDetection.isIOS;
    const isMacSafariOriginal = _browserDetection.isMacSafari;

    function mockIOS() {
      _browserDetection.isIOS = true;
      _browserDetection.isMacSafari = false;
    }

    function mockMacSafari() {
      // When we are iOS
      _browserDetection.isIOS = false;
      _browserDetection.isMacSafari = true;
    }

    afterEach(() => {
      // Restore original values
      _browserDetection.isIOS = isIOSOriginal;
      _browserDetection.isMacSafari = isMacSafariOriginal;
    });

    describe('When initialized with "preventsScroll: true"', () => {
      it('adds class "global-overlays-scroll-lock-ios-fix" to body and html on iOS', async () => {
        mockIOS();
        const dialog = new OverlayController({ ...defaultOptions, preventsScroll: true }, mngr);
        await dialog.show();
        expect(Array.from(document.body.classList)).to.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        expect(Array.from(document.documentElement.classList)).to.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        await dialog.hide();
        expect(Array.from(document.body.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );

        // When we are not iOS nor MacSafari
        _browserDetection.isIOS = false;
        _browserDetection.isMacSafari = false;

        const dialog2 = new OverlayController({ ...defaultOptions, preventsScroll: true }, mngr);
        await dialog2.show();
        expect(Array.from(document.body.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
      });

      it('adds class "global-overlays-scroll-lock-ios-fix" to body on MacSafari', async () => {
        mockMacSafari();
        const dialog = new OverlayController({ ...defaultOptions, preventsScroll: true }, mngr);
        await dialog.show();
        expect(Array.from(document.body.classList)).to.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        await dialog.hide();
        expect(Array.from(document.body.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
        expect(Array.from(document.documentElement.classList)).to.not.contain(
          'global-overlays-scroll-lock-ios-fix',
        );
      });
    });
  });
});
