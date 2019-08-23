import { dedupeMixin } from '@lion/core';
import { formRegistrarManager } from './formRegistrarManager.js';

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
        this.formElements = [];
        this.registrationTarget = undefined;
        this.__readyForRegistration = false;
        this.registrationReady = new Promise(resolve => {
          this.__resolveRegistrationReady = resolve;
        });
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        this.__checkRegistrationTarget();

        formRegistrarManager.add(this);

        this.__redispatchEventForFormRegistrarPortalMixin = ev => {
          ev.stopPropagation();
          // TODO: change ev.target to original registering element
          this.registrationTarget.dispatchEvent(
            new CustomEvent('form-element-register', {
              detail: { element: ev.detail.element },
              bubbles: true,
            }),
          );
        };
        this.addEventListener(
          'form-element-register',
          this.__redispatchEventForFormRegistrarPortalMixin,
        );
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        formRegistrarManager.remove(this);
        this.removeEventListener(
          'form-element-register',
          this.__redispatchEventForFormRegistrarPortalMixin,
        );
      }

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.__resolveRegistrationReady();
        this.__readyForRegistration = true;
        formRegistrarManager.becomesReady(this);
      }

      __checkRegistrationTarget() {
        if (!this.registrationTarget) {
          throw new Error('A FormRegistrarPortal element requires a .registrationTarget');
        }
      }
    },
);
