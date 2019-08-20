import { css } from '@lion/core';

export const globalOverlaysStyle = css`
  .global-overlays {
    position: fixed;
    z-index: 200;
  }

  .global-overlays__overlay {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .global-overlays.global-overlays--blocking-opened .global-overlays__overlay {
    display: none;
  }

  .global-overlays .global-overlays__backdrop::before {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background-color: #333333;
    opacity: 0.3;
  }

  .global-overlays .global-overlays__backdrop--fade-in::before {
    animation: global-overlays-backdrop-fade-in 300ms;
  }

  .global-overlays.global-overlays--backdrop-fade-out::before {
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
