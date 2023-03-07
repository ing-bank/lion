import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, PropertyValues } from 'lit';
import { DisabledHost } from './DisabledMixinTypes.js';
export declare class DisabledWithTabIndexHost {
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

  firstUpdated(changedProperties: PropertyValues): void;
}

export declare function DisabledWithTabIndexMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<DisabledWithTabIndexHost> &
  Pick<typeof DisabledWithTabIndexHost, keyof typeof DisabledWithTabIndexHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type DisabledWithTabIndexMixin = typeof DisabledWithTabIndexMixinImplementation;
