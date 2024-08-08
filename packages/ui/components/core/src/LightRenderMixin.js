/* eslint-disable class-methods-use-this */
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { render } from 'lit';

/**
 * @typedef {{renderBefore:Comment; renderTargetThatRespectsShadowRootScoping: HTMLDivElement}} RenderMetaObj
 * @typedef {import('../types/LightRenderMixinTypes.js').LightRenderHost} LightRenderHost
 * @typedef {import('../types/LightRenderMixinTypes.js').SlotItem} SlotItem
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('lit').LitElement} LitElement
 */

/**
 * @param {{slotsProvidedByUser:Set<string>; slots: SlotItem[]}} opts
 * @returns {Set<string>}
 */
function extractPrivateSlots({ slots, slotsProvidedByUser }) {
  const privateSlots = new Set();
  const slotNames = slots.map(s => s.name);
  for (const slotName of slotNames) {
    if (slotsProvidedByUser.has(slotName)) {
      continue; // eslint-disable-line no-continue
    }
    // Allow to conditionally return a slot
    const slotFunctionResult = slots.find(s => s.name === slotName)?.template();
    if (slotFunctionResult === undefined) {
      continue; // eslint-disable-line no-continue
    }
    privateSlots.add(slotName);
  }
  return privateSlots;
}


/**
 * @param {object} options
 * @param {Node[]} options.nodes
 * @param {Element} options.renderParent It's recommended to create a render target in light dom (like <div slot=myslot>),
 * which can be used as a render target for most
 * @param {string} options.slotName For the first render, it's best to use slotName
 */
function appendNodes({ nodes, renderParent, slotName }) {
  for (const node of nodes) {
    if (node instanceof Element && slotName && slotName !== '') {
      node.setAttribute('slot', slotName);
    }
    renderParent.appendChild(node);
  }
}

/**
 * Renders to light dom while respecting shadow dom scoping.
 * Suitable for rerendering as well.
 *
 * @private
 * @param {object} opts
 * @param {Map<string,RenderMetaObj>} opts.renderMetaPerSlot
 * @param {import('lit').RenderOptions} opts.renderOptions
 * @param {import('lit').TemplateResult} opts.template
 * @param {HTMLElement} opts.shadowHost
 * @param {string} opts.slotName
 * @returns {void}
 */
function renderLightDomInScopedContext({
  renderMetaPerSlot,
  renderOptions,
  shadowHost,
  template,
  slotName,
}) {
  const isFirstRender = !renderMetaPerSlot.has(slotName);
  
  if (isFirstRender) {
    // @ts-expect-error wait for browser support
    const supportsScopedRegistry = !!ShadowRoot.prototype.createElement;
    const registryRoot = supportsScopedRegistry ? shadowHost.shadowRoot || document : document;

    // @ts-expect-error wait for browser support
    const renderTargetThatRespectsShadowRootScoping = registryRoot.createElement('div');
    const startComment = document.createComment(`_start_slot_${slotName}_`);
    const endComment = document.createComment(`_end_slot_${slotName}_`);

    renderTargetThatRespectsShadowRootScoping.appendChild(startComment);
    renderTargetThatRespectsShadowRootScoping.appendChild(endComment);

    render(template, renderTargetThatRespectsShadowRootScoping, {
      ...renderOptions,
      renderBefore: endComment,
    });

    // renderTargetThatRespectsShadowRootScoping.slot = slotName;
    // shadowHost.appendChild(renderTargetThatRespectsShadowRootScoping);
    const nodes = Array.from(renderTargetThatRespectsShadowRootScoping.childNodes);
    appendNodes({ nodes, renderParent: shadowHost, slotName });

    renderMetaPerSlot.set(slotName, {
      renderTargetThatRespectsShadowRootScoping,
      renderBefore: endComment,
    });

    return;
  }

  // Rerender
  const { renderBefore } = /** @type {RenderMetaObj} */ (renderMetaPerSlot.get(slotName));
  const rerenderTarget = shadowHost;
  render(template, rerenderTarget, { ...renderOptions, renderBefore });
}

/**
 * @private
 * @param {{isInLightDom: () => boolean; slots: SlotItem[]; defaultHost: HTMLElement}} opts
 * @returns {void}
 */
