import { LitElement, css, html } from '@lion/core';

/* eslint-disable no-underscore-dangle, class-methods-use-this */

/**
 * All debuggables are registered into this component. All the <lion-debuggable-output>s coupled
 * to the debuggables, will be appended to this central component. They will be visible once
 * activated by the user via mouseover.
 */

class LionDebugViewer extends LitElement {
  static get properties() {
    return {
      enabled: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this._debuggables = new WeakMap();
    this.__counter = 0;
    this._maxHeight = 200;
    // List with debuggableOutputElements that registered, but need to be added to dom after
    // firstUpdated callback
    this.__debuggableQueue = [];

    this.__activateOutputElement = this.__activateOutputElement.bind(this);
    this.__deactivateOutputElement = this.__deactivateOutputElement.bind(this);
    this.__updateOutputElement = this.__updateOutputElement.bind(this);

    this.__onRegisterDebuggable = this.__onRegisterDebuggable.bind(this);
    this.__onUnregisterDebuggable = this.__onUnregisterDebuggable.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('register-debuggable', this.__onRegisterDebuggable);
    window.addEventListener('unregister-debuggable', this.__onUnregisterDebuggable);

    // add mouseover and show output of hovered element
    this.addEventListener('mouseover', this.__activateViewer);
    this.addEventListener('mouseout', this.__deactivateViewer);

    document.body.style.paddingBottom = `${Number(
      document.body.style.paddingBottom.replace('px', ''),
    ) + 200}px`;

    // from : https://stackoverflow.com/questions/1223764/how-to-trap-double-key-press-in-javascript
    const delta = 500;
    let lastKeypressTime = 0;
    this._enableDebugModeHandler = event => {
      if (String.fromCharCode(event.charCode).toUpperCase() === 'D') {
        let thisKeypressTime = new Date();
        if (thisKeypressTime - lastKeypressTime <= delta) {
          this.enabled = !this.enabled;
          // optional - if we'd rather not detect a triple-press
          // as a second double-press, reset the timestamp
          thisKeypressTime = 0;
        }
        lastKeypressTime = thisKeypressTime;
      }
    };
    this._enableDebugModeHandler.bind(this);
    document.addEventListener('keydown', this._enableDebugModeHandler);
  }

  firstUpdated() {
    this.__debuggableQueue.forEach(d => this._target.appendChild(d));
  }

  disconnectedCallback() {
    window.removeEventListener('register-debuggable', this.__onRegisterDebuggable);
    window.removeEventListener('unregister-debuggable', this.__onUnregisterDebuggable);
    document.addEventListener('keydown', this._enableDebugModeHandler);
  }

  __onRegisterDebuggable(event) {
    const { element, debuggableOutputElement } = event.detail;
    element._debugInfo = this;

    this._debuggables.set(element, debuggableOutputElement);
    this.__counter += 1;
    debuggableOutputElement.id = `${element.localName}-${this.__counter}`;

    if (this._target) {
      this._target.appendChild(debuggableOutputElement);
    } else {
      this.__debuggableQueue.push(debuggableOutputElement);
    }

    // add mouseover and show output of hovered element
    element.addEventListener('mouseover', this.__activateOutputElement);
    element.addEventListener('mouseout', this.__deactivateOutputElement);

    ['mousemove', 'keydown', 'mouseup'].forEach(eventName => {
      document.addEventListener(eventName, this.__updateOutputElement);
    });
  }

  __activateOutputElement(event) {
    event.stopPropagation(); // when nested, only update deepest
    const element = event.currentTarget;
    this.__activeElement = element;
    const debuggableOutputElement = this._debuggables.get(element);
    debuggableOutputElement.__prevBoxShadow = element.style.boxShadow;
    element.style.boxShadow = '0 0 8px lightgray';
    element.style.outline = '1px solid lightgray';
    debuggableOutputElement.active = true;
  }

  __deactivateOutputElement(event) {
    if (this.__viewerActive) return;
    const element = event.currentTarget;
    const debuggableOutputElement = this._debuggables.get(element);
    element.style.boxShadow = debuggableOutputElement.__prevBoxShadow;
    element.style.outline = '';
    debuggableOutputElement.active = false;
    this.__activeElement = null;
  }

  __updateOutputElement() {
    const element = this.__activeElement;
    const debuggableOutputElement = this._debuggables.get(element);
    if (debuggableOutputElement && debuggableOutputElement.active) {
      // TODO: this might not be the cheapest thing ever. Add debounce if needed
      debuggableOutputElement.rerender();
    }
  }

  __onUnregisterDebuggable(event) {
    const { element } = event.detail;
    element.removeEventListener('mouseover', this.__enableOutput);
    this._debuggables.delete(element);
  }

  get _target() {
    return this.shadowRoot.querySelector('#target');
  }

  static get styles() {
    return css`
      :host {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        padding: 8px;
        border: 1px solid gray;
        z-index: 1;
      }
    `;
  }

  render() {
    return html`
      <div id="target" class="debug-info__target"></div>
    `;
  }
}

customElements.define('lion-debug-viewer', LionDebugViewer);
