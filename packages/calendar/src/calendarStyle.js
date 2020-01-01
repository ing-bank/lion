import { css } from '@lion/core';

export const calendarStyle = css`
  :host {
    display: block;
  }

  button[title='Unavailable']:focus:after {
    content: attr(title);
    background-color: black;
    color: white;
    padding: 5px;
    margin-top: 1.3em;
    position: absolute;
    max-width: 200px;
  }

  .calendar {
    display: block;
  }

  .calendar__header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #adadad;
    padding: 0 8px;
  }

  .calendar__month-heading {
    margin: 0.5em 0;
  }

  .calendar__previous-month-button,
  .calendar__next-month-button {
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

  .calendar__day-button[aria-disabled] {
    background-color: #fff;
    color: #eee;
  }
`;
