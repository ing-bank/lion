// Note. This file is a partial copy of https://github.com/open-wc/open-wc/blob/scoped-elements-v2/packages/scoped-elements/src/types.d.ts

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

export type ScopedElementsMap = {
  [key: string]: typeof HTMLElement;
};
export declare class ScopedElementsHost {
  /**
   * Obtains the scoped elements definitions map
   */
  static scopedElements: ScopedElementsMap | undefined;
  /**
   * Obtains the CustomElementRegistry
   */
  registry?: CustomElementRegistry;

  constructor(...args: any[]);
}
