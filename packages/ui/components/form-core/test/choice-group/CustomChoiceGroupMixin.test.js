import { ChoiceInputMixin, FormGroupMixin } from '@lion/ui/form-core.js';
import { LionInput } from '@lion/ui/input.js';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-fieldset.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';
import { CustomChoiceGroupMixin } from '../../src/choice-group/CustomChoiceGroupMixin.js';
import { runCustomChoiceGroupMixinSuite } from '../../test-suites/choice-group/CustomChoiceGroupMixin.suite.js';

export class CustomChoiceGroup extends CustomChoiceGroupMixin(FormGroupMixin(LitElement)) {}
customElements.define('custom-choice-input-group', CustomChoiceGroup);

class ChoiceInput extends ChoiceInputMixin(LionInput) {}
customElements.define('custom-choice-input', ChoiceInput);

runCustomChoiceGroupMixinSuite();
