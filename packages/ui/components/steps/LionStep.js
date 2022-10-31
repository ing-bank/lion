import { css, html, LitElement } from 'lit';

/**
 * @typedef {import('./LionSteps').LionSteps} LionSteps
 */

/**
 * `LionStep` is one of many in a LionSteps Controller
 *
 * @customElement lion-step
 * @extends {LitElement}
 */
export class LionStep extends LitElement {
  static get properties() {
    return {
      /**
       * Step status, one of: "untouched", "entered", "left", "skipped".
       */
      status: {
        type: String,
        reflect: true,
      },
      /**
       * The funtion which us run to check if this step can be transitioned to.
       * Takes lion-steps data as a first argument `myConditionFunc(data)`.
       */
      condition: {
        attribute: false,
      },
      /**
       * Allows to invert condition function result.
       */
      invertCondition: {
        type: Boolean,
        reflect: true,
        attribute: 'invert-condition',
      },
      /**
       * Allows transition to step only in forward direction. Skips it if transitioned back.
       * May be useful if the step is only showing some messages and does data loading and
       * then makes transition to next step automatically.
       */
      forwardOnly: {
        type: Boolean,
        reflect: true,
        attribute: 'forward-only',
      },
      /**
       * If set this step will be the initially enabled step
       * There should be only ONE intial step in each steps
       */
      initialStep: {
        type: Boolean,
        reflect: true,
        attribute: 'initial-step',
      },
    };
  }

  constructor() {
    super();
    this.status = 'untouched';
    // eslint-disable-next-line no-unused-vars
    this.condition = /** @param {Object} [data] */ data => true;
    this.invertCondition = false;
    this.forwardOnly = false;
    this.initialStep = false;
  }

  static get styles() {
    return [
      css`
        :host {
          display: none;
        }

        :host([hidden]) {
          display: none;
        }

        :host([status='entered']) {
          display: block;
        }
      `,
    ];
  }

  render() {
    return html`<slot></slot>`;
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.controller = /** @type {LionSteps} */ (this.parentNode);
  }

  enter() {
    this.status = 'entered';
    this.dispatchEvent(new CustomEvent('enter', { bubbles: true, composed: true }));
  }

  leave() {
    this.status = 'left';
    this.dispatchEvent(new CustomEvent('leave', { bubbles: true, composed: true }));
  }

  skip() {
    this.status = 'skipped';
    this.dispatchEvent(new CustomEvent('skip', { bubbles: true, composed: true }));
  }

  /** @param {Object} [data] */
  passesCondition(data) {
    const result = this.condition(data);
    return this.invertCondition ? !result : result;
  }
}
