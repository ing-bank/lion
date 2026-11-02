/* eslint-disable no-param-reassign, no-unused-vars */
import { Validator, LionField } from '@lion/ui/form-core.js';
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';
// import { addLionFieldMixinPostProcessor } from '../../../components/form-core/LionFieldMixin.js';
import {
  setAsStateModifierDemoClass,
  getAsStateModifierDemoClass,
  setAsBooleanProp,
  getAsBooleanProp,
} from '../helpers.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

// TODO: export these in @lion/ui/form-core-helpers.js or similar

/**
 * "isTriggeredByUser" for different types of fields:
 *
 * RegularField:
 * - true: when change/input (c.q. user-input-changed) fired
 * - false: when .modelValue set programmatically
 *
 * ChoiceField:
 * - true: when 'change' event fired
 * - false: when .modelValue (or checked) set programmatically
 *
 * OptionChoiceField:
 * - true: when 'click' event fired
 * - false: when .modelValue (or checked) set programmatically
 *
 * ChoiceGroupField (listbox, select-rich, combobox, radio-group, checkbox-group):
 * - true: when child formElement condition for ChoiceField(Option) is met
 * - false: when child formElement condition for ChoiceField(Option) is not met
 *
 * FormOrFieldset (fieldset, form):
 * - true: when child formElement condition for RegularField is met
 * - false: when child formElement condition for RegularField is not met
 */

const featureDetectChoiceField = /** @param {HTMLElement} el */ el =>
  'checked' in el && 'choiceValue' in el;
const featureDetectOptionChoiceField = /** @param {HTMLElement} el */ el => 'active' in el;

/**
 * @param {*} el
 * @returns {'RegularField'|'ChoiceField'|'OptionChoiceField'|'ChoiceGroupField'|'FormOrFieldset'}
 */
function detectType(el) {
  const repropagationRole = el._repropagationRole;
  if (repropagationRole === 'child') {
    if (featureDetectChoiceField(el)) {
      return featureDetectOptionChoiceField(el) ? 'OptionChoiceField' : 'ChoiceField';
    }
    return 'RegularField';
  }
  return repropagationRole === 'choice-group' ? 'ChoiceGroupField' : 'FormOrFieldset';
}

class AlwaysErrorValidator extends Validator {
  // eslint-disable-next-line class-methods-use-this
  execute() {
    return true;
  }

  static async getMessage() {
    return 'This is an example error message';
  }
}
const alwaysErrorValidator = new AlwaysErrorValidator();

/**
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function getInputEl(el) {
  // @ts-expect-error
  return el._inputNode;
}

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: [
      'hover',
      'disabled',
      'focus',
      // 'focus-visible',
      'showsError',
      // 'submitted',
      // 'dirty',
      // 'touched',
      // 'prefilled',
      // 'filled',
      // 'isPending',
    ],
  },
  mapToCode: [
    {
      name: 'hover',
      setter: (el, m, state) => setAsStateModifierDemoClass(getInputEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getInputEl(el), m),
    },
    { name: 'disabled', setter: setAsBooleanProp, getter: getAsBooleanProp },
    {
      name: 'focus',
      setter: (el, m, state) => {
        // eslint-disable-next-line no-param-reassign
        // @ts-expect-error
        el.focused = state;
      },
      // @ts-expect-error
      getter: (el, m) => el.focused,
    },
    // We don't enable focus-visible for ing-web, because it's not separately styled for all components
    // (or we have?)
    // {
    //   name: 'focus-visible',
    //   setter: (el, m, state) => {
    //     // eslint-disable-next-line no-param-reassign
    //     el.focusedVisible = state;
    //   },
    //   getter: (el, m) => el.focusedVisible,
    // },
    {
      name: 'showsError',
      setter: (el, m, state) => {
        if (state) {
          const elType = detectType(el);
          if (elType === 'RegularField') {
            // @ts-expect-error
            el.modelValue = 'some text';
          } else if (elType === 'ChoiceField') {
            // @ts-expect-error
            el.checkedIdex = 1;
          }
          // TODO: restore these as well on reset
          // @ts-expect-error
          el.touched = true;
          // @ts-expect-error
          el.dirty = true;
          // @ts-expect-error
          el.validators.push(alwaysErrorValidator);
          // @ts-expect-error
          el.validate();
        } else {
          // @ts-expect-error
          el.validators = el.validators.filter(v => v !== alwaysErrorValidator);
        }
      },
      getter: (el, m) => el.getAttribute('shows-feedback-for')?.includes('error'),
    },
    // // TODO: adjust when they're made readonly
    // { name: 'touched', setter: setAsBooleanProp, getter: getAsBooleanProp },
    // { name: 'dirty', setter: setAsBooleanProp, getter: getAsBooleanProp },
    // { name: 'prefilled', setter: setAsBooleanProp, getter: getAsBooleanProp },
    // { name: 'filled', setter: setAsBooleanProp, getter: getAsBooleanProp },
    // { name: 'submitted', setter: setAsBooleanProp, getter: getAsBooleanProp },
    // { name: 'isPending', setter: setAsBooleanProp, getter: getAsBooleanProp },
  ],
});

// addIngFieldMixinPostProcessor(IngFieldMixin => {
//   // @ts-expect-error
defineModifierInterfaceOnConstructor(modifierInterface, LionField);
// });
