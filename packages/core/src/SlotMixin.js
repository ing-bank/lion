/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('../types/SlotMixinTypes').SlotMixin} SlotMixin
 * @typedef {import('../types/SlotMixinTypes').SlotsMap} SlotsMap
 */

/** @type {SlotMixin} */
const SlotMixinImplementation = superclass =>
  // eslint-disable-next-line no-unused-vars, no-shadow
  class SlotMixinHost extends superclass {
    /**
     * @return {SlotsMap}
     */
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
            // ignore non-elements to enable conditional slots
            if (slotContent instanceof Element) {
              slotContent.setAttribute('slot', slotName);
              this.appendChild(slotContent);
              this.__privateSlots.add(slotName);
            }
          }
        });
        this.__isConnectedSlotMixin = true;
      }
    }

    /**
     * @param {string} slotName Name of the slot
     * @return {boolean} true if given slot name been created by SlotMixin
     */
    _isPrivateSlot(slotName) {
      return this.__privateSlots.has(slotName);
    }
  };

export const SlotMixin = dedupeMixin(SlotMixinImplementation);
