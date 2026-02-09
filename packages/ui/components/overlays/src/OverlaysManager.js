import { browserDetection } from '@lion/ui/core.js';

/**
 * @typedef {import('lit').CSSResult} CSSResult
 * @typedef {import('./OverlayController.js').OverlayController} OverlayController
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
    /** @private */
    this.__siblingsInert = false;
    /**
     * @type {WeakMap<OverlayController, OverlayController[]>}
     * @private
     */
    this.__blockingMap = new WeakMap();
    /** @private */
    this.__preventScrollCount = 0;
    /** @private */
    this.__bodyClientWidth = undefined;
    /** @private */
    this.__bodyClientHeight = undefined;
    /** @private */
    this.__bodyMarginRightInline = undefined;
    /** @private */
    this.__bodyMarginBottomInline = undefined;
    /** @private */
    this.__bodyMarginRight = undefined;
    /** @private */
    this.__bodyMarginBottom = undefined;

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
    this.__siblingsInert = false;
    this.__preventScrollCount = 0;
    this.__bodyClientWidth = undefined;
    this.__bodyClientHeight = undefined;
    this.__bodyMarginRightInline = undefined;
    this.__bodyMarginBottomInline = undefined;
    this.__bodyMarginRight = undefined;
    this.__bodyMarginBottom = undefined;

    if (OverlaysManager.__globalStyleNode) {
      document.head.removeChild(
        /** @type {HTMLStyleElement} */ (OverlaysManager.__globalStyleNode),
      );
      OverlaysManager.__globalStyleNode = undefined;
    }
  }

  /** Features right now only for Global Overlay Manager */

  get siblingsInert() {
    return this.__siblingsInert;
  }

  disableTrapsKeyboardFocusForAll() {
    this.shownList.forEach(ctrl => {
      if (ctrl.trapsKeyboardFocus === true && ctrl.disableTrapsKeyboardFocus) {
        ctrl.disableTrapsKeyboardFocus({ findNewTrap: false });
      }
    });
  }

  /**
   * @param {'local' | 'global' | undefined} placementMode
   */
  informTrapsKeyboardFocusGotEnabled(placementMode) {
    if (this.siblingsInert === false && placementMode === 'global') {
      this.__siblingsInert = true;
    }
  }

  /**
   * @param {{ disabledCtrl?:OverlayController, findNewTrap?:boolean }} options
   */
  informTrapsKeyboardFocusGotDisabled({ disabledCtrl, findNewTrap = true } = {}) {
    const next = this.shownList.find(
      ctrl => ctrl !== disabledCtrl && ctrl.trapsKeyboardFocus === true,
    );
    if (next) {
      if (findNewTrap) {
        next.enableTrapsKeyboardFocus();
      }
    } else if (this.siblingsInert === true) {
      this.__siblingsInert = false;
    }
  }

  /** PreventsScroll */

  /**
   * @param {{ phase: 'before-show' | 'show' | 'hide' | 'teardown' }} config
   */
  requestToKeepBodySize({ phase }) {
    switch (phase) {
      case 'before-show':
        if (this.__preventScrollCount === 0) {
          this.__bodyClientWidth = document.body.clientWidth;
          this.__bodyClientHeight = document.body.clientHeight;
          this.__bodyMarginRightInline = document.body.style.marginRight;
          this.__bodyMarginBottomInline = document.body.style.marginBottom;
        }
        this.__preventScrollCount += 1;
        break;
      case 'show': {
        if (this.__preventScrollCount === 1) {
          if (window.getComputedStyle) {
            const bodyStyle = window.getComputedStyle(document.body);
            this.__bodyMarginRight = parseInt(bodyStyle.getPropertyValue('margin-right'), 10);
            this.__bodyMarginBottom = parseInt(bodyStyle.getPropertyValue('margin-bottom'), 10);
          } else {
            this.__bodyMarginRight = 0;
            this.__bodyMarginBottom = 0;
          }
          const scrollbarWidth =
            document.body.clientWidth - /** @type {number} */ (this.__bodyClientWidth);
          const scrollbarHeight =
            document.body.clientHeight - /** @type {number} */ (this.__bodyClientHeight);
          const newMarginRight = this.__bodyMarginRight + scrollbarWidth;
          const newMarginBottom = this.__bodyMarginBottom + scrollbarHeight;
          // @ts-expect-error [external]: CSS not yet typed
          if (window.CSS?.number && document.body.attributeStyleMap?.set) {
            // @ts-expect-error [external]: types attributeStyleMap + CSS.px not available yet
            document.body.attributeStyleMap.set('margin-right', CSS.px(newMarginRight));
            // @ts-expect-error [external]: types attributeStyleMap + CSS.px not available yet
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
        this.__preventScrollCount -= 1;
        if (this.__preventScrollCount === 0) {
          document.body.style.marginRight = this.__bodyMarginRightInline || '';
          document.body.style.marginBottom = this.__bodyMarginBottomInline || '';
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
