const html = /** @param {TemplateStringsArray} strings */ strings => strings[0];

export default html`
  <div id="js-content-wrapper">
    <table
      aria-labelledby="month year"
      aria-readonly="true"
      class="calendar__grid"
      data-wrap-cols=""
      role="grid"
    >
      <thead>
        <tr role="row">
          <th class="calendar__weekday-header" aria-label="Sunday" scope="col" role="columnheader">
            Sun
          </th>
          <th class="calendar__weekday-header" aria-label="Monday" scope="col" role="columnheader">
            Mon
          </th>
          <th class="calendar__weekday-header" aria-label="Tuesday" scope="col" role="columnheader">
            Tue
          </th>
          <th
            class="calendar__weekday-header"
            aria-label="Wednesday"
            scope="col"
            role="columnheader"
          >
            Wed
          </th>
          <th
            class="calendar__weekday-header"
            aria-label="Thursday"
            scope="col"
            role="columnheader"
          >
            Thu
          </th>
          <th class="calendar__weekday-header" aria-label="Friday" scope="col" role="columnheader">
            Fri
          </th>
          <th
            class="calendar__weekday-header"
            aria-label="Saturday"
            scope="col"
            role="columnheader"
          >
            Sat
          </th>
        </tr>
      </thead>
      <tbody>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell" start-of-last-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">25</span>
              <span class="u-sr-only"> November 2018 Sunday</span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">26</span>
              <span class="u-sr-only"> November 2018 Monday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">27</span>
              <span class="u-sr-only"> November 2018 Tuesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">28</span>
              <span class="u-sr-only"> November 2018 Wednesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">29</span>
              <span class="u-sr-only"> November 2018 Thursday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell" last-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">30</span>
              <span class="u-sr-only"> November 2018 Friday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell" end-of-first-week first-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">1</span>
              <span class="u-sr-only"> December 2018 Saturday </span>
            </div>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell" start-of-first-full-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">2</span>
              <span class="u-sr-only"> December 2018 Sunday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">3</span>
              <span class="u-sr-only"> December 2018 Monday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">4</span>
              <span class="u-sr-only"> December 2018 Tuesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">5</span>
              <span class="u-sr-only"> December 2018 Wednesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">6</span>
              <span class="u-sr-only"> December 2018 Thursday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">7</span>
              <span class="u-sr-only"> December 2018 Friday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">8</span>
              <span class="u-sr-only"> December 2018 Saturday </span>
            </div>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">9</span>
              <span class="u-sr-only"> December 2018 Sunday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">10</span>
              <span class="u-sr-only"> December 2018 Monday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">11</span>
              <span class="u-sr-only"> December 2018 Tuesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">12</span>
              <span class="u-sr-only"> December 2018 Wednesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">13</span>
              <span class="u-sr-only"> December 2018 Thursday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">14</span>
              <span class="u-sr-only"> December 2018 Friday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">15</span>
              <span class="u-sr-only"> December 2018 Saturday </span>
            </div>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">16</span>
              <span class="u-sr-only"> December 2018 Sunday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">17</span>
              <span class="u-sr-only"> December 2018 Monday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">18</span>
              <span class="u-sr-only"> December 2018 Tuesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">19</span>
              <span class="u-sr-only"> December 2018 Wednesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">20</span>
              <span class="u-sr-only"> December 2018 Thursday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">21</span>
              <span class="u-sr-only"> December 2018 Friday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">22</span>
              <span class="u-sr-only"> December 2018 Saturday </span>
            </div>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">23</span>
              <span class="u-sr-only"> December 2018 Sunday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">24</span>
              <span class="u-sr-only"> December 2018 Monday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">25</span>
              <span class="u-sr-only"> December 2018 Tuesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">26</span>
              <span class="u-sr-only"> December 2018 Wednesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">27</span>
              <span class="u-sr-only"> December 2018 Thursday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">28</span>
              <span class="u-sr-only"> December 2018 Friday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell" end-of-last-full-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">29</span>
              <span class="u-sr-only"> December 2018 Saturday </span>
            </div>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell" start-of-last-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">30</span>
              <span class="u-sr-only"> December 2018 Sunday </span>
            </div>
          </td>
          <td class="calendar__day-cell" last-day role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">31</span>
              <span class="u-sr-only"> December 2018 Monday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell" first-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">1</span>
              <span class="u-sr-only"> January 2019 Tuesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">2</span>
              <span class="u-sr-only"> January 2019 Wednesday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">3</span>
              <span class="u-sr-only"> January 2019 Thursday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">4</span>
              <span class="u-sr-only"> January 2019 Friday </span>
            </div>
          </td>
          <td class="calendar__day-cell" role="gridcell" end-of-first-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">5</span>
              <span class="u-sr-only"> January 2019 Saturday </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`;
