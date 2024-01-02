import { css } from 'lit';

export default css`
  /* Improve Page speed */
  /* https://css-tricks.com/almanac/properties/c/content-visibility/ */
  img {
    content-visibility: auto;
  }

  .ui-portal-grid {
    height: 100vh;
    display: grid;
    /* https://web.dev/articles/one-line-layouts#04_pancake_stack_grid-template-rows_auto_1fr_auto */
    grid-template-rows: auto 1fr auto;
  }

  .ui-portal-grid__nav {
    /* grid-area: nav; */
  }

  .ui-portal-grid__main {
    /* grid-area: main; */
  }

  .ui-portal-grid__footer {
    /* grid-area: footer; */
  }

  .ui-portal-container {
    padding: var(--size-6);
  }

  /* .ui-portal-collection {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  }
  .ui-portal-card {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0.5rem;
  } */
`;
