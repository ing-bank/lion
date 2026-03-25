import{a as o}from"./lit-element.jD9bOQKo.js";import"./lit-html.DtZEZPQ5.js";const i=o`
  * {
    box-sizing: border-box;
  }

  *:focus,
  *:focus-visible {
    outline: none;
    /* background-color: var(--_color-focus); */
  }

  *:focus-visible::after {
    content: '';
    position: absolute;
    inset: -0.25rem;
    outline-color: var(--highlight-color);
    outline-style: dotted;
    outline-width: var(--border-width-lg);
    outline-offset: 2px;
  }

  button {
    all: unset;
    outline: revert;
  }

  a,
  button,
  [tabindex] {
    cursor: pointer;
    position: relative;
  }

  [tabindex='-1'] {
    cursor: default;
  }
`,s=o`
  /**
   * Apply this to an element that should be visually hidden but accessible to assistive technology. 
   * See https://www.scottohara.me/blog/2023/03/21/visually-hidden-hack.html
   * Note that since the visibility state should be animatable, it's advised to use javascript to toggle this attribute (on focus or on other triggers).
   */
  [data-visually-hidden],
  [data-visually-hidden-focusable]:not(:focus) {
    /* Although most libraries use 'position: absolute', this can cause render issues on browsers when this class is toggled on and off. */
    position: fixed;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;

    /** No need to slow down renders during browser layout/paint phase */
    contain: strict;
  }

  /**
   * When a visibility toggle is configured as popover, we need to make sure the content of a closed popover is
   * available to assistive technology.
   */
  [data-visually-hidden][popover]:not(:popover-open),
  [data-visually-hidden-focusable][popover]:not(:popover-open) {
    display: block;
  }

  /**
   * 
   */
  [hidden],
  :host([hidden]) {
    display: none !important;
  }
`,a=o`
  body[data-scroll-lock] {
    overflow: hidden;
  }

  body[data-scroll-lock-ios-fix] {
    position: fixed;
    width: 100%;
  }

  html[data-scroll-lock-ios-fix] {
    height: 100vh;
  }
`,l=o`
  [popover] {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;export{a,l as r,i as s,s as v};
