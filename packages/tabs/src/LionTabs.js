import { css, html, LitElement } from '@lion/core';

const uuid = () => Math.random().toString(36).substr(2, 10);

const setupPanel = ({ element, uid }) => {
  element.setAttribute('id', `panel-${uid}`);
  element.setAttribute('role', 'tabpanel');
  element.setAttribute('aria-labelledby', `button-${uid}`);
};

const selectPanel = element => {
  element.setAttribute('selected', true);
};

const deselectPanel = element => {
  element.removeAttribute('selected');
};

const setupButton = ({ element, uid, clickHandler, keydownHandler, keyupHandler }) => {
  element.setAttribute('id', `button-${uid}`);
  element.setAttribute('role', 'tab');
  element.setAttribute('aria-controls', `panel-${uid}`);
  element.addEventListener('click', clickHandler);
  element.addEventListener('keyup', keyupHandler);
  element.addEventListener('keydown', keydownHandler);
};

const cleanButton = ({ element, clickHandler, keydownHandler, keyupHandler }) => {
  element.removeAttribute('id');
  element.removeAttribute('role');
  element.removeAttribute('aria-controls');
  element.removeEventListener('click', clickHandler);
  element.removeEventListener('keyup', keyupHandler);
  element.removeEventListener('keydown', keydownHandler);
};

const selectButton = (element, firstUpdate = false) => {
  // Don't focus on first update, as the component might be lower on the page
  if (!firstUpdate) {
    element.focus();
  }

  element.setAttribute('selected', true);
  element.setAttribute('aria-selected', true);
  element.setAttribute('tabindex', 0);
};

const deselectButton = element => {
  element.removeAttribute('selected');
  element.setAttribute('aria-selected', false);
  element.setAttribute('tabindex', -1);
};

const handleButtonKeydown = e => {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'Home':
    case 'End':
      e.preventDefault();
    /* no default */
  }
};

export class LionTabs extends LitElement {
  static get properties() {
    return {
      /**
       * index number of the selected tab
       */
      selectedIndex: {
        type: Number,
        value: 0,
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
    this.selectedIndex = 0;
  }

  firstUpdated() {
    super.firstUpdated();
    this.__firstUpdate = true;
    this.__setupSlots();
  }

  __setupSlots() {
    const tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    const handleSlotChange = () => {
      this.__cleanStore();
      this.__setupStore();
      this.__updateSelected();
    };
    tabSlot.addEventListener('slotchange', handleSlotChange);
  }

  __setupStore() {
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
        keydownHandler: handleButtonKeydown,
        keyupHandler: this.__handleButtonKeyup.bind(this),
      };
      setupPanel({ element: entry.panel, ...entry });
      setupButton({ element: entry.button, ...entry });
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
      cleanButton({ element: entry.button, ...entry });
    });
  }

  __createButtonClickHandler(index) {
    return () => {
      this.selectedIndex = index;
    };
  }

  __handleButtonKeyup(e) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        if (this.selectedIndex + 1 >= this._pairCount) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex += 1;
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        if (this.selectedIndex <= 0) {
          this.selectedIndex = this._pairCount - 1;
        } else {
          this.selectedIndex -= 1;
        }
        break;
      case 'Home':
        this.selectedIndex = 0;
        break;
      case 'End':
        this.selectedIndex = this._pairCount - 1;
        break;
      /* no default */
    }
  }

  set selectedIndex(value) {
    this.__firstUpdate = false;
    const stale = this.__selectedIndex;
    this.__selectedIndex = value;
    this.__updateSelected();
    this.dispatchEvent(new Event('selected-changed'));
    this.requestUpdate('selectedIndex', stale);
  }

  get selectedIndex() {
    return this.__selectedIndex;
  }

  get _pairCount() {
    return this.__store.length;
  }

  __updateSelected() {
    if (!(this.__store && this.__store[this.selectedIndex])) {
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
      selectButton(currentButton, this.__firstUpdate);
    }
    if (currentPanel) {
      selectPanel(currentPanel);
    }
  }
}
