import { css } from 'lit';

export const globalOverlaysStyle = css`
  .global-overlays {
    position: fixed;
    z-index: 200;
  }

  .global-overlays__overlay {
    pointer-events: auto;
  }

  .global-overlays__overlay-container {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .global-overlays__overlay-container--top-left {
    justify-content: flex-start;
    align-items: flex-start;
  }

  .global-overlays__overlay-container--top {
    justify-content: center;
    align-items: flex-start;
  }

  .global-overlays__overlay-container--top-right {
    justify-content: flex-end;
    align-items: flex-start;
  }

  .global-overlays__overlay-container--right {
    justify-content: flex-end;
    align-items: center;
  }

  .global-overlays__overlay-container--bottom-left {
    justify-content: flex-start;
    align-items: flex-end;
  }

  .global-overlays__overlay-container--bottom {
    justify-content: center;
    align-items: flex-end;
  }

  .global-overlays__overlay-container--bottom-right {
    justify-content: flex-end;
    align-items: flex-end;
  }
  .global-overlays__overlay-container--left {
    justify-content: flex-start;
    align-items: center;
  }

  .global-overlays__overlay-container--center {
    justify-content: center;
    align-items: center;
  }

  .global-overlays__overlay--bottom-sheet {
    width: 100%;
  }

  .global-overlays .global-overlays__backdrop {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #333333;
    filter: opacity(30%);
    display: none;
  }

  .global-overlays .global-overlays__backdrop--visible {
    display: block;
  }

  .global-overlays .global-overlays__backdrop--animation-in {
    animation: global-overlays-backdrop-fade-in 300ms;
  }

  .global-overlays .global-overlays__backdrop--animation-out {
    animation: global-overlays-backdrop-fade-out 300ms;
    opacity: 0;
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

  html.global-overlays-scroll-lock-ios-fix {
    height: 100vh;
  }
`;
