import { LitElement } from 'lit-element';
import { CSSResultArray, CSSResultGroup } from 'lit';

/**
 * The element that the dashboard's `DecorateMixin` produces. It carries the
 * members the mixin adds on top of `LitElement`.
 */
export declare class DecorateHost extends LitElement {
  /**
   * Prepend or append a stylesheet to the styles decorated on the class.
   */
  static decorateStyles(styles: CSSResultGroup, opts?: { prepend?: boolean }): void;

  /**
   * Wrap a method of the decorated class with `fn`.
   */
  static decorateMethod(name: string, fn: (...args: unknown[]) => void): void;

  static __decoratedStyles: CSSResultGroup[];
  static __decoratedStylesPrepended: CSSResultGroup[];

  static get styles(): CSSResultArray;
}

export type DecorateMixin = (superclass: typeof LitElement) => typeof DecorateHost;
