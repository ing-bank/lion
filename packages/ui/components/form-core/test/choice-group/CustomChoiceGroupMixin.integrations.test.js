import { runChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { FormGroupMixin, ChoiceGroupMixin, CustomChoiceGroupMixin } from '@lion/ui/form-core.js';

class CustomChoiceGroupAllowCustom extends CustomChoiceGroupMixin(
  ChoiceGroupMixin(FormGroupMixin(LitElement)),
) {
  constructor() {
    super();
    this.allowCustomChoice = true;
  }
}
customElements.define('allow-custom-choice-input-group', CustomChoiceGroupAllowCustom);

class MultipleCustomChoiceGroup extends CustomChoiceGroupMixin(
  ChoiceGroupMixin(FormGroupMixin(LitElement)),
) {
  constructor() {
    super();
    this.multipleChoice = true;
  }
}
customElements.define('multiple-custom-choice-input-group', MultipleCustomChoiceGroup);

class MultipleCustomChoiceGroupAllowCustom extends CustomChoiceGroupMixin(
  ChoiceGroupMixin(FormGroupMixin(LitElement)),
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
