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

  .calendar__navigation {
    padding: 0 8px;
  }

  .calendar__navigation__month,
  .calendar__navigation__year {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .calendar__navigation-heading {
    margin: 0.5em 0;
  }

  .calendar__previous-button,
  .calendar__next-button {
    background-color: var(--bg-default, #fff);
    border: 0;
    padding: 0;
    min-width: 40px;
    min-height: 40px;
  }

  .calendar__previous-button:hover,
  .calendar__next-button:hover {
    background-color: var(--bg-hover, #fff);
  }

  .calendar__previous-button:active,
  .calendar__next-button:active {
    background-color: var(--bg-active, #ccc);
  }

  .calendar__previous-button:focus,
  .calendar__next-button:focus {
    outline: 3px solid var(--border-focus, blue);
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
    background-color: var(--bg-default, #fff);
    border: 0;
    color: var(--fg-default, black);
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
    outline: 3px solid var(--border-focus, blue);
  }

  .calendar__day-button__text {
    pointer-events: none;
  }

  .calendar__day-button[today] {
    text-decoration: underline;
  }

  .calendar__day-button[selected] {
    background: var(--bg-primary, #ccc);
  }

  .calendar__day-button[previous-month],
  .calendar__day-button[next-month] {
    color: var(--fg-secondary, rgb(115, 115, 115));
  }

  .calendar__day-button:hover {
    background: var(--bg-hover, blue);
  }

  .calendar__day-button:active {
    background: var(--bg-active, blue);
  }

  .calendar__day-button[aria-disabled='true'] {
    background-color: var(--bg-disabled, #fff);
    color: var(--fg-disabled, #eee);
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
`;