function patchRenderFns({ isInLightDom, slots, defaultHost }) {
  const slotTemplateFns = [];
  console.debug({slots});


  for (const { name: slotName, template: templateFn, host } of slots) {

    console.debug({slotName, templateFn, host});

    const hostObj = host || defaultHost;
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const potentialFnName in hostObj) {
      if (hostObj[potentialFnName] === templateFn) {
        slotTemplateFns.push({
          templateFnName: potentialFnName,
          originalFn: templateFn,
          slotName,
          hostObj,
        });
        // eslint-disable-next-line no-continue
        continue;
      }
    }
  }
  // Patch existing functions
  for (const { slotName, templateFnName, originalFn, hostObj } of slotTemplateFns) {
    // @ts-ignore
    // eslint-disable-next-line consistent-return
    hostObj[templateFnName] = (/** @type {any} */ ...args) => {
      if (isInLightDom()) {
        // @ts-ignore
        originalFn(...args);
      } else {
        const slotNode = document.createElement('slot');
        if (slotName) {
          slotNode.name = slotName;
        }
        return slotNode;
      }
    };
  }
}

/**
 * LightDomRenderMixin is needed when the author of a component needs to render to both light dom and shadow dom.
 *
 * Accessibility is extremely high valued in Lion.
 * Because aria relations can't cross shadow boundaries today, we introduced LightDomRenderMixin.
 *
 * Normally, light dom is provided by the consumer of a component and only shadow dom is provided by the author.
 * However, in order to deliver the best possible accessible experience, an author sometimes needs to render to light dom.
 * Read more about this in the [ARIA in Shadow DOM](https://lion-web.netlify.app/fundamentals/rationales/accessibility/#shadow-roots-and-accessibility)
 * The aim of this mixin is to provide abstractions that are almost 100% forward compatible with a future spec for cross-root aria.
 *
 * ## Common use of light dom
 * In below example for instance, a consumer provides options to a combobox via light dom:
 *
 * ```html
 * <my-combobox>
 *   <my-option value="a">a</my-option>
 *   <my-option value="b">b</my-option>
 * </my-combobox>
 * ```
 *
 * Internally, the author provided a listbox and a textbox in shadow dom. The textbox also has a shadow root.
 *
 * ```html
 * <my-combobox>
 *   <my-option value="a">a</my-option>
 *   <my-option value="b">b</my-option>
 *   #shadow-root
 *   <my-textbox>
 *     #shadow-root
 *     <input role="combobox" aria-autocomplete="list" aria-controls="unreachable">
 *   </my-textbox>
 *   <div role="listbox" aria-activedescendant="unreachable"><slot></slot></div>
 * </my-combobox>
 * ```
 *
 * We already see two problems here: aria-controls and aria-activedescendant can't reference ids outside their dom boundaries.
 * Now imagine we have a combobox is part of a form group (fieldset) and we want
 * to read the fieldset error when the combobox is focused.
 *
 * ```html
 * <my-fieldset>
 *   <my-textfield name="residence"></my-textfield>
 *   <my-combobox name="country">
 *     <my-option value="a">a</my-option>
 *     <my-option value="b">b</my-option>
 *     #shadow-root
 *     <my-textbox>
 *       #shadow-root
 *       <input role="combobox" aria-autocomplete="list" aria-controls="unreachable" aria-describedby="unreachable">
 *     </my-textbox>
 *     <div aria-describedby="unreachable" role="listbox" aria-activedescendant="unreachable"><slot></slot></div>
 *   </my-combobox>
 *   <my-feedback id="myError"> Combination of residence and country do not match</my-feedback>
 * </my-fieldset>
 * ```
 *
 *
 * Summarized, without LightDomRenderMixin, the following is not achievable:
 * - creating a relation between element outside and an element inside the host (labels, descriptions etc.)
 * - using aria-activedescendant, aria-owns, aria-controls (in listboxes, comboboxes, etc.)
 * - creating a nested form group (like a fieldset) that lies relations between parent (the group) and children (the fields)
 * - leveraging native form registration (today it should be possible to use form association for this)
 * - creating a button that allows for implicit form submission
 * - as soon as you start to use composition (nested web components), you need to be able to lay relations between the different components
 *
 * Note that at some point in the future, there will be a spec for cross-root aria relations. By that time, this mixin will be obsolete.
 * This mixin is designed in such a way that it can be removed with minimial effort and without breaking changes.
 *
 * ## How to use
 * In order to use the mixin, just render like you would to shadow dom:
 *
 * ```js
 * class MyInput extends LitElement {
 *   render() {
 *     return html`
 *       <div>
 *        ${this.renderInput()}
 *       </div>
 *     `;
 *   }
 *
 *   renderInput() {
 *     return html`<input>`;
 *   }
 * }
 *
 * ```
 *
 * This results in:
 * ```html
 * #shadow-root
 *  <input>
 * ```
 *
 * Now, we apply the LightDomRenderMixin on top.
 * Below, we just tell which slots we render, using what functions.
 *
 * ```js
 * class MyInput extends LightDomRenderMixin(LitElement) {
 *
 *   slots = {
 *    input: this.renderInput,
 *   }
 *
 *   render() {
 *     return html`
 *       <div>
 *        ${this.renderInput()}
 *       </div>
 *     `;
 *   }
 *
 *   renderInput() {
 *     return html`<input>`;
 *   }
 * }
 *
 * ```
 *
 * This results in:
 * ```html
 * <input slot="input">
 * #shadow-root
 *  <slot name="input"></slot>
 * ```
 *
 * ## How it works
 *
 * By default, the render function is called in LitElement inside the `update` lifecycle method.
 * This is done for the shadow root.
 * This mixin uses the same render cycle (via the `update` method) to render to light dom as well.
 * For this, the collection of functions in the `slots` property is called. The result is appended to the light dom.
 *
 * The mixin creates a proxy for slot functions (like `renderInput`). When called during the shadow render,
 * the slot outlet is added to shadow dom. When called during the light dom render, the slot content is added to light dom.
 *
 * ## Scoped elements
 *
 * Per the spec, scoped elements are bound to a shadow root of its host. Since we render to light dom for the possibilities
 * it gives us in creating aria relations, we still want to scope elements to the shadow root. LightDomRenderMixin takes care of this.
 *
 * @param {import('@open-wc/dedupe-mixin').Constructor<LitElement>} superclass
 */
