import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export declare class FormRegistrarPortalHost {
  /**
   * Registration target: an element, usually in the body of the dom, that captures events
   * and redispatches them on host
   */
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
