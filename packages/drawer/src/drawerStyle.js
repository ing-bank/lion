import { css } from '@lion/core';

export const drawerStyle = css`
  :host {
    display: block;
    --min-height: 50px;
    --max-height: 200px;
  }

  #container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: var(--min-height);
    min-height: var(--min-height);
    max-height: var(--max-height);
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #000000;
    border-radius: 0 0 16px 16px;
    padding: 16px 24px;
    background-color: #ffffff;
    transition: height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  @media screen and (min-width: 640px) {
    :host {
      height: 600px;
      --min-width: 72px;
      --max-width: 320px;
    }

    #container {
      height: 100%;
      width: var(--min-width);
      min-width: var(--min-width);
      max-width: var(--max-width);
      border-radius: 0 16px 16px 0;
      transition: width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    }
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
