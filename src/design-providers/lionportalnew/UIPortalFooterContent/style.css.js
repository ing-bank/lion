import { css } from 'lit';

export default css`
  ul,
  ol,
  li {
    all: unset;
  }

  [data-part='root'] {
    --_subtle-border-color: #ccc;
    padding: 96px;
    margin-top: 96px;
    border-top: 1px solid var(--_subtle-border-color);
  }

  a {
    color: black;
    font-weight: 200;
  }
`;
