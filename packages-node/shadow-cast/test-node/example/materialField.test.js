const fs = require('fs');
const path = require('path');

const { transformHtmlAndCss } = require('../../src/transform-html-and-css.js');
const { formatCss } = require('../../src/tools/formatting-utils.js');
const { getBemSelectorParts } = require('../../src/tools/bem/get-bem-selector-parts.js');
const {
  bemAdditionalHostMatcher,
  bemCreateCompoundFromStatePart,
} = require('../../src/tools/bem/bem-helpers.js');

describe('mdc-text-field', () => {
  it('works', async () => {
    const cssPath = path.resolve(
      __dirname,
      '../../examples/material-components-web/mdc.textfield.css',
    );
    const mdcTextField = fs.readFileSync(cssPath, 'utf8');
    // const mdcTextField = `
    //   .mdc-text-field--filled {
    //     --mdc-ripple-fg-size: 0;
    //     --mdc-ripple-left: 0;
    //     --mdc-ripple-top: 0;
    //     --mdc-ripple-fg-scale: 1;
    //     --mdc-ripple-fg-translate-end: 0;
    //     --mdc-ripple-fg-translate-start: 0;
    //     -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    //     will-change: transform, opacity;
    //   }
    //   .mdc-text-field--filled .mdc-text-field__ripple::before,
    //   .mdc-text-field--filled .mdc-text-field__ripple::after {
    //     position: absolute;
    //     border-radius: 50%;
    //     opacity: 0;
    //     pointer-events: none;
    //     content: "";
    //   }
    //   .mdc-text-field--filled .mdc-text-field__ripple::before {
    //     transition: opacity 15ms linear, background-color 15ms linear;
    //     z-index: 1;
    //     /* @alternate */
    //     z-index: var(--mdc-ripple-z-index, 1);
    //   }
    //   .mdc-text-field--filled .mdc-text-field__ripple::after {
    //     z-index: 0;
    //     /* @alternate */
    //     z-index: var(--mdc-ripple-z-index, 0);
    //   }
    //   .mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before {
    //     -webkit-transform: scale(var(--mdc-ripple-fg-scale, 1));
    //             transform: scale(var(--mdc-ripple-fg-scale, 1));
    //   }
    //   .mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after {
    //     top: 0;
    //     /* @noflip */
    //     left: 0;
    //     -webkit-transform: scale(0);
    //             transform: scale(0);
    //     -webkit-transform-origin: center center;
    //             transform-origin: center center;
    //   }
    //   .mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after {
    //     top: var(--mdc-ripple-top, 0);
    //     /* @noflip */
    //     left: var(--mdc-ripple-left, 0);
    //   }
    //   .mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after {
    //     -webkit-animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;
    //             animation: mdc-ripple-fg-radius-in 225ms forwards, mdc-ripple-fg-opacity-in 75ms forwards;
    //   }
    //   .mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after {
    //     -webkit-animation: mdc-ripple-fg-opacity-out 150ms;
    //             animation: mdc-ripple-fg-opacity-out 150ms;
    //     -webkit-transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
    //             transform: translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1));
    //   }
    //   .mdc-text-field--filled .mdc-text-field__ripple::before,
    //   .mdc-text-field--filled .mdc-text-field__ripple::after {
    //     top: calc(50% - 100%);
    //     /* @noflip */
    //     left: calc(50% - 100%);
    //     width: 200%;
    //     height: 200%;
    //   }
    //   .mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after {
    //     width: var(--mdc-ripple-fg-size, 100%);
    //     height: var(--mdc-ripple-fg-size, 100%);
    //   }

    //   .mdc-text-field__ripple {
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     pointer-events: none;
    //   }

    //   .mdc-text-field {
    //     border-top-left-radius: 4px;
    //     /* @alternate */
    //     border-top-left-radius: var(--mdc-shape-small, 4px);
    //     border-top-right-radius: 4px;
    //     /* @alternate */
    //     border-top-right-radius: var(--mdc-shape-small, 4px);
    //     border-bottom-right-radius: 0;
    //     border-bottom-left-radius: 0;
    //     display: inline-flex;
    //     align-items: baseline;
    //     padding: 0 16px;
    //     position: relative;
    //     box-sizing: border-box;
    //     overflow: hidden;
    //     /* @alternate */
    //     will-change: opacity, transform, color;
    //   }
    //   .mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label {
    //     color: rgba(0, 0, 0, 0.6);
    //   }
    //   .mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input {
    //     color: rgba(0, 0, 0, 0.87);
    //   }
    // `;

    const hostStates = [
      '[outlined]:.mdc-text-field--outlined',
      '[disabled]:.mdc-text-field--disabled',
      '[invalid]:.mdc-text-field--invalid',
      '[focused]:.mdc-text-field--focused',
      '[filled]:.mdc-text-field--filled',

      '[with-leading-icon]:.mdc-text-field--with-leading-icon',
      '[with-trailing-icon]:.mdc-text-field--with-trailing-icon',
      '[float-above]:.mdc-text-field--float-above',
      // '[notched-outline-upgraded]:.mdc-notched-outline--upgraded',

      '[no-label]:.mdc-text-field--no-label',
      '[label-floating]:.mdc-text-field--label-floating',
      '[end-aligned]:.mdc-text-field--end-aligned',
      '[textarea]:.mdc-text-field--textarea',
      '[with-internal-counter]:.mdc-text-field--with-internal-counter',
      '[ltr-text]:.mdc-text-field--ltr-text',
    ];

    const annotatedHtml = `
      <div class="mdc-text-field" :host:=".mdc-text-field" :states:="${hostStates.join(',')}">
        <span class="mdc-notched-outline">
          <span class="mdc-notched-outline__leading"></span>
          <span class="mdc-notched-outline__notch">
            <label class="mdc-floating-label" :slot:="label:.mdc-floating-label"></label>
          </span>
          <span class="mdc-notched-outline__trailing"></span>
        </span>
        <input type="text" class="mdc-text-field__input" :slot:="input:.mdc-text-field__input" />
      </div>`;
    const result = transformHtmlAndCss(annotatedHtml, {
      cssSources: [mdcTextField],
      settings: {
        getCategorizedSelectorParts: getBemSelectorParts,
        additionalHostMatcher: bemAdditionalHostMatcher,
        createCompoundFromStatePart: bemCreateCompoundFromStatePart,
      },
    });
    console.log('result\n\n', formatCss(result.shadowCss));
  });
});
