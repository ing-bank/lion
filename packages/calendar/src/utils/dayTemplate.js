import { html, ifDefined } from '@lion/core';

const defaultMonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// TODO: remove as much logic as possible from this template and move to processor
export function dayTemplate(day, { weekdays, monthsLabels = defaultMonthLabels } = {}) {
  const dayNumber = day.date.getDate();
  const monthName = monthsLabels[day.date.getMonth()];
  const year = day.date.getFullYear();
  const weekdayName = weekdays[day.weekOrder];

  return html`
    <td role="gridcell" class="calendar__day-cell">
      <button
        .date=${day.date}
        class="calendar__day-button"
        tabindex=${day.central ? '0' : '-1'}
        aria-label=${day.disabled
          ? 'Unavailable'
          : `${dayNumber} ${monthName} ${year} ${weekdayName}`}
        aria-pressed=${day.selected ? 'true' : 'false'}
        aria-current=${ifDefined(day.today ? 'date' : undefined)}
        aria-disabled=${ifDefined(day.disabled ? 'true' : undefined)}
        title=${day.disabled ? 'Unavailable' : ''}
        ?selected=${day.selected}
        ?past=${day.past}
        ?today=${day.today}
        ?future=${day.future}
        ?previous-month=${day.previousMonth}
        ?current-month=${day.currentMonth}
        ?next-month=${day.nextMonth}
      >
        ${day.date.getDate()}
      </button>
    </td>
  `;
}
