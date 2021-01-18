import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormControlHost } from './FormControlMixinTypes';

export declare class InteractionStateHost {
  constructor(...args: any[]);
  prefilled: boolean;
  filled: boolean;
  touched: boolean;
  dirty: boolean;
  submitted: boolean;
  _leaveEvent: string;
  _valueChangedEvent: string;

  connectedCallback(): void;
  disconnectedCallback(): void;

  initInteractionState(): void;
  resetInteractionState(): void;
  _iStateOnLeave(): void;
  _iStateOnValueChange(): void;
  _onTouchedChanged(): void;
  _onDirtyChanged(): void;
}

export declare function InteractionStateImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<InteractionStateHost> &
  typeof InteractionStateHost &
  Constructor<FormControlHost> &
  typeof FormControlHost;

export type InteractionStateMixin = typeof InteractionStateImplementation;
