import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, TemplateResult } from 'lit';
import {
  SlotFunctionResult as SlotMixinFunctionResult,
  SlotRerenderObject as SlotMixinRerenderObject,
  SlotsMap as SlotMixinSlotsMap,
} from './SlotMixinTypes.js';

/**
 * What a slot template may return: a `TemplateResult`, a raw `Element` (the legacy SlotMixin
 * convention, which lit renders as a node), a `SlotRerenderObject` or `undefined` to skip the slot.
 * Identical to the union `SlotMixin` accepts, so a legacy slot function type-checks unchanged.
 */
export type SlotFunctionResult = SlotMixinFunctionResult;

/**
 * Legacy SlotMixin rerender object; only its template is used by LightRenderMixin (its
 * `afterRender` / `firstRenderOnConnected` options are not).
 */
export type SlotRerenderObject = SlotMixinRerenderObject;

/**
 * What the mixin actually renders into the light dom: the slot template result after a legacy
 * `SlotRerenderObject` has been unwrapped. Both a `TemplateResult` and a raw `Element` are valid lit
 * child values (lit commits a node as-is), and `undefined` skips the slot.
 */
export type SlotTemplateOutput = TemplateResult | Element | undefined;

export type SlotItem = {
  name: string;
  template: () => SlotFunctionResult;
  host?: HTMLElement;
};

/**
 * The legacy SlotMixin shape: slot name -> slot function. This is `SlotMixin`'s own `SlotsMap`, so
 * an existing map type-checks against `LightRenderMixin` without a cast.
 */
export type SlotsMap = SlotMixinSlotsMap;

export declare class LightRenderHost extends HTMLElement {
  /**
   * All slots that should be rendered to light dom instead of shadow dom.
   *
   * Declared as an **accessor** on purpose. A subclass may return the array shape
   * (`get slots() { return [{ name, template }] }`) or the legacy SlotMixin map
   * (`get slots() { return { name: fn } }`), and an accessor is the only declaration under which
   * both are allowed: a property here would make the legacy `get slots()` an error (TS2611), and
   * leaving it undeclared would make the `...super.slots` composition that the legacy shape uses
   * untyped (TS2551). A subclass that declares `slots` as a class field is rejected by the type
   * checker (TS2610) and reported at runtime, because a field shadows an accessor and thereby
   * breaks that composition.
   */
  public get slots(): SlotItem[] | SlotsMap;

  /**
   * Light dom protocol of `@lit-labs/ssr`: returns the slot templates that should be serialized as
   * the light dom of this element. lit-ssr calls this when the server template asks for it with the
   * `renderLight()` directive from `@lit-labs/ssr-client/directives/render-light.js`, so the light
   * dom is in the initial response.
   */
  public renderLight(): TemplateResult;

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
 * Note that the alternatives that did land in browsers do not remove the need for this mixin:
 * element reflection is a JavaScript only api (no declarative rendering, no crawler visibility, needs
 * hydration) and reference target only forwards references *into* a shadow tree, is limited to one
 * target per host and is not available by default in every engine. Light dom is the only place where
 * an accessible relation can live that is authorable in markup, indexable and present without
 * hydration. See docs/fundamentals/rationales/accessibility.md#do-not-wait-for-cross-root-aria.
 * This mixin is designed in such a way that it can be removed with minimal effort and without
 * breaking changes.
 *
 * Note: do not combine this mixin with SlotMixin in one class; both would render the same slot.
 * The legacy SlotMixin `slots` map is accepted as a compatibility layer.
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
 *   get slots() {
 *     return [{ name: 'input', template: this.renderInput }];
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
export declare function LightRenderMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<LightRenderHost> & Pick<typeof LightRenderHost, keyof typeof LightRenderHost>;

export type LightRenderMixin = typeof LightRenderMixinImplementation;
