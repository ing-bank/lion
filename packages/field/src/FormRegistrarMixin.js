// eslint-disable-next-line max-classes-per-file
import { dedupeMixin } from '@lion/core';
import { FormRegisteringMixin } from './FormRegisteringMixin.js';
import { formRegistrarManager } from './formRegistrarManager.js';

/**
 * @desc This class closely mimics the natively
 * supported HTMLFormControlsCollection. It can be accessed
 * both like an array and an object (based on control/element names).
 * @example
 * // This is how a native form works:
 * <form>
 *   <input id="a" name="a">
 *   <fieldset>
 *      <input id="b1" name="b">
 *      <input id="b2" name="b">
 *      <input id="c" name="c">
 *   </fieldset>
 *   <select id="d" name="d">
 *     <option></option>
 *   </select>
 *   <fieldset>
 *     <input type="radio" id="e1" name="e">
 *     <input type="radio" id="e2" name="e">
 *   </fieldset>
 *   <select id="f" name="f" multiple>
 *     <option></option>
 *   </select>
 *   <fieldset>
 *     <input type="checkbox" id="g1" name="g">
 *     <input type="checkbox" id="g2" name="g">
 *   </fieldset>
 * </form>
 *
 * form.elements.length; // 4
 * form.elements[0]; // Element input#a
 * form.elements[1]; // Element input#b1
 * form.elements[2]; // Element input#b2
 * form.elements[3]; // Element input#c
 * form.elements.a;  // Element input#a
 * form.elements.b;  // RadioNodeList<Element> [input#b1, input#b2]
 * form.elements.c;  // input#c
 *
 * // This is how a Lion form works (for simplicity Lion components have the 'l'-prefix):
 * <l-form>
 *  <form>
 *
 *    <!-- fields -->
 *
 *    <l-input id="a" name="a"></l-input>
 *
 *
 *    <!-- field sets ('sub forms') -->
 *
 *    <l-fieldset>
 *      <l-input id="b1" name="b"</l-input>
 *      <l-input id="b2" name="b"></l-input>
 *      <l-input id="c" name="c"></l-input>
 *    </l-fieldset>
 *
 *
 *    <!-- choice groups (children are 'end points') -->
 *
 *    <!-- single selection choice groups -->
 *    <l-select id="d" name="d">
 *      <l-option></l-option>
 *    </l-select>
 *    <l-radio-group id="e" name="e">
 *      <l-radio></l-radio>
 *      <l-radio></l-radio>
 *    </l-radio-group>
 *
 *    <!-- multi selection choice groups -->
 *    <l-select id="f" name="f" multiple>
 *      <l-option></l-option>
 *    </l-select>
 *    <l-checkbox-group id="g" name="g">
 *      <l-checkbox></l-checkbox>
 *      <l-checkbox></l-checkbox>
 *    </l-checkbox-group>
 *
 *  </form>
 * </l-form>
 *
 * lionForm.formElements.length;              // 4
 * lionForm.formElements[0];                  // Element l-input#a
 * lionForm.formElements[1];                  // Element l-input#b1
 * lionForm.formElements[2];                  // Element l-input#b2
 * lionForm.formElements.a;                   // Element l-input#a
 * lionForm.formElements.b;                   // Array<Element> [l-input#b1, l-input#b2]
 * lionForm.formElements.c;                   // Element l-input#c
 *
 * lionForm.formElements[d-g].optionElements; // Array<Element>
 *
 * lionForm.formElements[d-e].value;          // String
 * lionForm.formElements[f-g].value;          // Array<String>
 */
class FormElementsCollection extends Array {
  /**
   * @desc Gives back the named keys and filters out array indexes
   */
  keys() {
    return Object.keys(this).filter(k => Number.isNaN(Number(k)));
  }
}

/**
 * This allows an element to become the manager of a register
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
          _isFormOrFieldset: {
            type: Boolean,
          },
        };
      }

      get formElements() {
        return this.__formElements;
      }

      set formElements(value) {
        this.__formElements = value;
      }

      // TODO: rmv
      get formElementsArray() {
        return this.__formElements;
      }

      constructor() {
        super();
        this.formElements = new FormElementsCollection();

        this._isFormOrFieldset = false;

        this.__readyForRegistration = false;
        this.__hasBeenRendered = false;
        this.registrationReady = new Promise(resolve => {
          this.__resolveRegistrationReady = resolve;
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
        return this.formElementsArray.some(exitingEl => exitingEl === el);
      }

      firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        this.__resolveRegistrationReady();
        this.__readyForRegistration = true;
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
          if (name === this.name && !this._childrenCanHaveSameName) {
            console.info('Error Node:', child); // eslint-disable-line no-console
            throw new TypeError(`You can not have the same name "${name}" as your parent`);
          }

          // if (this.disabled) {
          //   // eslint-disable-next-line no-param-reassign
          //   child.makeRequestToBeDisabled();
          // }

          if (name.substr(-2) === '[]' || this._childNamesCanBeDuplicate) {
            if (!Array.isArray(this.formElements[name])) {
              this.formElements[name] = [];
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
        const index = this.formElements.indexOf(child);
        if (index > -1) {
          this.formElements.splice(index, 1);
        }

        if (this._isFormOrFieldset) {
          const { name } = child;
          if (name.substr(-2) === '[]' && this.formElements[name]) {
            const index = this.formElements[name].indexOf(child);
            if (index > -1) {
              this.formElements[name].splice(index, 1);
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
          // as we fire and listen - don't add ourselves
          return;
        }
        if (!this.isRegisteredFormElement(child)) {
          // do not readd already existing elements
          return;
        }
        ev.stopPropagation();

        this.removeFormElement(child);
      }
    },
);
