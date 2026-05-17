// @ts-nocheck
/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit';
import { LionMenuHybrid } from '@lion/ui/menu.js';
import { ScopedElementsMixin } from '../../core/src/ScopedElementsMixin.js';
import { IngMenuBarMoreButtonMixin } from './IngMenuBarMoreButtonMixin.js';

/**
 * @typedef {import('./types.js').NavBarResponsiveMode} NavBarResponsiveMode
 * @typedef {import('./types.js').MenuItem} MenuItem
 * @typedef {import('./types.js').CtaLink} CtaLink
 * @typedef {import('./types.js').Logo} Logo
 * @typedef {import('./types.js').LevelConfig} LevelConfig
 */

export class LionNavigationBar extends IngMenuBarMoreButtonMixin(ScopedElementsMixin(LitElement)) {
  static get properties() {
    return {
      responsiveMode: { type: String, reflect: true, attribute: 'responsive-mode' },
      // logo: { type: String },
      menuItems: { type: Array },
      menuSupportItems: { type: Array },
      ctaPrimary: { type: Object },
      ctaSecondary: { type: Object },
      suggestions: { type: Array },
      showOnMobile: { type: Array, attribute: 'show-on-mobile', reflect: true },

      _levelCfg: { state: true },
    };
  }

  static get scopedElements() {
    return {
      // 'lion-menu-overlay': LionMenuOverlay,
      'lion-menu-hybrid': LionMenuHybrid,
    };
  }

  static get styles() {
    return [
      css`
        /** specific styles */

        :host([responsive-mode='desktop']) [data-has-full-width-flyout] > [slot='list'] {
          /** make sure that we give the right styles */
          position: relative;
        }

        .more-button-menu {
          display: none;
        }

        .more-button-wrapper {
          display: none;
        }

        :host([responsive-mode='desktop'])
          [data-has-full-width-flyout]
          > [slot='list']
          [level='2']
          > [slot='list'] {
          position: absolute;
          width: 100%;
          left: 0;
          right: 0;
          min-height: 300px;
          padding: 1em;
          background-color: white;
          border: 1px solid gray;
          box-sizing: border-box;
        }

        :host([responsive-mode='desktop']) [level='3'] > [slot='list'] {
          position: absolute;
          left: 33.333%;
          width: 33.333%;
          top: 0;
          padding: 1em;
          background-color: white;
          box-sizing: border-box;
          height: 100%;
        }

        :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > [role='listitem'] > button,
        :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > [role='listitem'] > a,
        :host([responsive-mode='desktop'])
          [level='1']
          > [slot='list']
          > .more-button-wrapper
          > [role='listitem']
          > button,
        :host([responsive-mode='desktop'])
          [level='1']
          > [slot='list']
          > .more-button-wrapper
          > [role='listitem']
          > a {
          white-space: nowrap;
        }

        /**
        * TODO listitem rigth margin/gap is not taken at the account ATM
        */

        /** TODO get rid of it, come up with a robust solution
         * Use it here only for max-width for now
         */
        .navigation-bar__container {
          border: 1px solid;
        }

        /**
         * More button relies on the fact that the menu items do not break the line
         * TODO is it optimal?
         */
        :host([responsive-mode='desktop']) > [role='list'] > [role='listitem'] > button,
        :host([responsive-mode='desktop']) > [role='list'] > [role='listitem'] > a {
          white-space: nowrap;
        }

        /**
        * TODO remove it. Use it now for testing More button feature
        */
        :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > [role='listitem'],
        :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > .more-button-wrapper {
          margin-right: 180px;
        }

        :host([responsive-mode='mobile']) nav {
          border: 1px solid black;
          display: block;
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          min-width: 500px;
        }

        :host([responsive-mode='mobile']) [level][opened] > [slot='list'] {
          left: 0;
          width: 100%;
          top: 0;
          box-sizing: border-box;
        }

        :host([responsive-mode='mobile']) [slot='list'] {
          position: relative;
          padding: 1em;
          background-color: white;
        }

        :host([responsive-mode='mobile']) [level='2'] > [slot='list'],
        :host([responsive-mode='mobile']) [level='3'] > [slot='list'] {
          position: absolute;
          left: 100%;
          top: 0;
          box-sizing: border-box;
          padding-bottom: 200%;
        }

        :host([responsive-mode='mobile']) nav {
          display: flex;
          flex-direction: column;
          /* height: 100%;
          justify-content: space-between; */
        }

        /* :host([responsive-mode='mobile']) .cta-items {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 1em;
          background-color: white;
          box-sizing: border-box;
        } */

        :host([responsive-mode='mobile']) .logo-and-close {
          padding: 1em;
        }
      `,
    ];
  }

