import { css, html, LitElement } from '@lion/core';

/**
 * @typedef {Object} StoreEntry
 * @property {Element} el Dom Element
 * @property {string} [uid] Unique ID for the entry
 * @property {Element} [button] Unique ID for the entry
 * @property {Element} [panel] Unique ID for the entry
 * @property {eventHandler} clickHandler
 * @property {eventHandler} keydownHandler
 * @property {eventHandler} keyupHandler
 */

function uuid() {
  return Math.random().toString(36).substr(2, 10);
}

/**
 * @param {object} options
 * @param {Element} options.el
 * @param {string} options.uid
 */
function setupPanel({ el, uid }) {
  el.setAttribute('id', `panel-${uid}`);
  el.setAttribute('role', 'tabpanel');
  el.setAttribute('aria-labelledby', `button-${uid}`);
}

/**
 * @param {Element} el
 */
function selectPanel(el) {
  el.setAttribute('selected', true);
}

/**
 * @param {Element} el
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
 * @param {Element} el
 * @param {boolean} withFocus
 */
function selectButton(el, withFocus = false) {
  if (withFocus) {
    el.focus();
  }

  el.setAttribute('selected', true);
  el.setAttribute('aria-selected', true);
  el.setAttribute('tabindex', 0);
}

/**
 * @param {Element} el
 */
function deselectButton(el) {
  el.removeAttribute('selected');
  el.setAttribute('aria-selected', false);
  el.setAttribute('tabindex', -1);
}

/**
 * @param {KeyboardEvent} ev
 */
function handleButtonKeydown(ev) {
  switch (ev.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'Home':
    case 'End':
      ev.preventDefault();
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

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this.__setupSlots();
  }

  __setupSlots() {
    const tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    const handleSlotChange = () => {
      this.__cleanStore();
      this.__setupStore();
      this.__updateSelected(false);
    };
    tabSlot.addEventListener('slotchange', handleSlotChange);
  }

  __setupStore() {
    /** @type {StoreEntry[]} */
    this.__store = [];
    const buttons = this.querySelectorAll('[slot="tab"]');
    const panels = this.querySelectorAll('[slot="panel"]');
    if (buttons.length !== panels.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `The amount of tabs (${buttons.length}) doesn't match the amount of panels (${panels.length}).`,
      );
    }

    buttons.forEach((button, index) => {
      const uid = uuid();
      const panel = panels[index];
      const entry = {
        uid,
        button,
        panel,
        clickHandler: this.__createButtonClickHandler(index),
        keydownHandler: handleButtonKeydown.bind(this),
        keyupHandler: this.__handleButtonKeyup.bind(this),
      };
      setupPanel({ el: entry.panel, ...entry });
      setupButton({ el: entry.button, ...entry });
      deselectPanel(entry.panel);
      deselectButton(entry.button);
      this.__store.push(entry);
    });
  }

  __cleanStore() {
    if (!this.__store) {
      return;
    }
    this.__store.forEach(entry => {
      cleanButton({ el: entry.button, ...entry });
    });
  }

  /**
   * @param {number} index
   */
  __createButtonClickHandler(index) {
    return () => {
      this._setSelectedIndexWithFocus(index);
    };
  }

  /**
   * @param {KeyboardEvent} ev
   */
  __handleButtonKeyup(ev) {
    if (typeof this.selectedIndex === 'number') {
      switch (ev.key) {
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
   * @param {number | undefined} value The new index
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
   * @return {number | undefined}
   */
  get selectedIndex() {
    return this.__selectedIndex;
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
    const previousButton = Array.from(this.children).find(
      child => child.slot === 'tab' && child.hasAttribute('selected'),
    );
    const previousPanel = Array.from(this.children).find(
      child => child.slot === 'panel' && child.hasAttribute('selected'),
    );
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
