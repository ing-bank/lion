/* eslint-disable no-underscore-dangle, class-methods-use-this */
/* global ShadyCSS */
import { dedupeMixin } from './dedupeMixin.js';
import { DomHelpersMixin } from './DomHelpersMixin.js';

/**
 * @deprecated please apply DomHelpersMixin and UpdateStylesMixin if needed yourself
 */
export const ElementMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-shadow
    class ElementMixin extends DomHelpersMixin(superclass) {
      /**
       * @example
       * <my-element>
       *     <style>
       *         :host {
       *          color: var(--foo);
       *         }
       *     </style>
       * </my-element>
       *
       * $0.updateStyles({'background': 'orange', '--foo': '#fff'})
       * Chrome, Firefox: <my-element style="background: orange; --foo: bar;">
       * IE: <my-element>
       *     => to head: <style>color: #fff</style>
       *
       * @param {Object} updateStyles
       */
      updateStyles(updateStyles) {
        const styleString = this.getAttribute('style') || this.getAttribute('data-style') || '';
        const currentStyles = styleString.split(';').reduce((acc, stylePair) => {
          const parts = stylePair.split(':');
          if (parts.length === 2) {
            /* eslint-disable-next-line prefer-destructuring */
            acc[parts[0]] = parts[1];
          }
          return acc;
        }, {});

        const newStyles = { ...currentStyles, ...updateStyles };
        let newStylesString = '';
        if (typeof ShadyCSS === 'object' && !ShadyCSS.nativeShadow) {
          // No ShadowDOM => IE, Edge
          const newCssVariablesObj = {};
          Object.keys(newStyles).forEach(key => {
            if (key.indexOf('--') === -1) {
              newStylesString += `${key}:${newStyles[key]};`;
            } else {
              newCssVariablesObj[key] = newStyles[key];
            }
          });
          this.setAttribute('style', newStylesString);
          ShadyCSS.styleSubtree(this, newCssVariablesObj);
        } else {
          // has shadowdom => Chrome, Firefox, Safari
          Object.keys(newStyles).forEach(key => {
            newStylesString += `${key}: ${newStyles[key]};`;
          });
          this.setAttribute('style', newStylesString);
        }
      }
    },
);
