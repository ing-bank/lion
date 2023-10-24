import { ChoiceInputMixin, CustomChoiceGroupMixin, FormGroupMixin } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { runCustomChoiceGroupMixinSuite } from '@lion/ui/form-core-test-suites.js';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';

class CustomChoiceGroup extends CustomChoiceGroupMixin(FormGroupMixin(LitElement)) {}
customElements.define('custom-choice-input-group', CustomChoiceGroup);

class ChoiceInput extends ChoiceInputMixin(LionInput) {}
customElements.define('custom-choice-input', ChoiceInput);

runCustomChoiceGroupMixinSuite();