  constructor() {
    super();

    /** @type {Logo} */
    this.logo = { type: 'ing', alt: 'ING homepage', href: '/' };
    /** @type {MenuItem[]} */
    this.menuSupportItems = [];
    // /**
    //  * @type {string[]}
    //  * @description Choose which items to show on mobile when in default mode, maximum of two. Possible values: 'search', 'ctaPrimary', 'ctaSecondary', 'avatarMenu'
    //  */
    // this.showOnMobile = [];
    /**
     * @type {CtaLink}
     */
    // @ts-ignore
    this.ctaPrimary = {};
    /**
     * @type {CtaLink}
     */
    // @ts-ignore
    this.ctaSecondary = {};
    /** @type {MenuItem[]} */
    this.menuItems = [];
    // /** @type {Boolean} */
    // this.searchDisabled = false;
    this.breakpointMin = 1068; // force desktop
    /** @type {string[]} */
    this.suggestions = [];

    this.prefilledSuggestion = '';

    const mql = window.matchMedia(`(width <= ${this.breakpointMin}px)`);
    /** @type {NavBarResponsiveMode} */
    this.responsiveMode = mql.matches ? 'mobile' : 'desktop';
    this._levelCfg = this._getLevelCfg(this.responsiveMode);
    this._levelSecondaryCfg = this._getSecondaryLevelCfg(this.responsiveMode);

    mql.addEventListener('change', () => {
      this.responsiveMode = mql.matches ? 'mobile' : 'desktop';
      this._levelCfg = this._getLevelCfg(this.responsiveMode);
      this._levelSecondaryCfg = this._getSecondaryLevelCfg(this.responsiveMode);
    });

    this.#storeLatestFocusedElementId();
  }

  /**
   * @param {NavBarResponsiveMode} responsiveMode
   */
  _getLevelCfg(responsiveMode) {
    // N.B. we're fighting some of the overlay configs provided by LionMenuOverlay here,
    // the idea is to take over all of that when depending on LionMenu, after removing LonMenuOverlay and LionMenuHybrid components altogether.

    if (responsiveMode === 'mobile') {
      return {
        l1: {
          isBar: false,
          openableConfig: {
            // We want to do the absolute positioning ourselves, popper is not suited for this...
            placementMode: 'custom',
            isOpenable: false,
            hidesOnOutsideClick: false,
            inheritsReferenceWidth: 'none',
          },
        },
        l2: {
          openableConfig: {
            // We want disclosure behavior
            placementMode: 'custom',
            hidesOnOutsideClick: false,
            inheritsReferenceWidth: 'none',
          },
        },
        l3: {
          openableConfig: {
            // We want disclosure behavior
            placementMode: 'custom',
            hidesOnOutsideClick: false,
            inheritsReferenceWidth: 'none',
          },
        },
      };
    }

    return {
      l1: {
        isBar: true,
        hasFullWidthFlyout: true,
        openableConfig: {
          // We want disclosure behavior
          placementMode: 'custom',
          // N.B. we don't have an invoker...
          isOpenable: false,
          inheritsReferenceWidth: 'none',
          focusContentOnOpen: true,
        },
      },
      l2: {
        openableConfig: {
          // We want disclosure behavior
          placementMode: 'custom',
          hidesOnOutsideClick: true,
          hidesOnEscape: true,
          inheritsReferenceWidth: 'none',
          focusContentOnOpen: true,
        },
      },
      l3: {
        openableConfig: {
          // We want disclosure behavior
          placementMode: 'custom',
          inheritsReferenceWidth: 'none',
          focusContentOnOpen: true,
          // TODO: implement in OverlayController
          hideVisually: true,
        },
      },
    };
  }

  _getSecondaryLevelCfg(responsiveMode) {
    if (responsiveMode === 'mobile') {
      return {
        l1: {
          isBar: true,
        },
        l2: {
          isBar: false,
        },
      };
    }

    return {
      l1: {
        isBar: true,
      },
      l2: {
        isBar: false,
      },
    };
  }

  /** @type {string | null} */
  #latestFocusedElementId = null;

