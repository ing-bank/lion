import { css } from 'lit';

export default css`
  [data-part='root'] {
    display: grid;
    /* https://web.dev/articles/one-line-layouts#04_pancake_stack_grid-template-rows_auto_1fr_auto */
    grid-template-areas: 'nav main-and-footer-wrapper';
    grid-template-columns: max-content;
    scroll-behavior: smooth;
  }

  [data-part='header'] {
    grid-area: nav;
  }

  [data-part='main-and-footer-wrapper'] {
    grid-area: main-and-footer-wrapper;
  }

  [data-part='main-wrapper'] {
    display: flex;
    flex-direction: row-reverse;
    overflow-x: clip; /* do not change to hidden, bc it breaks position sticky inside */
  }

  [data-part='main'] {
    width: 100%;
  }

  [data-part='aside'] {
    grid-area: aside;
  }

  [data-part='footer'] {
    grid-area: footer;
  }

  [data-part='container'] {
    padding-left: 96px;
  }
`;
