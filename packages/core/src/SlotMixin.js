/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('./types').SlotMixin} SlotMixin
 * @typedef {import('./types').SlotsMap} SlotsMap
 * @typedef {import("lit-element").LitElement} LitElement
 */

/** @type {SlotMixin} */
const SlotMixinImplementation = superclass =>
  // eslint-disable-next-line no-unused-vars, no-shadow
  class SlotMixinHost extends superclass {
    get slots() {
      return {};
    }

    constructor() {
      super();
      this.__privateSlots = new Set(null);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this._connectSlotMixin();
    }

    _connectSlotMixin() {
      if (!this.__isConnectedSlotMixin) {
        Object.keys(this.slots).forEach(slotName => {
          if (!this.querySelector(`[slot=${slotName}]`)) {
            const slotFactory = this.slots[slotName];
            const slotContent = slotFactory();
            if (slotContent instanceof Element) {
              slotContent.setAttribute('slot', slotName);
              this.appendChild(slotContent);
              this.__privateSlots.add(slotName);
            } // ignore non-elements to enable conditional slots
          }
        });
        this.__isConnectedSlotMixin = true;
      }
    }

    _isPrivateSlot(slotName) {
      return this.__privateSlots.has(slotName);
    }
  };

export const SlotMixin = dedupeMixin(SlotMixinImplementation);
