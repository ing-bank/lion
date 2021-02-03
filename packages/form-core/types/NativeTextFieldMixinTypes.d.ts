import { Constructor } from '@open-wc/dedupe-mixin';
import { LionField } from '@lion/form-core/src/LionField';

export declare class NativeTextField extends LionField {
  get _inputNode(): HTMLTextAreaElement | HTMLInputElement;
}

export declare class NativeTextFieldHost {
  constructor(...args: any[]);
  get selectionStart(): number;
  set selectionStart(value: number);
  get selectionEnd(): number;
  set selectionEnd(value: number);
}

export declare function NativeTextFieldImplementation<T extends Constructor<NativeTextField>>(
  superclass: T,
): T & Constructor<NativeTextFieldHost> & NativeTextFieldHost & typeof NativeTextField;

export type NativeTextFieldMixin = typeof NativeTextFieldImplementation;
