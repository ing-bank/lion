import { Constructor } from '@open-wc/dedupe-mixin';

export declare class FormControlsCollection {
  _keys(): string[];
}

export declare class ElementWithParentFormGroup {
  __parentFormGroup: FormRegistrarHost;
}

export declare class FormRegistrarHost {
  static get properties(): {
    _isFormOrFieldset: {
      type: BooleanConstructor;
      reflect: boolean;
    };
  };
  _isFormOrFieldset: boolean;
  formElements: FormControlsCollection;
  addFormElement(child: HTMLElement & ElementWithParentFormGroup, indexToInsertAt: number): void;
}

export declare function FormRegistrarImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<FormRegistrarHost> & FormRegistrarHost;

export type FormRegistrarMixin = typeof FormRegistrarImplementation;
