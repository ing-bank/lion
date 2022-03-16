import { unsafeCSS, css } from 'lit';

/**
 * @typedef {import('lit').ReactiveControllerHost} ReactiveControllerHost
 * @typedef {import('lit').ReactiveController} ReactiveController
 * @implements {ReactiveController}
 */
export class ScopedStylesController {
  /**
   * @param {import('lit').CSSResult} scope
   * @return {import('lit').CSSResultGroup}
   */
  // eslint-disable-next-line no-unused-vars
  static scopedStyles(scope) {
    return css``;
  }

  /**
   * @param {ReactiveControllerHost & import('lit').LitElement} host
   */
  constructor(host) {
    (this.host = host).addController(this);
    // Perhaps use constructable stylesheets instead once Safari supports replace(Sync) methods
    this.__styleTag = document.createElement('style');
    this.scopedClass = `${this.host.localName}-${Math.floor(Math.random() * 10000)}`;
  }

  hostConnected() {
    this.host.classList.add(this.scopedClass);
    this.__setupStyleTag();
  }

  hostDisconnected() {
    this.__teardownStyleTag();
  }

  __setupStyleTag() {
    // Make it win from other elements on the page.
    // TODO: consider adding an id here to always win, since we are simulating shadow dom
    // behavior here.
    const highSpecifictyScope = `${this.scopedClass}.${this.scopedClass}`;
    this.__styleTag.textContent = /** @type {typeof ScopedStylesController} */ (
      this.host.constructor
    )
      .scopedStyles(unsafeCSS(highSpecifictyScope))
      .toString();
    this.host.insertBefore(this.__styleTag, this.host.childNodes[0]);
  }

  __teardownStyleTag() {
    this.host.removeChild(this.__styleTag);
  }
}
