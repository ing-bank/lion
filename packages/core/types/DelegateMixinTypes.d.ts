import { Constructor } from '@open-wc/dedupe-mixin';

export type Delegations = {
  target: Function;
  events: string[];
  methods: string[];
  properties: string[];
  attributes: string[];
};

export declare class DelegateMixinHost {
  delegations: Delegations;

  protected _connectDelegateMixin(): void;

  private __setupPropertyDelegation(): void;

  private __initialAttributeDelegation(): void;

  private __emptyEventListenerQueue(): void;

  private __emptyPropertiesQueue(): void;
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
declare function DelegateMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<DelegateMixinHost>;

export type DelegateMixin = typeof DelegateMixinImplementation;
