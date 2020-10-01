import { Constructor } from '@open-wc/dedupe-mixin';
import { LionField } from '@lion/form-core/src/LionField';

export declare class LionFieldWithValue extends LionField {
  get _inputNode(): HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement;
}

export declare class ValueHost {
  get value(): string;
  set value(value: string);
  _setValueAndPreserveCaret(newValue: string): void;
}

export declare function ValueImplementation<T extends Constructor<LionFieldWithValue>>(
  superclass: T,
): T & Constructor<ValueHost> & ValueHost;

export type ValueMixin = typeof ValueImplementation;
