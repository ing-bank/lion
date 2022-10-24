import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @typedef {import('../../types/registration/FormRegistrarPortalMixinTypes').FormRegistrarPortalMixin} FormRegistrarPortalMixin
 * @typedef {import('../../types/registration/FormRegistrarPortalMixinTypes').FormRegistrarPortalHost} FormRegistrarPortalHost
 */

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
 * @type {FormRegistrarPortalMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<HTMLElement>} superclass
 */
const FormRegistrarPortalMixinImplementation = superclass =>
  // eslint-disable-next-line no-shadow, no-unused-vars
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class extends superclass {
    constructor() {
      super();

      /**
       * Registration target: an element, usually in the body of the dom, that captures events
       * and redispatches them on host
       * @type {(FormRegistrarPortalHost & HTMLElement) | undefined}
       */
      this.registrationTarget = undefined;
      this.__redispatchEventForFormRegistrarPortalMixin =
        this.__redispatchEventForFormRegistrarPortalMixin.bind(this);
      this.addEventListener(
        'form-element-register',
        /** @type {EventListenerOrEventListenerObject} */ (
          this.__redispatchEventForFormRegistrarPortalMixin
        ),
      );
    }

    /**
     * @param {CustomEvent} ev
     * @private
     */
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
  };

export const FormRegistrarPortalMixin = dedupeMixin(FormRegistrarPortalMixinImplementation);
