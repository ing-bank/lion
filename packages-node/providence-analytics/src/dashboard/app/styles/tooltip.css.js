// eslint-disable-next-line import/no-extraneous-dependencies
import { css } from 'lit';

export const tooltip = css`
  .c-tooltip {
    position: relative;
    cursor: pointer;
    padding: 8px 0;
  }

  .c-tooltip::after {
    background-color: #eee;
    border-radius: 10px;
    color: black;
    display: none;
    padding: 10px 15px;
    position: absolute;
    text-align: center;
    z-index: 999;
  }

  .c-tooltip::before {
    background-color: #333;
    content: ' ';
    display: none;
    position: absolute;
    width: 15px;
    height: 15px;
    z-index: 999;
  }

  .c-tooltip:hover::after {
    display: block;
  }

  .c-tooltip:hover::before {
    display: block;
  }

  .c-tooltip.c-tooltip--top::after {
    content: attr(data-tooltip);
    top: 0;
    left: 50%;
    transform: translate(-50%, calc(-100% - 10px));
  }

  .c-tooltip.c-tooltip--top::before {
    top: 0;
    left: 50%;
    transform: translate(-50%, calc(-100% - 5px)) rotate(45deg);
  }

  .c-tooltip.c-tooltip--bottom::after {
    content: attr(data-tooltip);
    bottom: 0;
    left: 50%;
    transform: translate(-50%, calc(100% + 10px));
  }

  .c-tooltip.c-tooltip--bottom::before {
    bottom: 0;
    left: 50%;
    transform: translate(-50%, calc(100% + 5px)) rotate(45deg);
  }

  .c-tooltip.c-tooltip--right::after {
    content: attr(data-tooltip);
    top: 0;
    right: 0;
    transform: translateX(calc(100% + 10px));
  }

  .c-tooltip.c-tooltip--right::before {
    top: 50%;
    right: 0;
    transform: translate(calc(100% + 5px), -50%) rotate(45deg);
  }

  .c-tooltip.c-tooltip--left::after {
    content: attr(data-tooltip);
    top: 0;
    left: 0;
    transform: translateX(calc(-100% - 10px));
  }

  .c-tooltip.c-tooltip--left::before {
    top: 50%;
    left: 0;
    transform: translate(calc(-100% - 5px), -50%) rotate(45deg);
  }
`;
