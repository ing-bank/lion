import { css } from '@lion/core';

export const localOverlaysStyle = css`
  .local-overlays__backdrop {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #333333;
    opacity: 0.3;
    display: none;
  }

  .local-overlays__backdrop--visible {
    display: block;
  }

  .local-overlays__backdrop--fade-in {
    animation: local-overlays-backdrop-fade-in 300ms;
  }

  .local-overlays__backdrop--fade-out {
    animation: local-overlays-backdrop-fade-out 300ms;
    opacity: 0;
  }

  @keyframes local-overlays-backdrop-fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes local-overlays-backdrop-fade-out {
    from {
      opacity: 0.3;
    }
  }
`;
