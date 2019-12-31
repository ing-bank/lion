import { css } from '@lion/core';

const applyDemoOverlayStyles = () => {
  const demoOverlaysStyle = css`
    .demo-overlay {
      background-color: lightgrey;
      padding: 10px;
    }

    .demo-overlay--second {
      background-color: pink;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.setAttribute('data-demo-global-overlays', '');
  styleTag.textContent = demoOverlaysStyle.cssText;
  document.head.appendChild(styleTag);
};

applyDemoOverlayStyles();
