import { css } from '@lion/core';

const applyDemoCollapsibleStyles = () => {
  const demoCollapsibleStyles = css`
    .demo-custom-collapsible-container {
      padding: 16px;
      margin: 16px;
      border-radius: 4px;
      width: 400px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }

    .demo-custom-collapsible-body {
      padding: 12px 0px;
    }

    .demo-custom-collapsible-invoker {
      border-width: 0;
      border-radius: 2px;
      padding: 12px 24px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
      font-weight: bold;
      color: #3f51b5;
    }

    .demo-custom-collapsible-state-container {
      padding: 12px 0;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.setAttribute('data-demo-collapsible', '');
  styleTag.textContent = demoCollapsibleStyles.cssText;
  document.head.appendChild(styleTag);
};

applyDemoCollapsibleStyles();
