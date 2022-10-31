import { html } from 'lit';
import { dayTemplate as defaultDayTemplate } from './dayTemplate.js';

/**
 * @param {{months: {weeks: {days: import('../../types/day').Day[]}[]}[]}} data
 * @param {{ weekdaysShort: string[], weekdays: string[], monthsLabels?: string[], dayTemplate?: (day: import('../../types/day').Day, { weekdays, monthsLabels }?: any) => import('@lion/core').TemplateResult }} opts
 */
export function dataTemplate(
  data,
  { weekdaysShort, weekdays, monthsLabels, dayTemplate = defaultDayTemplate },
) {
  return html`
    <div id="js-content-wrapper">
      ${data.months.map(
        month => html`
          <table
            role="grid"
            data-wrap-cols
            aria-readonly="true"
            class="calendar__grid"
            aria-labelledby="month year"
          >
            <thead>
              <tr role="row">
                ${weekdaysShort.map(
                  (header, i) => html`
                    <th
                      role="columnheader"
                      class="calendar__weekday-header"
                      scope="col"
                      aria-label="${weekdays[i]}"
                    >
                      ${header}
                    </th>
                  `,
                )}
              </tr>
            </thead>
            <tbody>
              ${month.weeks.map(
                week => html`
                  <tr role="row">
                    ${week.days.map(day =>
                      dayTemplate(day, { weekdaysShort, weekdays, monthsLabels }),
                    )}
                  </tr>
                `,
              )}
            </tbody>
          </table>
        `,
      )}
    </div>
  `;
}
