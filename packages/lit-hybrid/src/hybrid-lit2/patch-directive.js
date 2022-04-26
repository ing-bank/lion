// import { isSingleExpression } from 'lit/directive-helpers.js';
import { html, render } from '../lit2-exports.js';
import { isLit1TemplateResult } from '../helpers/isLit1TemplateResult.js';
import { html2Hybrid } from './html2-hybrid-tag.js';

function getChildPartConstructor() {
  const container = document.createElement('div');
  render(html``, container);
  // @ts-ignore
  return container._$litPart$.constructor;
}

/**
 * @param {{ __$setValue: any; prototype: { _$setValue: (value: any, ...args: any[]) => void; }; }} childPartConstructor
 */
function patchChildPart(childPartConstructor) {
  const originalSetValue = childPartConstructor.prototype._$setValue;
  // eslint-disable-next-line no-param-reassign
  childPartConstructor.prototype._$setValue = function _$setValue(/** @type {unknown} */ value) {
    if (isLit1TemplateResult(value)) {
      // eslint-disable-next-line no-param-reassign
      value = html2Hybrid`${value}`;
    }
    // eslint-disable-next-line prefer-rest-params
    originalSetValue.call(this, value, ...Array.from(arguments).slice(1));
  };
}

const childPartConstructor = getChildPartConstructor();
patchChildPart(childPartConstructor);

// const originalSetValue = AsyncDirective.prototype.setValue;
// /**
//  * @param {unknown} value The value to set
//  */
// AsyncDirective.prototype.setValue = function setValue(value) {
//   if (isLit1TemplateResult(value)) {
//     // eslint-disable-next-line no-param-reassign
//     value = html2Hybrid`${value}`;
//   }
//   originalSetValue.call(this, value);
// };

// const originalCommitValue = AsyncAppendDirective.prototype.commitValue;
// /**
//  * @param {unknown} value The value to set
//  */
// AsyncAppendDirective.prototype.commitValue = function commitValue(value) {
//   if (isLit1TemplateResult(value)) {
//     // eslint-disable-next-line no-param-reassign
//     value = html2Hybrid`${value}`;
//   }
//   originalCommitValue.call(this, value);
// };
