import { dedupeMixin } from './dedupeMixin.js';

/**
 *
 * @type {Symbol}
 */
const undefinedSymbol = Symbol('this value should actually be undefined when passing on');

/**
 * # ObserverMixin
 * `ObserverMixin` warns the developer if something unexpected happens and provides
 * triggerObserversFor() which can be used within a setter to hook into the observer system.
 * It has syncObservers, which call observers immediately when the observed property
 * is changed (newValue !== oldValue) and asyncObservers, which makes only one call
 * to observer even if multiple observed attributes changed.
 *
 * **Deprecated**: Please use LitElement update/updated instead.
 *
 * @deprecated
 * @type {function()}
 * @polymerMixin
 * @mixinFunction
 */
export const ObserverMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class ObserverMixin extends superclass {
      /**
       * @returns {{}}
       */
      static get syncObservers() {
        return {};
      }

      /**
       * @returns {{}}
       */
      static get asyncObservers() {
        return {};
      }

      constructor() {
        super();
        this.__initializeObservers('sync');
        this.__initializeObservers('async');
        this.__asyncObserversQueue = {};
        this.__asyncObserversNewValues = {};
        this.__asyncObserversOldValues = {};
      }

      /**
       * @param {string} property
       * @param {*} newValue
       * @param {*} oldValue
       */
      triggerObserversFor(property, newValue, oldValue) {
        this.__executeSyncObserversFor(property, newValue, oldValue);
        this.__addToAsyncObserversQueue(property, newValue, oldValue);
        this.updateComplete.then(() => {
          this.__emptyAsyncObserversQueue();
        });
      }

      /**
       * Sync hooks into UpdatingElement mixin
       *
       * @param {string} property
       * @param {any} oldValue
       * @private
       */
      _requestUpdate(property, oldValue) {
        super._requestUpdate(property, oldValue);
        this.__executeSyncObserversFor(property, this[property], oldValue);
      }

      /**
       * Async hook into Updating Element
       *
       * @param {Map} changedProperties
       */
      update(changedProperties) {
        super.update(changedProperties);
        this.__addMultipleToAsyncObserversQueue(changedProperties);
        this.__emptyAsyncObserversQueue();
      }

      /**
       * @param {string} type
       * @private
       */
      __initializeObservers(type) {
        this[`__${type}ObserversForProperty`] = {};
        Object.keys(this.constructor[`${type}Observers`]).forEach(observerFunctionName => {
          const propertiesToObserve = this.constructor[`${type}Observers`][observerFunctionName];
          if (typeof this[observerFunctionName] === 'function') {
            propertiesToObserve.forEach(property => {
              if (!this[`__${type}ObserversForProperty`][property]) {
                this[`__${type}ObserversForProperty`][property] = [];
              }
              this[`__${type}ObserversForProperty`][property].push(observerFunctionName);
            });
          } else {
            throw new Error(
              `${this.localName} does not have a function called ${observerFunctionName}`,
            );
          }
        });
      }

      /**
       * @param {string} observedProperty
       * @param {*} newValue
       * @param {*} oldValue
       * @private
       */
      __executeSyncObserversFor(observedProperty, newValue, oldValue) {
        if (newValue === oldValue) return;
        const functionsToCall = {};
        if (this.__syncObserversForProperty[observedProperty]) {
          this.__syncObserversForProperty[observedProperty].forEach(observerFunctionName => {
            functionsToCall[observerFunctionName] = true;
          });
        }

        Object.keys(functionsToCall).forEach(functionName => {
          const newValues = {};
          const oldValues = {};
          this.constructor.syncObservers[functionName].forEach(property => {
            newValues[property] = observedProperty === property ? newValue : this[property];
            oldValues[property] = observedProperty === property ? oldValue : this[property];
          });
          this[functionName](newValues, oldValues);
        });
      }

      /**
       * @param {string} property
       * @param {*} newValue
       * @param {*} oldValue
       * @private
       */
      __addToAsyncObserversQueue(property, newValue, oldValue) {
        this.__asyncObserversNewValues[property] = newValue;
        if (this.__asyncObserversOldValues[property] === undefined) {
          // only get old value once
          this.__asyncObserversOldValues[property] = oldValue;
        }
        if (oldValue === undefined) {
          // special case for undefined
          this.__asyncObserversOldValues[property] = undefinedSymbol;
        }
        if (this.__asyncObserversForProperty[property]) {
          this.__asyncObserversForProperty[property].forEach(observerFunctionName => {
            this.__asyncObserversQueue[observerFunctionName] = true;
          });
        }
      }

      /**
       * @param {Map} oldValues
       * @private
       */
      __addMultipleToAsyncObserversQueue(oldValues) {
        if (!oldValues) return;
        oldValues.forEach((oldValue, property) => {
          this.__addToAsyncObserversQueue(property, this[property], oldValue);
        });
      }

      /**
       * @private
       */
      __emptyAsyncObserversQueue() {
        Object.keys(this.__asyncObserversQueue).forEach(functionName => {
          this[functionName](
            this.__asyncObserversNewValues,
            this.__getOldValuesWithRealUndefined(),
          );
        });
        this.__asyncObserversNewValues = {};
        this.__asyncObserversOldValues = {};
        this.__asyncObserversQueue = {};
      }

      /**
       * @returns {{}}
       * @private
       */
      __getOldValuesWithRealUndefined() {
        const result = {};
        Object.keys(this.__asyncObserversOldValues).forEach(key => {
          const value = this.__asyncObserversOldValues[key];
          result[key] = value === undefinedSymbol ? undefined : value;
        });
        return result;
      }
    },
);
