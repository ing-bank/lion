import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

export declare class DisabledHost {
  disabled: boolean;

  /**
   * Makes request to make the element disabled
   */
  public makeRequestToBeDisabled(): void;

  /**
   * Retract request to make the element disabled and restore disabled to previous
   */
  public retractRequestToBeDisabled(): void;

  protected _requestedToBeDisabled: boolean;

  // private __internalSetDisabled(value: boolean): void;
}

export declare function DisabledMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type DisabledMixin = typeof DisabledMixinImplementation;
