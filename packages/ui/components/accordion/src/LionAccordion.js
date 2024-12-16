/* eslint-disable class-methods-use-this */
import { LitElement, css, html } from 'lit';
import { uuid } from '@lion/ui/core.js';

/**
 * @typedef {Object} StoreEntry
 * @property {string} uid Unique ID for the entry
 * @property {number} index index of the node
 * @property {HTMLElement} invoker invoker node
 * @property {HTMLElement} content content node
 * @property {(event: Event) => unknown} clickHandler executed on click event
 * @property {(event: Event) => unknown} keydownHandler executed on keydown event
 * @property {(event: Event) => unknown} focusHandler executed on focusin event
 */

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
      focusedIndex: { type: Number },
      /**
       * array of indices of the expanded accordions
       */
      expanded: { type: Array },
      /**
       * exclusive property allows only one accordion slot to be open at a time
       */
      exclusive: { type: Boolean },
    };
  }

  static get styles() {
    return [
      css`
        .accordion {
          display: flex;
          flex-direction: column;
        }

        .accordion ::slotted(.invoker) {
          margin: 0;
        }

        .accordion ::slotted(.invoker)[expanded] {
          font-weight: bold;
        }

        .accordion ::slotted(.content) {
          margin: 0;
          visibility: hidden;
          display: none;
        }

        .accordion ::slotted(.content[expanded]) {
          visibility: visible;
          display: block;
        }
      `,
    ];
  }

  /**
   * @param {number} value
   */
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

  /**
   * @param {number[]} value
   */
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

  constructor() {
    super();
    this.styles = {};

    /**
     * @type {boolean}
     */
    this.exclusive = false;

    /**
     * @type {StoreEntry[]}
     * @private
     */
    this.__store = [];

    /**
     * @type {number}
     * @private
     */
    this.__focusedIndex = -1;

    /**
     * @type {number[]}
     * @private
     */
    this.__expanded = [];
  }

  /** @param {import('lit').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__setupSlots();
  }

  render() {
    return html`
      <div class="accordion">
        <slot name="invoker"></slot>
        <slot name="content"></slot>
        <slot name="_accordion"></slot>
      </div>
    `;
  }

  /**
   *  @private
   */
  __setupSlots() {
    const invokerSlot = /** @type {HTMLSlotElement} */ (
      this.shadowRoot?.querySelector('slot[name=invoker]')
    );
    const handleSlotChange = () => {
      if (invokerSlot.assignedNodes().length > 0) {
        this.__cleanStore();
        this.__setupStore();
        this.__updateFocused();
        this.__updateExpanded();
      }
    };
    if (invokerSlot) {
      invokerSlot.addEventListener('slotchange', handleSlotChange);
    }
  }

  /**
   *  @private
   */
  __setupStore() {
    const accordion = /** @type {HTMLSlotElement} */ (
      this.shadowRoot?.querySelector('slot[name=_accordion]')
    );
    const existingInvokers = accordion
      ? accordion.assignedElements().filter(child => child.classList.contains('invoker'))
      : [];
    const existingContent = accordion
      ? accordion.assignedElements().filter(child => child.classList.contains('content'))
      : [];

    const invokers = /** @type {HTMLElement[]} */ ([
      ...Array.from(existingInvokers),
      ...Array.from(this.querySelectorAll(':scope > [slot="invoker"]')),
    ]);

    const contents = /** @type {HTMLElement[]} */ ([
      ...Array.from(existingContent),
      ...Array.from(this.querySelectorAll(':scope > [slot="content"]')),
    ]);

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
        focusHandler: this.__createInvokerFocusHandler(index),
      };
      this._setupContent(entry);
      this._setupInvoker(entry);
      this._unfocusInvoker(entry);
      this._collapse(entry);
      this.__store.push(entry);
    });

    this.__rearrangeInvokersAndContent();
  }

  /**
   *  @private
   *
   *  Moves all invokers and content to slot[name=_accordion] in correct order so focus works
   *  correctly when the user tabs.
   */
  __rearrangeInvokersAndContent() {
    const invokers = /** @type {HTMLElement[]} */ (
      Array.from(this.children).filter(child => child.slot === 'invoker')
    );

    const contents = /** @type {HTMLElement[]} */ (
      Array.from(this.children).filter(child => child.slot === 'content')
    );

    const accordion = this.shadowRoot?.querySelector('slot[name=_accordion]');

    if (accordion) {
      invokers.forEach((invoker, index) => {
        invoker.classList.add('invoker');
        // eslint-disable-next-line no-param-reassign
        invoker.slot = '_accordion';

        contents[index].classList.add('content');
        contents[index].slot = '_accordion';
      });
    }
  }

  /**
   * @param {number} index
   * @private
   */
  __createInvokerClickHandler(index) {
    return () => {
      this.focusedIndex = index;
      this.__toggleExpanded(index);
    };
  }

  /**
   * @param {number} index
   * @private
   */
  __createInvokerFocusHandler(index) {
    return () => {
      if (index === this.focusedIndex) {
        return;
      }
      this.focusedIndex = index;
    };
  }

  /**
   * @param {Event} e
   * @private
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

  /**
   *  @private
   */
  get _pairCount() {
    return this.__store.length;
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _setupContent(entry) {
    const { content, index, uid } = entry;
    content.style.setProperty('order', `${index + 1}`);
    content.setAttribute('id', `content-${uid}`);
    content.setAttribute('aria-labelledby', `invoker-${uid}`);
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _setupInvoker(entry) {
    const { invoker, uid, index, clickHandler, keydownHandler, focusHandler } = entry;
    invoker.style.setProperty('order', `${index + 1}`);
    const firstChild = invoker.firstElementChild;
    if (firstChild) {
      firstChild.setAttribute('id', `invoker-${uid}`);
      firstChild.setAttribute('aria-controls', `content-${uid}`);
      firstChild.addEventListener('click', clickHandler);
      firstChild.addEventListener('keydown', keydownHandler);
      firstChild.addEventListener('focusin', focusHandler);
    }
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _cleanInvoker(entry) {
    const { invoker, clickHandler, keydownHandler, focusHandler } = entry;
    const firstChild = invoker.firstElementChild;
    if (firstChild) {
      firstChild.removeAttribute('id');
      firstChild.removeAttribute('aria-controls');
      firstChild.removeEventListener('click', clickHandler);
      firstChild.removeEventListener('keydown', keydownHandler);
      firstChild.removeEventListener('focusin', focusHandler);
    }
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _focusInvoker(entry) {
    const { invoker } = entry;
    const firstChild = /** @type {HTMLElement|null} */ (invoker.firstElementChild);
    if (firstChild) {
      firstChild.focus();
      firstChild.setAttribute('focused', `${true}`);
    }
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _unfocusInvoker(entry) {
    const { invoker } = entry;
    const firstChild = invoker.firstElementChild;
    if (firstChild) {
      firstChild.removeAttribute('focused');
    }
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _collapse(entry) {
    const { content, invoker } = entry;
    content.removeAttribute('expanded');
    invoker.removeAttribute('expanded');
    const firstChild = invoker.firstElementChild;
    if (firstChild) {
      firstChild.removeAttribute('expanded');
      firstChild.setAttribute('aria-expanded', `${false}`);
    }
  }

  /**
   * @param {StoreEntry} entry
   * @protected
   */
  _expand(entry) {
    const { content, invoker } = entry;
    content.setAttribute('expanded', `${true}`);
    invoker.setAttribute('expanded', `${true}`);
    const firstChild = invoker.firstElementChild;
    if (firstChild) {
      firstChild.setAttribute('expanded', `${true}`);
      firstChild.setAttribute('aria-expanded', `${true}`);
    }
  }

  /**
   *  @private
   */
  __updateFocused() {
    const focusedEntry = this.__store[this.focusedIndex];
    const previousFocusedEntry = Array.from(this.__store).find(
      entry => entry.invoker && entry.invoker.firstElementChild?.hasAttribute('focused'),
    );
    if (previousFocusedEntry) {
      this._unfocusInvoker(previousFocusedEntry);
    }
    if (focusedEntry) {
      this._focusInvoker(focusedEntry);
    }
  }

  /**
   *  @private
   */
  __updateExpanded() {
    if (!this.__store) {
      return;
    }
    this.__store.forEach((entry, index) => {
      const entryExpanded = this.expanded.indexOf(index) !== -1;

      if (entryExpanded) {
        this._expand(entry);
      } else {
        this._collapse(entry);
      }
    });
  }

  /**
   * @param {number} indexClicked
   * @private
   */
  __toggleExpanded(indexClicked) {
    const indexFound = this.expanded.indexOf(indexClicked);
    const expandedNewValues = this.exclusive ? [] : [...this.expanded];

    if (indexFound === -1) {
      expandedNewValues.push(indexClicked);
    } else {
      expandedNewValues.splice(indexFound, 1);
    }

    // trigger a render
    this.expanded = expandedNewValues;
  }

  /**
   *  @private
   */
  __cleanStore() {
    if (!this.__store) {
      return;
    }
    this.__store.forEach(entry => {
      this._cleanInvoker(entry);
    });
    this.__store = [];
  }
}
