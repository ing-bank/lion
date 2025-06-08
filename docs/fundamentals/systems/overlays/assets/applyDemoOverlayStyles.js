/* eslint-disable import/no-extraneous-dependencies */
import { css } from 'lit';

const applyDemoOverlayStyles = () => {
  const demoOverlaysStyle = css`
    .demo-overlay {
      background-color: white;
      border: 1px solid black;
      padding: 10px;
    }

    .demo-overlay--blocking {
      background-color: lightgrey;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.setAttribute('data-demo-overlays', '');
  styleTag.textContent = demoOverlaysStyle.cssText;
  document.head.appendChild(styleTag);
};

applyDemoOverlayStyles();
