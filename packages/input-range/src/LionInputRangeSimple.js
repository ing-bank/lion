/* eslint-disable import/no-extraneous-dependencies */
import { css, html, ScopedStylesController } from '@lion/core';
import { formatNumber } from '@lion/localize';
import { LionInputRange } from './LionInputRange';

/**
 * @typedef {import('@lion/core').CSSResult} CSSResult
 */

/**
 * LionInputRange: extension of lion-input.
 *
 * @customElement `lion-input-range`
 */
export class LionInputRangeSimple extends LionInputRange {
  /** @protected */
  _inputGroupTemplate() {
    return html`
      <div class="input-group">
        ${this._inputGroupBeforeTemplate()}
        <div class="input-group__container">
          ${this._inputGroupPrefixTemplate()} ${this._inputGroupInputTemplate()}
          ${this._inputGroupSuffixTemplate()}
        </div>
        ${this._inputGroupAfterTemplate()}
      </div>
    `;
  }
}
