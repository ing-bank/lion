/* eslint-disable import/no-extraneous-dependencies */
import { css, html, LitElement, ScopedElementsMixin } from '@lion/core';
import { LionFieldset } from '@lion/fieldset';
import { LionInputRangeSimple } from './LionInputRangeSimple';

/**
 * LionInputRangeGroup: extension of lion-input-range.
 *
 * @customElement `lion-input-range-group`
 */
export class LionInputRangeGroup extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-fieldset': LionFieldset,
      'lion-input-range': LionInputRangeSimple,
    };
  }

  static get styles() {
    return css`
      .input-range-wrapper {
          --low-perc: 0%;
          --high-perc: 0%;
          display: grid;
          grid-template-rows: max-content 1em;
          overflow: hidden;
          position: relative;
          margin: 1em auto;
          width: 20em;
          background: linear-gradient(90deg, #ccc var(--low-perc), #3ff var(--low-perc), #3ff var(--high-perc), #ccc var(--high-perc));
      }

      lion-input-range {
          grid-column: 1;
          grid-row: 2;
          pointer-events: none;
      }

      input[type=range] {
          margin: 0;
          background: none;
          /* get rid of white Chrome background */
          color: #000;
          font: inherit;
          /* fix too small font-size in both Chrome & Firefox */
      }

      input[type=range]::-webkit-slider-runnable-track, input[type=range]::-webkit-slider-thumb, input[type=range] {
          -webkit-appearance: none;
      }

      input[type=range]::-webkit-slider-runnable-track {
          width: 100%;
          height: 100%;
          background: none;
      }

      input[type=range]::-moz-range-track {
          width: 100%;
          height: 100%;
          background: none;
      }

      input[type=range]::-webkit-slider-thumb {
          border: none;
          /* get rid of Firefox thumb border */
          width: 1em;
          height: 1em;
          border-radius: 50%;
          /* get rid of Firefox corner rounding */
          background: currentcolor;
          pointer-events: auto;
      }

      input[type=range]::-moz-range-thumb {
          border: none;
          /* get rid of Firefox thumb border */
          width: 1em;
          height: 1em;
          border-radius: 50%;
          /* get rid of Firefox corner rounding */
          background: currentcolor;
          pointer-events: auto;
      }
    `;
  }

  get _track() {
    return this.shadowRoot.querySelector('.input-range-wrapper');
  }

  _onLowSliderChange(e) {
    let perc = (e.detail.formPath[0].modelValue / 100) * 100;
    this._track.style.setProperty('--low-perc', `${perc}%`);
  }

  _onHighSliderChange(e) {
    let perc = (e.detail.formPath[0].modelValue / 100) * 100;
    this._track.style.setProperty('--high-perc', `${perc}%`);
  }


  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <lion-fieldset name='inputRangeGroup' label='Input Range'>
        <div class='input-range-wrapper'>
          <lion-input-range
            class='input-range input-range-low'
            name='low'
            min='0'
            max='100'
            .modelValue='${50}'
            unit='%'
            no-min-max-labels
            @model-value-changed='${this._onLowSliderChange}'
          ></lion-input-range>

          <lion-input-range
            class='input-range input-range-high'
            name='high'
            min='0'
            max='100'
            .modelValue='${50}'
            unit='%'
            no-min-max-labels
            @model-value-changed='${this._onHighSliderChange}'
          ></lion-input-range>
        </div>
        <button @click='${ev => console.log(ev.target.parentNode.modelValue)}'>
          Log to Action Logger
        </button>
      </lion-fieldset>
    `;
  }
}
