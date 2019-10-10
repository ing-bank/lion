import { unsetSiblingsInert, setSiblingsInert } from './utils/inert-siblings.js';
import { globalOverlaysStyle } from './globalOverlaysStyle.js';

const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

/**
 * @typedef {object} OverlayController
 * @param {(object) => TemplateResult} contentTemplate the template function
 * which is called on update
 * @param {(boolean, object) => void} sync updates shown state and data all together
 * @param {(object) => void} update updates the overlay (with data if provided as a first argument)
 * @param {Function} show shows the overlay
 * @param {Function} hide hides the overlay
 * @param {boolean} hasBackdrop displays a gray backdrop while the overlay is opened
 * @param {boolean} isBlocking hides all other overlays once shown
 * @param {boolean} preventsScroll prevents scrolling the background
 *   while this overlay is opened
 * @param {boolean} trapsKeyboardFocus keeps focus within the overlay,
 *   and prevents interaction with the overlay background
 */

/**
 * `OverlaysManager` which manages overlays which are rendered into the body
 */
export class OverlaysManager {
  static __createGlobalRootNode() {
    const rootNode = document.createElement('div');
    rootNode.classList.add('global-overlays');
    document.body.appendChild(rootNode);
    return rootNode;
  }

  static __createGlobalStyleNode() {
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-global-overlays', '');
    styleTag.textContent = globalOverlaysStyle.cssText;
    document.head.appendChild(styleTag);
    return styleTag;
  }

  /**
   * no setter as .list is intended to be read-only
   * You can use .add or .remove to modify it
   */
  get globalRootNode() {
    if (!this.constructor.__globalRootNode) {
      this.constructor.__globalRootNode = this.constructor.__createGlobalRootNode();
      this.constructor.__globalStyleNode = this.constructor.__createGlobalStyleNode();
    }
    return this.constructor.__globalRootNode;
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
    this.__list = [];
    this.__shownList = [];
    this.__siblingsInert = false;
    this.__blockingMap = new WeakMap();
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

  remove(ctrlToRemove) {
    if (!this.list.find(ctrl => ctrlToRemove === ctrl)) {
      throw new Error('could not find controller to remove');
    }
    this.__list = this.list.filter(ctrl => ctrl !== ctrlToRemove);
  }

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

    const rootNode = this.constructor.__globalRootNode;
    if (rootNode) {
      rootNode.parentElement.removeChild(rootNode);
      this.constructor.__globalRootNode = undefined;

      document.head.removeChild(this.constructor.__globalStyleNode);
      this.constructor.__globalStyleNode = undefined;
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

  informTrapsKeyboardFocusGotEnabled() {
    if (this.siblingsInert === false) {
      if (this.constructor.__globalRootNode) {
        setSiblingsInert(this.globalRootNode);
      }
      this.__siblingsInert = true;
    }
  }

  informTrapsKeyboardFocusGotDisabled({ disabledCtrl, findNewTrap = true } = {}) {
    const next = this.shownList.find(
      ctrl => ctrl !== disabledCtrl && ctrl.trapsKeyboardFocus === true,
    );
    if (next) {
      if (findNewTrap) {
        next.enableTrapsKeyboardFocus();
      }
    } else if (this.siblingsInert === true) {
      if (this.constructor.__globalRootNode) {
        unsetSiblingsInert(this.globalRootNode);
      }
      this.__siblingsInert = false;
    }
  }

  /** PreventsScroll */

  // eslint-disable-next-line class-methods-use-this
  requestToPreventScroll() {
    // no check as classList will dedupe it anyways
    document.body.classList.add('global-overlays-scroll-lock');
    if (isIOS) {
      // iOS has issues with overlays with input fields. This is fixed by applying
      // position: fixed to the body. As a side effect, this will scroll the body to the top.
      document.body.classList.add('global-overlays-scroll-lock-ios-fix');
    }
  }

  requestToEnableScroll() {
    if (!this.shownList.some(ctrl => ctrl.preventsScroll === true)) {
      document.body.classList.remove('global-overlays-scroll-lock');
      if (isIOS) {
        document.body.classList.remove('global-overlays-scroll-lock-ios-fix');
      }
    }
  }

  /** Blocking */
  requestToShowOnly(blockingCtrl) {
    const controllersToHide = this.shownList.filter(ctrl => ctrl !== blockingCtrl);

    controllersToHide.map(ctrl => ctrl.hide());
    this.__blockingMap.set(blockingCtrl, controllersToHide);
  }

  retractRequestToShowOnly(blockingCtrl) {
    if (this.__blockingMap.has(blockingCtrl)) {
      const controllersWhichGotHidden = this.__blockingMap.get(blockingCtrl);
      controllersWhichGotHidden.map(ctrl => ctrl.show());
    }
  }
}
