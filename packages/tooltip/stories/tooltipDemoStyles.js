import { css } from '@lion/core';

export const tooltipDemoStyles = css`
  .demo-tooltip-invoker {
    margin: 50px;
  }

  .demo-tooltip-content {
    display: block;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }

  .demo-box-placements {
    display: flex;
    flex-direction: column;
    margin: 40px 0 0 200px;
  }

  .demo-box-placements lion-tooltip {
    margin: 20px;
  }
`;
