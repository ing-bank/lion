import { css, html, LitElement } from 'lit';
import { uuid } from '@lion/components/core.js';

/**
 * @typedef {Object} StoreEntry
 * @property {HTMLElement} el Dom Element
 * @property {string} uid Unique ID for the entry
 * @property {HTMLElement} button Button HTMLElement for the entry
 * @property {HTMLElement} panel Panel HTMLElement for the entry
 * @property {(event: Event) => unknown} clickHandler executed on click event
 * @property {(event: Event) => unknown} keydownHandler executed on keydown event
 * @property {(event: Event) => unknown} keyupHandler executed on keyup event
 */

/**
 * @param {StoreEntry} options
 */
function setupPanel({ el, uid }) {
  el.setAttribute('id', `panel-${uid}`);
  el.setAttribute('role', 'tabpanel');
  el.setAttribute('aria-labelledby', `button-${uid}`);
}

/**
 * @param {HTMLElement} el
 */
function selectPanel(el) {
  el.setAttribute('selected', 'true');
}

/**
 * @param {HTMLElement} el
 */
function deselectPanel(el) {
  el.removeAttribute('selected');
}

/**
 * @param {StoreEntry} options
 */
function setupButton({ el, uid, clickHandler, keydownHandler, keyupHandler }) {
  el.setAttribute('id', `button-${uid}`);
  el.setAttribute('role', 'tab');
  el.setAttribute('aria-controls', `panel-${uid}`);
  el.addEventListener('click', clickHandler);
  el.addEventListener('keyup', keyupHandler);
  el.addEventListener('keydown', keydownHandler);
}

/**
 * @param {StoreEntry} options
 */
function cleanButton({ el, clickHandler, keydownHandler, keyupHandler }) {
  el.removeAttribute('id');
  el.removeAttribute('role');
  el.removeAttribute('aria-controls');
  el.removeEventListener('click', clickHandler);
  el.removeEventListener('keyup', keyupHandler);
  el.removeEventListener('keydown', keydownHandler);
}

/**
 * @param {HTMLElement} el
 * @param {boolean} withFocus
 */
function selectButton(el, withFocus = false) {
  if (withFocus) {
    el.focus();
  }

  el.setAttribute('selected', 'true');
  el.setAttribute('aria-selected', 'true');
  el.setAttribute('tabindex', '0');
}

/**
 * @param {HTMLElement} el
 */
function deselectButton(el) {
  el.removeAttribute('selected');
  el.setAttribute('aria-selected', 'false');
  el.setAttribute('tabindex', '-1');
}

/**
 * @param {Event} ev
 */
function handleButtonKeydown(ev) {
  const _ev = /** @type {KeyboardEvent} */ (ev);
  switch (_ev.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'Home':
    case 'End':
      _ev.preventDefault();
    /* no default */
  }
}

export class LionTabs extends LitElement {
  static get properties() {
    return {
      selectedIndex: {
        type: Number,
        attribute: 'selected-index',
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        .tabs__tab-group {
          display: flex;
        }

        .tabs__tab-group ::slotted([slot='tab'][selected]) {
          font-weight: bold;
        }

        .tabs__panels ::slotted([slot='panel']) {
          visibility: hidden;
          display: none;
        }

        .tabs__panels ::slotted([slot='panel'][selected]) {
          visibility: visible;
          display: block;
        }

        .tabs__panels {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="tabs__tab-group" role="tablist">
        <slot name="tab"></slot>
      </div>
      <div class="tabs__panels">
        <slot name="panel"></slot>
      </div>
    `;
  }

  constructor() {
    super();
    /**
     * An index number of the selected tab
     */
    this.selectedIndex = 0;
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__setupSlots();
    if (this.tabs[0]?.disabled) {
      this.selectedIndex = this.tabs.findIndex(tab => !tab.disabled);
    }
  }

  get tabs() {
    return /** @type {HTMLButtonElement[]} */ (Array.from(this.children)).filter(
      child => child.slot === 'tab',
    );
  }

  get panels() {
    return /** @type {HTMLElement[]} */ (Array.from(this.children)).filter(
      child => child.slot === 'panel',
    );
  }

  /** @private */
  __setupSlots() {
    if (this.shadowRoot) {
      const tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
      const handleSlotChange = () => {
        this.__cleanStore();
        this.__setupStore();
        this.__updateSelected(false);
      };

      if (tabSlot) {
        tabSlot.addEventListener('slotchange', handleSlotChange);
      }
    }
  }

  /** @private */
  __setupStore() {
    /** @type {StoreEntry[]} */
    this.__store = [];
    if (this.tabs.length !== this.panels.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `The amount of tabs (${this.tabs.length}) doesn't match the amount of panels (${this.panels.length}).`,
      );
    }

    this.tabs.forEach((button, index) => {
      const uid = uuid();
      const panel = this.panels[index];

      /** @type {StoreEntry} */
      const entry = {
        uid,
        el: button,
        button,
        panel,
        clickHandler: this.__createButtonClickHandler(index),
        keydownHandler: handleButtonKeydown.bind(this),
        keyupHandler: this.__handleButtonKeyup.bind(this),
      };
      setupPanel({ ...entry, el: entry.panel });
      setupButton(entry);
      deselectPanel(entry.panel);
      deselectButton(entry.button);

      if (this.__store) {
        this.__store.push(entry);
      }
    });
  }

  /** @private */
  __cleanStore() {
    if (!this.__store) {
      return;
    }
    this.__store.forEach(entry => {
      cleanButton(entry);
    });
    this.__store = [];
  }

  /**
   * @param {HTMLButtonElement[]} tabs
   * @param {HTMLButtonElement} currentTab
   * @param {'right' | 'left'} dir
   * @returns {HTMLButtonElement|undefined}
   * @private
   */
  __getNextNotDisabledTab(tabs, currentTab, dir) {
    let orderedNotDisabledTabs = /** @type {HTMLButtonElement[]} */ ([]);
    const nextNotDisabledTabs = tabs.filter((tab, i) => !tab.disabled && i > this.selectedIndex);
    const prevNotDisabledTabs = tabs.filter((tab, i) => !tab.disabled && i < this.selectedIndex);
    if (dir === 'right') {
      orderedNotDisabledTabs = [...nextNotDisabledTabs, ...prevNotDisabledTabs];
    } else {
      orderedNotDisabledTabs = [...prevNotDisabledTabs.reverse(), ...nextNotDisabledTabs.reverse()];
    }
    return orderedNotDisabledTabs[0];
  }

  /**
   * @param {number} newIndex
   * @param {string} direction
   * @returns {number}
   * @private
   */
  __getNextAvailableIndex(newIndex, direction) {
    const currentTab = this.tabs[this.selectedIndex];
    if (this.tabs.every(tab => !tab.disabled)) {
      return newIndex;
    }
    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
      const nextNotDisabledTab = this.__getNextNotDisabledTab(this.tabs, currentTab, 'right');
      return this.tabs.findIndex(tab => nextNotDisabledTab === tab);
    }
    if (direction === 'ArrowLeft' || direction === 'ArrowUp') {
      const nextNotDisabledTab = this.__getNextNotDisabledTab(this.tabs, currentTab, 'left');
      return this.tabs.findIndex(tab => nextNotDisabledTab === tab);
    }
    if (direction === 'Home') {
      return this.tabs.findIndex(tab => !tab.disabled);
    }
    if (direction === 'End') {
      const notDisabledTabs = this.tabs
        .map((tab, i) => ({ disabled: tab.disabled, index: i }))
        .filter(tab => !tab.disabled);
      return notDisabledTabs[notDisabledTabs.length - 1].index;
    }
    return -1;
  }

