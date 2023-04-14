/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, html, css } from 'lit';
import { LocalizeMixin } from '@lion/ui/localize-no-side-effects.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

/**
 * `LionPagination` is a class for custom Pagination element (`<lion-pagination>` web component).
 *
 * @customElement lion-pagination
 */
export class LionPagination extends LocalizeMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          cursor: default;
        }

        ul {
          list-style: none;
          padding: 0;
          text-align: center;
        }

        li {
          display: inline-block;
        }

        button[aria-current='true'] {
          font-weight: bold;
        }
      `,
    ];
  }

  static get localizeNamespaces() {
    return [
      {
        'lion-pagination': /** @param {string} locale */ locale => {
          switch (locale) {
            case 'bg-BG':
              return import('@lion/ui/pagination-translations/bg.js');
            case 'cs-CZ':
              return import('@lion/ui/pagination-translations/cs.js');
            case 'de-AT':
            case 'de-DE':
              return import('@lion/ui/pagination-translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-PH':
            case 'en-US':
              return import('@lion/ui/pagination-translations/en.js');
            case 'es-ES':
              return import('@lion/ui/pagination-translations/es.js');
            case 'fr-FR':
            case 'fr-BE':
              return import('@lion/ui/pagination-translations/fr.js');
            case 'hu-HU':
              return import('@lion/ui/pagination-translations/hu.js');
            case 'it-IT':
              return import('@lion/ui/pagination-translations/it.js');
            case 'nl-BE':
            case 'nl-NL':
              return import('@lion/ui/pagination-translations/nl.js');
            case 'pl-PL':
              return import('@lion/ui/pagination-translations/pl.js');
            case 'ro-RO':
              return import('@lion/ui/pagination-translations/ro.js');
            case 'ru-RU':
              return import('@lion/ui/pagination-translations/ru.js');
            case 'sk-SK':
              return import('@lion/ui/pagination-translations/sk.js');
            case 'uk-UA':
              return import('@lion/ui/pagination-translations/uk.js');
            case 'zh-CN':
              return import('@lion/ui/pagination-translations/zh.js');
            default:
              return import('@lion/ui/pagination-translations/en.js');
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

  static get properties() {
    return {
      current: {
        type: Number,
        reflect: true,
      },
      count: {
        type: Number,
        reflect: true,
      },
    };
  }

  /** @param {number} value */
  set current(value) {
    if (value !== this.current) {
      const oldValue = this.current;
      this.__current = value;
      this.dispatchEvent(new Event('current-changed'));
      this.requestUpdate('current', oldValue);
    }
  }

  /** @returns {number} */
  get current() {
    return this.__current || 0;
  }

  constructor() {
    super();
    /** @private */
    this.__visiblePages = 5;
    this.current = 1;
    this.count = 0;
  }

  /**
   * Go next in pagination
   * @public
   */
  next() {
    if (this.current < this.count) {
      this.__fire(this.current + 1);
    }
  }

  /**
   * Go to first page
   * @public
   */
  first() {
    if (this.count >= 1) {
      this.__fire(1);
    }
  }

  /**
   * Go to the last page
   * @public
   */
  last() {
    if (this.count >= 1) {
      this.__fire(this.count);
    }
  }

  /**
   * Go to the specific page
   * @param {number} pageNumber
   * @public
   */
  goto(pageNumber) {
    if (pageNumber >= 1 && pageNumber <= this.count) {
      this.__fire(pageNumber);
    }
  }

  /**
   * Go back in pagination
   * @public
   */
  previous() {
    if (this.current !== 1) {
      this.__fire(this.current - 1);
    }
  }

  /**
   * Set desired page in the pagination and fire the current changed event.
   * @param {Number} page page number to be set
   * @private
   */
  __fire(page) {
    if (page !== this.current) {
      this.current = page;
    }
  }

  /**
   * Calculate nav list based on current page selection.
   * @returns {(number|'...')[]}
   * @private
   */
  __calculateNavList() {
    const start = 1;
    const finish = this.count;
    // If there are more pages then we want to display we have to redo the list each time
    // Else we can just return the same list every time.
    if (this.count > this.__visiblePages) {
      // Calculate left side of current page and right side
      const pos3 = this.current - 1;
      const pos4 = this.current;
      const pos5 = this.current + 1;
      //  if pos 3 is lower than 4 we have a predefined list of elements
      if (pos4 <= 4) {
        const list = /** @type {(number|'...')[]} */ (
          [...Array(this.__visiblePages)].map((_, idx) => start + idx)
        );
        list.push('...');
        list.push(this.count);
        return list;
      }
      //  if we are close to the end of the list with the current page then we have again a predefined list
      if (finish - pos4 <= 3) {
        const list = /** @type {(number|'...')[]} */ ([]);
        list.push(1);
        list.push('...');
        const listRemaining = [...Array(this.__visiblePages)].map(
          (_, idx) => this.count - this.__visiblePages + 1 + idx,
        );
        return list.concat(listRemaining);
      }

      return [start, '...', pos3, pos4, pos5, '...', finish];
    }
    return [...Array(finish - start + 1)].map((_, idx) => start + idx);
  }

  /**
   * Get previous or next button template.
   * This method can be overridden to apply customized template in wrapper.
   * @param {String} label namespace label i.e. next or previous
   * @returns {TemplateResult} icon template
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _prevNextIconTemplate(label) {
    return label === 'next' ? html` &gt; ` : html` &lt; `;
  }

  /**
   * Get next or previous button template.
   * This method can be overridden to apply customized template in wrapper.
   * @param {String} label namespace label i.e. next or previous
   * @param {Number} pageNumber page number to be set
   * @param {String} namespace namespace prefix for translations
   * @returns {TemplateResult} nav item template
   * @protected
   */
  _prevNextButtonTemplate(label, pageNumber, namespace = 'lion') {
    return html`
      <li>
        <button
          aria-label=${this.msgLit(`${namespace}-pagination:${label}`)}
          @click=${() => this.__fire(pageNumber)}
        >
          ${this._prevNextIconTemplate(label)}
        </button>
      </li>
    `;
  }

  /**
   * Get disabled button template.
   * This method can be overridden to apply customized template in wrapper.
   * @param {String} label namespace label i.e. next or previous
   * @returns {TemplateResult} nav item template
   * @protected
   */
  _disabledButtonTemplate(label) {
    return html`
      <li>
        <button disabled>${this._prevNextIconTemplate(label)}</button>
      </li>
    `;
  }

  /**
   * Render navigation list
   * @returns {TemplateResult[]} nav list template
   * @protected
   */
  _renderNavList() {
    return this.__calculateNavList().map(page =>
      page === '...'
        ? html` <li><span>${page}</span></li> `
        : html`
            <li>
              <button
                aria-label="${this.msgLit('lion-pagination:page', { page })}"
                aria-current=${page === this.current}
                @click=${() => this.__fire(page)}
              >
                ${page}
              </button>
            </li>
          `,
    );
  }

  render() {
    return html`
      <nav role="navigation" aria-label="${this.msgLit('lion-pagination:label')}">
        <ul>
          ${this.current > 1
            ? this._prevNextButtonTemplate('previous', this.current - 1)
            : this._disabledButtonTemplate('previous')}
          ${this._renderNavList()}
          ${this.current < this.count
            ? this._prevNextButtonTemplate('next', this.current + 1)
            : this._disabledButtonTemplate('next')}
        </ul>
      </nav>
    `;
  }
}
