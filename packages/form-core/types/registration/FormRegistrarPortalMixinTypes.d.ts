import { Constructor } from '@open-wc/dedupe-mixin';

export declare class FormRegistrarPortalHost {
  __redispatchEventForFormRegistrarPortalMixin(ev: CustomEvent): void;
}

export declare function FormRegistrarPortalImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<FormRegistrarPortalHost> & FormRegistrarPortalHost;

export type FormRegistrarPortalMixin = typeof FormRegistrarPortalImplementation;
