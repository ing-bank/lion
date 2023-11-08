import { runChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { FormGroupMixin, ChoiceInputMixin } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { CustomChoiceGroupMixin } from '../../src/choice-group/CustomChoiceGroupMixin.js';

class CustomChoiceGroup extends CustomChoiceGroupMixin(FormGroupMixin(LitElement)) {}
customElements.define('custom-choice-input-group', CustomChoiceGroup);

class ChoiceInput extends ChoiceInputMixin(LionInput) {}
customElements.define('custom-choice-input', ChoiceInput);

class CustomChoiceGroupAllowCustom extends CustomChoiceGroupMixin(FormGroupMixin(LitElement)) {
  constructor() {
    super();
    this.allowCustomChoice = true;
  }
}
customElements.define('allow-custom-choice-input-group', CustomChoiceGroupAllowCustom);

class MultipleCustomChoiceGroup extends CustomChoiceGroupMixin(FormGroupMixin(LitElement)) {
  constructor() {
    super();
    this.multipleChoice = true;
  }
}
customElements.define('multiple-custom-choice-input-group', MultipleCustomChoiceGroup);

class MultipleCustomChoiceGroupAllowCustom extends CustomChoiceGroupMixin(
  FormGroupMixin(LitElement),
) {
  constructor() {
    super();
    this.multipleChoice = true;
    this.allowCustomChoice = true;
  }
}
customElements.define(
  'multiple-allow-custom-choice-input-group',
  MultipleCustomChoiceGroupAllowCustom,
);

runChoiceGroupMixinSuite({ parentTagString: 'custom-choice-input-group' });
runChoiceGroupMixinSuite({
  parentTagString: 'multiple-custom-choice-input-group',
  choiceType: 'multiple',
});
runChoiceGroupMixinSuite({ parentTagString: 'allow-custom-choice-input-group' });
runChoiceGroupMixinSuite({
  parentTagString: 'multiple-allow-custom-choice-input-group',
  choiceType: 'multiple',
});
