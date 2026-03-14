import { LionSegmentedControl } from '@lion/ui/segmented-control.js';
import {
  setAsStateModifierDemoClass,
  getAsStateModifierDemoClass,
  setAsBooleanProp,
  getAsBooleanProp,
} from '../helpers.js';
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

/**
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function getSegmentedChoiceEl(el) {
  // @ts-ignore
  return el.querySelector('[type="radio"]');
}

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: ['hover', 'disabled', 'focus', 'active', 'checked'],
  },
  mapToCode: [
    {
      name: 'hover',
      setter: (el, m, state) => setAsStateModifierDemoClass(getSegmentedChoiceEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSegmentedChoiceEl(el), m),
    },
    {
      name: 'disabled',
      setter: (el, m, state) => setAsBooleanProp(getSegmentedChoiceEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSegmentedChoiceEl(el), m),
    },
    {
      name: 'focus',
      setter: (el, m, state) => setAsStateModifierDemoClass(getSegmentedChoiceEl(el), m, state),
      getter: (el, m) => getAsBooleanProp(getSegmentedChoiceEl(el), m),
    },
    {
      name: 'active',
      setter: (el, m, state) => setAsStateModifierDemoClass(getSegmentedChoiceEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSegmentedChoiceEl(el), m),
    },
    {
      name: 'checked',
      setter: (el, m, state) => setAsBooleanProp(getSegmentedChoiceEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSegmentedChoiceEl(el), m),
    },
  ],
});

defineModifierInterfaceOnConstructor(modifierInterface, IngSegmentedControl);
