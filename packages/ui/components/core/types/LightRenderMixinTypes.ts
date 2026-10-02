import { Constructor } from '@open-wc/dedupe-mixin';
import { TemplateResult, LitElement } from 'lit';

export type SlotItem = { name: string; template: () => TemplateResult; host?: HTMLElement };

export declare class LightRenderHost {
  /**
   * All slots that should be rendered to light dom instead of shadow dom
   */
  public slots: SlotItem[];

  /**
   * Useful to decide if a given slot should be manipulated depending on if it was auto generated
   * or not.
   *
   * @param {string} slotName Name of the slot
   * @returns {boolean} true if given slot name been created by SlotMixin
   */
  protected _isPrivateSlot(slotName: string): boolean;
}

/**
 * LightRenderMixin is needed when the author of a component needs to render to both light dom and shadow dom.
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
 *   slots = [{ name: 'input', template: this.renderInput }];
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
 */
declare function LightRenderMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<LightRenderHost> &
  Pick<typeof LightRenderHost, keyof typeof LightRenderHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type LightRenderMixin = typeof LightRenderMixinImplementation;
