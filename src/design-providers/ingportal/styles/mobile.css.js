import { css } from 'lit';

export default css`
  /**
   * Hide until hydration on mobile (to prevent flash of unstyled content of desktop render)
   */
  :host(:not([data-layout])) {
    display: none;
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    @starting-style {
      translate: var(--_width) 0;
    }
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    translate: 0 0;
  }

  :host(:not([data-prevent-animations])) [popover] {
    transition: translate calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
      overlay calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete,
      display calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete;
    translate: calc(-1 * var(--_width)) 0;
  }

  [data-level='1'][popover]::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  /* ----------------------------
   * part: root
   */

  @media (prefers-reduced-motion) {
    :host {
      --_anim-factor: 0;
    }
  }

  :host {
    --_width: 400px;
    --_bg-color: white;
    --_anim-factor: 1;
    --_anim-speed: 0.25s;
  }

  /* ----------------------------
   * part: nav
   */

  [data-part='nav'] {
    height: 100%;
  }

  /* ----------------------------
   * part: l1-wrapper
   */

  [data-part='level'][data-level='0'] {
    position: fixed;
    background: var(--_bg-color);
  }

  [data-part='l1-invoker'] {
    padding: var(--size-2);
  }

  [data-part='level'][data-level='1'] {
    height: 100%;
    width: var(--_width);
    position: fixed;
  }

  [data-part='level']:not([data-level='0']) {
    left: 0;
    top: 0;
    /* position: fixed; */
    background-color: var(--_bg-color);
    width: var(--_width);
    height: 100%;
  }

  [data-part='list'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  [data-part='listitem'] {
    display: block;
    padding: var(--size-6);
  }

  [data-part='anchor'],
  [data-part='invoker-for-level'],
  [data-part='level-back-btn'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: inherit;
    text-decoration: inherit;
    font-size: 0.875rem;
    fill: #666666;
    gap: var(--size-2);
  }

  [data-part='anchor']:hover,
  [data-part='invoker-for-level']:hover,
  [data-part='level-back-btn']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }

  [data-part='level-back-btn'] {
    display: flex;
    padding: var(--size-6);
    font-size: 0.875rem;
    width: 100%;
  }

  [data-part='icon'] {
    display: block;
    width: var(--size-5);
    height: var(--size-5);
  }
`;
