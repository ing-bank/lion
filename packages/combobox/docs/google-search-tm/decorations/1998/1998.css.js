import { css } from 'lit-element';

export default css`
  /** @configure FormControlMixin */

  /* =======================
    block | .form-field
    ======================= */

  :host {
    font-family: 'Times New Roman', Times, serif;
  }

  .form-field__group-two {
    background: #eee;
    padding: 16px;
    padding-top: 0;
    text-align: center;
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
    max-width: 285px;
    margin: auto;
  }

  .input-group__container {
    position: relative;
    background: #fff;
    display: flex;
    border: 1px solid #666;
    box-shadow: none;
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
    background: white;
    border: 1px solid #666;
    box-sizing: border-box;
    margin-top: -1px;
  }

  * > ::slotted([slot='listbox']) {
    margin-bottom: 8px;
    background: none;
  }

  /** @enhance LionCombobox */

  /* =============================
    block | .google-search-btns
    ============================ */

  .google-search-btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .google-search-btns__input-button {
    margin-right: 4px;
  }

  /* ===============================
    block | .google-search-report
    ============================== */

  .google-search-report {
    display: none;
  }
`;
