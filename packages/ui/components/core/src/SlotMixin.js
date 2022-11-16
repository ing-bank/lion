/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { render } from 'lit';
import { isTemplateResult } from 'lit/directive-helpers.js';

/**
 * @typedef {import('../types/SlotMixinTypes.js').SlotMixin} SlotMixin
 * @typedef {import('../types/SlotMixinTypes.js').SlotsMap} SlotsMap
 * @typedef {import('../types/SlotMixinTypes.js').SlotFunctionResult} SlotFunctionResult
 * @typedef {import('../types/SlotMixinTypes.js').SlotRerenderObject} SlotRerenderObject
 * @typedef {import('lit').LitElement} LitElement
 */

const isRerenderConfig = (/** @type {SlotFunctionResult} */ o) =>
  !Array.isArray(o) && typeof o === 'object' && 'template' in o;

/**
 * All intricacies involved in managing light dom can be delegated to SlotMixin. Amongst others, it automatically:
 * - mediates between light dom provided by the user ('public slots') and light dom provided by the component author ('private slots').
 * - allows to hook into the reactive update loop of LitElement (rerendering on property changes)
 * - respects the scoped registry belonging to the shadow root.
 *
 * Be sure to read all details about SlotMixin in the [SlotMixin documentation](docs/fundamentals/systems/core/SlotMixin.md)
 *
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

      /**
       * The roots that are used to do a rerender in.
       * In case of a SlotRerenderObject, this will create a render wrapper in the scoped context (shadow root)
       * and connect this under the slot name to the light dom. All (re)renders will happen from here,
       * so that all interactions work as intended and no focus issues can arise (which would be the case
       * when (cloned) nodes of a render outcome would be moved around)
       * @private
       * @type { Map<string, HTMLDivElement> } */
      this.__scopedRenderRoots = new Map();
      /**
       * @private
       * @type {Set<string>}
       */
      this.__slotsThatNeedRerender = new Set();
      /**
       * Those are slots that should not be touched by SlotMixin
       * @private
       * @type {Set<string>}
       */
      this.__slotsProvidedByUserOnFirstConnected = new Set();
      /**
       * Those are slots that should be touched by SlotMixin
       * The opposite of __slotsProvidedByUserOnFirstConnected,
       * also taking into account undefined (a.k.a. conditional) slots
       * @private
       * @type {Set<string>}
       */
      this.__privateSlots = new Set();
    }

    connectedCallback() {
      super.connectedCallback();
      this._connectSlotMixin();
    }

    /**
     * @param {string} slotName
     */
    __rerenderSlot(slotName) {
      const slotFunctionResult = /** @type {SlotRerenderObject} */ (this.slots[slotName]());
      this.__renderTemplateInScopedContext({
        template: slotFunctionResult.template,
        slotName,
        shouldRerender: true,
      });
      slotFunctionResult.afterRender?.();
    }

    /**
     * Here we rerender slots defined with a `SlotRerenderObject`
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (this.__slotsThatNeedRerender.size) {
        for (const slotName of Array.from(this.__slotsThatNeedRerender)) {
          this.__rerenderSlot(slotName);
        }
      }

      if (this.__isFirstSlotUpdate) {
        this.__isFirstSlotUpdate = false;
      }
    }

    /**
     * @private
     * @param {object} opts
     * @param {import('lit').TemplateResult} opts.template
     * @param {string} opts.slotName
     * @param {boolean} [opts.shouldRerender] false when TemplateResult, true when SlotRerenderObject
     */
    __renderTemplateInScopedContext({ template, slotName, shouldRerender }) {
      // @ts-expect-error wait for browser support
      const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;
      const registryRoot = supportsScopedRegistry ? this.shadowRoot : document;

      let renderTarget;
      // Reuse the existing offline renderTargets for results consistent with that of rendering to one target (shadow dom)
      if (this.__scopedRenderRoots.has(slotName)) {
        renderTarget = this.__scopedRenderRoots.get(slotName);
      } else {
        // @ts-expect-error wait for browser support
        renderTarget = registryRoot.createElement('div');
        if (shouldRerender) {
          renderTarget.slot = slotName;
          this.appendChild(renderTarget);
        }
        this.__scopedRenderRoots.set(slotName, renderTarget);
      }

      // Providing all options breaks Safari; keep host and creationScope
      const { creationScope, host } = this.renderOptions;
      render(template, renderTarget, { creationScope, host });

      return renderTarget;
    }

    /**
     * @param {object} options
     * @param {Node[]} options.nodes
     * @param {Element} [options.renderParent] It's recommended to create a render target in light dom (like <div slot=myslot>),
     * which can be used as a render target for most
     * @param {string} options.slotName For the first render, it's best to use slotName
     */
    __appendNodesForOneTimeRender({ nodes, renderParent = this, slotName }) {
      for (const node of nodes) {
        if (!(node instanceof Node)) {
          return;
        }
        // Here, we add the slot name to the node that is an element
        // (ignoring helper comment nodes that might be in our nodes array)
        if (node instanceof Element && slotName && slotName !== '') {
          node.setAttribute('slot', slotName);
        }
        renderParent.appendChild(node);
      }
    }

    /**
     * Here we look what's inside our `get slots`.
     * Rerenderable slots get scheduled and "one time slots" get rendered once on connected
     * @param {string[]} slotNames
     */
    __initSlots(slotNames) {
      for (const slotName of slotNames) {
        if (this.__slotsProvidedByUserOnFirstConnected.has(slotName)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const slotFunctionResult = this.slots[slotName]();
        // Allow to conditionally return a slot
        if (slotFunctionResult === undefined) {
          return;
        }

        if (!this.__isConnectedSlotMixin) {
          this.__privateSlots.add(slotName);
        }

        if (isTemplateResult(slotFunctionResult)) {
          const renderTarget = this.__renderTemplateInScopedContext({
            template: slotFunctionResult,
            slotName,
          });
          const nodes = Array.from(renderTarget.childNodes);
          this.__appendNodesForOneTimeRender({ nodes, renderParent: this, slotName });
        } else if (slotFunctionResult instanceof Node) {
          const nodes = [/** @type {Node} */ (slotFunctionResult)];
          this.__appendNodesForOneTimeRender({ nodes, renderParent: this, slotName });
        } else if (isRerenderConfig(slotFunctionResult)) {
          // Rerenderable slots are scheduled in the "updated loop"
          this.__slotsThatNeedRerender.add(slotName);
        } else {
          throw new Error(
            'Please provide a function inside "get slots()" returning TemplateResult | Node | {template:TemplateResult, afterRender?:function} | undefined',
          );
        }
      }
    }

    /**
     * @protected
     */
    _connectSlotMixin() {
      if (this.__isConnectedSlotMixin) {
        return;
      }

      const allSlots = Object.keys(this.slots);

      for (const slotName of allSlots) {
        const hasSlottableFromUser =
          slotName === ''
            ? // for default slot (''), we can't use el.slot because polyfill for IE11
              // will do .querySelector('[slot=]') which produces a fatal error
              // therefore we check if there's children that do not have a slot attr
              Array.from(this.children).find(el => !el.hasAttribute('slot'))
            : Array.from(this.children).find(el => el.slot === slotName);

        if (hasSlottableFromUser) {
          this.__slotsProvidedByUserOnFirstConnected.add(slotName);
        }
      }

      this.__initSlots(allSlots);
      this.__isConnectedSlotMixin = true;
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
