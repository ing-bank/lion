/**
 * @typedef {import('lit').ReactiveControllerHost} ReactiveControllerHost
 *
 * @typedef {ReactiveControllerHost & import('lit').LitElement & {disabled: Boolean}} DisabledControllerHost
 *
 * @typedef {import('lit').ReactiveController} ReactiveController
 * @implements {ReactiveController}
 */
export class DisabledController {
  /**
   * @param {DisabledControllerHost} host
   * @param {(value: Boolean) => void} setDisabled
   */
  constructor(host, setDisabled) {
    (this.host = host).addController(this);
    this.setDisabled = setDisabled;
    /** @protected */
    this._requestedToBeDisabled = false;
    /** @private */
    this.__isUserSettingDisabled = true;
    /** @private */
    this.__restoreDisabledTo = false;
  }

  makeRequestToBeDisabled() {
    if (this._requestedToBeDisabled === false) {
      this._requestedToBeDisabled = true;
      this.__restoreDisabledTo = this.host.disabled;
      this.__internalSetDisabled(true);
    }
  }

  retractRequestToBeDisabled() {
    if (this._requestedToBeDisabled === true) {
      this._requestedToBeDisabled = false;
      this.__internalSetDisabled(this.__restoreDisabledTo);
    }
  }

  /**
   * @param {boolean} value
   * @private
   */
  __internalSetDisabled(value) {
    this.__isUserSettingDisabled = false;
    this.setDisabled(value);
    this.__isUserSettingDisabled = true;
  }

  hostConnected() {
    const hostHasDisabled = 'disabled' in this.host;
    if (!hostHasDisabled) {
      throw new Error('DisabledController requires a host with a "disabled" property set');
    }
  }

  hostUpdated() {
    if (this.host.disabled !== this.__restoreDisabledTo) {
      if (this.__isUserSettingDisabled) {
        this.__restoreDisabledTo = this.host.disabled;
      }
      if (this.host.disabled === false && this._requestedToBeDisabled === true) {
        this.__internalSetDisabled(true);
      }
    }
  }
}
