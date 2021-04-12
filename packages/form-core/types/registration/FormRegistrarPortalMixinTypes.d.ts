import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export declare class FormRegistrarPortalHost {
  registrationTarget: HTMLElement;
  private __redispatchEventForFormRegistrarPortalMixin(ev: CustomEvent): void;
}

export declare function FormRegistrarPortalImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormRegistrarPortalHost> &
  Pick<typeof FormRegistrarPortalHost, keyof typeof FormRegistrarPortalHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormRegistrarPortalMixin = typeof FormRegistrarPortalImplementation;
