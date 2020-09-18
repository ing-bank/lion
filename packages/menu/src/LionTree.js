import { LitElement } from '@lion/core';
import { MultiLevelListMixin } from './MultiLevelListMixin.js';

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

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('level')) {
      if (this.level > 0) {
        this._listNode.setAttribute('role', 'group');
      }
      this.__setAriaLevelForListItems();
    }
  }

  _initListItems(newItems) {
    super._initListItems(newItems);

    this.__setAriaLevelForListItems();
    newItems.forEach((item, index) => {
      item.setAttribute('aria-posinset', `${index + 1}`);
      item.setAttribute('aria-setsize', `${this.listItems.length}`);
    });
  }

  __setAriaLevelForListItems() {
    this.listItems.forEach(item => {
      item.setAttribute('aria-level', `${this.level + 1}`);
    });
  }
}
