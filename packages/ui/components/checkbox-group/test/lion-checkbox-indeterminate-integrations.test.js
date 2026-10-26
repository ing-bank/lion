import '@lion/ui/define/lion-checkbox-indeterminate.js';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox.js';

import {
  LionCheckbox,
  LionCheckboxGroup,
  LionCheckboxIndeterminate,
} from '@lion/ui/checkbox-group.js';
import { runChoiceInputMixinSuite } from '@lion/ui/form-core-test-suites.js';
import { runCheckboxIndeterminateSuite } from '../test-suites/CheckboxIndeterminate.suite.js';

runChoiceInputMixinSuite({ classes: { host: LionCheckboxIndeterminate } });
runCheckboxIndeterminateSuite({
  classes: {
    host: LionCheckboxIndeterminate,
    'checkbox-group': LionCheckboxGroup,
    checkbox: LionCheckbox,
  },
});
