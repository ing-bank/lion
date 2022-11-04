import { LitElement } from 'lit';
import { Constructor } from '@open-wc/dedupe-mixin';

import { FormRegistrarHost } from './FormRegistrarMixinTypes.js';

export declare class FormRegisteringHost {
  /**
   * The name the host is registered with to a parent
   */
  name: string;

  /**
   * The registrar this FormControl registers to, Usually a descendant of FormGroup or
   * ChoiceGroup
   */
  protected _parentFormGroup: FormRegistrarHost | undefined;

  private __unregisterFormElement: void;
}

export declare function FormRegisteringImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormRegisteringHost> &
  Pick<typeof FormRegisteringHost, keyof typeof FormRegisteringHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormRegisteringMixin = typeof FormRegisteringImplementation;
