/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html, css } from '@lion/core';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

/**
 * `LionRating` is a class for custom Rating element (`<lion-rating>` web component).
 *
 * @customElement lion-rating
 */
export class LionRating extends LitElement {
  static get styles() {
    return [css``];
  }

  render() {
    return html`<p>rating</p>`;
  }
}
