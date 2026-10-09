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

  .calendar__navigation-heading--interactive {
    cursor: pointer;
    background: none;
    border: 0;
    padding: 0;
    font: inherit;
    display: inline-flex;
    align-items: center;
  }

  .calendar__navigation-heading--interactive:focus {
    outline: 2px solid blue;
    outline-offset: 2px;
  }

  .calendar__heading-indicator {
    pointer-events: none;
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

  /* Essential layout for selection views */
  .calendar__month-selection {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .calendar__year-selection {
    display: block;
  }

  .calendar__year-selection-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .calendar__year-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .calendar__month-button,
  .calendar__year-button,
  .calendar__year-range-prev,
  .calendar__year-range-next {
    background-color: #fff;
    border: 0;
    color: black;
    padding: 0;
    min-width: 40px;
    min-height: 40px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-sizing: border-box;
  }

  .calendar__month-button:focus,
  .calendar__year-button:focus,
  .calendar__year-range-prev:focus,
  .calendar__year-range-next:focus {
    border: 1px solid blue;
    outline: 2px solid blue;
  }

  .calendar__month-button--current,
  .calendar__year-button--current {
    font-weight: bold;
    text-decoration: underline;
  }

  .calendar__month-button[aria-disabled='true'],
  .calendar__year-button[aria-disabled='true'],
  .calendar__year-range-prev:disabled,
  .calendar__year-range-next:disabled {
    background-color: #fff;
    color: #eee;
    cursor: not-allowed;
    outline: none;
  }
`;
