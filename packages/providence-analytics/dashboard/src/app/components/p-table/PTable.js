// eslint-disable-next-line max-classes-per-file
import { LitElement, html, css } from 'lit-element';
import { DecorateMixin } from '../../utils/DecorateMixin.js';

export class PTable extends DecorateMixin(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      mobile: {
        reflect: true,
        type: Boolean,
      },
      data: Object,
      // Sorted, sliced data, based on user interaction
      _viewData: Object,
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        /**
         * Structural css
         */

        [role='row'] {
          display: flex;
        }

        [role='cell'],
        [role='columnheader'] {
          flex: 1;
        }

        [role='columnheader'] {
          font-weight: bold;
        }

        .c-table__cell__header {
          display: none;
        }

        .c-table__head {
          background-color: var(--header-bg-color);
          color: var(--header-color);
        }

        .c-table[mobile] .c-table__head {
          display: none;
        }

        .c-table[mobile] .c-table__row {
          flex-direction: column;
        }

        .c-table[mobile] .c-table__cell {
          display: flex;
        }

        .c-table[mobile] .c-table__cell__header,
        .c-table[mobile] .c-table__cell__text {
          flex: 1;
        }

        .c-table[mobile] .c-table__cell__header {
          display: block;
          background-color: var(--header-bg-color);
          color: var(--header-color);
        }
      `,
    ];
  }

  // eslint-disable-next-line class-methods-use-this
  _descTemplate() {
    return html` <span aria-label="descending">&#x25BC;</span> `;
  }

  // eslint-disable-next-line class-methods-use-this
  _ascTemplate() {
    return html` <span aria-label="ascending">&#x25B2;</span> `;
  }

  _mainTemplate(headers, sortMap, data, m) {
    if (!(headers && sortMap && data)) {
      return html``;
    }
    return html`
      <div role="table" class="c-table" ?mobile=${m}>
        <div role="rowgroup" class="c-table__head">
          <div role="row" class="c-table__row c-table__columnheader-wrapper">
            ${headers.map(
              header => html`
                <div role="columnheader" class="c-table__columnheader">
                  <button @click="${() => this._sortBy(header)}" class="c-table__sort-button">
                    ${header}
                    <span class="c-table__sort-indicator">
                      ${sortMap[header] === 'desc' ? this._descTemplate() : this._ascTemplate()}
                    </span>
                  </button>
                </div>
              `,
            )}
          </div>
        </div>

        <div role="rowgroup" class="c-table__body">
          ${data.map(
            row => html`
              <div role="${m ? 'presentation' : 'row'}" class="c-table__row">
                ${headers.map(
                  header => html`
                    <div role="${m ? 'row' : 'cell'}" class="c-table__cell">
                      <span
                        id="item1"
                        role="${m ? 'rowheader' : 'presentation'}"
                        class="c-table__cell__header"
                      >
                        ${header}
                      </span>
                      <span role="${m ? 'cell' : 'presentation'}" class="c-table__cell__text">
                        ${this.renderCellContent(row[header], header)}
                      </span>
                    </div>
                  `,
                )}
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  render() {
    return this._mainTemplate(
      this._viewDataHeaders,
      this.__viewDataSortMap,
      this._viewData,
      this.mobile,
    );
  }

  constructor() {
    super();
    this.__viewDataSortMap = {};
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    const mql = window.matchMedia('(max-width: 767px)');
    this.mobile = mql.matches;
    mql.addListener(({ matches }) => {
      this.mobile = matches;
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('data')) {
      this.__computeViewData(this.data);
    }
  }

  /**
   * @overridable
   * @param {string} content
   * @param {string} header
   */
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  renderCellContent(content, header) {
    return content;
  }

  __computeViewData(newData) {
    this._viewData = [...newData];
    this._viewDataHeaders = Object.keys(newData[0]);
  }

  _sortBy(specifier) {
    this.__setSortMapValue(specifier);

    const comparison = (a, b) => {
      if (this.__viewDataSortMap[specifier] === 'desc') {
        return b[specifier] > a[specifier];
      }
      return b[specifier] < a[specifier];
    };

    this._viewData.sort((a, b) => {
      if (comparison(a, b)) {
        return 1;
      }
      if (b[specifier] === a[specifier]) {
        return 0;
      }
      return -1;
    });
    this.__computeViewData(this._viewData);
  }

  __setSortMapValue(specifier) {
    // initialize to desc first time
    if (!this.__viewDataSortMap[specifier]) {
      this.__viewDataSortMap[specifier] = 'desc';
    } else {
      const cur = this.__viewDataSortMap[specifier];
      // Toggle asc / desc
      this.__viewDataSortMap[specifier] = cur === 'desc' ? 'asc' : 'desc';
    }
  }
}