  #storeLatestFocusedElementId() {
    this.addEventListener('focusin', ({ target }) => {
      // @ts-ignore
      this.#latestFocusedElementId = target.id;
    });
  }

  #syncLatestFocusedElementForNewResponsiveMode() {
    // We might show/hide or rerender some elements (with same ids) in different positions in the DOM.
    // As these are physically different elements, we must move focus (as otherwise it would be reset to body)
    if (!this.#latestFocusedElementId) return;
    const newFocusedElement = this.shadowRoot?.querySelector(`#${this.#latestFocusedElementId}`);
    if (newFocusedElement instanceof HTMLElement) {
      newFocusedElement.focus();
    }
  }

  /**
   * @param {import("./types.js").MenuItem}
   * @param {number} level
   */
  _getId(menuItem, level) {
    if (menuItem.id) return menuItem.id;
    const title = menuItem.title || menuItem.label || 'item';
    return `${
      Number.isInteger(level) ? `l${level}-${title}` : title
    }-${Math.random().toString(16).slice(2)}`;
  }

  /**
   * @param {import('lit').PropertyValues} changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('menuItems')) {
      /**
       * @override IngMenuBarMoreButtonMixin
       */
      this.allFirstLevelItems = this.menuItems;
    }
    if (changedProperties.has('responsiveMode')) {
      this._levelCfg = this._getLevelCfg(this.responsiveMode);
      this.#syncLatestFocusedElementForNewResponsiveMode();
    }
  }

  render() {
    return html`
      <nav>
        <div class="nav-header">
          <div class="logo-and-close">
            <a href="${this.logo.href || '#'}">
              <img src="${this.logo.src || ''}" alt="${this.logo.alt || ''}" />
            </a>
            ${this.responsiveMode === 'mobile'
              ? html`<button data-close data-level="1">✖️</button>`
              : ''}
          </div>
          ${this._searchTemplate()}
        </div>
        <div class="nav-body">
          ${this._menulevelTemplate(this.menuSupportItems, 1, '')}
          ${this.responsiveMode === 'desktop'
            ? this._ctasTemplate(this.ctaPrimary, this.ctaSecondary)
            : ''}
          ${this._menulevelTemplate(this.menuItems, 1, '', true)}
        </div>
        ${this.responsiveMode === 'mobile'
          ? html`<div class="nav-footer">
              ${this._ctasTemplate(this.ctaPrimary, this.ctaSecondary)}
            </div>`
          : ''}
      </nav>
    `;
  }

  /**
   * @param {string[]} suggestions
   * @returns {import('lit').TemplateResult}
   */
  _searchTemplate(suggestions = this.suggestions, prefilledSuggestion = this.prefilledSuggestion) {
    return html` <form role="search">
      <input
        type="search"
        list="search-list"
        placeholder="What are you looking for?"
        .value="${prefilledSuggestion}"
      />
      <datalist id="search-list">
        ${suggestions.map(suggestion => html`<option value="${suggestion}"></option>`)}
      </datalist>
      <input type="submit" value="Search" />
    </form>`;
  }

  /**
   * @param {CtaLink} ctaPrimary
   * @param {CtaLink} ctaSecondary
   * @returns {import('lit').TemplateResult}
   */
  _ctasTemplate(ctaPrimary, ctaSecondary) {
    return html`<div class="cta-items">
      ${ctaSecondary?.href
        ? html`<div class="cta-secondary">
            <a id="${this._getId(ctaSecondary)}" href="${ctaSecondary.href}"
              >${ctaSecondary.label}
            </a>
          </div>`
        : ''}
      ${ctaPrimary?.href
        ? html`<div class="cta-primary">
            <a id="${this._getId(ctaPrimary)}" href="${ctaPrimary.href}"> ${ctaPrimary.label}</a>
          </div>`
        : ''}
    </div>`;
  }

  _listItemsTemplate(items, level) {
    // @ts-ignore
    const cfgForNextLevel = this._levelCfg[`l${level + 1}`];

    const getId = (/** @type {import("./types.js").MenuItem} */ menuItem) =>
      menuItem.id || `l${level}-${menuItem.title}`;

    return items.map(
      menuItem => html`
        <div role="listitem">
          ${menuItem.sub
            ? html` <button id="${getId(menuItem)}" data-invoker>${menuItem.title}</button>
                ${menuItem.sub
                  ? this._menulevelTemplate(
                      menuItem.sub,
                      level + 1,
                      cfgForNextLevel,
                      menuItem.title,
                    )
                  : ''}`
            : html` <a id="${getId(menuItem)}" href="${menuItem.link || ''}">${menuItem.title}</a>`}
        </div>
      `,
    );
  }

  _renderMoreButton(level, cfgForLevel) {
    return level === 1 && cfgForLevel.hasFullWidthFlyout
      ? this._renderMoreButtonWrapper(
          this.hiddenFirstLevelItems?.length > 0
            ? this._listItemsTemplate(this.hiddenFirstLevelItems, level)
            : '',
        )
      : '';
  }

  /**
   * @param {MenuItem[]} menuItemsForLevel
   * @param {number} level
   * @returns {import('lit').TemplateResult}
   */
  _menulevelTemplate(menuItemsForLevel, level, prevText = '', supportMoreButton = false) {
    // @ts-ignore
    const cfgForLevel = this._levelCfg[`l${level}`];

    const menuItemsToRender =
      level === 1 &&
      this.responsiveMode === 'desktop' &&
      supportMoreButton &&
      this.hiddenFirstLevelItems?.length > 0
        ? this.visibleFirstLevelItems
        : menuItemsForLevel;

    return html`<lion-menu-hybrid
      .config="${cfgForLevel.openableConfig || {}}"
      .bar="${cfgForLevel.isBar}"
      ?data-has-full-width-flyout="${cfgForLevel.hasFullWidthFlyout}"
      ._activeMode="${'tabbable-disclosure'}"
    >
      ${level > 1 && this.responsiveMode === 'mobile'
        ? html` <div role="listitem">
            <button data-close data-level="${level}">&lt; ${prevText}</button>
          </div>`
        : ''}
      ${this._listItemsTemplate(menuItemsToRender, level)}
      ${supportMoreButton ? this._renderMoreButton(level, cfgForLevel) : ''}
    </lion-menu-hybrid>`;
  }
}
