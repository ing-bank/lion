import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '../index.js';

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

  private __internalSetDisabled(value: boolean): void;
  protected _requestedToBeDisabled: boolean;
}

export declare function DisabledMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<DisabledHost> & Pick<typeof DisabledHost, keyof typeof DisabledHost>;

export type DisabledMixin = typeof DisabledMixinImplementation;
