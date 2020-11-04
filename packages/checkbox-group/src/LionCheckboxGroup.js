import { LitElement } from '@lion/core';
import { ChoiceGroupMixin, FormGroupMixin } from '@lion/form-core';

/**
 * A wrapper around multiple checkboxes
 */
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/40110
export class LionCheckboxGroup extends ChoiceGroupMixin(FormGroupMixin(LitElement)) {
  constructor() {
    super();
    this.multipleChoice = true;
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('name') && !String(this.name).match(/\[\]$/)) {
      throw new Error('Names should end in "[]".');
    }
  }
}
