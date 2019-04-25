/* eslint-disable no-underscore-dangle */

import { dedupeMixin } from './dedupeMixin.js';

/**
 *
 * @returns {{$id: {}, $name: {}, $$id: {}, $$slot: {}}}
 */
function generateEmptyCache() {
  return {
    $id: {},
    $name: {},
    $$id: {},
    $$slot: {},
  };
}

/**
 * # DomHelpersMixin
 * `DomHelpersMixin` provides access to element in shadow and light DOM with "id" attribute,
 * it provides access to element in shadow DOM with "name" attribute and
 * provides access to element in Light DOM with "slot" attribute.
 * It memorizes element reference in cache and can be removed from cache
 * (individually or completely) via _clearDomCache().
 *
 * @example
 * this.$id('foo') to access the element with the id 'foo' in shadow DOM
 * this.$name('foo') to access the element with name 'foo' in shadow DOM
 * this.$$id('foo') to access the element with the id 'foo' when not in shadow DOM
 * this.$$slot('foo') to access the element with the slot 'foo' when in light DOM
 *
 * @type {function()}
 * @polymerMixin
 * @mixinFunction
 */
export const DomHelpersMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class DomHelpersMixin extends superclass {
      constructor() {
        super();
        this.__domHelpersCache = generateEmptyCache();
      }

      /**
       * To access an element with the id 'foo' in shadow DOM
       *
       * @param {number} id
       * @returns {*|undefined}
       */
      $id(id) {
        let element = this.__domHelpersCache.$id[id];
        if (!element) {
          element = this.shadowRoot.getElementById(id);
          this.__domHelpersCache.$id[id] = element;
        }

        return element || undefined;
      }

      /**
       * Provides access to the named slot node in shadow DOM for this name
       *
       * @param {string} name
       * @returns {*|undefined}
       */
      $name(name) {
        let element = this.__domHelpersCache.$name[name];
        if (!element) {
          element = this.shadowRoot.querySelector(`[name="${name}"]`);
          this.__domHelpersCache.$name[name] = element;
        }
        return element || undefined;
      }

      /**
       * To access an element with the id 'foo' in light DOM
       *
       * **Deprecated**: LightDom may change underneath you - you should not cache it
       *
       * @deprecated
       * @param {number} id
       * @returns {*|undefined}
       */
      $$id(id) {
        let element = this.__domHelpersCache.$$id[id];
        if (!element) {
          element = this.querySelector(`#${id}`);
          this.__domHelpersCache.$$id[id] = element;
        }
        return element || undefined;
      }

      /**
       * To access the element with the slot 'foo' when in light DOM
       *
       * **Deprecated**: LightDom may change underneath you - you should not cache it
       *
       * @deprecated
       * @param {string} slot
       * @returns {*|undefined}
       */
      $$slot(slot) {
        let element = this.__domHelpersCache.$$slot[slot];
        if (!element) {
          element = Array.from(this.children).find(child => child.slot === slot);
          this.__domHelpersCache.$$slot[slot] = element;
        }
        return element || undefined;
      }

      /**
       * Remove from cache (individually or completely) via _clearDomCache()
       *
       * @param {string} type
       * @param {number} id
       * @private
       */
      _clearDomCache(type, id) {
        if (type) {
          this.__domHelpersCache[type][id] = undefined;
        } else {
          this.__domHelpersCache = generateEmptyCache();
        }
      }
    },
);
