import { css } from 'lit';

export default css`
  /* Improve Page speed */
  /* https://css-tricks.com/almanac/properties/c/content-visibility/ */
  img {
    content-visibility: auto;
  }

  [data-part='root'] {
    height: 100vh;
    display: grid;
    /* https://web.dev/articles/one-line-layouts#04_pancake_stack_grid-template-rows_auto_1fr_auto */
    grid-template-rows: auto 1fr auto;
  }

  [data-part='header'] {
    /* grid-area: nav; */
  }

  [data-part='main'] {
    /* grid-area: main; */
  }

  [data-part='footer'] {
    /* grid-area: footer; */
  }

  [data-part='container'] {
    padding: var(--size-6);
  }
`;
