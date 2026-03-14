import { LionButton } from '@lion/ui/button.js';
import {
  setAsStateModifierDemoClass,
  getAsStateModifierDemoClass,
  setAsBooleanProp,
  getAsBooleanProp,
  // setAsEnumValue,
  // getAsEnumValue,
} from '../helpers.js';
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';
// import { validButtonVariations } from '../../../components/button/validButtonVariations.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    // variants: [{ name: 'variation', values: validButtonVariations }],
    states: ['hover', 'active', 'focus', 'disabled'],
  },
  mapToCode: [
    // { name: 'variation', setter: setAsEnumValue, getter: getAsEnumValue },
    // States
    { name: 'hover', setter: setAsStateModifierDemoClass, getter: getAsStateModifierDemoClass },
    { name: 'disabled', setter: setAsBooleanProp, getter: getAsBooleanProp },
    { name: 'focus', setter: setAsStateModifierDemoClass, getter: getAsStateModifierDemoClass },
    { name: 'active', setter: setAsStateModifierDemoClass, getter: getAsStateModifierDemoClass },
  ],
});

defineModifierInterfaceOnConstructor(modifierInterface, LionButton);
