// Make sure to patch LionFieldset before checkbox-group is instantiated
import { LionFieldset } from '@lion/fieldset';
import { LionField } from '@lion/field';
import { LionRadio } from '@lion/radio';
import { LionCheckbox } from '@lion/checkbox';

import { DebugManager } from './DebugManager.js';
import './lion-debuggable-output.js';
import './lion-debug-viewer.js';


// Make the most fundamental components (which are a base for every form component debuggable)

// const cfg =   [{
//   type: 'group',
//   name: 'Interaction states',
//   items: [
//     'focused',
//     'touched',
//     'dirty',
//     'prefilled',
//     'submitted',
//   ],
// },
// {
//   type: 'group',
//   name: 'Error states',
//   items: [
//     'errorState',
//     'errorShow',
//     'errorValidators',
//   ],
// },
// {
//   type: 'group',
//   name: 'Values',
//   items: [
//     'modelValue',
//     'formattedValue',
//     'serializedValue',
//   ],
// },
// ];

// const typeValidators = (type) => ({
//   type: 'expression',
//   name: `${type}Validators`,
//   expression: el => el.getValidatorsForType(type),
// });

DebugManager.makeDebuggables(
  [LionField, LionFieldset],
  [
    'focused',
    'touched',
    'dirty',
    'prefilled',
    'submitted',
    'errorState',
    'errorShow',
    'modelValue',
    'formattedValue',
  ],
);

// TODO: extract props to relevant prototypes (for instance 'checked' on ChoiceInputMixin)

const checkedStateClass = {
  type: 'expression',
  name: '.state-checked',
  expression: el => el.classList.contains('state-checked'),
};

DebugManager.makeDebuggables(
  [LionRadio, LionCheckbox],
  [
    'focused',
    'touched',
    'dirty',
    'prefilled',
    'checked',
    checkedStateClass,
    'errorState',
    'errorShow',
    'errorValidators',
    'modelValue',
    'formattedValue',
  ],
);
