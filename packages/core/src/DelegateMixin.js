/* eslint-disable class-methods-use-this */

import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * # DelegateMixin
 * Forwards defined events, methods, properties and attributes to the defined target.
 *
 * @example
 * get delegations() {
 *   return {
 *     ...super.delegations,
 *     target: () => this.shadowRoot.getElementById('button1'),
 *     events: ['click'],
 *     methods: ['click'],
 *     properties: ['disabled'],
 *     attributes: ['disabled'],
 *   };
 * }
 *
 * render() {
 *   return html`
 *     <button id="button1">with delegation</button>
 *   `;
 * }
 *
 * @type {function()}
 * @polymerMixin
 * @mixinFunction
 */
export const DelegateMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class DelegateMixin extends superclass {
      constructor() {
        super();
        this.__eventsQueue = [];
        this.__propertiesQueue = {};
        this.__setupPropertyDelegation();
      }

      /**
       * @returns {{target: null, events: Array, methods: Array, properties: Array, attributes: Array}}
       */
      get delegations() {
        return {
          target: null,
          events: [],
          methods: [],
          properties: [],
          attributes: [],
        };
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this._connectDelegateMixin();
      }

      updated(...args) {
        super.updated(...args);
        this._connectDelegateMixin();
      }

      /**
       * @param {string} type
       * @param {Object} args
       */
      addEventListener(type, ...args) {
        const delegatedEvents = this.delegations.events;
        if (delegatedEvents.indexOf(type) > -1) {
          if (this.delegationTarget) {
            this.delegationTarget.addEventListener(type, ...args);
          } else {
            this.__eventsQueue.push({ type, args });
          }
        } else {
          super.addEventListener(type, ...args);
        }
      }

      /**
       * @param {string} name
       * @param {string} value
       */
      setAttribute(name, value) {
        const attributeNames = this.delegations.attributes;
        if (attributeNames.indexOf(name) > -1) {
          if (this.delegationTarget) {
            this.delegationTarget.setAttribute(name, value);
          }
          super.removeAttribute(name);
        } else {
          super.setAttribute(name, value);
        }
      }

      /**
       * @param {string} name
       */
      removeAttribute(name) {
        const attributeNames = this.delegations.attributes;
        if (attributeNames.indexOf(name) > -1) {
          if (this.delegationTarget) {
            this.delegationTarget.removeAttribute(name);
          }
        }
        super.removeAttribute(name);
      }

      /**
       * @protected
       */
      _connectDelegateMixin() {
        if (this.__connectedDelegateMixin) return;

        if (!this.delegationTarget) {
          this.delegationTarget = this.delegations.target();
        }

        if (this.delegationTarget) {
          this.__emptyEventListenerQueue();
          this.__emptyPropertiesQueue();
          this.__initialAttributeDelegation();

          this.__connectedDelegateMixin = true;
        }
      }

      /**
       * @private
       */
      __setupPropertyDelegation() {
        const propertyNames = this.delegations.properties.concat(this.delegations.methods);
        propertyNames.forEach(propertyName => {
          Object.defineProperty(this, propertyName, {
            get() {
              const target = this.delegationTarget;
              if (target) {
                if (typeof target[propertyName] === 'function') {
                  return target[propertyName].bind(target);
                }
                return target[propertyName];
              }
              if (this.__propertiesQueue[propertyName]) {
                return this.__propertiesQueue[propertyName];
              }
              // This is the moment the attribute is not delegated (and thus removed) yet.
              // and the property is not set, but the attribute is (it serves as a fallback for
              // __propertiesQueue).
              return this.getAttribute(propertyName);
            },
            set(newValue) {
              if (this.delegationTarget) {
                const oldValue = this.delegationTarget[propertyName];
                this.delegationTarget[propertyName] = newValue;
                // connect with observer system if available
                if (typeof this.triggerObserversFor === 'function') {
                  this.triggerObserversFor(propertyName, newValue, oldValue);
                }
              } else {
                this.__propertiesQueue[propertyName] = newValue;
              }
            },
          });
        });
      }

      /**
       * @private
       */
      __initialAttributeDelegation() {
        const attributeNames = this.delegations.attributes;
        attributeNames.forEach(attributeName => {
          const attributeValue = this.getAttribute(attributeName);
          if (typeof attributeValue === 'string') {
            this.delegationTarget.setAttribute(attributeName, attributeValue);
            super.removeAttribute(attributeName);
          }
        });
      }

      /**
       * @private
       */
      __emptyEventListenerQueue() {
        this.__eventsQueue.forEach(ev => {
          this.delegationTarget.addEventListener(ev.type, ...ev.args);
        });
      }

      /**
       * @private
       */
      __emptyPropertiesQueue() {
        Object.keys(this.__propertiesQueue).forEach(propName => {
          this.delegationTarget[propName] = this.__propertiesQueue[propName];
        });
      }
    },
);
