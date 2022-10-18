import { css } from '@lion/core';

export const demoStyle = css`
  .demo-container {
    height: 400px;
    display: flex;
    flex-direction: row;
  }

  .demo-container > div {
    padding: 8px;
    background-color: #f6f8fa;
  }

  lion-drawer {
    height: 400px;
  }

  button {
    all: revert !important;
    border: 2px solid #000000;
    background-color: rgb(239, 239, 239);
  }

  .demo-container-top {
    height: 400px;
    display: flex;
    flex-direction: column;
  }

  .demo-container-top > div {
    padding: 8px;
    height: 100%;
    background-color: #f6f8fa;
  }

  .demo-container-top lion-drawer {
    height: auto;
    width: 100%;
  }

  .demo-container-right {
    height: 400px;
    display: flex;
    flex-direction: row-reverse;
  }

  .demo-container-right > div {
    padding: 8px;
    background-color: #f6f8fa;
  }

  .demo-container-right lion-drawer {
    height: 400px;
  }

  .demo-container-opened {
    height: 400px;
    display: flex;
    flex-direction: row;
  }

  .demo-container-opened > div {
    padding: 8px;
    background-color: #f6f8fa;
  }

  .demo-container-opened lion-drawer {
    height: 400px;
  }
`;
