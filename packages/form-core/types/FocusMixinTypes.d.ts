import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormControlHost } from './FormControlMixinTypes';

export declare class FocusHost {
  focused: boolean;
  focus(): void;
  blur(): void;

  private __onFocus(): void;
  private __onBlur(): void;
  private __registerEventsForFocusMixin(): void;
  private __teardownEventsForFocusMixin(): void;
}

export declare function FocusImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FocusHost> &
  Pick<typeof FocusHost, keyof typeof FocusHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FocusMixin = typeof FocusImplementation;
