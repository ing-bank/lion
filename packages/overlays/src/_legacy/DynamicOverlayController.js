import { LocalOverlayController } from './LocalOverlayController.js';

export class DynamicOverlayController {
  /**
   * no setter as .list is intended to be read-only
   * You can use .add or .remove to modify it
   */
  get list() {
    return this.__list;
  }

  /**
   * no setter as .active is intended to be read-only
   * You can use .switchTo to change it
   */
  get active() {
    return this.__active;
  }

  get isShown() {
    return this.active ? this.active.isShown : false;
  }

  set isShown(value) {
    if (this.active) {
      this.active.isShown = value;
    }
  }

  constructor() {
    this.__list = [];
    this.__active = undefined;
    this.nextOpen = undefined;
    if (!this.content) {
      this.content = document.createElement('div');
    }
    this.__fakeExtendsEventTarget();
    this.__delegateEvent = this.__delegateEvent.bind(this);
  }

  add(ctrlToAdd) {
    if (this.list.find(ctrl => ctrlToAdd === ctrl)) {
      throw new Error('controller instance is already added');
    }
    this.list.push(ctrlToAdd);

    if (!this.active) {
      this.__active = ctrlToAdd;
    }

    if (this.active && ctrlToAdd instanceof LocalOverlayController) {
      // eslint-disable-next-line no-param-reassign
      ctrlToAdd.content = this.content;
    }

    return ctrlToAdd;
  }

  remove(ctrlToRemove) {
    if (!this.list.find(ctrl => ctrlToRemove === ctrl)) {
      throw new Error('could not find controller to remove');
    }
    if (this.active === ctrlToRemove) {
      throw new Error(
        'You can not remove the active controller. Please switch first to a different controller via ctrl.switchTo()',
      );
    }

    this.__list = this.list.filter(ctrl => ctrl !== ctrlToRemove);
  }

  switchTo(ctrlToSwitchTo) {
    if (this.isShown === true) {
      throw new Error('You can not switch overlays while being shown');
    }
    const prevActive = this.active;

    this.active.switchOut();
    ctrlToSwitchTo.switchIn();
    this.__active = ctrlToSwitchTo;

    this._delegateEvents(this.__active, prevActive);
  }

  async show() {
    if (this.nextOpen) {
      this.switchTo(this.nextOpen);
      this.nextOpen = null;
    }
    await this.active.show();
  }

  async hide() {
    await this.active.hide();
  }

  async toggle() {
    if (this.isShown === true) {
      await this.hide();
    } else {
      await this.show();
    }
  }

  get invokerNode() {
    return this.active.invokerNode;
  }

  _delegateEvents(active, prevActive) {
    ['show', 'hide'].forEach(event => {
      active.addEventListener(event, this.__delegateEvent);
      prevActive.removeEventListener(event, this.__delegateEvent);
    });
  }

  __delegateEvent(ev) {
    ev.stopPropagation();
    this.dispatchEvent(new Event(ev.type));
  }

  // TODO: this method has to be removed when EventTarget polyfill is available on IE11
  __fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }
}
