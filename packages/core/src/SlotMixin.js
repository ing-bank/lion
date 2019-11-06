/* eslint-disable class-methods-use-this */

import { dedupeMixin } from './dedupeMixin.js';

/**
 * # SlotMixin
 * `SlotMixin`, when attached to the DOM it creates content for defined slots in the Light DOM.
 * The content element is created using a factory function and is assigned a slot name from the key.
 * Existing slot content is not overridden.
 *
 * The purpose is to have the default content in the Light DOM rather than hidden in Shadow DOM
 * like default slot content works natively.
 *
 * @example
 * get slots() {
 *   return {
 *     ...super.slots,
 *     // appends <div slot="foo"></div> to the Light DOM of this element
 *     foo: () => document.createElement('div'),
 *   };
 * }
 *
 * @type {function()}
 * @polymerMixin
 * @mixinFunction
 */
export const SlotMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow
    class SlotMixin extends superclass {
      /**
       * @returns {{}}
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

      /**
       * @protected
       */
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

      /**
       * @protected
       * @param {string} slotName Name of the slot
       * @return {boolean} true if given slot name been created by SlotMixin
       */
      _isPrivateSlot(slotName) {
        return this.__privateSlots.has(slotName);
      }
    },
);
