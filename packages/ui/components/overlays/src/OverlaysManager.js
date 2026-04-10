import { browserDetection } from '@lion/ui/core.js';

/**
 * @typedef {import('lit').CSSResult} CSSResult
 * @typedef {import('./OverlayController.js').OverlayController} OverlayController
 * @typedef {import('@lion/ui/types/overlays.js').OverlayPhase} OverlayPhase
 */

import { overlayDocumentStyle } from './overlayDocumentStyle.js';

/**
 * `OverlaysManager` which manages overlays which are rendered into the body
 */
export class OverlaysManager {
  static __createGlobalStyleNode() {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-overlays', '');
    styleTag.textContent = /** @type {CSSResult} */ (overlayDocumentStyle).cssText;
    document.head.appendChild(styleTag);
    return styleTag;
  }

  /**
   * no setter as .list is intended to be read-only
   * You can use .add or .remove to modify it
   */
  get list() {
    return this.__list;
  }

  /**
   * no setter as .shownList is intended to be read-only
   * You can use .show or .hide on individual controllers to modify
   */
  get shownList() {
    return this.__shownList;
  }

  constructor() {
    /**
     * @type {OverlayController[]}
     * @private
     */
    this.__list = [];
    /**
     * @type {OverlayController[]}
     * @private
     */
    this.__shownList = [];
    /** @protected */
    this._siblingsInert = false;
    /**
     * @type {WeakMap<OverlayController, OverlayController[]>}
     * @private
     */
    this.__blockingMap = new WeakMap();
    /**
     * @private
     * @type {{
     *   preventScrollCount: number;
     *   clientWidth: number | undefined;
     *   clientHeight: number | undefined;
     *   marginRightInline: string | undefined;
     *   marginBottomInline: string | undefined;
     *   marginRight: number | undefined;
     *   marginBottom: number | undefined;
     * }}
     */
    this.__bodySizeVars = {
      preventScrollCount: 0,
      clientWidth: undefined,
      clientHeight: undefined,
      marginRightInline: undefined,
      marginBottomInline: undefined,
      marginRight: undefined,
      marginBottom: undefined,
    };

    this.__forTesting = {
      bodySizeVars: this.__bodySizeVars,
    };

    if (!OverlaysManager.__globalStyleNode) {
      OverlaysManager.__globalStyleNode = OverlaysManager.__createGlobalStyleNode();
    }
  }

  /**
   * Registers an overlay controller.
   * @param {OverlayController} ctrlToAdd controller of the newly added overlay
   * @returns {OverlayController} same controller after adding to the manager
   */
  add(ctrlToAdd) {
    if (this.list.find(ctrl => ctrlToAdd === ctrl)) {
      throw new Error('controller instance is already added');
    }
    this.list.push(ctrlToAdd);
    return ctrlToAdd;
  }

  /**
   * @param {OverlayController} ctrlToRemove
   */
  remove(ctrlToRemove) {
    if (!this.list.find(ctrl => ctrlToRemove === ctrl)) {
      throw new Error('could not find controller to remove');
    }
    this.__list = this.list.filter(ctrl => ctrl !== ctrlToRemove);
    this.__shownList = this.shownList.filter(ctrl => ctrl !== ctrlToRemove);
  }

  /**
   * @param {OverlayController} ctrlToShow
   */
  show(ctrlToShow) {
    if (this.list.find(ctrl => ctrlToShow === ctrl)) {
      this.hide(ctrlToShow);
    }
    this.__shownList.unshift(ctrlToShow);

    // make sure latest shown ctrl is visible
    Array.from(this.__shownList)
      .reverse()
      .forEach((ctrl, i) => {
        // eslint-disable-next-line no-param-reassign
        ctrl.elevation = i + 1;
      });
  }

  /**
   * @param {any} ctrlToHide
   */
  hide(ctrlToHide) {
    if (!this.list.find(ctrl => ctrlToHide === ctrl)) {
      throw new Error('could not find controller to hide');
    }
    this.__shownList = this.shownList.filter(ctrl => ctrl !== ctrlToHide);
  }

  teardown() {
    this.list.forEach(ctrl => {
      ctrl.teardown();
    });

    this.__list = [];
    this.__shownList = [];
    this._siblingsInert = false;
    this.__bodySizeVars.preventScrollCount = 0;
    this.__bodySizeVars.clientWidth = undefined;
    this.__bodySizeVars.clientHeight = undefined;
    this.__bodySizeVars.marginRightInline = undefined;
    this.__bodySizeVars.marginBottomInline = undefined;
    this.__bodySizeVars.marginRight = undefined;
    this.__bodySizeVars.marginBottom = undefined;

    if (OverlaysManager.__globalStyleNode) {
      document.head.removeChild(
        /** @type {HTMLStyleElement} */ (OverlaysManager.__globalStyleNode),
      );
      OverlaysManager.__globalStyleNode = undefined;
    }
  }

  /** Features right now only for Global Overlay Manager */

  get siblingsInert() {
    return this._siblingsInert;
  }

  /** PreventsScroll */

