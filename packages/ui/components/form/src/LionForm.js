// @ts-nocheck
import { LionFieldset } from '@lion/ui/fieldset.js';
/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const throwFormNodeError = () => {
  throw new Error(
    'No form node found. Did you put a <form> element inside your custom-form element?',
  );
};

/**
 * LionForm: form wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement lion-form
 */
// eslint-disable-next-line no-unused-vars
export class LionForm extends LionFieldset {
  constructor() {
    super();
    /** @protected */
    this._submit = this._submit.bind(this);
    /** @protected */
    this._reset = this._reset.bind(this);
  }


  firstUpdated(){
    this.appInsights = new ApplicationInsights(
      {
        config: {
          instrumentationKey: '41c2886d-21bc-4038-9eb2-1d7c19387afd',
          autoTrackPageVisitTime: true,
          loggingLevelConsole: 2,
          loggingLevelTelemetry: 2,
          enableSessionStorageBuffer: false,
        }
      }
    );
    this.appInsights.loadAppInsights();
  }

  connectedCallback() {
    super.connectedCallback();
    this.__registerEventsForLionForm();

    // @override LionFieldset: makes sure a11y is handled by ._formNode
    this.removeAttribute('role');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownEventsForLionForm();
  }

  get _formNode() {
    return /** @type {HTMLFormElement} */ (this.querySelector('form'));
  }

  submit() {
    if (this._formNode) {
      // Firefox requires cancelable flag, otherwise we cannot preventDefault
      // Firefox still runs default handlers for untrusted events :\
      this._formNode.dispatchEvent(new Event('submit', { cancelable: true }));
      this.appInsights.trackEvent({name: 'form submitted'})
    } else {
      throwFormNodeError();
    }
  }

  /**
   * @param {Event} ev
   * @protected
   */
  _submit(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.submitGroup();
    this.dispatchEvent(new Event('submit', { bubbles: true }));
    this.appInsights.trackEvent({name: 'form submitted'})
  }

  reset() {
    if (this._formNode) {
      this.appInsights.trackEvent({name: 'form reset'})
      this._formNode.reset();
    } else {
      throwFormNodeError();
    }
  }

  /**
   * @param {Event} ev
   * @protected
   */
  _reset(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.resetGroup();
    this.dispatchEvent(new Event('reset', { bubbles: true }));
    this.appInsights.trackEvent({name: 'form reset'})
  }

  /** @private */
  __registerEventsForLionForm() {
    this._formNode.addEventListener('submit', this._submit);
    this._formNode.addEventListener('reset', this._reset);
  }

  /** @private */
  __teardownEventsForLionForm() {
    this._formNode.removeEventListener('submit', this._submit);
    this._formNode.removeEventListener('reset', this._reset);
  }
}
