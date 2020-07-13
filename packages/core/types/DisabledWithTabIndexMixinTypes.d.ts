import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledMixinHost } from './DisabledMixinTypes';
export declare class DisabledWithTabIndexMixinHost {
  static get properties(): {
    tabIndex: {
      type: NumberConstructor;
      reflect: boolean;
      attribute: string;
    };
  };
  tabIndex: number;
  /**
   * Makes request to make the element disabled and set the tabindex
   */
  public makeRequestToBeDisabled(): void;

  /**
   * Retract request to make the element disabled and restore disabled and tabindex to previous
   */
  public retractRequestToBeDisabled(): void;

  private __internalSetTabIndex(value: boolean): void;
}

export declare function DisabledWithTabIndexMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<DisabledWithTabIndexMixinHost> & Constructor<DisabledMixinHost>;

export type DisabledWithTabIndexMixin = typeof DisabledWithTabIndexMixinImplementation;
