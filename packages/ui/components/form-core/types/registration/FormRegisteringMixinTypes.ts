import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

import { FormRegistrarHost } from './FormRegistrarMixinTypes.js';

export declare class FormRegisteringHost {
  static get properties(): {
    name: {
      type: StringConstructor;
      reflect: boolean;
    };
  }
  
  /**
   * To encourage accessibility best practices, `form-element-register` events
   * do not pierce through shadow roots. This forces the developer to create form groups and fieldsets that
   * automatically allow the creation of accessible relationships in the same dom tree.
   * Use this option if you know what you're doing. It will then be possible to nest FormControls
   * inside shadow dom. See https://lion-web.netlify.app/fundamentals/rationales/accessibility#shadow-roots-and-accessibility
   */
  allowCrossRootRegistration: boolean;

  /**
   * The name the element will be registered with to the .formElements collection
   * of the parent. Also, it serves as the key of key/value pairs in
   *  modelValue/serializedValue objects
   */
  get name(): string;
  set name(arg: any);

  /**
   * The registrar this FormControl registers to, Usually a descendant of FormGroup or
   * ChoiceGroup
   */
  protected _parentFormGroup: FormRegistrarHost | undefined;

  private __name: string;

  private __unregisterFormElement: void;
}

export declare function FormRegisteringImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormRegisteringHost> &
  Pick<typeof FormRegisteringHost, keyof typeof FormRegisteringHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormRegisteringMixin = typeof FormRegisteringImplementation;
