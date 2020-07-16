import { dedupeMixin } from '@lion/core';

/**
 * This allows to register fields within a form even though they are not within the same dom tree.
 * It does that by redispatching the event on the registration target.
 * Neither form or field need to know about the portal. It acts as if the field is part of the dom tree.
 *
 * @example
 * <my-form></my-form>
 * <my-portal .registrationTarget=${document.querySelector('my-form')}>
 *   <my-field></my-field>
 * </my-portal>
 * // my-field will be registered within my-form
 */
export const FormRegistrarPortalMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormRegistrarPortalMixin extends superclass {
      constructor() {
        super();
        this.registrationTarget = undefined;
        this.__redispatchEventForFormRegistrarPortalMixin = this.__redispatchEventForFormRegistrarPortalMixin.bind(
          this,
        );
        this.addEventListener(
          'form-element-register',
          this.__redispatchEventForFormRegistrarPortalMixin,
        );
      }

      __redispatchEventForFormRegistrarPortalMixin(ev) {
        ev.stopPropagation();
        if (!this.registrationTarget) {
          throw new Error('A FormRegistrarPortal element requires a .registrationTarget');
        }
        this.registrationTarget.dispatchEvent(
          new CustomEvent('form-element-register', {
            detail: { element: ev.detail.element },
            bubbles: true,
          }),
        );
      }
    },
);
