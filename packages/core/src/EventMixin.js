/* eslint-disable class-methods-use-this */

import { dedupeMixin } from './dedupeMixin.js';

/**
 * # EventMixin
 * `EventMixin` provides a declarative way for registering event handlers,
 * keeping performance and ease of use in mind
 *
 * **Deprecated**: Please use add/removeEventListener in connected/disconnectedCallback
 *
 * @deprecated
 * @example
 *   get events() {
 *     return {
 *       ...super.events,
 *       '_onButton1Click': [() => this.$id('button1'), 'click'],
 *       '_onButton2Focus': [() => this.$id('button2'), 'focus'],
 *       '_onButton2Blur': [() => this.$id('button2'), 'blur'],
 *     };
 *   }
 *   render() {
 *     return html`
 *       <button id="button1">with click event</button>
 *       <button id="button2">with focus + blur event</button>
 *     `;
 *   }
 *
 * @polymerMixin
 * @mixinFunction
 */
export const EventMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class EventMixin extends superclass {
      /**
       * @returns {{}}
       */
      get events() {
        return {};
      }

      constructor() {
        super();
        this.__eventsCache = [];
        this.__boundEvents = {};

        Object.keys(this.events).forEach(eventFunctionName => {
          this.__boundEvents[eventFunctionName] = this[eventFunctionName].bind(this);
        });
      }

      updated() {
        if (super.updated) super.updated();
        this.__registerEvents();
      }

      connectedCallback() {
        if (super.connectedCallback) super.connectedCallback();
        this.__registerEvents();
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) super.disconnectedCallback();
        this.__unregisterEvents();
      }

      /**
       * @private
       */
      __registerEvents() {
        Object.keys(this.events).forEach(eventFunctionName => {
          const [targetFunction, eventNames] = this.events[eventFunctionName];
          const target = targetFunction();
          if (target) {
            const eventFunction = this.__boundEvents[eventFunctionName];
            const eventNamesToProcess = typeof eventNames === 'string' ? [eventNames] : eventNames;
            eventNamesToProcess.forEach(eventName => {
              if (!this.constructor._isProcessed(target, eventName, eventFunction)) {
                target.addEventListener(eventName, eventFunction);
                this.__eventsCache.push([target, eventName, eventFunctionName]);
                this.constructor._markProcessed(target, eventName, eventFunction);
              }
            });
          }
        });
      }

      /**
       * @param {Object} target
       * @param {string} eventName
       * @param {function()} eventFunction
       * @returns {*|Boolean|boolean}
       * @private
       */
      static _isProcessed(target, eventName, eventFunction) {
        const mixinData = target.__eventMixinProcessed;
        return mixinData && mixinData[eventName] && mixinData[eventName].has(eventFunction);
      }

      /**
       * @param {Object} target
       * @param {string} eventName
       * @param {function()} eventFunction
       * @private
       */
      static _markProcessed(target, eventName, eventFunction) {
        let mixinData = target.__eventMixinProcessed;
        mixinData = mixinData || {};
        mixinData[eventName] = mixinData[eventName] || new Set();
        mixinData[eventName].add(eventFunction);
        target.__eventMixinProcessed = mixinData; // eslint-disable-line no-param-reassign
      }

      /**
       * @private
       */
      __unregisterEvents() {
        let data = this.__eventsCache.pop();
        while (data) {
          const [target, eventName, eventFunctionName] = data;
          const eventFunction = this.__boundEvents[eventFunctionName];
          target.removeEventListener(eventName, eventFunction);
          delete target.__eventMixinProcessed;
          data = this.__eventsCache.pop();
        }
      }
    },
);
