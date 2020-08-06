import { Constructor } from '@open-wc/dedupe-mixin';
import { PropertyValues, LitElement } from 'lit-element';

export declare interface SyncUpdatableNamespace {
  connected?: boolean;
  disconnected?: boolean;
  initialized?: boolean;
  queue?: Set<string> | undefined;
}

export declare class SyncUpdatableHost {
  static __syncUpdatableHasChanged(name: string, newValue: any, oldValue: any): boolean;
  updateSync(name: string, oldValue: any): void;
  __syncUpdatableInitialize(): void;
  __SyncUpdatableNamespace: SyncUpdatableNamespace;

  firstUpdated(changedProperties: PropertyValues): void;
  disconnectedCallback(): void;
}

export type SyncUpdatableHostType = typeof SyncUpdatableHost;

export declare function SyncUpdatableImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<SyncUpdatableHost> & SyncUpdatableHost;

export type SyncUpdatableMixin = typeof SyncUpdatableImplementation;
