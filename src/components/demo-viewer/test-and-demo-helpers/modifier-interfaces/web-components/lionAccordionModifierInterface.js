import { LionAccordion } from '@lion/ui/accordion.js';
import {
  setAsStateModifierDemoClass,
  getAsStateModifierDemoClass,
  setAsBooleanProp,
  getAsBooleanProp,
  runWhilePreservingFocus,
} from '../helpers.js';
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

/**
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function getAccordionInvokerBtnEl(el) {
  // @ts-ignore
  return el.querySelector('[slot=_accordion]')?.firstElementChild;
}

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: ['hover', 'disabled', 'focus', 'active', 'open'],
  },
  mapToCode: [
    {
      name: 'hover',
      setter: (el, m, state) => setAsStateModifierDemoClass(getAccordionInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getAccordionInvokerBtnEl(el), m),
    },
    {
      name: 'disabled',
      setter: (el, m, state) => setAsBooleanProp(getAccordionInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsBooleanProp(getAccordionInvokerBtnEl(el), m),
    },
    {
      name: 'focus',
      setter: (el, m, state) => setAsStateModifierDemoClass(getAccordionInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getAccordionInvokerBtnEl(el), m),
    },
    {
      name: 'active',
      setter: (el, m, state) => setAsStateModifierDemoClass(getAccordionInvokerBtnEl(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getAccordionInvokerBtnEl(el), m),
    },
    {
      name: 'open',
      setter: (el, m, state) => {
        const invokerBtn = getAccordionInvokerBtnEl(el);
        const isExpanded = invokerBtn.getAttribute('aria-expanded') === 'true';
        if ((isExpanded && state === false) || (!isExpanded && state === true)) {
          runWhilePreservingFocus(() => invokerBtn.click());
        }
      },
      getter: el => {
        const invokerBtn = getAccordionInvokerBtnEl(el);
        const isExpanded = invokerBtn.getAttribute('aria-expanded') === 'true';
        return isExpanded;
      },
    },
  ],
});

defineModifierInterfaceOnConstructor(modifierInterface, LionAccordion);
