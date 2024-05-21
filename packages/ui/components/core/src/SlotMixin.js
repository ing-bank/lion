/* eslint-disable class-methods-use-this */
import { isTemplateResult } from 'lit/directive-helpers.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { render } from 'lit';

/**
 * @typedef {{renderBefore:Comment; renderTargetThatRespectsShadowRootScoping: HTMLDivElement}} RenderMetaObj
 * @typedef {import('../types/SlotMixinTypes.js').SlotFunctionResult} SlotFunctionResult
 * @typedef {import('../types/SlotMixinTypes.js').SlotRerenderObject} SlotRerenderObject
 * @typedef {import('../types/SlotMixinTypes.js').SlotMixin} SlotMixin
 * @typedef {import('../types/SlotMixinTypes.js').SlotsMap} SlotsMap
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * @param {SlotFunctionResult} slotFunctionResult
 * @returns {'template-result'|'node'|'slot-rerender-object'|null}
 */
function determineSlotFunctionResultType(slotFunctionResult) {
  if (slotFunctionResult instanceof Node) {
    return 'node';
  }
  if (isTemplateResult(slotFunctionResult)) {
    return 'template-result';
  }
  if (
    !Array.isArray(slotFunctionResult) &&
    typeof slotFunctionResult === 'object' &&
    'template' in slotFunctionResult
  ) {
    return 'slot-rerender-object';
  }
  return null;
}

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
       * @type { Map<string, RenderMetaObj> } */
      this.__renderMetaPerSlot = new Map();
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
        renderAsDirectHostChild: slotFunctionResult.renderAsDirectHostChild,
        template: slotFunctionResult.template,
        slotName,
      });
      // TODO: this is deprecated, remove later
      slotFunctionResult.afterRender?.();
    }

    /**
     * Here we rerender slots defined with a `SlotRerenderObject`
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    update(changedProperties) {
      super.update(changedProperties);

      for (const slotName of this.__slotsThatNeedRerender) {
        this.__rerenderSlot(slotName);
      }
    }

    /**
     * @private
     * @param {object} opts
     * @param {import('lit').TemplateResult} opts.template
     * @param {string} opts.slotName
     * @param {boolean} [opts.renderAsDirectHostChild] when false, the render parent (wrapper div) will be kept in the light dom
     * @returns {void}
     */
    __renderTemplateInScopedContext({ template, slotName, renderAsDirectHostChild }) {
      const isFirstRender = !this.__renderMetaPerSlot.has(slotName);
      if (isFirstRender) {
        // @ts-expect-error wait for browser support
        const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;
        const hasShadowRoot = Boolean(this.shadowRoot);
        if (!hasShadowRoot) {
          // TODO: throw an error in a breaking release
          // eslint-disable no-console
          console.error(`[SlotMixin] No shadowRoot was found`);
        }
        const registryRoot = supportsScopedRegistry ? this.shadowRoot : document;

        // @ts-expect-error wait for browser support
        const renderTargetThatRespectsShadowRootScoping = registryRoot.createElement('div');
        const startComment = document.createComment(`_start_slot_${slotName}_`);
        const endComment = document.createComment(`_end_slot_${slotName}_`);

        renderTargetThatRespectsShadowRootScoping.appendChild(startComment);
        renderTargetThatRespectsShadowRootScoping.appendChild(endComment);

        // Providing all options breaks Safari; keep host and creationScope
        const { creationScope, host } = this.renderOptions;
        render(template, renderTargetThatRespectsShadowRootScoping, {
          renderBefore: endComment,
          creationScope,
          host,
        });

        if (renderAsDirectHostChild) {
          const nodes = Array.from(renderTargetThatRespectsShadowRootScoping.childNodes);
          this.__appendNodes({ nodes, renderParent: this, slotName });
        } else {
          renderTargetThatRespectsShadowRootScoping.slot = slotName;
          this.appendChild(renderTargetThatRespectsShadowRootScoping);
        }

        this.__renderMetaPerSlot.set(slotName, {
          renderTargetThatRespectsShadowRootScoping,
          renderBefore: endComment,
        });

        return;
      }

      // Rerender
      const { renderBefore, renderTargetThatRespectsShadowRootScoping } =
        /** @type {RenderMetaObj} */ (this.__renderMetaPerSlot.get(slotName));

      const rerenderTarget = renderAsDirectHostChild
        ? this
        : renderTargetThatRespectsShadowRootScoping;

      // Providing all options breaks Safari: we keep host and creationScope
      const { creationScope, host } = this.renderOptions;
      render(template, rerenderTarget, { creationScope, host, renderBefore });
    }

    /**
     * @param {object} options
     * @param {Node[]} options.nodes
     * @param {Element} [options.renderParent] It's recommended to create a render target in light dom (like <div slot=myslot>),
     * which can be used as a render target for most
     * @param {string} options.slotName For the first render, it's best to use slotName
     */
    __appendNodes({ nodes, renderParent = this, slotName }) {
      for (const node of nodes) {
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
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!this.__isConnectedSlotMixin) {
          this.__privateSlots.add(slotName);
        }

        const slotFunctionResultType = determineSlotFunctionResultType(slotFunctionResult);

        switch (slotFunctionResultType) {
          case 'template-result':
            this.__renderTemplateInScopedContext({
              template: /** @type {import('lit').TemplateResult} */ (slotFunctionResult),
              renderAsDirectHostChild: true,
              slotName,
            });
            break;
          case 'node':
            this.__appendNodes({
              nodes: [/** @type {Node} */ (slotFunctionResult)],
              renderParent: this,
              slotName,
            });
            break;
          case 'slot-rerender-object':
            // Rerenderable slots are scheduled in the "update loop"
            this.__slotsThatNeedRerender.add(slotName);
            // For backw. compat, we allow a first render on connectedCallback
            if (/** @type {SlotRerenderObject} */ (slotFunctionResult).firstRenderOnConnected) {
              this.__rerenderSlot(slotName);
            }
            break;
          default:
            throw new Error(
              `Slot "${slotName}" configured inside "get slots()" (in prototype) of ${this.constructor.name} may return these types: TemplateResult | Node | {template:TemplateResult, afterRender?:function} | undefined.
              You provided: ${slotFunctionResult}`,
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
