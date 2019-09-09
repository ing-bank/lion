import { dedupeMixin } from '@lion/core';

/**
 * @desc Why this mixin?
 * - it adheres to the "Member Order Independence" web components standard:
 * https://github.com/webcomponents/gold-standard/wiki/Member-Order-Independence
 * - sync observers can be dependent on the outcome of the render function (or, more generically
 * speaking, the light and shadow dom). This aligns with the 'updated' callback that is supported
 * out of the box by LitElement, which runs after connectedCallback as well.
 * - makes the propertyAccessor.`hasChanged` compatible in synchronous updates:
 * `updateSync` will only be called when new value differs from old value.
 * See: https://lit-element.polymer-project.org/guide/lifecycle#haschanged
 * - it is a stable abstaction on top of a protected/non offical lifecycle LitElement api.
 * Whenever the implementation of `_requestUpdate` changes (this happened in the past for
 * `requestUpdate`) we only have to change our abstraction instead of all our components
 */
export const SyncUpdatableMixin = dedupeMixin(
  superclass =>
    class SyncUpdatable extends superclass {
      constructor() {
        super();
        // Namespace for this mixin that guaruantees naming clashes will not occur...
        this.__SyncUpdatableNamespace = {};
      }

      connectedCallback() {
        super.connectedCallback();
        this.__SyncUpdatableNamespace.connected = true;
        this.__syncUpdatableInitialize();
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this.__SyncUpdatableNamespace.connected = false;
      }

      /**
       * Makes the propertyAccessor.`hasChanged` compatible in synchronous updates
       * @param {string} name
       * @param {*} oldValue
       */
      static __syncUpdatableHasChanged(name, newValue, oldValue) {
        const properties = this._classProperties;
        if (properties.get(name) && properties.get(name).hasChanged) {
          return properties.get(name).hasChanged(newValue, oldValue);
        }
        return this[name] !== oldValue;
      }

      __syncUpdatableInitialize() {
        const ns = this.__SyncUpdatableNamespace;
        const ctor = this.constructor;

        ns.initialized = true;
        // Empty queue...
        ns.queue.forEach(({ name, oldValue }) => {
          if (ctor.__syncUpdatableHasChanged(name, this[name], oldValue)) {
            this.updateSync(name, oldValue);
          }
        });
      }

      _requestUpdate(name, oldValue) {
        super._requestUpdate(name, oldValue);

        this.__SyncUpdatableNamespace = this.__SyncUpdatableNamespace || {};
        const ns = this.__SyncUpdatableNamespace;
        const ctor = this.constructor;

        // Before connectedCallback: queue
        if (!ns.connected) {
          ns.queue = ns.queue || [];
          ns.queue.push({ name, oldValue });
        } // After connectedCallback: guarded proxy to updateSync
        else if (ctor.__syncUpdatableHasChanged(name, this[name], oldValue)) {
          this.updateSync(name, oldValue);
        }
      }

      /**
       * @desc A public abstraction that has the exact same api as `_requestUpdate`.
       * All code previously present in _requestUpdate can be placed in this method.
       * @param {string} name
       * @param {*} oldValue
       */
      updateSync(name, oldValue) {} // eslint-disable-line class-methods-use-this, no-unused-vars
    },
);
