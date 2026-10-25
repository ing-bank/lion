import { LionCalendar } from '@lion/ui/calendar.js';
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
function getCalendarFirstDayBtn(el) {
  const firstDay = el.shadowRoot?.querySelector('[first-day]');
  // @ts-ignore
  return firstDay?.firstElementChild;
}

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: ['hover', 'disabled', 'focus', 'pressed', 'checked'],
  },
  mapToCode: [
    {
      name: 'hover',
      setter: (el, m, state) => setAsStateModifierDemoClass(getCalendarFirstDayBtn(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getCalendarFirstDayBtn(el), m),
    },
    {
      name: 'disabled',
      setter: (el, m, state) => setAsBooleanProp(getCalendarFirstDayBtn(el), m, state),
      getter: (el, m) => getAsBooleanProp(getCalendarFirstDayBtn(el), m),
    },
    {
      name: 'focus',
      setter: (el, m, state) => setAsStateModifierDemoClass(getCalendarFirstDayBtn(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getCalendarFirstDayBtn(el), m),
    },
    {
      name: 'pressed',
      setter: (el, m, state) => setAsStateModifierDemoClass(getCalendarFirstDayBtn(el), m, state),
      getter: (el, m) => getAsStateModifierDemoClass(getCalendarFirstDayBtn(el), m),
    },
    {
      name: 'checked',
      setter: (el, m, state) => setAsBooleanProp(getCalendarFirstDayBtn(el), m, state),
      getter: (el, m) => getAsBooleanProp(getCalendarFirstDayBtn(el), m),
    },
  ],
});

defineModifierInterfaceOnConstructor(modifierInterface, LionCalendar);
