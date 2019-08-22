import { dedupeMixin } from '@lion/core';
import { formRegistrarManager } from './formRegistrarManager.js';

/**
 * This will forward
 */
export const FormRegistrarPortalMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormRegistrarPortalMixin extends superclass {
      constructor() {
        super();
        this.formElements = [];
        this.__readyForRegistration = false;
        this.registrationReady = new Promise(resolve => {
          this.__resolveRegistrationReady = resolve;
        });
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        formRegistrarManager.add(this);
        this.__redispatchEventForFormRegistrarPortalMixin = ev => {
          ev.stopPropagation();
          // TODO: fire event with changed ev.target
          this.dispatchEvent(
            new CustomEvent('form-element-register', {
              detail: { element: ev.element },
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
      }

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.__resolveRegistrationReady();
        this.__readyForRegistration = true;
        formRegistrarManager.becomesReady(this);
      }
    },
);
