import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { FocusHost } from '@lion/components/form-core/types/FocusMixinTypes.js';
import { FormControlHost } from '@lion/components/form-core/types/FormControlMixinTypes.js';
import { FormatHost } from '@lion/components/form-core/types/FormatMixinTypes.js';

export declare class NativeTextFieldHost {
  /**
   * Delegates autocomplete to input/textarea
   */
  autocomplete: string;

  /**
   * Delegates selectionStart to input/textarea
   */
  get selectionStart(): number;
  set selectionStart(value: number);

  /**
   * Delegates selectionEnd to input/textarea
   */
  get selectionEnd(): number;
  set selectionEnd(value: number);

  /**
   * Restores the cursor to its original position after updating the value.
   */
  protected _setValueAndPreserveCaret(value: string): void;
}

export declare function NativeTextFieldImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<NativeTextFieldHost> &
  Pick<typeof NativeTextFieldHost, keyof typeof NativeTextFieldHost> &
  Constructor<FormatHost> &
  Pick<typeof FormatHost, keyof typeof FormatHost> &
  Constructor<FocusHost> &
  Pick<typeof FocusHost, keyof typeof FocusHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost>;

export type NativeTextFieldMixin = typeof NativeTextFieldImplementation;
