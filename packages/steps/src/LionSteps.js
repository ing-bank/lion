import { html, css } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
/**
 * `LionSteps` is a controller for a multi step system.
 *
 * @customElement
 */
export class LionSteps extends LionLitElement {
  static get properties() {
    /**
     * Fired when a transition between steps happens.
     *
     * @event transition
     */

    return {
      /**
       * Storage for data gathered across different steps.
       * Data is passed into each step condition function as a first argument.
       */
      data: {
        type: Object,
      },
      /**
       * Number of the current entered step.
       */
      current: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.data = {};
    this._internalCurrentSync = true; // necessary for preventing side effects on initialization
    this.current = 0;
  }

  static get styles() {
    return [
      css`
        :host {
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
    this._max = this.steps.length - 1;
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('current')) {
      this._onCurrentChanged(this.current, changedProps.get('current'));
    }
  }

  next() {
    this._goTo(this.current + 1, this.current);
  }

  previous() {
    this._goTo(this.current - 1, this.current);
  }

  get steps() {
    const defaultSlot = this.shadowRoot.querySelector('slot:not([name])');
    return defaultSlot.assignedNodes().filter(node => node.nodeType === Node.ELEMENT_NODE);
  }

  _goTo(newCurrent, oldCurrent) {
    if (newCurrent < 0 || newCurrent > this._max) {
      throw new Error(`There is no step at index ${newCurrent}.`);
    }

    const nextStep = this.steps[newCurrent];
    const back = newCurrent < oldCurrent;

    if (nextStep.passesCondition(this.data)) {
      if (back && nextStep.forwardOnly) {
        this._goTo(newCurrent - 1, oldCurrent);
      } else {
        this._changeStep(newCurrent, oldCurrent);
      }
    } else {
      nextStep.skip();
      if (back) {
        this._goTo(newCurrent - 1, oldCurrent);
      } else {
        this._goTo(newCurrent + 1, oldCurrent);
      }
    }
  }

  _changeStep(newCurrent, oldCurrent) {
    const oldStepElement = this.steps[oldCurrent];
    const newStepElement = this.steps[newCurrent];
    const fromStep = { number: oldCurrent, element: oldStepElement };
    const toStep = { number: newCurrent, element: newStepElement };

    oldStepElement.leave();
    newStepElement.enter();

    if (this.current !== newCurrent) {
      this._internalCurrentSync = true;
      this.current = newCurrent;
    }

    this._dispatchTransitionEvent(fromStep, toStep);
  }

  _dispatchTransitionEvent(fromStep, toStep) {
    this.dispatchEvent(
      new CustomEvent('transition', {
        bubbles: true,
        composed: true,
        detail: { fromStep, toStep },
      }),
    );
  }

  _onCurrentChanged(current, oldCurrent) {
    if (this._internalCurrentSync) {
      this._internalCurrentSync = false;
    } else {
      this._goTo(current, oldCurrent);
    }
  }
}
