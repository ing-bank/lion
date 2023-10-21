import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

import { ChoiceGroupHost } from './ChoiceGroupMixinTypes.js';

export declare class CustomChoiceHost {
  allowCustomChoice: boolean;
  get modelValue(): any;
  set modelValue(value: any);
  get serializedValue(): string;
  set serializedValue(value: string);
  get formattedValue(): string;
  set formattedValue(value: string);

  protected _isEmpty(): boolean;
}

export declare function CustomChoiceImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<CustomChoiceHost> &
  Pick<typeof CustomChoiceHost, keyof typeof CustomChoiceHost> &
  Constructor<ChoiceGroupHost> &
  Pick<typeof ChoiceGroupHost, keyof typeof ChoiceGroupHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type CustomChoiceMixin = typeof CustomChoiceImplementation;
