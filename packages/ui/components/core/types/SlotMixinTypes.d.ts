import { Constructor } from '@open-wc/dedupe-mixin';
import { TemplateResult, LitElement } from '../index.js';

declare function slotFunction(): HTMLElement | Node[] | TemplateResult | undefined;

export type SlotsMap = {
  [key: string]: typeof slotFunction;
};

export declare class SlotHost {
  /**
   * Obtains all the slots to create
   */
  public get slots(): SlotsMap;

  /**
   * Starts the creation of slots
   */
  protected _connectSlotMixin(): void;

  /**
   * Useful to decide if a given slot should be manipulated depending on if it was auto generated
   * or not.
   *
   * @param {string} slotName Name of the slot
   * @return {boolean} true if given slot name been created by SlotMixin
   */
  protected _isPrivateSlot(slotName: string): boolean;

  connectedCallback(): void;
}

/**
 * # SlotMixin
 *
 * `SlotMixin`, when attached to the DOM it creates content for defined slots in the Light DOM.
 * The content element is created using a factory function and is assigned a slot name from the key.
 * Existing slot content is not overridden.
 *
 * The purpose is to have the default content in the Light DOM rather than hidden in Shadow DOM
 * like default slot content works natively.
 *
 * @example
 * get slots() {
 *   return {
 *     ...super.slots,
 *     // appends <div slot="foo"></div> to the Light DOM of this element
 *     foo: () => document.createElement('div'),
 *   };
 * }
 */
export declare function SlotMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type SlotMixin = typeof SlotMixinImplementation;
