import { html, css } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';

/**
 * `LionSteps` is a controller for a multi step system.
 *
 * @customElement
 */
export class LionSteps extends ObserverMixin(LionLitElement) {
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

  static get asyncObservers() {
    return {
      _onCurrentChanged: ['current'],
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
    this._max = this.children.length - 1;
  }

  next() {
    this._goTo(this.current + 1, this.current);
  }

  previous() {
    this._goTo(this.current - 1, this.current);
  }

  _goTo(newCurrent, oldCurrent) {
    if (newCurrent < 0 || newCurrent > this._max) {
      throw new Error(`There is no step at index ${newCurrent}.`);
    }

    const nextStep = this.children[newCurrent];
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
    const oldStepElement = this.children[oldCurrent];
    const newStepElement = this.children[newCurrent];
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

  _onCurrentChanged(newValues, oldValues) {
    if (this._internalCurrentSync) {
      this._internalCurrentSync = false;
    } else {
      this._goTo(newValues.current, oldValues.current);
    }
  }
}
