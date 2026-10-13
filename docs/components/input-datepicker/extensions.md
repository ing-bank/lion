---
title: 'Input Datepicker: Extensions'
parts:
  - Input Datepicker
  - Extensions
eleventyNavigation:
  key: 'Input Datepicker: Extensions'
  order: 30
  parent: Input Datepicker
  title: Extensions
---

# Input Datepicker: Extensions

```js script
import { html } from '@mdjs/mdjs-preview';
import { css } from 'lit';
import { LionCalendar } from '@lion/ui/calendar.js';
import { LionInputDatepicker } from '@lion/ui/input-datepicker.js';
```

Below several extensions can be found. They illustrate how Lion components can be styled and customized easily by extending base components and scoping them.

## Styled datepicker with month and year navigation

The base `LionCalendar` ships with minimal, un-opinionated structural styles so you can easily supply your own visual design. For an enhanced visual presentation (custom borders, hover backgrounds, smooth transitions, and current selection highlights), extend `LionCalendar` and provide it to a subclass of `LionInputDatepicker` using `scopedElements`:

```js preview-story
class StyledLionCalendar extends LionCalendar {
  static get styles() {
    return [
      ...super.styles,
      css`
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

        .calendar__month-selection {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          padding: 16px 8px;
          animation: calendarFadeIn 0.15s ease;
        }

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

        .calendar__year-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

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

        .calendar__month-button:focus-visible,
        .calendar__year-button:focus-visible {
          outline: 2px solid #005fcc;
          outline-offset: 2px;
        }

        .calendar__month-button--current,
        .calendar__year-button--current {
          background-color: #e3f2fd;
          border-color: #005fcc;
          font-weight: bold;
        }

        .calendar__month-button[aria-disabled='true'],
        .calendar__year-button[aria-disabled='true'] {
          color: #767676;
          background-color: #f5f5f5;
          border-color: #ddd;
          cursor: not-allowed;
        }

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
      `,
    ];
  }
}

class StyledInputDatepicker extends LionInputDatepicker {
  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-calendar': StyledLionCalendar,
    };
  }
}
customElements.define('styled-input-datepicker', StyledInputDatepicker);

export const styledDatepickerWithMonthYearNavigation = () => html`
  <styled-input-datepicker
    label="Appointment date"
    month-year-navigation
    .modelValue="${new Date()}"
  ></styled-input-datepicker>
`;
```