const LightRenderMixinImplementation = superclass =>
  /** @type {* & LightRenderHost} */
  (
    class LightDomRenderHost extends superclass {
      /**
       * @type {SlotItem[]}
       */
      slots = [];


      /**
       * Private state
       */
      #lightRenderState = {
        /**
         * @type {'shadow-dom'|'light-dom'}
         */
        slotRenderPhase: 'shadow-dom',
        isInitialized: false,
        /**
         * The roots that are used to do a rerender in.
         * In case of a SlotRerenderObject, this will create a render wrapper in the scoped context (shadow root)
         * and connect this under the slot name to the light dom. All (re)renders will happen from here,
         * so that all interactions work as intended and no focus issues can arise (which would be the case
         * when (cloned) nodes of a render outcome would be moved around)
         * @private
         * @type { Map<string, RenderMetaObj> } 
         */
        renderMetaPerSlot: new Map(),
        /**
         * Those are slots that should be touched by SlotMixin
         * The opposite of __slotsProvidedByUserOnFirstConnected,
         * also taking into account undefined (a.k.a. conditional) slots
         * @private
         * @type {Set<string>}
         */
         privateSlots: new Set(),
      };

      connectedCallback() {
        super.connectedCallback();
        this.#initLightRenderMixin();
      }

      /**
       * Here we rerender slots defined with a `SlotRerenderObject`
       * @param {import('lit-element').PropertyValues } changedProperties
       */
      update(changedProperties) {
        // Here we just render the shadow dom
        // For this, we tell our patched function to render the slot outlet
        this.#lightRenderState.slotRenderPhase = 'shadow-dom';
        super.update(changedProperties);

        // Now, we update/render the light dom
        // For this, we tell our patched function to render the original function (to light dom)
        this.#lightRenderState.slotRenderPhase = 'light-dom';

        // Now we render the light dom in one go...
        for (const slotName of this.#lightRenderState.privateSlots) {
          const slotFunctionResult = this.slots.find(s => s.name === slotName)?.template();
          if (slotFunctionResult === undefined) {
            continue; // eslint-disable-line no-continue
          }
          // Providing all options breaks Safari; keep host and creationScope
          const { creationScope, host } = this.renderOptions;
          renderLightDomInScopedContext({
            renderMetaPerSlot: this.#lightRenderState.renderMetaPerSlot,
            renderOptions: { creationScope, host },
            template: slotFunctionResult,
            shadowHost: this,
            slotName,
          });
        }
      }

      /**
       * Helper function that Subclassers can use to check if a slot is private
       * @protected
       * @param {string} slotName Name of the slot
       * @returns {boolean} true if given slot name been created by SlotMixin
       */
      _isPrivateSlot(slotName) {
        return this.#lightRenderState.privateSlots.has(slotName);
      }

      /**
       * @returns {void}
       */
      #initLightRenderMixin() {
        // This is called on connected, so avoid that it is called twice when the host element is moved...
        if (this.#lightRenderState.isInitialized) return;

        patchRenderFns({
          isInLightDom: () => this.#lightRenderState.slotRenderPhase === 'light-dom',
          slots: this.slots,
          defaultHost: this,
        });
        const slotsProvidedByUser = new Set(Array.from(this.children).map(c => c.slot || ''));
        this.#lightRenderState.privateSlots = extractPrivateSlots({ slotsProvidedByUser, slots: this.slots });
        this.#lightRenderState.isInitialized = true;
      }
    }
  );
export const LightRenderMixin = dedupeMixin(LightRenderMixinImplementation);
