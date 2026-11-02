import { LionTabs } from '@lion/ui/tabs.js';
import {
  setAsStateModifierDemoClass,
  getAsStateModifierDemoClass,
  setAsBooleanProp,
  getAsBooleanProp,
  runWhilePreservingFocus,
} from '../helpers.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

/**
 * @param {HTMLElement} el
 * @returns {HTMLElement}
 */
function getFirstTab(el) {
  // @ts-ignore
  return el.querySelector('[slot=tab]');
}

// @ts-expect-error
LionTabs.modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: ['hover', 'disabled', 'focus', 'pressed', 'open'],
  },
  mapToCode: [
    {
      name: 'hover',
      setter: (el, m, state) => setAsStateModifierDemoClass(getFirstTab(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getFirstTab(el), m),
    },
    {
      name: 'disabled',
      setter: (el, m, state) => setAsBooleanProp(getFirstTab(el), m, state),
      getter: (el, m) => getAsBooleanProp(getFirstTab(el), m),
    },
    {
      name: 'focus',
      setter: (el, m, state) => setAsStateModifierDemoClass(getFirstTab(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getFirstTab(el), m),
    },
    {
      name: 'pressed',
      setter: (el, m, state) => setAsStateModifierDemoClass(getFirstTab(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getFirstTab(el), m),
    },
    {
      name: 'open',
      setter: (el, m, state) => {
        const invokerBtn = getFirstTab(el);
        const isExpanded = invokerBtn.getAttribute('aria-expanded') === 'true';
        if ((isExpanded && state === false) || (!isExpanded && state === true)) {
          runWhilePreservingFocus(() => invokerBtn.click());
        }
      },
      getter: el => {
        const invokerBtn = getFirstTab(el);
        const isExpanded = invokerBtn.getAttribute('aria-expanded') === 'true';
        return isExpanded;
      },
    },
  ],
});
