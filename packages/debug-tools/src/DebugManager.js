import './lion-debuggable-output.js';

/* eslint-disable no-underscore-dangle, class-methods-use-this */

export class DebugManager {
  static makeDebuggables(debuggableClasses, props, config = {}) {
    return debuggableClasses.forEach(klass => this.makeDebuggable(klass, props, config));
  }

  static makeDebuggable(klass, props, config = {}) {
    const debuggableClass = klass;
    const originalConnectedCallback = debuggableClass.prototype.connectedCallback;
    const originalDisconnectedCallback = debuggableClass.prototype.disconnectedCallback;

    debuggableClass.prototype.connectedCallback = function connectedCallbackDebug() {
      // eslint-disable-line no-param-reassign, max-len
      if (originalConnectedCallback) originalConnectedCallback.bind(this)();
      const debuggableOutputElement = document.createElement('lion-debuggable-output');
      this.dispatchEvent(
        new CustomEvent('register-debuggable', {
          detail: { element: this, debuggableOutputElement },
          bubbles: true,
          composed: true,
        }),
      );
      debuggableOutputElement.element = this;
      debuggableOutputElement.props = props;

      if (config.callback) {
        // might some extra stuff be needed
        config.callback(this, debuggableOutputElement);
      }
    };

    debuggableClass.prototype.disconnectedCallback = function disconnectedCallbackDebug() {
      // eslint-disable-line no-param-reassign, max-len
      if (originalDisconnectedCallback) originalDisconnectedCallback.bind(this)();
      if (this._debugInfo) {
        // unregister on  <lion-debug-viewer> element
        this._debugInfo.dispatchEvent(
          new CustomEvent('unregister-debuggable', {
            detail: { element: this },
            bubbles: true,
            composed: true,
          }),
        );
      }
    };
  }
}
