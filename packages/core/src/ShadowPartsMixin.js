/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('../types/ShadowPartsMixinTypes').ShadowPartsMixin} ShadowPartsMixin
 */

/**
 * @type {ShadowPartsMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<HTMLElement>} superclass
 */
const ShadowPartsMixinImplementation = superclass =>
  // eslint-disable-next-line no-unused-vars, no-shadow
  class extends superclass {
    static get _shadowParts() {
      return [];
    }

    static get exposeParts() {
      return this.name.startsWith('Lion') ? this._shadowParts : [];
    }

    /**
     * Decide if part should be include or not.
     *
     * @param {string} part
     */
    static _renderPart(part) {
      return this.exposeParts.includes(part) ? part : '';
    }
  };

export const ShadowPartsMixin = dedupeMixin(ShadowPartsMixinImplementation);
