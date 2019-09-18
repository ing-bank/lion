import { css } from '@lion/core';

export const globalOverlaysStyle = css`
  .global-overlays {
    position: fixed;
    z-index: 200;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
  }

  .global-overlays__overlay,
  .global-overlays__overlay--blocking {
    pointer-events: auto;
  }

  .global-overlays.global-overlays--blocking-opened .global-overlays__overlay {
    display: none;
  }

  .global-overlays.global-overlays--blocking-opened .global-overlays__backdrop {
    animation: global-overlays-backdrop-fade-out 300ms;
    opacity: 0;
  }

  .global-overlays .global-overlays__backdrop,
  .global-overlays .global-overlays__backdrop--blocking {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #333333;
    opacity: 0.3;
  }

  .global-overlays .global-overlays__backdrop--fade-in {
    animation: global-overlays-backdrop-fade-in 300ms;
  }

  .global-overlays .global-overlays__backdrop--fade-out {
    animation: global-overlays-backdrop-fade-out 300ms;
    opacity: 0;
  }

  .global-overlays.global-overlays--backdrop-fade-out {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #333333;
    opacity: 0;
    pointer-events: none;
    animation: global-overlays-backdrop-fade-out 300ms;
  }

  @keyframes global-overlays-backdrop-fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes global-overlays-backdrop-fade-out {
    from {
      opacity: 0.3;
    }
  }

  body > *[inert] {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    pointer-events: none;
  }

  body.global-overlays-scroll-lock {
    overflow: hidden;
  }

  body.global-overlays-scroll-lock-ios-fix {
    position: fixed;
    width: 100%;
  }
`;
