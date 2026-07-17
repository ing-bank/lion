import { css } from 'lit';

export const calendarStyle = css`
  :host {
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  .calendar {
    display: block;
  }

  /* Hide day grid when month/year selection view is active */
  .calendar--selection-active #js-content-wrapper {
    display: none;
  }

  .calendar__navigation {
    padding: 0 8px;
  }

  .calendar__navigation__month,
  .calendar__navigation__year {
    display: flex;
  }

  .calendar__navigation-heading {
    margin: 0.5em 0;
  }

  .calendar__previous-button,
  .calendar__next-button {
    background-color: #fff;
    border: 0;
    padding: 0;
    min-width: 40px;
    min-height: 40px;
  }

  .calendar__grid {
    width: 100%;
    padding: 8px 8px;
  }

  .calendar__weekday-header {
  }

  .calendar__day-cell {
    text-align: center;
  }

  .calendar__day-button {
    background-color: #fff;
    border: 0;
    color: black;
    padding: 0;
    min-width: 40px;
    min-height: 40px;
    /** give div[role=button][aria-disabled] same display type as native btn */
    display: inline-flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .calendar__day-button:focus {
    border: 1px solid blue;
    outline: none;
  }

  .calendar__day-button__text {
    pointer-events: none;
  }

  .calendar__day-button[today] {
    text-decoration: underline;
  }

  .calendar__day-button[selected] {
    background: #ccc;
  }

  .calendar__day-button[previous-month],
  .calendar__day-button[next-month] {
    color: rgb(115, 115, 115);
  }

  .calendar__day-button:hover {
    border: 1px solid green;
  }

  .calendar__day-button[aria-disabled='true'] {
    background-color: #fff;
    color: #eee;
    outline: none;
  }

  .u-sr-only {
    position: absolute;
    top: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(100%);
    clip: rect(1px, 1px, 1px, 1px);
    white-space: nowrap;
    border: 0;
    margin: 0;
    padding: 0;
  }

  .calendar__navigation-heading--interactive {
    cursor: pointer;
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 0.25em 0.5em;
    font-size: inherit;
    font-weight: inherit;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: background-color 0.15s ease;
  }

  .calendar__navigation-heading--interactive:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  /* WCAG 1.4.11: focus ring min 3:1 contrast ratio, min 2px width */
  .calendar__navigation-heading--interactive:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  /* Hide default focus outline for mouse users (keep for keyboard) */
  .calendar__navigation-heading--interactive:focus:not(:focus-visible) {
    outline: none;
  }

  .calendar__navigation-heading--interactive:focus-visible {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  .calendar__heading-indicator {
    font-size: 0.75em;
    display: inline-block;
    transition: transform 0.2s ease;
    pointer-events: none;
  }

  .calendar__navigation-heading--interactive[aria-expanded='true'] .calendar__heading-indicator {
    transform: rotate(180deg);
  }

  /* =============================================
   * Month Selection View — 3×4 Grid
   * WCAG 2.5.5: min 44×44px touch targets
   * ============================================= */

  .calendar__month-selection {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 16px 8px;
    animation: calendarFadeIn 0.15s ease;
  }

  /* =============================================
   * Year Selection View
   * ============================================= */

  .calendar__year-selection {
    padding: 8px;
    animation: calendarFadeIn 0.15s ease;
  }

  .calendar__year-selection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 12px;
  }

  .calendar__year-range-label {
    font-weight: 500;
    font-size: 0.95em;
  }

  /* Year Grid — 4×3 */
  .calendar__year-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  /* Year range navigation buttons */
  .calendar__year-range-prev,
  .calendar__year-range-next {
    min-width: 44px;
    min-height: 44px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;
  }

  .calendar__year-range-prev:hover:not(:disabled),
  .calendar__year-range-next:hover:not(:disabled) {
    background-color: #f0f0f0;
    border-color: #bbb;
  }

  .calendar__year-range-prev:focus,
  .calendar__year-range-next:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  .calendar__year-range-prev:focus:not(:focus-visible),
  .calendar__year-range-next:focus:not(:focus-visible) {
    outline: none;
  }

  .calendar__year-range-prev:focus-visible,
  .calendar__year-range-next:focus-visible {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  .calendar__year-range-prev:disabled,
  .calendar__year-range-next:disabled {
    color: #aaa;
    cursor: not-allowed;
    background-color: #f9f9f9;
  }

  /* =============================================
   * Month and Year Selection Buttons
   * WCAG 2.5.5: min 44×44px touch targets
   * WCAG 1.4.11: focus ring 3:1 contrast
   * ============================================= */

  .calendar__month-button,
  .calendar__year-button {
    min-width: 44px;
    min-height: 44px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease;
  }

  .calendar__month-button:hover:not([aria-disabled='true']),
  .calendar__year-button:hover:not([aria-disabled='true']) {
    background-color: #f0f0f0;
    border-color: #bbb;
  }

  /* WCAG 1.4.11: focus ring min 3:1 contrast, 2px width */
  .calendar__month-button:focus,
  .calendar__year-button:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  .calendar__month-button:focus:not(:focus-visible),
  .calendar__year-button:focus:not(:focus-visible) {
    outline: none;
  }

  .calendar__month-button:focus-visible,
  .calendar__year-button:focus-visible {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  /* Highlight current month/year */
  .calendar__month-button--current,
  .calendar__year-button--current {
    background-color: #e3f2fd;
    border-color: #005fcc;
    font-weight: bold;
  }

  /* Disabled state — WCAG 1.4.3: sufficient contrast with background */
  .calendar__month-button[aria-disabled='true'],
  .calendar__year-button[aria-disabled='true'] {
    color: #767676;
    background-color: #f5f5f5;
    border-color: #ddd;
    cursor: not-allowed;
  }

  /* =============================================
   * Fade-in animation
   * ============================================= */

  @keyframes calendarFadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* =============================================
   * Reduced Motion — WCAG 2.3.3 (AAA) / EAA
   * Disable or minimize all animations/transitions
   * ============================================= */

  @media (prefers-reduced-motion: reduce) {
    .calendar__month-selection,
    .calendar__year-selection {
      animation: none;
    }

    .calendar__navigation-heading--interactive,
    .calendar__month-button,
    .calendar__year-button,
    .calendar__year-range-prev,
    .calendar__year-range-next {
      transition: none;
    }

    .calendar__heading-indicator {
      transition: none;
    }
  }

  /* =============================================
   * Responsive — small viewports
   * WCAG 2.5.5: maintain 44×44px on small screens
   * ============================================= */

  @media (max-width: 320px) {
    .calendar__month-selection {
      gap: 4px;
      padding: 8px 4px;
    }

    .calendar__year-grid {
      gap: 4px;
    }

    .calendar__month-button,
    .calendar__year-button {
      font-size: 12px;
      min-width: 44px;
      min-height: 44px;
    }
  }
`;
