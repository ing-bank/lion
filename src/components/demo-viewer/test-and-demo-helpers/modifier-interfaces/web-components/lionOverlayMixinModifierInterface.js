/* eslint-disable no-param-reassign, no-unused-vars */
import { defineModifierInterfaceOnConstructor } from '../applyModifierInterface.js';
// eslint-disable-next-line import/no-relative-packages
import { _addOverlayMixinPostProcessor } from '../../../../../../packages/ui/components/overlays/src/OverlayMixin.js';

/**
 * @typedef {import('../ModifierInterface.js').ModifierInterface} ModifierInterface
 */

const modifierInterface = /** @type {ModifierInterface} */ ({
  designDefinitions: {
    states: ['open'],
  },
  mapToCode: [
    {
      name: 'open',
      setter: (el, m, state) => {
        // @ts-expect-error
        el.opened = state;
      },
      // @ts-expect-error
      getter: (el, m) => el.opened,
    },
  ],
});

_addOverlayMixinPostProcessor(LionOverlayMixin => {
  // @ts-expect-error
  defineModifierInterfaceOnConstructor(modifierInterface, LionOverlayMixin);
});
