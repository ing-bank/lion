import { LitElement, css, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ScopedStylesController } from '@lion/components/core.js';
import { regionMetaList } from '../../select-rich/src/regionMetaList.js';

export class HRegionCodeTable extends LitElement {
  static properties = {
    regionMeta: Object,
  };

  constructor() {
    super();
    /** @type {ScopedStylesController} */
    this.scopedStylesController = new ScopedStylesController(this);
  }

  /**
   * @param {CSSResult} scope
   */
  static scopedStyles(scope) {
    return css`
      /* Custom input range styling comes here, be aware that this won't work for polyfilled browsers */
      .${scope} .sr-only {
        position: absolute;
        top: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(100%);
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
        border: 0;
        margin: 0;
        padding: 0;
      }

      .${scope} table {
        position: relative;
        height: 300px;
      }

      .${scope} th {
        border-left: none;
        border-right: none;
        position: sticky;
        top: -1px;
      }

      .${scope} th .backdrop {
        background-color: white;
        opacity: 0.95;
        filter: blur(4px);
        position: absolute;
        inset: -5px;
      }

      .${scope} th .content {
        position: relative;
      }

      .${scope} td {
        border-left: none;
        border-right: none;
      }
    `;
  }

  // Render to light dom, so global table styling will be applied
  createRenderRoot() {
    return this;
  }

  render() {
    const finalRegionMetaList = this.regionMetaList || regionMetaList;
    return html`
      <table role="table">
        <caption class="sr-only">
          Region codes
        </caption>
        <thead>
          <tr>
            <th align="left">
              <span class="backdrop"></span><span class="content">country name</span>
            </th>
            <th align="right">
              <span class="backdrop"></span><span class="content">region code</span>
            </th>
            <th align="right">
              <span class="backdrop"></span><span class="content">country code</span>
            </th>
          </tr>
        </thead>
        <tbody>
          ${repeat(
            finalRegionMetaList,
            regionMeta => regionMeta.regionCode,
            ({ regionCode, countryCode, flagSymbol, nameForLocale }) =>
              html` <tr>
                <td align="left"><span aria-hidden="true">${flagSymbol}</span> ${nameForLocale}</td>
                <td align="right">${regionCode}</td>
                <td align="right">${countryCode}</td>
              </tr>`,
          )}
        </tbody>
      </table>
    `;
  }
}
customElements.define('h-region-code-table', HRegionCodeTable);
