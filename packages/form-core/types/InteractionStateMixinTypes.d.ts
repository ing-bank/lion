import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormControlHost } from './FormControlMixinTypes';

/**
 * A set of meta info about a FormControl that helps in the context of determining validation
 * feedback visibility
 */
type InteractionStates = {
  submitted: boolean;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  prefilled: boolean;
};
export declare class InteractionStateHost {
  prefilled: boolean;
  filled: boolean;
  touched: boolean;
  dirty: boolean;
  submitted: boolean;
  initInteractionState(): void;
  resetInteractionState(): void;

  connectedCallback(): void;
  disconnectedCallback(): void;

  protected _leaveEvent: string;
  protected _valueChangedEvent: string;
  protected _iStateOnLeave(): void;
  protected _iStateOnValueChange(): void;
  protected _onTouchedChanged(): void;
  protected _onDirtyChanged(): void;
}

export declare function InteractionStateImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<InteractionStateHost> &
  Pick<typeof InteractionStateHost, keyof typeof InteractionStateHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type InteractionStateMixin = typeof InteractionStateImplementation;
