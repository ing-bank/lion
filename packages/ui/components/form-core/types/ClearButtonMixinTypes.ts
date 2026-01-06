import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

type RefTemplateData = {
  ref?: { value?: HTMLElement };
  listeners?: { [key: string]: any };
  labels?: { [key: string]: any };
};

export type OnIconButtonBlurEvent = Event & {
  target: { value?: string; modelValue?: string; _clearButton?: HTMLButtonElement };
  detail?: { initialize: boolean };
};

export type OnIconButtonClickEvent = Event & {
  target: { value?: string; modelValue?: string; _clearButton?: HTMLButtonElement };
  detail?: { initialize: boolean };
};

export type OnIconButtonFocusEvent = Event & {
  target: { value?: string; modelValue?: string; _clearButton?: HTMLButtonElement };
  detail?: { initialize: boolean };
};

export type SuffixRef = { value: HTMLElement | undefined };

export type TemplateDataForField = {
  refs: {
    suffix: RefTemplateData & {
      ref: SuffixRef;
      listeners: {
        blur: (event: OnIconButtonBlurEvent) => void;
        click: (event: OnIconButtonClickEvent) => void;
        focus: (event: OnIconButtonFocusEvent) => void;
      };
      labels: { clearButtonLabel: string };
    };
  };
  data: {
    disabled: boolean;
    filled: boolean;
    focused: boolean;
  };
};

export declare class ClearButtonHost {
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
}

export declare function ClearButtonImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ClearButtonHost> &
  Pick<typeof ClearButtonHost, keyof typeof ClearButtonHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ClearButtonMixin = typeof ClearButtonImplementation;