import { LionSelectRich } from '@lion/ui/select-rich.js';
import { setAsStateModifierDemoClass, getAsStateModifierDemoClass } from '../helpers.js';
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

/**
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function getSelectAccountInvokerBtnEl(el) {
  // @ts-ignore
  return el.querySelector('[slot=invoker]');
}

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: ['hover', 'disabled', 'focus', 'active'],
  },
  mapToCode: [
    {
      name: 'hover',
      setter: (el, m, state) =>
        setAsStateModifierDemoClass(getSelectAccountInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSelectAccountInvokerBtnEl(el), m),
    },
    {
      name: 'active',
      setter: (el, m, state) =>
        setAsStateModifierDemoClass(getSelectAccountInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSelectAccountInvokerBtnEl(el), m),
    },
    {
      name: 'focus',
      setter: (el, m, state) =>
        setAsStateModifierDemoClass(getSelectAccountInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getSelectAccountInvokerBtnEl(el), m),
    },
  ],
});

defineModifierInterfaceOnConstructor(modifierInterface, LionSelectRich);
