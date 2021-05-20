import { LitElement } from '@lion/core';
import { Constructor } from '@open-wc/dedupe-mixin';

export declare interface SyncUpdatableNamespace {
  connected?: boolean;
  disconnected?: boolean;
  initialized?: boolean;
  queue?: Set<string> | undefined;
}

export declare class SyncUpdatableHost {
  /**
   * An abstraction that has the exact same api as `requestUpdate`, but taking
   * into account:
   * - [member order independence](https://github.com/webcomponents/gold-standard/wiki/Member-Order-Independence)
   * - property effects start when all (light) dom has initialized (on firstUpdated)
   * - property effects don't interrupt the first meaningful paint
   * - compatible with propertyAccessor.`hasChanged`: no manual checks needed or accidentally
   * run property effects / events when no change happened
   * effects when values didn't change
   * All code previously present in requestUpdate can be placed in this method.
   * @param {string} name
   * @param {*} oldValue
   */
  protected updateSync(name: string, oldValue: any): void;
  private __syncUpdatableInitialize(): void;
  private __SyncUpdatableNamespace: SyncUpdatableNamespace;
  private static __syncUpdatableHasChanged(name: string, newValue: any, oldValue: any): boolean;
}

export type SyncUpdatableHostType = typeof SyncUpdatableHost;

export declare function SyncUpdatableImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<SyncUpdatableHost> &
  Pick<typeof SyncUpdatableHost, keyof typeof SyncUpdatableHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type SyncUpdatableMixin = typeof SyncUpdatableImplementation;
