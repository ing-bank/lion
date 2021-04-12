import { Constructor } from '@open-wc/dedupe-mixin';
// import { LionField } from '@lion/form-core/src/LionField';
import { LitElement } from '@lion/core';
import { FocusHost } from '@lion/form-core/types/FocusMixinTypes';
import { FormControlHost } from '@lion/form-core/types/FormControlMixinTypes';

// export declare class NativeTextField extends LionField {
//   protected get _inputNode(): HTMLTextAreaElement | HTMLInputElement;
// }

export declare class NativeTextFieldHost {
  // protected get _inputNode(): HTMLTextAreaElement | HTMLInputElement;

  get selectionStart(): number;
  set selectionStart(value: number);
  get selectionEnd(): number;
  set selectionEnd(value: number);
}

export declare function NativeTextFieldImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<NativeTextFieldHost> &
  Pick<typeof NativeTextFieldHost, keyof typeof NativeTextFieldHost> &
  Constructor<FocusHost> &
  Pick<typeof FocusHost, keyof typeof FocusHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost>;
// &
// Pick<typeof NativeTextField, keyof typeof NativeTextField>;

export type NativeTextFieldMixin = typeof NativeTextFieldImplementation;
