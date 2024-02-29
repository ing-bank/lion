import { Constructor } from '@open-wc/dedupe-mixin';

export declare class ScopedElementsHostV2 {
  /**
   * Defines a scoped element inside the CustomElementRegistry bound to the shadowRoot.
   */
  defineScopedElement<T extends HTMLElement>(tagName: string, klass: Constructor<T>): void;

  /**
   * Create a scoped element inside the CustomElementRegistry bound to the shadowRoot.
   *
   * @param tagName string The tag name of the element to create
   */
  createScopedElement(tagName: string): HTMLElement;
}

export type ScopedElementsHostV2Constructor = Constructor<ScopedElementsHostV2>;
