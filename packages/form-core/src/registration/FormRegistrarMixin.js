// eslint-disable-next-line max-classes-per-file
import { dedupeMixin } from '@lion/core';
import { FormRegisteringMixin } from './FormRegisteringMixin.js';
import { formRegistrarManager } from './formRegistrarManager.js';
import { FormControlsCollection } from './FormControlsCollection.js';

// TODO: rename .formElements to .formControls? (or .$controls ?)

/**
 * @desc This allows an element to become the manager of a register.
 * It basically keeps track of a FormControlsCollection that it stores in .formElements
 * This will always be an array of all elements.
 * In case of a form or fieldset(sub form), it will also act as a key based object with FormControl
 * (fields, choice groups or fieldsets)as keys.
 * For choice groups, the value will only stay an array.
 * See FormControlsCollection for more information
 */
export const FormRegistrarMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, no-unused-vars
    class FormRegistrarMixin extends FormRegisteringMixin(superclass) {
      static get properties() {
        return {
          /**
           * @desc Flag that determines how ".formElements" should behave.
           * For a regular fieldset (see LionFieldset) we expect ".formElements"
           * to be accessible as an object.
           * In case of a radio-group, a checkbox-group or a select/listbox,
           * it should act like an array (see ChoiceGroupMixin).
           * Usually, when false, we deal with a choice-group (radio-group, checkbox-group,
           * (multi)select)
           * @type {boolean}
           */
          _isFormOrFieldset: Boolean,
        };
      }

      constructor() {
        super();
        this.formElements = new FormControlsCollection();

        this._isFormOrFieldset = false;

        this.__readyForRegistration = false;
        this.__hasBeenRendered = false;
        this.registrationReady = new Promise(resolve => {
          this.__resolveRegistrationReady = resolve;
        });
        this.registrationComplete = new Promise(resolve => {
          this.__resolveRegistrationComplete = resolve;
        });

        this._onRequestToAddFormElement = this._onRequestToAddFormElement.bind(this);
        this.addEventListener('form-element-register', this._onRequestToAddFormElement);
      }

      connectedCallback() {
        if (super.connectedCallback) {
          super.connectedCallback();
        }
        formRegistrarManager.add(this);
        if (this.__hasBeenRendered) {
          formRegistrarManager.becomesReady();
        }
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }
        formRegistrarManager.remove(this);
      }

      isRegisteredFormElement(el) {
        return this.formElements.some(exitingEl => exitingEl === el);
      }

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.__resolveRegistrationReady();
        this.__readyForRegistration = true;

        // After we allow our children to register, we need to wait one tick before they
        // all sent their 'form-element-register' event.
        // TODO: allow developer to delay this moment, similar to LitElement.performUpdate can be
        // delayed.
        setTimeout(() => {
          this.registrationHasCompleted = true;
          this.__resolveRegistrationComplete();
        });

        formRegistrarManager.becomesReady();
        this.__hasBeenRendered = true;
      }

      addFormElement(child, indexToInsertAt) {
        // This is a way to let the child element (a lion-fieldset or lion-field) know, about its parent
        // eslint-disable-next-line no-param-reassign
        child.__parentFormGroup = this;

        // 1. Add children as array element
        if (indexToInsertAt > 0) {
          this.formElements.splice(indexToInsertAt, 0, child);
        } else {
          this.formElements.push(child);
        }

        // 2. Add children as object key
        if (this._isFormOrFieldset) {
          const { name } = child;
          if (!name) {
            console.info('Error Node:', child); // eslint-disable-line no-console
            throw new TypeError('You need to define a name');
          }
          if (name === this.name) {
            console.info('Error Node:', child); // eslint-disable-line no-console
            throw new TypeError(`You can not have the same name "${name}" as your parent`);
          }

          if (name.substr(-2) === '[]') {
            if (!Array.isArray(this.formElements[name])) {
              this.formElements[name] = new FormControlsCollection();
            }
            if (indexToInsertAt > 0) {
              this.formElements[name].splice(indexToInsertAt, 0, child);
            } else {
              this.formElements[name].push(child);
            }
          } else if (!this.formElements[name]) {
            this.formElements[name] = child;
          } else {
            console.info('Error Node:', child); // eslint-disable-line no-console
            throw new TypeError(
              `Name "${name}" is already registered - if you want an array add [] to the end`,
            );
          }
        }
      }

      removeFormElement(child) {
        // 1. Handle array based children
        const index = this.formElements.indexOf(child);
        if (index > -1) {
          this.formElements.splice(index, 1);
        }

        // 2. Handle name based object keys
        if (this._isFormOrFieldset) {
          const { name } = child;
          if (name.substr(-2) === '[]' && this.formElements[name]) {
            const idx = this.formElements[name].indexOf(child);
            if (idx > -1) {
              this.formElements[name].splice(idx, 1);
            }
          } else if (this.formElements[name]) {
            delete this.formElements[name];
          }
        }
      }

      _onRequestToAddFormElement(ev) {
        const child = ev.detail.element;
        if (child === this) {
          // as we fire and listen - don't add ourselves
          return;
        }
        if (this.isRegisteredFormElement(child)) {
          // do not readd already existing elements
          return;
        }
        ev.stopPropagation();

        // Check for siblings to determine the right order to insert into formElements
        // If there is no next sibling, index is -1
        let indexToInsertAt = -1;
        if (this.formElements && Array.isArray(this.formElements)) {
          indexToInsertAt = this.formElements.indexOf(child.nextElementSibling);
        }
        this.addFormElement(child, indexToInsertAt);
      }

      _onRequestToRemoveFormElement(ev) {
        const child = ev.detail.element;
        if (child === this) {
          // as we fire and listen - don't remove ourselves
          return;
        }
        if (!this.isRegisteredFormElement(child)) {
          // do not remove non existing elements
          return;
        }
        ev.stopPropagation();

        this.removeFormElement(child);
      }
    },
);
