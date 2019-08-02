import { dedupeMixin, nothing } from '@lion/core';

/**
 * #FieldCustomMixin
 *
 * @polymerMixin
 * @mixinFunction
 */

export const FieldCustomMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow, max-len
    class FieldCustomMixin extends superclass {
      static get properties() {
        return {
          /**
           * When no light dom defined and prop set
           */
          disableHelpText: {
            type: Boolean,
            attribute: 'disable-help-text',
          },
        };
      }

      get slots() {
        return {
          ...super.slots,
          'help-text': () => {
            if (!this.disableHelpText) {
              return super.slots['help-text']();
            }
            return null;
          },
        };
      }

      helpTextTemplate(...args) {
        if (this.disableHelpText || !super.helpTextTemplate) {
          return nothing;
        }

        return super.helpTextTemplate.apply(this, args);
      }
    },
);
