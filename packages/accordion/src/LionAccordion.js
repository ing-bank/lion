import { LitElement, css, html } from '@lion/core';

/**
 * @typedef {Object} StoreEntry
 * @property {string} uid Unique ID for the entry
 * @property {number} index index of the node
 * @property {HTMLElement} invoker invoker node
 * @property {HTMLElement} content content node
 * @property {EventHandlerNonNull} clickHandler executed on click event
 * @property {EventHandlerNonNull} keydownHandler executed on keydown event
 */

const uuid = () => Math.random().toString(36).substr(2, 10);

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.element
 * @param {string} opts.uid
 * @param {number} opts.index
 */
const setupContent = ({ element, uid, index }) => {
  element.style.setProperty('order', `${index + 1}`);
  element.setAttribute('id', `content-${uid}`);
  element.setAttribute('aria-labelledby', `invoker-${uid}`);
};

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.element
 * @param {string} opts.uid
 * @param {number} opts.index
 * @param {EventHandlerNonNull} opts.clickHandler
 * @param {EventHandlerNonNull} opts.keydownHandler
 */
const setupInvoker = ({ element, uid, index, clickHandler, keydownHandler }) => {
  element.style.setProperty('order', `${index + 1}`);
  const firstChild = element.firstElementChild;
  if (firstChild) {
    firstChild.setAttribute('id', `invoker-${uid}`);
    firstChild.setAttribute('aria-controls', `content-${uid}`);
    firstChild.addEventListener('click', clickHandler);
    firstChild.addEventListener('keydown', keydownHandler);
  }
};

/**
 * @param {HTMLElement} element
 * @param {EventHandlerNonNull} clickHandler
 * @param {EventHandlerNonNull} keydownHandler
 */
const cleanInvoker = (element, clickHandler, keydownHandler) => {
  const firstChild = element.firstElementChild;
  if (firstChild) {
    firstChild.removeAttribute('id');
    firstChild.removeAttribute('aria-controls');
    firstChild.removeEventListener('click', clickHandler);
    firstChild.removeEventListener('keydown', keydownHandler);
  }
};

/**
 * @param {HTMLElement} element
 */
const focusInvoker = element => {
  const firstChild = /** @type {HTMLElement|null} */ (element.firstElementChild);
  if (firstChild) {
    firstChild.focus();
    firstChild.setAttribute('focused', `${true}`);
  }
};

/**
 * @param {HTMLElement} element
 */
const unfocusInvoker = element => {
  const firstChild = element.firstElementChild;
  if (firstChild) {
    firstChild.removeAttribute('focused');
  }
};

/**
 * @param {HTMLElement} element
 */
const expandInvoker = element => {
  element.setAttribute('expanded', `${true}`);
  const firstChild = element.firstElementChild;
  if (firstChild) {
    firstChild.setAttribute('expanded', `${true}`);
    firstChild.setAttribute('aria-expanded', `${true}`);
  }
};

/**
 * @param {HTMLElement} element
 */
const collapseInvoker = element => {
  element.removeAttribute('expanded');
  const firstChild = element.firstElementChild;
  if (firstChild) {
    firstChild.removeAttribute('expanded');
    firstChild.setAttribute('aria-expanded', `${false}`);
  }
};

/**
 * @param {HTMLElement} element
 */
const expandContent = element => {
  element.setAttribute('expanded', `${true}`);
};

/**
 * @param {HTMLElement} element
 */
const collapseContent = element => {
  element.removeAttribute('expanded');
};

/**
 * # <lion-accordion> webcomponent
 *
 * @customElement lion-accordion
 * @extends LitElement
 */
export class LionAccordion extends LitElement {
  static get properties() {
    return {
      /**
       * index number of the focused accordion
       */
      focusedIndex: {
        type: Number,
      },
      /**
       * array of indices of the expanded accordions
       */
      expanded: {
        type: Array,
      },
    };
  }

