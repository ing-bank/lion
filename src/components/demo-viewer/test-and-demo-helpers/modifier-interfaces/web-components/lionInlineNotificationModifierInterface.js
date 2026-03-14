import { LionNotificationInline } from '@lion/ui/notification-inline.js';
import { setAsEnumValue, getAsEnumValue } from '../helpers.js';
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    variants: [
      { name: 'type', values: ['success', 'warning', 'information', 'error'] },
      { name: 'mode', values: ['default', 'borderless', 'simple'] },
    ],
  },
  mapToCode: [
    { name: 'type', setter: setAsEnumValue, getter: getAsEnumValue },
    {
      name: 'mode',
      setter: (el, m, state) => {
        const notificationEl = /** @type {LionNotificationInline} */ (el);
        if (state === 'borderless') {
          notificationEl.inverted = true;
          notificationEl.light = false;
        } else if (state === 'simple') {
          notificationEl.light = true;
          notificationEl.inverted = false;
        } else {
          notificationEl.light = false;
          notificationEl.inverted = false;
        }
      },
      getter: el => {
        const notificationEl = /** @type {LionNotificationInline} */ (el);
        if (notificationEl.inverted) {
          return 'borderless';
        }
        if (notificationEl.light) {
          return 'simple';
        }
        return 'default';
      },
    },
  ],
});

defineModifierInterfaceOnConstructor(modifierInterface, LionNotificationInline);
