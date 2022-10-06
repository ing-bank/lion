import { css } from '@lion/core';

export const drawerStyle = css`
  :host {
    display: block;
    height: 100%;
    --min-width: 0px;
    --max-width: none;
    --min-height: 50px;
    --max-height: 200px;
    --start-width: 100%;
    --start-height: var(--min-height);
    --border-radius: 0 0 16px 16px;
    --transition-property: height;
  }

  @media screen and (min-width: 640px) {
    :host {
      --min-width: 72px;
      --max-width: 320px;
      --min-height: auto;
      --max-height: fit-content;
      --start-width: var(--min-width);
      --start-height: 100%;
      --border-radius: 0 16px 16px 0;
      --transition-property: width;
    }
  }

  #container {
    display: flex;
    flex-direction: column;
    width: var(--start-width);
    height: var(--start-height);
    min-width: var(--min-width);
    max-width: var(--max-width);
    min-height: var(--min-height);
    max-height: var(--max-height);
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #000000;
    border-radius: var(--border-radius);
    padding: 16px 24px;
    background-color: #ffffff;
    transition: var(--transition-property) 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  #headline-container {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    height: 16px;
  }

  #content-container {
    overflow: hidden;
    padding: 16px 0;
  }

  ::slotted([slot='headline']) {
    margin-left: 16px;
  }

  ::slotted([slot='content']) {
    width: var(--max-width);
  }
`;
