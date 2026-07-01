/* eslint-disable import/no-extraneous-dependencies */
import { LitElement } from 'lit';
import { MultiLevelListMixin } from './MultiLevelListMixin.js';

// @ts-ignore - class extension with mixin
export class LionTree extends MultiLevelListMixin(LitElement) {
  constructor() {
    super();

    /** @configure InteractiveListMixin */
    this._listRole = 'tree';
    /** @configure InteractiveListMixin */
    this._activateOnTypedChars = true;
    /** @configure DisclosureMixin */
    this.invokerInteraction = 'click';
  }

  /**
   * @param {*} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('level')) {
      if (this.level > 1) {
        this._listNode.setAttribute('role', 'group');
      }
      this.__setAriaLevelForListItems();
    }
  }

  /**
   * @param {*} newItems
   */
  _initListItems(newItems) {
    // @ts-ignore - parameter types
    super._initListItems(newItems);

    this.__setAriaLevelForListItems();
    // @ts-ignore - forEach parameters
    newItems.forEach((item, index) => {
      item.setAttribute('aria-posinset', `${index + 1}`);
      item.setAttribute('aria-setsize', `${this.listItems.length}`);
    });
  }

  __setAriaLevelForListItems() {
    this.listItems.forEach(item => {
      item.setAttribute?.('aria-level', `${this.level + 1}`);
    });
  }
}
