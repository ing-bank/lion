import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '../index.js';

export type Delegations = {
  target: Function;
  events: string[];
  methods: string[];
  properties: string[];
  attributes: string[];
};

export declare class DelegateHost {
  protected get delegations(): Delegations;

  protected _connectDelegateMixin(): void;

  private __setupPropertyDelegation(): void;

  private __initialAttributeDelegation(): void;

  private __emptyEventListenerQueue(): void;

  private __emptyPropertiesQueue(): void;

  connectedCallback(): void;
  updated(changedProperties: import('lit-element').PropertyValues): void;
}

/**
 * # DelegateMixin
 * Forwards defined events, methods, properties and attributes to the defined target.
 *
 * @example
 * get delegations() {
 *   return {
 *     ...super.delegations,
 *     target: () => this.shadowRoot.getElementById('button1'),
 *     events: ['click'],
 *     methods: ['click'],
 *     properties: ['disabled'],
 *     attributes: ['disabled'],
 *   };
 * }
 *
 * render() {
 *   return html`
 *     <button id="button1">with delegation</button>
 *   `;
 * }
 */
declare function DelegateMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<DelegateHost> &
  Pick<typeof DelegateHost, keyof typeof DelegateHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type DelegateMixin = typeof DelegateMixinImplementation;
