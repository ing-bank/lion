import { Constructor } from '@open-wc/dedupe-mixin';
import { FormControlsCollection } from '../../src/registration/FormControlsCollection';
import { FormRegisteringHost } from '../../types/registration/FormRegisteringMixinTypes';
import { FormControlHost } from '../../types/FormControlMixinTypes';
import { LitElement } from '@lion/core';

export declare class ElementWithParentFormGroup {
  _parentFormGroup: FormRegistrarHost;
}

export declare class FormRegistrarHost {
  formElements: FormControlsCollection & { [x: string]: any };
  addFormElement(
    child:
      | (FormControlHost & ElementWithParentFormGroup)
      | (FormControlHost & HTMLElement)
      | (HTMLElement & ElementWithParentFormGroup),
    indexToInsertAt?: number,
  ): void;
  removeFormElement(child: FormRegisteringHost): void;
  isRegisteredFormElement(el: FormControlHost): boolean;
  registrationComplete: Promise<boolean>;
  initComplete: Promise<boolean>;
  protected _isFormOrFieldset: boolean;
  protected _onRequestToAddFormElement(e: CustomEvent): void;
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
