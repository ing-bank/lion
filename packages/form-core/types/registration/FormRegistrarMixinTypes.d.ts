import { Constructor } from '@open-wc/dedupe-mixin';
import { FormControlsCollection } from '../../src/registration/FormControlsCollection';
import { FormRegisteringHost } from '../../types/registration/FormRegisteringMixinTypes';
import { FormControlHost } from '../../types/FormControlMixinTypes';
import { LitElement } from '@lion/core';

export declare class ElementWithParentFormGroup {
  _parentFormGroup: FormRegistrarHost;
}

export declare class FormRegistrarHost {
  /**
   * Closely mimics the natively supported HTMLFormControlsCollection. It can be accessed
   * both like an array and an object (based on control/element names).
   */
  formElements: FormControlsCollection & { [x: string]: any };

  /**
   * Adds FormControl to `.formElements`
   */
  addFormElement(
    child:
      | (FormControlHost & ElementWithParentFormGroup)
      | (FormControlHost & HTMLElement)
      | (HTMLElement & ElementWithParentFormGroup),
    indexToInsertAt?: number,
  ): void;

  /**
   * Removes FormControl from `.formElements`
   */
  removeFormElement(child: FormRegisteringHost): void;

  /**
   * Whether FormControl is part of `.formElements`
   */
  isRegisteredFormElement(el: FormControlHost): boolean;

  /**
   * Promise that is resolved by `._completeRegistration`. By default after one microtask,
   * so children get the chance to register themselves
   */
  registrationComplete: Promise<boolean>;

  /**
   * initComplete resolves after all pending initialization logic
   * (for instance `<form-group .serializedValue=${{ child1: 'a', child2: 'b' }}>`)
   * is executed.
   */
  initComplete: Promise<boolean>;

  /**
   * Flag that determines how ".formElements" should behave.
   * For a regular fieldset (see LionFieldset) we expect ".formElements"
   * to be accessible as an object.
   * In case of a radio-group, a checkbox-group or a select/listbox,
   * it should act like an array (see ChoiceGroupMixin).
   * Usually, when false, we deal with a choice-group (radio-group, checkbox-group,
   * (multi)select)
   */
  protected _isFormOrFieldset: boolean;

  /**
   * Hook for Subclassers to perform logic before an element is added
   */
  protected _onRequestToAddFormElement(e: CustomEvent): void;

  protected _onRequestToChangeFormElementName(e: CustomEvent): void;

  protected _onRequestToRemoveFormElement(e: CustomEvent): void;

  /**
   * Resolves the registrationComplete promise. Subclassers can delay if needed
   */
  protected _completeRegistration(): void;
}

export declare function FormRegistrarImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormRegistrarHost> &
  Pick<typeof FormRegistrarHost, keyof typeof FormRegistrarHost> &
  Constructor<FormRegisteringHost> &
  Pick<typeof FormRegisteringHost, keyof typeof FormRegisteringHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormRegistrarMixin = typeof FormRegistrarImplementation;
