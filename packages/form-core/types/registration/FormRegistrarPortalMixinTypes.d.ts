import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export declare class FormRegistrarPortalHost {
  registrationTarget: HTMLElement;
  __redispatchEventForFormRegistrarPortalMixin(ev: CustomEvent): void;
}

export declare function FormRegistrarPortalImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<FormRegistrarPortalHost> & FormRegistrarPortalHost;

export type FormRegistrarPortalMixin = typeof FormRegistrarPortalImplementation;