  static get styles() {
    return [
      css`
        .accordion {
          display: flex;
          flex-direction: column;
        }

        .accordion ::slotted([slot='invoker']) {
          margin: 0;
        }

        .accordion ::slotted([slot='invoker'][expanded]) {
          font-weight: bold;
        }

        .accordion ::slotted([slot='content']) {
          margin: 0;
          visibility: hidden;
          display: none;
        }

        .accordion ::slotted([slot='content'][expanded]) {
          visibility: visible;
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="accordion">
        <slot name="invoker"></slot>
        <slot name="content"></slot>
      </div>
    `;
  }

  constructor() {
    super();
    this.styles = {};

    /** @type {StoreEntry[]} */
    this.__store = [];

    /** @type {number} */
    this.__focusedIndex = -1;

    /** @type {number[]} */
    this.__expanded = [];
  }

  /** @param {import('lit-element').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__setupSlots();
  }

  __setupSlots() {
    const invokerSlot = this.shadowRoot?.querySelector('slot[name=invoker]');
    const handleSlotChange = () => {
      this.__cleanStore();
      this.__setupStore();
      this.__updateFocused();
      this.__updateExpanded();
    };
    if (invokerSlot) {
      invokerSlot.addEventListener('slotchange', handleSlotChange);
    }
  }

  __setupStore() {
    const invokers = /** @type {HTMLElement[]} */ (Array.from(
      this.querySelectorAll('[slot="invoker"]'),
    ));
    const contents = /** @type {HTMLElement[]} */ (Array.from(
      this.querySelectorAll('[slot="content"]'),
    ));
    if (invokers.length !== contents.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `The amount of invokers (${invokers.length}) doesn't match the amount of contents (${contents.length}).`,
      );
    }

    invokers.forEach((invoker, index) => {
      const uid = uuid();
      const content = contents[index];
      /** @type {StoreEntry} */
      const entry = {
        uid,
        index,
        invoker,
        content,
        clickHandler: this.__createInvokerClickHandler(index),
        keydownHandler: this.__handleInvokerKeydown.bind(this),
      };
      setupContent({ element: entry.content, ...entry });
      setupInvoker({ element: entry.invoker, ...entry });
      unfocusInvoker(entry.invoker);
      collapseContent(entry.content);
      collapseInvoker(entry.invoker);
      this.__store.push(entry);
    });
  }

  __cleanStore() {
    if (!this.__store) {
      return;
    }
    this.__store.forEach(entry => {
      cleanInvoker(entry.invoker, entry.clickHandler, entry.keydownHandler);
    });
    this.__store = [];
  }

  /**
   *
   * @param {number} index
   */
  __createInvokerClickHandler(index) {
    return () => {
      this.focusedIndex = index;
      this.__toggleExpanded(index);
    };
  }

  /**
   * @param {Event} e
   */
  __handleInvokerKeydown(e) {
    const _e = /** @type {KeyboardEvent} */ (e);
    switch (_e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        _e.preventDefault();
        if (this.focusedIndex + 2 <= this._pairCount) {
          this.focusedIndex += 1;
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        _e.preventDefault();
        if (this.focusedIndex >= 1) {
          this.focusedIndex -= 1;
        }
        break;
      case 'Home':
        _e.preventDefault();
        this.focusedIndex = 0;
        break;
      case 'End':
        _e.preventDefault();
        this.focusedIndex = this._pairCount - 1;
        break;
      /* no default */
    }
  }

  set focusedIndex(value) {
    const stale = this.__focusedIndex;
    this.__focusedIndex = value;
    this.__updateFocused();
    this.dispatchEvent(new Event('focused-changed'));
    this.requestUpdate('focusedIndex', stale);
  }

  get focusedIndex() {
    return this.__focusedIndex;
  }

  get _pairCount() {
    return this.__store.length;
  }

  set expanded(value) {
    const stale = this.__expanded;
    this.__expanded = value;
    this.__updateExpanded();
    this.dispatchEvent(new Event('expanded-changed'));
    this.requestUpdate('expanded', stale);
  }

  get expanded() {
    return this.__expanded;
  }

  __updateFocused() {
    if (!(this.__store && this.__store[this.focusedIndex])) {
      return;
    }
    const previousInvoker = /** @type {HTMLElement | null} */ (Array.from(this.children).find(
      child => child.slot === 'invoker' && child.firstElementChild?.hasAttribute('focused'),
    ));
    if (previousInvoker) {
      unfocusInvoker(previousInvoker);
    }
    const { invoker: currentInvoker } = this.__store[this.focusedIndex];
    if (currentInvoker) {
      focusInvoker(currentInvoker);
    }
  }

  __updateExpanded() {
    if (!this.__store) {
      return;
    }
    this.__store.forEach((entry, index) => {
      const entryExpanded = this.expanded.indexOf(index) !== -1;

      if (entryExpanded) {
        expandInvoker(entry.invoker);
        expandContent(entry.content);
      } else {
        collapseInvoker(entry.invoker);
        collapseContent(entry.content);
      }
    });
  }

  /**
   * @param {number} value
   */
  __toggleExpanded(value) {
    const { expanded } = this;
    const index = expanded.indexOf(value);

    if (index === -1) {
      expanded.push(value);
    } else {
      expanded.splice(index, 1);
    }

    this.expanded = expanded;
  }
}
