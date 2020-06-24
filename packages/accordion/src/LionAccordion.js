import { LitElement, css, html } from '@lion/core';

const uuid = () => Math.random().toString(36).substr(2, 10);

const setupContent = ({ element, uid, index }) => {
  element.style.setProperty('order', index + 1);
  element.setAttribute('id', `content-${uid}`);
  element.setAttribute('aria-labelledby', `invoker-${uid}`);
};

const setupInvoker = ({ element, uid, index, clickHandler, keydownHandler }) => {
  element.style.setProperty('order', index + 1);
  element.firstElementChild.setAttribute('id', `invoker-${uid}`);
  element.firstElementChild.setAttribute('aria-controls', `content-${uid}`);
  element.firstElementChild.addEventListener('click', clickHandler);
  element.firstElementChild.addEventListener('keydown', keydownHandler);
};

const cleanInvoker = (element, clickHandler, keydownHandler) => {
  element.firstElementChild.removeAttribute('id');
  element.firstElementChild.removeAttribute('aria-controls');
  element.firstElementChild.removeEventListener('click', clickHandler);
  element.firstElementChild.removeEventListener('keydown', keydownHandler);
};

const focusInvoker = element => {
  element.firstElementChild.focus();
  element.firstElementChild.setAttribute('focused', true);
};

const unfocusInvoker = element => {
  element.firstElementChild.removeAttribute('focused');
};

const expandInvoker = element => {
  element.setAttribute('expanded', true);
  element.firstElementChild.setAttribute('expanded', true);
  element.firstElementChild.setAttribute('aria-expanded', true);
};

const collapseInvoker = element => {
  element.removeAttribute('expanded');
  element.firstElementChild.removeAttribute('expanded');
  element.firstElementChild.setAttribute('aria-expanded', false);
};

const expandContent = element => {
  element.setAttribute('expanded', true);
};

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
    this.focusedIndex = null;
    this.expanded = [];
    this.styles = {};
  }

  firstUpdated() {
    super.firstUpdated();
    this.__setupSlots();
  }

  __setupSlots() {
    const invokerSlot = this.shadowRoot.querySelector('slot[name=invoker]');
    const handleSlotChange = () => {
      this.__cleanStore();
      this.__setupStore();
      this.__updateFocused();
      this.__updateExpanded();
    };
    invokerSlot.addEventListener('slotchange', handleSlotChange);
  }

  __setupStore() {
    this.__store = [];
    const invokers = this.querySelectorAll('[slot="invoker"]');
    const contents = this.querySelectorAll('[slot="content"]');
    if (invokers.length !== contents.length) {
      // eslint-disable-next-line no-console
      console.warn(
        `The amount of invokers (${invokers.length}) doesn't match the amount of contents (${contents.length}).`,
      );
    }

    invokers.forEach((invoker, index) => {
      const uid = uuid();
      const content = contents[index];
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
  }

  __createInvokerClickHandler(index) {
    return () => {
      this.focusedIndex = index;
      this.__toggleExpanded(index);
    };
  }

  __handleInvokerKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        if (this.focusedIndex + 2 <= this._pairCount) {
          this.focusedIndex += 1;
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        if (this.focusedIndex >= 1) {
          this.focusedIndex -= 1;
        }
        break;
      case 'Home':
        e.preventDefault();
        this.focusedIndex = 0;
        break;
      case 'End':
        e.preventDefault();
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
    const previousInvoker = Array.from(this.children).find(
      child => child.slot === 'invoker' && child.firstElementChild.hasAttribute('focused'),
    );
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
