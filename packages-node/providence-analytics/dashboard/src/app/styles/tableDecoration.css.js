import { css } from 'lit-element';

// Decoration of white label component 'c-table', which is consumed by webcomponent 'p-table'

export const tableDecoration = css`
  :host {
    --sort-indicator-color: var(--primary-color);
    --header-bg-color: #333;
    --header-color: #fff;
  }

  .c-table__row {
    transition: 1s all;
  }

  .c-table__row:nth-child(2n) {
    background: #f7f7f7;
  }

  .c-table__sort-button {
    border: none;
    background: none;
    padding: 16px;
    font-size: 16px;
    color: var(--sort-color);
  }

  .c-table__sort-indicator {
    font-size: 12px;
    color: var(--sort-indicator-color);
  }

  .c-table__cell {
    padding: 16px;
  }

  .c-table[mobile] .c-table__cell {
    padding: 0;
  }

  .c-table[mobile] .c-table__cell__header,
  .c-table[mobile] .c-table__cell__text {
    padding: 16px;
  }
`;
