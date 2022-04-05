/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { render } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';

/**
 * @typedef {import('../types/SlotMixinTypes').SlotMixin} SlotMixin
 * @typedef {import('../types/SlotMixinTypes').SlotsMap} SlotsMap
 * @typedef {import('../index').LitElement} LitElement
 */

/**
 * @type {SlotMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<LitElement>} superclass
 */
const SlotMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class SlotMixin extends superclass {
    /**
     * @return {SlotsMap}
     */
    get slots() {
      return {};
    }

    constructor() {
      super();
      /** @private */
      this.__privateSlots = new Set(null);
    }

    connectedCallback() {
      super.connectedCallback();
      this._connectSlotMixin();
    }

    /**
     * @private
     * @param {import('@lion/core').TemplateResult} template
     */
    __renderAsNodes(template) {
      // @ts-expect-error wait for browser support
      const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;
      const registryRoot = supportsScopedRegistry ? this.shadowRoot : document;
      // @ts-expect-error wait for browser support
      const tempRenderTarget = registryRoot.createElement('div');
      render(template, tempRenderTarget, this.renderOptions);
      return Array.from(tempRenderTarget.childNodes);
    }

    /**
     * @protected
     */
    _connectSlotMixin() {
      if (!this.__isConnectedSlotMixin) {
        Object.keys(this.slots).forEach(slotName => {
          const hasSlottableFromUser =
            slotName === ''
              ? // for default slot (''), we can't use el.slot because polyfill for IE11
                // will do .querySelector('[slot=]') which produces a fatal error
                // therefore we check if there's children that do not have a slot attr
                Array.from(this.children).find(el => !el.hasAttribute('slot'))
              : Array.from(this.children).find(el => el.slot === slotName);

          if (!hasSlottableFromUser) {
            const slotContent = this.slots[slotName]();
            /** @type {Node[]} */
            let nodes = [];

            if (isTemplateResult(slotContent)) {
              nodes = this.__renderAsNodes(slotContent);
            } else if (!Array.isArray(slotContent)) {
              nodes = [/** @type {Node} */ (slotContent)];
            }

            nodes.forEach(node => {
              if (!(node instanceof Node)) {
                return;
              }
              if (node instanceof Element && slotName !== '') {
                node.setAttribute('slot', slotName);
              }
              this.appendChild(node);
              this.__privateSlots.add(slotName);
            });
          }
        });
        this.__isConnectedSlotMixin = true;
      }
    }

    /**
     * @param {string} slotName Name of the slot
     * @return {boolean} true if given slot name been created by SlotMixin
     * @protected
     */
    _isPrivateSlot(slotName) {
      return this.__privateSlots.has(slotName);
    }
  };

export const SlotMixin = dedupeMixin(SlotMixinImplementation);
