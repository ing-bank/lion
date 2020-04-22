import { LitElement, html, css } from '@lion/core';

/**
 * `LionStep` is one of many in a LionSteps Controller
 *
 * @customElement lion-step
 * @extends {LitElement}
 */
export class LionStep extends LitElement {
  static get properties() {
    /**
     * Fired when the step is entered.
     *
     * @event enter
     */

    /**
     * Fired when the step is left.
     *
     * @event left
     */

    /**
     * Fired when the step is skipped.
     *
     * @event skipped
     */

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
        type: Function,
      },
      /**
       * Allows to invert condition function result.
       */
      invertCondition: {
        type: Boolean,
        attribute: 'invert-condition',
      },
      /**
       * Allows transition to step only in forward direction. Skips it if transitioned back.
       * May be useful if the step is only showing some messages and does data loading and
       * then makes transition to next step automatically.
       */
      forwardOnly: {
        type: Boolean,
        attribute: 'forward-only',
      },
      /**
       * If set this step will be the initially enabled step
       * There should be only ONE intial step in each steps
       */
      initialStep: {
        type: Boolean,
        attribute: 'initial-step',
      },
    };
  }

  constructor() {
    super();
    this.status = 'untouched';
    this.condition = () => true;
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
    return html`
      <slot></slot>
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    this.controller = this.parentNode;
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

  passesCondition(data) {
    const result = this.condition(data);
    return this.invertCondition ? !result : result;
  }
}
