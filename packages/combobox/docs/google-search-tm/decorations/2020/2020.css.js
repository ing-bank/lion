import { css } from 'lit-element';

export default css`
  /** @configure FormControlMixin */

  /* =======================
    block | .form-field
    ======================= */

  :host {
    font-family: arial, sans-serif;
  }

  .form-field__label {
    margin-top: 36px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;
  }

  /* ==============================
    element | .input-group
    ============================== */

  .input-group {
    margin-bottom: 16px;
    max-width: 582px;
    margin: auto;
  }

  .input-group__container {
    position: relative;
    background: #fff;
    display: flex;
    border: 1px solid #dfe1e5;
    box-shadow: none;
    border-radius: 24px;
    height: 44px;
  }

  .input-group__container:hover,
  :host([opened]) .input-group__container {
    border-color: rgba(223, 225, 229, 0);
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  }

  :host([opened]) .input-group__container {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  :host([opened]) .input-group__container::before {
    content: '';
    position: absolute;
    background: white;
    left: 0;
    right: 0;
    height: 10px;
    bottom: -10px;
  }

  :host([opened]) .input-group__container::after {
    content: '';
    position: absolute;
    background: #eee;
    left: 16px;
    right: 16px;
    height: 1px;
    bottom: 0;
    z-index: 3;
  }

  .input-group__prefix,
  .input-group__suffix {
    display: block;
    fill: var(--icon-color);
    display: flex;
    place-items: center;
  }

  .input-group__input {
    flex: 1;
  }

  .input-group__input ::slotted([slot='input']) {
    border: transparent;
    width: 100%;
  }

  /** @configure LionCombobox */

  /* =======================
    block | .form-field
    ======================= */

  #overlay-content-node-wrapper {
    box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
    border-radius: 0 0 24px 24px;
    margin-top: -2px;
    padding-top: 6px;
    background: white;
  }

  * > ::slotted([slot='listbox']) {
    margin-bottom: 8px;
    background: none;
  }

  :host {
    --icon-color: #9aa0a6;
  }

  /** @enhance LionCombobox */

  /* ===================================
    block | .google-search-clear-btn
  =================================== */

  .google-search-clear-btn {
    position: relative;
    height: 100%;
    align-items: center;
    display: none;
  }

  .google-search-clear-btn::after {
    border-left: 1px solid #dfe1e5;
    height: 65%;
    right: 0;
    content: '';
    margin-right: 10px;
    margin-left: 8px;
  }

  :host([filled]) .google-search-clear-btn {
    display: flex;
  }

  * > ::slotted([slot='suffix']),
  * > ::slotted([slot='clear-btn']) {
    font: inherit;
    margin: 0;
    border: 0;
    outline: 0;
    padding: 0;
    color: inherit;
    background-color: transparent;
    text-align: left;
    white-space: normal;
    overflow: visible;

    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-tap-highlight-color: transparent;

    width: 25px;
    height: 25px;
    cursor: pointer;
  }

  * > ::slotted([slot='suffix']) {
    margin-right: 20px;
  }

  * > ::slotted([slot='prefix']) {
    height: 20px;
    width: 20px;
    margin-left: 12px;
    margin-right: 16px;
  }

  /* =============================
    block | .google-search-btns
    ============================ */

  .google-search-btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .google-search-btns__input-button {
    background-image: -webkit-linear-gradient(top, #f8f9fa, #f8f9fa);
    background-color: #f8f9fa;
    border: 1px solid #f8f9fa;
    border-radius: 4px;
    color: #3c4043;
    font-family: arial, sans-serif;
    font-size: 14px;
    margin: 11px 4px;
    padding: 0 16px;
    line-height: 27px;
    height: 36px;
    min-width: 54px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }

  .google-search-btns__input-button:hover {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    background-image: -webkit-linear-gradient(top, #f8f8f8, #f1f1f1);
    background-color: #f8f8f8;
    border: 1px solid #c6c6c6;
    color: #222;
  }

  .google-search-btns__input-button:focus {
    border: 1px solid #4d90fe;
    outline: none;
  }

  /* ===============================
    block | .google-search-report
    ============================== */

  .google-search-report {
    display: flex;
    align-content: right;
    color: #70757a;
    font-style: italic;
    font-size: 8pt;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    margin-bottom: 8px;
    justify-content: flex-end;
    margin-right: 20px;
  }

  .google-search-report a {
    color: inherit;
  }
`;
