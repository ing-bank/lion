import { css, html, LitElement } from '@lion/core';

/**
 * @typedef {Object} StoreEntry
 * @property {HTMLElement} el Dom Element
 * @property {string} uid Unique ID for the entry
 * @property {HTMLElement} button Button HTMLElement for the entry
 * @property {HTMLElement} panel Panel HTMLElement for the entry
 * @property {EventHandlerNonNull} clickHandler executed on click event
 * @property {EventHandlerNonNull} keydownHandler executed on keydown event
 * @property {EventHandlerNonNull} keyupHandler executed on keyup event
 */

function uuid() {
  return Math.random().toString(36).substr(2, 10);
}

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
      <div part="tablist" class="tabs__tab-group" role="tablist">
        <slot name="tab"></slot>
      </div>
      <div part="panels" class="tabs__panels">
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

  /** @param {import('lit-element').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__setupSlots();
  }

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

  __setupStore() {
    /** @type {StoreEntry[]} */
    this.__store = [];
    const buttons = /** @type {HTMLElement[]} */ (Array.from(this.children)).filter(
      child => child.slot === 'tab',
    );
    const panels = /** @type {HTMLElement[]} */ (Array.from(this.children)).filter(
      child => child.slot === 'panel',
    );
    if (buttons.length !== panels.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `The amount of tabs (${buttons.length}) doesn't match the amount of panels (${panels.length}).`,
      );
    }

    buttons.forEach((button, index) => {
      const uid = uuid();
      const panel = panels[index];

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
   * @param {number} index
   * @returns {EventHandlerNonNull}
   */
  __createButtonClickHandler(index) {
    return () => {
      this._setSelectedIndexWithFocus(index);
    };
  }

  /**
   * @param {Event} ev
   */
  __handleButtonKeyup(ev) {
    const _ev = /** @type {KeyboardEvent} */ (ev);
    if (typeof this.selectedIndex === 'number') {
      switch (_ev.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (this.selectedIndex + 1 >= this._pairCount) {
            this._setSelectedIndexWithFocus(0);
          } else {
            this._setSelectedIndexWithFocus(this.selectedIndex + 1);
          }
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          if (this.selectedIndex <= 0) {
            this._setSelectedIndexWithFocus(this._pairCount - 1);
          } else {
            this._setSelectedIndexWithFocus(this.selectedIndex - 1);
          }
          break;
        case 'Home':
          this._setSelectedIndexWithFocus(0);
          break;
        case 'End':
          this._setSelectedIndexWithFocus(this._pairCount - 1);
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
   */
  _setSelectedIndexWithFocus(value) {
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

  get _pairCount() {
    return (this.__store && this.__store.length) || 0;
  }

  __updateSelected(withFocus = false) {
    if (
      !(this.__store && typeof this.selectedIndex === 'number' && this.__store[this.selectedIndex])
    ) {
      return;
    }
    const previousButton = /** @type {HTMLElement} */ (Array.from(this.children).find(
      child => child.slot === 'tab' && child.hasAttribute('selected'),
    ));
    const previousPanel = /** @type {HTMLElement} */ (Array.from(this.children).find(
      child => child.slot === 'panel' && child.hasAttribute('selected'),
    ));
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
