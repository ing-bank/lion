/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

import { LitElement, css, html } from '@lion/core';
import '@lion/listbox/lion-listbox.js';

/** @typedef {{choiceValue: string, checked: boolean, active: boolean}} ListOption */
/**
 * LionTransfer: provide functionality to shift items between listboxes
 * which indeed implicitly provide all wai-aria listbox design pattern and integrates it as a Lion
 * @customElement lion-transfer
 */
export class LionTransfer extends LitElement {
  /**
   * Instance of the element is created/upgraded. Useful for initializing
   * state, set up event listeners, create shadow dom.

   * @constructor
   */
  constructor() {
    super();
    /** @type {Array.<ListOption>} */
    this.leftList = [];
    /** @type {Array.<ListOption>} */
    this.rightList = [];
    this.shouldTransfer = false;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
      }

      .action-panel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: auto 16px;
      }
    `;
  }

  render() {
    return html`
      <lion-listbox id="leftListBox" multiple-choice></lion-listbox>
      <div class="action-panel">
        <slot
          name="transferToRightActionSlot"
          @click=${this._handleTransferToRight.bind(this)}
        ></slot>
        <slot
          name="transferToLeftActionSlot"
          @click=${this._handleTransferToLeft.bind(this)}
        ></slot>
      </div>
      <lion-listbox id="rightListBox" multiple-choice></lion-listbox>

      <slot id="leftListSlot" name="leftList"></slot>
      <slot id="rightListSlot" name="rightList"></slot>
    `;
  }

  /**
   * click handler on right list box slot
   * @protected
   */
  _handleTransferToRight() {
    this._transferingOptions('leftList', 'rightList');
  }

  /**
   * click handler on left list box slot
   * @protected
   */
  _handleTransferToLeft() {
    this._transferingOptions('rightList', 'leftList');
  }

  get modelValue() {
    return {
      left: this.leftList?.map(el => el.choiceValue) || [],
      right: this.rightList?.map(el => el.choiceValue) || [],
    };
  }

  firstUpdated() {
    this.leftListBox = this.shadowRoot?.querySelector('#leftListBox');
    this.rightListBox = this.shadowRoot?.querySelector('#rightListBox');

    const leftListSlot = /** @type {HTMLSlotElement} */ (
      /** @type {ShadowRoot} */ this.shadowRoot?.querySelector('#leftListSlot')
    );
    const rightListSlot = /** @type {HTMLSlotElement} */ (
      /** @type {ShadowRoot} */ this.shadowRoot?.querySelector('#rightListSlot')
    );

    [leftListSlot, rightListSlot].forEach(slot => {
      slot?.addEventListener('slotchange', () => {
        const nodes = /** @type {HTMLElement[]} */ (slot?.assignedNodes());
        const itemCollection = nodes[0]?.children;
        const slotType = slot?.id.replace('Slot', '');

        this[slotType] = Array.from(itemCollection);
        this[slotType].forEach(
          /** @param {ListOption & HTMLElement} option */ option => {
            option.choiceValue = option.getAttribute('.choicevalue') || ''; // eslint-disable-line no-param-reassign
            option.removeAttribute('.choicevalue');
          },
        );
        this.shouldTransfer = true;
        this._renderOptions(slotType);
      });
    });
  }

  /**
   * render the options into the listboxes
   * @param {String} listName e.g. leftList|rightList
   * @protected
   */
  _renderOptions(listName) {
    this._clearOptions(listName);

    this[listName]?.forEach(
      /** @param {HTMLElement} el */ el => {
        this[`${listName}Box`]?._inputNode?.appendChild(el);
      },
    );
  }

  /**
   * transfer options between listboxes left to right or reverse
   * @param {String} fromListName e.g. leftList|rightList
   * @param {String} toListName e.g. leftList|rightList
   * @protected
   */
  _transferingOptions(fromListName, toListName) {
    const selected =
      this[fromListName]?.filter(/** @param {ListOption} item */ item => item.checked) || [];

    this[fromListName] =
      this[fromListName]?.filter(/** @param {ListOption} item */ item => !item.checked) || [];
    this.shouldTransfer = false;
    selected.forEach(
      /** @param {ListOption} element */ element => {
        this.shouldTransfer = true;
        element.checked = false; // eslint-disable-line no-param-reassign
        element.active = false; // eslint-disable-line no-param-reassign
      },
    );

    this[toListName] = [...this[toListName], ...selected];

    if (this.shouldTransfer) {
      this._renderOptions('leftList');
      this._renderOptions('rightList');
    }
  }

  /**
   * remove the list options
   * @param {String} listName name of the list e.g. leftList|rightList
   * @protected
   */
  _clearOptions(listName) {
    let lastChild = this[`${listName}Box`]?._inputNode?.lastChild;

    while (lastChild) {
      lastChild.remove();
      lastChild = this[`${listName}Box`]?._inputNode?.lastChild;
    }
  }
}
