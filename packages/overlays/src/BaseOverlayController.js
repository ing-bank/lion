import { render, html } from '@lion/core';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
import { containFocus } from './utils/contain-focus.js';

/**
 * This is the interface for a controller
 */
export class BaseOverlayController {
  get _showHideMode() {
    return this.__showHideMode; // dom, css
  }

  get isShown() {
    return this.__isShown;
  }

  set isShown(value) {
    this.__isShown = value;
  }

  get content() {
    return this.__content;
  }

  set content(value) {
    this.__content = value;
  }

  get contentTemplate() {
    return this.__contentTemplate;
  }

  set contentTemplate(templateFunction) {
    if (typeof templateFunction !== 'function') {
      throw new Error('.contentTemplate needs to be a function');
    }

    const tmp = document.createElement('div');
    render(templateFunction(this.contentData), tmp);
    if (tmp.children.length !== 1) {
      throw new Error('The .contentTemplate needs to always return exactly one child node');
    }

    this.__contentTemplate = templateFunction;
    this.__showHideViaDom();
  }

  get contentData() {
    return this.__contentData;
  }

  set contentData(value) {
    if (!this.contentTemplate) {
      throw new Error('.contentData can only be used if there is a .contentTemplate function');
    }
    this.__contentData = value;
    this.__showHideViaDom();
  }

  get contentNode() {
    return this.__contentNode;
  }

  set contentNode(node) {
    this.__contentNode = node;
    this.content = node;
    // setting a contentNode means hide/show with css
    this.__showHideMode = 'css';
    if (this.isShown === false) {
      this.contentNode.style.display = 'none';
    }
  }

  constructor(params = {}) {
    this.__fakeExtendsEventTarget();
    this.__firstContentTemplateRender = false;
    this.__showHideMode = 'dom';
    this.isShown = false;

    this.__setupContent(params);

    // Features initial state
    this.__hasActiveTrapsKeyboardFocus = false;
    this.__hasActiveHidesOnEsc = false;
  }

  // TODO: add an ctrl.updateComplete e.g. when async show is done?
  async show() {
    if (this.manager) {
      this.manager.show(this);
    }
    if (this.isShown === true) {
      return;
    }
    this.isShown = true;
    this.__handleShowChange();
    this.dispatchEvent(new Event('show'));
  }

  async hide() {
    if (this.manager) {
      this.manager.hide(this);
    }
    if (this.isShown === false) {
      return;
    }
    this.isShown = false;
    if (!this.hideDone) {
      this.defaultHideDone();
    }
  }

  defaultHideDone() {
    this.__handleShowChange();
    this.dispatchEvent(new Event('hide'));
  }

  /**
   * Toggles the overlay.
   */
  async toggle() {
    if (this.isShown === true) {
      await this.hide();
    } else {
      await this.show();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  switchIn() {}

  // eslint-disable-next-line class-methods-use-this
  switchOut() {}

  // eslint-disable-next-line class-methods-use-this
  contentTemplateUpdated() {}

  __setupContent(params) {
    if (params.contentTemplate && params.contentNode) {
      throw new Error('You can only provide a .contentTemplate or a .contentNode but not both');
    }
    if (!params.contentTemplate && !params.contentNode) {
      throw new Error('You need to provide a .contentTemplate or a .contentNode');
    }
    if (params.contentTemplate) {
      this.contentTemplate = params.contentTemplate;
    }
    if (params.contentNode) {
      this.contentNode = params.contentNode;
    }
  }

  __handleShowChange() {
    if (this._showHideMode === 'dom') {
      this.__showHideViaDom();
    }

    if (this._showHideMode === 'css') {
      if (this.contentTemplate && !this.__firstContentTemplateRender) {
        this.__showHideViaDom();
        this.__firstContentTemplateRender = true;
      }
      this.__showHideViaCss();
    }
  }

  __showHideViaDom() {
    if (!this.contentTemplate) {
      return;
    }
    if (!this.content) {
      this.content = document.createElement('div');
    }

    if (this.isShown) {
      render(this.contentTemplate(this.contentData), this.content);
      this.__contentNode = this.content.firstElementChild;
      this.contentTemplateUpdated();
    } else {
      render(html``, this.content);
      this.__contentNode = undefined;
    }
  }

  __showHideViaCss() {
    if (!this.contentNode) {
      return;
    }
    if (this.isShown) {
      this.contentNode.style.display = 'inline-block';
    } else {
      this.contentNode.style.display = 'none';
    }
  }

  // TODO: this method has to be removed when EventTarget polyfill is available on IE11
  __fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }

  __enableFeatures() {
    if (this.trapsKeyboardFocus) {
      this.enableTrapsKeyboardFocus();
    }
    if (this.hidesOnEsc) {
      this.enableHidesOnEsc();
    }
  }

  __disableFeatures() {
    if (this.trapsKeyboardFocus) {
      this.disableTrapsKeyboardFocus();
    }
    if (this.hidesOnEsc) {
      this.disableHidesOnEsc();
    }
  }

  // **********************************************************************************************
  // FEATURE - TrapsKeyboardFocus
  // **********************************************************************************************
  get hasActiveTrapsKeyboardFocus() {
    return this.__hasActiveTrapsKeyboardFocus;
  }

  enableTrapsKeyboardFocus() {
    if (this.__hasActiveTrapsKeyboardFocus === true) {
      return;
    }
    if (this.manager) {
      this.manager.disableTrapsKeyboardFocusForAll();
    }
    this._containFocusHandler = containFocus(this.contentNode);

    this.__hasActiveTrapsKeyboardFocus = true;
    if (this.manager) {
      this.manager.informTrapsKeyboardFocusGotEnabled();
    }
  }

  disableTrapsKeyboardFocus({ findNewTrap = true } = {}) {
    if (this.__hasActiveTrapsKeyboardFocus === false) {
      return;
    }
    this._containFocusHandler.disconnect();
    this._containFocusHandler = undefined;

    this.__hasActiveTrapsKeyboardFocus = false;
    if (this.manager) {
      this.manager.informTrapsKeyboardFocusGotDisabled({ disabledCtrl: this, findNewTrap });
    }
  }

  // **********************************************************************************************
  // FEATURE - hideOnEsc
  // **********************************************************************************************
  get hasActiveHidesOnEsc() {
    return this.__hasActiveHidesOnEsc;
  }

  enableHidesOnEsc() {
    if (this.__hasHidesOnEsc === true) {
      return;
    }
    this.__escKeyHandler = ev => {
      if (ev.key === 'Escape') {
        this.hide();
      }
    };

    this.contentNode.addEventListener('keyup', this.__escKeyHandler);

    this.__hasActiveHidesOnEsc = true;
  }

  disableHidesOnEsc() {
    if (this.__hasHidesOnEsc === false) {
      return;
    }
    if (this.contentNode) {
      this.contentNode.removeEventListener('keyup', this.__escKeyHandler);
    }

    this.__hasActiveHidesOnEsc = false;
  }
}
