/** script code **/
import { html, css } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-calendar.js';
/** stories code **/
export const selectedDate = () => html`
  <style>
    .demo-calendar {
      border: 1px solid #adadad;
      box-shadow: 0 0 16px #ccc;
      max-width: 500px;
    }
  </style>
  <lion-calendar class="demo-calendar" .selectedDate="${new Date(1988, 2, 5)}"></lion-calendar>
`;
export const centralDate = () => {
  const today = new Date();
  const centralDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .centralDate="${centralDate}"></lion-calendar>
  `;
};
export const controllingFocus = () => {
  const today = new Date();
  const selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const centralDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      id="js-demo-calendar"
      class="demo-calendar"
      .selectedDate="${selectedDate}"
      .centralDate="${centralDate}"
    ></lion-calendar>
    <button
      @click="${e => e.target.parentElement.querySelector('#js-demo-calendar').focusCentralDate()}"
    >
      Set focus on: Central date
    </button>
    <button
      @click="${e => e.target.parentElement.querySelector('#js-demo-calendar').focusSelectedDate()}"
    >
      Set focus on: Selected date
    </button>
    <button
      @click="${e => e.target.parentElement.querySelector('#js-demo-calendar').focusDate(today)}"
    >
      Set focus on: Today
    </button>
  `;
};
export const providingLowerLimit = () => {
  const minDate = new Date();
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .minDate="${minDate}"></lion-calendar>
  `;
};
export const providingHigherLimit = () => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar class="demo-calendar" .maxDate="${maxDate}"></lion-calendar>
  `;
};
export const disabledDates = () => html`
  <style>
    .demo-calendar {
      border: 1px solid #adadad;
      box-shadow: 0 0 16px #ccc;
      max-width: 500px;
    }
  </style>
  <lion-calendar
    class="demo-calendar"
    .disableDates="${day => day.getDay() === 6 || day.getDay() === 0}"
  ></lion-calendar>
`;
export const combinedDisabledDates = () => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      class="demo-calendar"
      .disableDates="${day => day.getDay() === 6 || day.getDay() === 0}"
      .minDate="${new Date()}"
      .maxDate="${maxDate}"
    ></lion-calendar>
  `;
};
export const findingEnabledDates = () => {
  function getCalendar(ev) {
    return ev.target.parentElement.querySelector('.js-calendar');
  }
  return html`
    <style>
      .demo-calendar {
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
        max-width: 500px;
      }
    </style>
    <lion-calendar
      class="demo-calendar js-calendar"
      .disableDates="${day => day.getDay() === 6 || day.getDay() === 0}"
    ></lion-calendar>
    <button @click="${ev => getCalendar(ev).focusDate(getCalendar(ev).findNextEnabledDate())}">
      focus findNextEnabledDate
    </button>
    <button @click="${ev => getCalendar(ev).focusDate(getCalendar(ev).findPreviousEnabledDate())}">
      focus findPreviousEnabledDate
    </button>
    <button @click="${ev => getCalendar(ev).focusDate(getCalendar(ev).findNearestEnabledDate())}">
      focus findNearestEnabledDate
    </button>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'selectedDate', story: selectedDate }, { key: 'centralDate', story: centralDate }, { key: 'controllingFocus', story: controllingFocus }, { key: 'providingLowerLimit', story: providingLowerLimit }, { key: 'providingHigherLimit', story: providingHigherLimit }, { key: 'disabledDates', story: disabledDates }, { key: 'combinedDisabledDates', story: combinedDisabledDates }, { key: 'findingEnabledDates', story: findingEnabledDates }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}