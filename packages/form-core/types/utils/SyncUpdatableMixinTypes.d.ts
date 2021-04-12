import { LitElement } from '@lion/core';
import { Constructor } from '@open-wc/dedupe-mixin';

export declare interface SyncUpdatableNamespace {
  connected?: boolean;
  disconnected?: boolean;
  initialized?: boolean;
  queue?: Set<string> | undefined;
}

export declare class SyncUpdatableHost {
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
