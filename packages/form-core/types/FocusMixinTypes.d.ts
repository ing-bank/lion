import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export declare class FocusHost {
  /**
   * Whether the focusable element within (`._focusableNode`) is focused.
   * Reflects to attribute '[focused]' as a styling hook
   */
  focused: boolean;
  /**
   * Whether the focusable element within (`._focusableNode`) matches ':focus-visible'
   * Reflects to attribute '[focused-visible]' as a styling hook
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
   */
  focusedVisible: boolean;
  /**
   * Calls `focus()` on focusable element within
   */
  focus(): void;
  /**
   * Calls `blur()` on focusable element within
   */
  blur(): void;

  /**
   * The focusable element:
   * could be an input, textarea, select, button or any other element with tabindex > -1
   */
  protected get _focusableNode(): HTMLElement;

  private __onFocus(): void;
  private __onBlur(): void;
  private __registerEventsForFocusMixin(): void;
  private __teardownEventsForFocusMixin(): void;
}

export declare function FocusImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FocusHost> &
  Pick<typeof FocusHost, keyof typeof FocusHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FocusMixin = typeof FocusImplementation;
