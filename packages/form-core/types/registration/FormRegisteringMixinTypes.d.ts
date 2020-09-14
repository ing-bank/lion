import { Constructor } from '@open-wc/dedupe-mixin';
import { FormRegistrarHost } from './FormRegistrarMixinTypes';
import { LitElement } from '@lion/core';

export declare class FormRegisteringHost {
  connectedCallback(): void;
  disconnectedCallback(): void;
  __parentFormGroup?: FormRegistrarHost;
}

export declare function FormRegisteringImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<FormRegisteringHost> & typeof FormRegisteringHost;

export type FormRegisteringMixin = typeof FormRegisteringImplementation;
