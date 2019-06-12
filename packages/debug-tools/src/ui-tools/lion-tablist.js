import { LitElement, css, html } from '@lion/core';

/* eslint-disable */

// TODO: lint and complete
// Implements the official aria widget/design pattern:
// https://www.w3.org/TR/wai-aria-1.1/#tablist
// Uses: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/tabs/tabs-1/tabs.html

class LionTablist extends LitElement {
  static get properties() {
    return {
      selected: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.selected = 0;
    if (typeof this.constructor._idCounter !== 'undefined') {
      this.constructor._idCounter++;
    } else {
      this.constructor._idCounter = 0;
    }
    this._id = `${this.localName}-${this.constructor._idCounter.toString(16)}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'tablist');

    const tabs = Array.prototype.slice.call(this.querySelectorAll('[slot="tab"]'));
    const panels = Array.prototype.slice.call(this.querySelectorAll('[slot="panel"]'));

    if (tabs.length !== panels.length) {
      console.warn('Please provide a panel for every tab');
    }

    for (let i = 0, tab, panel; (tab = tabs[i]), (panel = panels[i]), i < tabs.length; i++) {
      tab.id = `${this._id}-tab${i}`;
      panel.id = `${this._id}-panel${i}`;

      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.setAttribute('aria-selected', this.selected === i ? 'true' : 'false');
      tab.setAttribute('tabindex', this.selected === i ? '0' : '-1');

      panel.hidden = this.selected !== i;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.setAttribute('tabindex', this.selected === i ? '0' : '-1');
    }
  }

  firstUpdated() {
    this._init(this);
  }

  static get styles() {
    return css`
      .tablist__tabs {
        width: 20em;
        font-family: 'lucida grande', sans-serif;
        display: flex;
      }

      ::slotted([role='tablist']) {
        margin: 0 0 -0.1em;
        overflow: visible;
      }

      .tablist__tabs ::slotted([role='tab']) {
        position: relative;
        margin: 0;
        padding: 0.3em 0.5em 0.4em;
        border-radius: 0.2em 0.2em 0 0;
        box-shadow: 0 0 0.2em hsl(219, 1%, 72%);
        overflow: visible;
        font-family: inherit;
        font-size: inherit;
        background: hsl(220, 20%, 94%);
      }

      .tablist__tabs ::slotted([role='tab']):hover::before,
      .tablist__tabs ::slotted([role='tab']):focus::before,
      .tablist__tabs ::slotted([role='tab'][aria-selected='true'])::before {
        position: absolute;
        bottom: 100%;
        right: -1px;
        left: -1px;
        border-radius: 0.2em 0.2em 0 0;
        border-top: 3px solid hsl(20, 96%, 48%);
        content: '';
      }

      .tablist__tabs ::slotted([role='tab'][aria-selected='true']) {
        border-radius: 0;
        background: hsl(220, 43%, 99%);
        outline: 0;
      }

      .tablist__tabs ::slotted([role='tab'][aria-selected='true']:not(:focus):not(:hover))::before {
        border-top: 5px solid hsl(218, 96%, 48%);
      }

      .tablist__tabs ::slotted([role='tab'][aria-selected='true'])::after {
        position: absolute;
        z-index: 3;
        bottom: -1px;
        right: 0;
        left: 0;
        height: 0.3em;
        background: hsl(220, 43%, 99%);
        box-shadow: none;
        content: '';
      }

      .tablist__tabs ::slotted([role='tab']):hover,
      .tablist__tabs ::slotted([role='tab']):focus,
      .tablist__tabs ::slotted([role='tab']):active {
        outline: 0;
        border-radius: 0;
        color: inherit;
      }

      .tablist__tabs ::slotted([role='tab']):hover::before,
      .tablist__tabs ::slotted([role='tab']):focus::before {
        border-color: hsl(20, 96%, 48%);
      }

      .tablist__panels ::slotted([role='tabpanel']) {
        position: relative;
        z-index: 2;
        padding: 0.5em 0.5em 0.7em;
        border-radius: 0 0.2em 0.2em 0.2em;
        box-shadow: 0 0 0.2em hsl(219, 1%, 72%);
        background: hsl(220, 43%, 99%);
      }

      .tablist__panels ::slotted([role='tabpanel']):focus {
        border-color: hsl(20, 96%, 48%);
        box-shadow: 0 0 0.2em hsl(20, 96%, 48%);
        outline: 0;
      }

      .tablist__panels ::slotted([role='tabpanel']):focus::after {
        position: absolute;
        bottom: 0;
        right: -1px;
        left: -1px;
        border-bottom: 3px solid hsl(20, 96%, 48%);
        border-radius: 0 0 0.2em 0.2em;
        content: '';
      }

      /* to be styled by consumer */

      [role='tabpanel'] p {
        margin: 0;
      }

      [role='tabpanel'] * + p {
        margin-top: 1em;
      }
    `;
  }

  static get template() {
    return html`
      <div class="tablist__tabs">
        <slot name="tab"></slot>
      </div>
      <div class="tablist__panels">
        <slot name="panel"></slot>
      </div>
    `;
  }

  render() {
    return this.constructor.template;
  }

  _init(root) {
    /**
     *   This content is licensed according to the W3C Software License at
     *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     */
    (function() {
      const tablist = root; // root.querySelectorAll('[role="tablist"]')[0];
      let tabs;
      let panels;
      const delay = determineDelay();

      generateArrays();

      function generateArrays() {
        tabs = root.querySelectorAll('[slot="tab"]');
        panels = root.querySelectorAll('[slot="panel"]');
      }

      // For easy reference
      const keys = {
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        delete: 46,
      };

      // Add or substract depenign on key pressed
      const direction = {
        37: -1,
        38: -1,
        39: 1,
        40: 1,
      };

      // Bind listeners
      for (let i = 0; i < tabs.length; ++i) {
        addListeners(i);
      }

      function addListeners(index) {
        tabs[index].addEventListener('click', clickEventListener);
        tabs[index].addEventListener('keydown', keydownEventListener);
        tabs[index].addEventListener('keyup', keyupEventListener);

        // Build an array with all tabs (<button>s) in it
        tabs[index].index = index;
      }

      // When a tab is clicked, activateTab is fired to activate it
      function clickEventListener(event) {
        const tab = event.target;
        activateTab(tab, false);
      }

      // Handle keydown on tabs
      function keydownEventListener(event) {
        const key = event.keyCode;

        switch (key) {
          case keys.end:
            event.preventDefault();
            // Activate last tab
            activateTab(tabs[tabs.length - 1]);
            break;
          case keys.home:
            event.preventDefault();
            // Activate first tab
            activateTab(tabs[0]);
            break;

          // Up and down are in keydown
          // because we need to prevent page scroll >:)
          case keys.up:
          case keys.down:
            determineOrientation(event);
            break;
        }
      }

      // Handle keyup on tabs
      function keyupEventListener(event) {
        const key = event.keyCode;

        switch (key) {
          case keys.left:
          case keys.right:
            determineOrientation(event);
            break;
          case keys.delete:
            determineDeletable(event);
            break;
        }
      }

      // When a tablistâ€™s aria-orientation is set to vertical,
      // only up and down arrow should function.
      // In all other cases only left and right arrow function.
      function determineOrientation(event) {
        const key = event.keyCode;
        const vertical = tablist.getAttribute('aria-orientation') == 'vertical';
        let proceed = false;

        if (vertical) {
          if (key === keys.up || key === keys.down) {
            event.preventDefault();
            proceed = true;
          }
        } else if (key === keys.left || key === keys.right) {
          proceed = true;
        }

        if (proceed) {
          switchTabOnArrowPress(event);
        }
      }

      // Either focus the next, previous, first, or last tab
      // depening on key pressed
      function switchTabOnArrowPress(event) {
        const pressed = event.keyCode;

        for (let x = 0; x < tabs.length; x++) {
          tabs[x].addEventListener('focus', focusEventHandler);
        }

        if (direction[pressed]) {
          const target = event.target;
          if (target.index !== undefined) {
            if (tabs[target.index + direction[pressed]]) {
              tabs[target.index + direction[pressed]].focus();
            } else if (pressed === keys.left || pressed === keys.up) {
              focusLastTab();
            } else if (pressed === keys.right || pressed == keys.down) {
              focusFirstTab();
            }
          }
        }
      }

      // Activates any given tab panel
      function activateTab(tab, setFocus) {
        setFocus = setFocus || true;
        // Deactivate all other tabs
        deactivateTabs();

        // Remove tabindex attribute
        tab.removeAttribute('tabindex');

        // Set the tab as selected
        tab.setAttribute('aria-selected', 'true');

        // Get the value of aria-controls (which is an ID)
        const controls = tab.getAttribute('aria-controls');

        // Remove hidden attribute from tab panel to make it visible
        root.querySelector(`[id=${controls}]`).removeAttribute('hidden');

        // Set focus when required
        if (setFocus) {
          tab.focus();
        }
      }

      // Deactivate all tabs and tab panels
      function deactivateTabs() {
        for (let t = 0; t < tabs.length; t++) {
          tabs[t].setAttribute('tabindex', '-1');
          tabs[t].setAttribute('aria-selected', 'false');
          tabs[t].removeEventListener('focus', focusEventHandler);
        }

        for (let p = 0; p < panels.length; p++) {
          panels[p].setAttribute('hidden', 'hidden');
        }
      }

      // Make a guess
      function focusFirstTab() {
        tabs[0].focus();
      }

      // Make a guess
      function focusLastTab() {
        tabs[tabs.length - 1].focus();
      }

      // Detect if a tab is deletable
      function determineDeletable(event) {
        target = event.target;

        if (target.getAttribute('data-deletable') !== null) {
          // Delete target tab
          deleteTab(event, target);

          // Update arrays related to tabs widget
          generateArrays();

          // Activate the closest tab to the one that was just deleted
          if (target.index - 1 < 0) {
            activateTab(tabs[0]);
          } else {
            activateTab(tabs[target.index - 1]);
          }
        }
      }

      // Deletes a tab and its panel
      function deleteTab(event) {
        const target = event.target;
        const panel = document.getElementById(target.getAttribute('aria-controls'));

        target.parentElement.removeChild(target);
        panel.parentElement.removeChild(panel);
      }

      // Determine whether there should be a delay
      // when user navigates with the arrow keys
      function determineDelay() {
        const hasDelay = tablist.hasAttribute('data-delay');
        let delay = 0;

        if (hasDelay) {
          const delayValue = tablist.getAttribute('data-delay');
          if (delayValue) {
            delay = delayValue;
          } else {
            // If no value is specified, default to 300ms
            delay = 300;
          }
        }
        return delay;
      }

      //
      function focusEventHandler(event) {
        const target = event.target;
        setTimeout(checkTabFocus, delay, target);
      }

      // Only activate tab on focus if it still has focus after the delay
      function checkTabFocus(target) {
        focused = document.activeElement;
        if (target === focused) {
          activateTab(target, false);
        }
      }
    })();
  }
}

customElements.define('lion-tablist', LionTablist);
