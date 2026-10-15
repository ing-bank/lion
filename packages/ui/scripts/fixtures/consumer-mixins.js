import { SlotMixin } from '@lion/ui/core.js';
import { ValidateMixin } from '@lion/ui/form-core.js';
import { ScopedMixin } from './consumer-mixins-types.js';

/** @type {import('./consumer-mixins-types.js').ValidationExtension} */
export const ValidationExtension = base =>
  class extends ScopedMixin(ValidateMixin(SlotMixin(base))) {
    static get scopedElements() {
      return { 'consumer-feedback': HTMLElement };
    }

    get slots() {
      return { ...super.slots, feedback: () => document.createElement('span') };
    }
  };
