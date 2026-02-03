import { css } from 'lit';

export const buttonStyle = css`
  :host {
    position: relative;
    display: inline-flex;
    box-sizing: border-box;
    vertical-align: middle;
    line-height: 24px;
    background-color: #eee; /* minimal styling to make it recognizable as btn */
    padding: 8px; /* padding to fix with min-height */
    outline: none; /* focus style handled below */
    cursor: default; /* we should always see the default arrow, never a caret */
    /* TODO: remove, native button also allows selection. Could be usability concern... */
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  :host::before {
    content: '';

    /* center vertically and horizontally */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* Minimum click area to meet [WCAG Success Criterion 2.5.5 Target Size (Enhanced)](https://www.w3.org/TR/WCAG22/#target-size-enhanced) */
    min-height: 44px;
    min-width: 44px;
    width: 100%;
    height: 100%;
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Show focus styles on keyboard focus. */
  :host(:focus:not([disabled])),
  :host(:focus-visible) {
    /* if you extend, please overwrite */
    outline: 2px solid #bde4ff;
  }

  /* Hide focus styles if they're not needed, for example,
        when an element receives focus via the mouse. */
  :host(:focus:not(:focus-visible)) {
    outline: 0;
  }

  :host(:hover) {
    /* if you extend, please overwrite */
    background: #f4f6f7;
  }

  :host(:active), /* keep native :active to render quickly where possible */
        :host([active]) /* use custom [active] to fix IE11 */ {
    /* if you extend, please overwrite */
    background: gray;
  }

  :host([hidden]) {
    display: none;
  }

  :host([disabled]) {
    pointer-events: none;
    /* if you extend, please overwrite */
    background: lightgray;
    color: #adadad;
    fill: #adadad;
  }
`;
