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
    this.active.switchOut();
    ctrlToSwitchTo.switchIn();
    this.__active = ctrlToSwitchTo;
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
}
