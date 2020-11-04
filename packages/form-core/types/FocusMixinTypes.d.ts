import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormControlHost } from './FormControlMixinTypes';

export declare class FocusHost {
  focused: boolean;

  connectedCallback(): void;
  disconnectedCallback(): void;

  focus(): void;
  blur(): void;
  __onFocus(): void;
  __onBlur(): void;
  __registerEventsForFocusMixin(): void;
  __teardownEventsForFocusMixin(): void;
}

export declare function FocusImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<FocusHost> & FocusHost & Constructor<FormControlHost> & typeof FormControlHost;

export type FocusMixin = typeof FocusImplementation;
