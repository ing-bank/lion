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

    grid-template-columns: 100%;
  }

  [data-part='header'] {
  }

  [data-part='header-items'] {
    display: flex;
    text-transform: capitalize;
  }

  [data-part='main'] {
    /* grid-area: main; */
    background: #f4f4f4;
    color: #161616;
    overflow-x: hidden;
    height: 100vh;
  }

  [data-part='footer'] {
    /* grid-area: footer; */
  }

  /** paddings page */

  @media (min-width: 99rem) {
    [data-part='container'] {
      max-width: 96.5rem;
      padding-left: 424px;
      padding-right: 0;
    }
  }

  @media (min-width: 66rem) {
    [data-part='container'] {
      padding-left: calc(25% + 1.5rem);
      padding-right: 2rem;
    }
  }

  [data-part='back-to-top-link'] {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding-top: 0;
  }
`;
