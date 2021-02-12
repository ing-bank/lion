import { Constructor } from '@open-wc/dedupe-mixin';

export declare class ShadowPartsHost {

  /**
   * Array with exposed Shadow Parts of the component
   */
  static get exposeParts(): Array<string>;

  /**
   * Array with available Shadow Parts of the component
   */
  protected static get _shadowParts(): Array<string>;

  /**
    * Render the part value if it's exposed
    *
    * @param {string} part Name of the shadow part.
    */
   protected static _renderPart(part: string) {
}

/**
 * # ShadowPartsMixin
 *
 * `ShadowPartsMixin`, manage the Shadow Parts and render the part attribute if it's exposed
 *
 * @example
 * static get exposeParts() {
 *   return this.constructor._shadowParts;
 * }
 */
export declare function ShadowPartsMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<ShadowPartsHost>;

export type ShadowPartsMixin = typeof ShadowPartsMixinImplementation;
