import { css } from '@lion/core';

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
`;
