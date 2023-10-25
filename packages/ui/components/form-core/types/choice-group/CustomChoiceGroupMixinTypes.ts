import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

import { ChoiceGroupHost } from './ChoiceGroupMixinTypes.js';

export declare class CustomChoiceGroupHost {
  allowCustomChoice: boolean;
  get modelValue(): any;
  set modelValue(value: any);
  get serializedValue(): string;
  set serializedValue(value: string);
  get formattedValue(): string;
  set formattedValue(value: string);

  clear(): void;
  parser(value: string | string[]): string | string[];

  protected _isEmpty(): boolean;
}

export declare function CustomChoiceGroupImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<CustomChoiceGroupHost> &
  Pick<typeof CustomChoiceGroupHost, keyof typeof CustomChoiceGroupHost> &
  Constructor<ChoiceGroupHost> &
  Pick<typeof ChoiceGroupHost, keyof typeof ChoiceGroupHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type CustomChoiceGroupMixin = typeof CustomChoiceGroupImplementation;
