import { Constructor } from '@open-wc/dedupe-mixin';
import { CSSResultGroup, CSSResult, LitElement } from 'lit';

export declare class ScopedStylesHost {
  static scopedStyles(scope: CSSResult): CSSResultGroup;

  __styleTag: HTMLStyleElement;

  scopedClass: string;

  private __setupStyleTag(): void;

  private __teardownStyleTag(): void;
}

export declare function ScopedStylesMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<ScopedStylesHost> & Pick<typeof ScopedStylesHost, keyof typeof ScopedStylesHost>;

export type ScopedStylesMixin = typeof ScopedStylesMixinImplementation;
