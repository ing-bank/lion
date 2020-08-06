import { Constructor } from '@open-wc/dedupe-mixin';

export declare class FormRegisteringHost {
  connectedCallback(): void;
  disconnectedCallback(): void;
}

export declare function FormRegisteringImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<FormRegisteringHost> & FormRegisteringHost;

export type FormRegisteringMixin = typeof FormRegisteringImplementation;