  /**
   * @param {number} index
   * @returns {(event: Event) => unknown}
   * @private
   */
  __createButtonClickHandler(index) {
    return () => {
      this._setSelectedIndexWithFocus(index);
    };
  }

  /**
   * @param {Event} ev
   * @private
   */
  __handleButtonKeyup(ev) {
    const _ev = /** @type {KeyboardEvent} */ (ev);
    if (typeof this.selectedIndex === 'number') {
      switch (_ev.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (this.selectedIndex + 1 >= this._pairCount) {
            this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0, _ev.key));
          } else {
            this._setSelectedIndexWithFocus(
              this.__getNextAvailableIndex(this.selectedIndex + 1, _ev.key),
            );
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (this.selectedIndex <= 0) {
            this._setSelectedIndexWithFocus(
              this.__getNextAvailableIndex(this._pairCount - 1, _ev.key),
            );
          } else {
            this._setSelectedIndexWithFocus(
              this.__getNextAvailableIndex(this.selectedIndex - 1, _ev.key),
            );
          }
          break;
        case 'Home':
          this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0, _ev.key));
          break;
        case 'End':
          this._setSelectedIndexWithFocus(
            this.__getNextAvailableIndex(this._pairCount - 1, _ev.key),
          );
          break;
        /* no default */
      }
    }
  }

  /**
   * @param {number} value The new index
   */
  set selectedIndex(value) {
    const stale = this.__selectedIndex;
    this.__selectedIndex = value;
    this.__updateSelected(false);
    this.dispatchEvent(new Event('selected-changed'));
    this.requestUpdate('selectedIndex', stale);
  }

  /**
   * @param {number} value The new index for focus
   * @protected
   */
  _setSelectedIndexWithFocus(value) {
    if (value === -1) {
      return;
    }
    const stale = this.__selectedIndex;
    this.__selectedIndex = value;
    this.__updateSelected(true);
    this.dispatchEvent(new Event('selected-changed'));
    this.requestUpdate('selectedIndex', stale);
  }

  /**
   * @return {number}
   */
  get selectedIndex() {
    return this.__selectedIndex || 0;
  }

  /** @protected */
  get _pairCount() {
    return (this.__store && this.__store.length) || 0;
  }

  /** @private */
  __updateSelected(withFocus = false) {
    if (
      !(this.__store && typeof this.selectedIndex === 'number' && this.__store[this.selectedIndex])
    ) {
      return;
    }
    const previousButton = this.tabs.find(child => child.hasAttribute('selected'));
    const previousPanel = this.panels.find(child => child.hasAttribute('selected'));
    if (previousButton) {
      deselectButton(previousButton);
    }
    if (previousPanel) {
      deselectPanel(previousPanel);
    }
    const { button: currentButton, panel: currentPanel } = this.__store[this.selectedIndex];
    if (currentButton) {
      selectButton(currentButton, withFocus);
    }
    if (currentPanel) {
      selectPanel(currentPanel);
    }
  }
}