  /**
   * @param {{ phase: OverlayPhase }} config
   */
  requestToKeepBodySize({ phase }) {
    switch (phase) {
      case 'before-show':
        // Tracks the amount of active preventsScroll overlays.
        // Only the first overlay captures body metrics and only the last one restores them.
        if (this.__bodySizeVars.preventScrollCount === 0) {
          this.__bodySizeVars.clientWidth = document.body.clientWidth;
          this.__bodySizeVars.clientHeight = document.body.clientHeight;
          this.__bodySizeVars.marginRightInline = document.body.style.marginRight;
          this.__bodySizeVars.marginBottomInline = document.body.style.marginBottom;
        }
        this.__bodySizeVars.preventScrollCount += 1;
        break;
      case 'show': {
        if (this.__bodySizeVars.preventScrollCount === 1) {
          if (window.getComputedStyle) {
            const bodyStyle = window.getComputedStyle(document.body);
            this.__bodySizeVars.marginRight = parseInt(
              bodyStyle.getPropertyValue('margin-right'),
              10,
            );
            this.__bodySizeVars.marginBottom = parseInt(
              bodyStyle.getPropertyValue('margin-bottom'),
              10,
            );
          } else {
            this.__bodySizeVars.marginRight = 0;
            this.__bodySizeVars.marginBottom = 0;
          }
          const scrollbarWidth =
            document.body.clientWidth - /** @type {number} */ (this.__bodySizeVars.clientWidth);
          const scrollbarHeight =
            document.body.clientHeight - /** @type {number} */ (this.__bodySizeVars.clientHeight);
          const newMarginRight = this.__bodySizeVars.marginRight + scrollbarWidth;
          const newMarginBottom = this.__bodySizeVars.marginBottom + scrollbarHeight;
          // @ts-expect-error [external]: CSS not yet typed
          if (window.CSS?.number && document.body.attributeStyleMap?.set) {
            document.body.attributeStyleMap.set('margin-right', CSS.px(newMarginRight));
            document.body.attributeStyleMap.set('margin-bottom', CSS.px(newMarginBottom));
          } else {
            document.body.style.marginRight = `${newMarginRight}px`;
            document.body.style.marginBottom = `${newMarginBottom}px`;
          }
        }
        break;
      }
      case 'hide':
      case 'teardown':
        if (this.__bodySizeVars.preventScrollCount > 0) {
          this.__bodySizeVars.preventScrollCount -= 1;
          if (this.__bodySizeVars.preventScrollCount === 0) {
            document.body.style.marginRight = this.__bodySizeVars.marginRightInline || '';
            document.body.style.marginBottom = this.__bodySizeVars.marginBottomInline || '';
          }
        }
        break;
      /* no default */
    }
  }

  // eslint-disable-next-line class-methods-use-this
  requestToPreventScroll() {
    const { isIOS, isMacSafari } = browserDetection;
    // no check as classList will dedupe it anyways
    document.body.classList.add('overlays-scroll-lock');
    if (isIOS || isMacSafari) {
      // iOS and safar for mac have issues with overlays with input fields. This is fixed by applying
      // position: fixed to the body. As a side effect, this will scroll the body to the top.
      document.body.classList.add('overlays-scroll-lock-ios-fix');
    }
    if (isIOS) {
      document.documentElement.classList.add('overlays-scroll-lock-ios-fix');
    }
  }

  /**
   * @param {OverlayController} [currentController]
   */
  requestToEnableScroll(currentController) {
    const openedSiblings = currentController
      ? this.shownList.filter(ctrl => ctrl !== currentController)
      : this.shownList;

    const hasOpenSiblingThatPreventsScroll = openedSiblings.some(
      ctrl => ctrl.preventsScroll === true,
    );
    if (hasOpenSiblingThatPreventsScroll) {
      return;
    }

    const { isIOS, isMacSafari } = browserDetection;
    document.body.classList.remove('overlays-scroll-lock');
    if (isIOS || isMacSafari) {
      document.body.classList.remove('overlays-scroll-lock-ios-fix');
    }
    if (isIOS) {
      document.documentElement.classList.remove('overlays-scroll-lock-ios-fix');
    }
  }

  /**
   * Blocking
   * @param {OverlayController} blockingCtrl
   */
  requestToShowOnly(blockingCtrl) {
    const controllersToHide = this.shownList.filter(ctrl => ctrl !== blockingCtrl);
    controllersToHide.forEach(ctrl => ctrl.hide());
    this.__blockingMap.set(blockingCtrl, controllersToHide);
  }

  /**
   * @param {OverlayController} blockingCtrl
   */
  retractRequestToShowOnly(blockingCtrl) {
    if (this.__blockingMap.has(blockingCtrl)) {
      const controllersWhichGotHidden = /** @type {OverlayController[]} */ (
        this.__blockingMap.get(blockingCtrl)
      );
      controllersWhichGotHidden.forEach(ctrl => ctrl.show());
    }
  }
}

/** @type {HTMLStyleElement | undefined} */
OverlaysManager.__globalStyleNode = undefined;
