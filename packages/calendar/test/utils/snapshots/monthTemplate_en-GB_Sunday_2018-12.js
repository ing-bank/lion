const html = strings => strings[0];

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
            <button
              aria-label="25 November 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">25</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="26 November 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">26</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="27 November 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">27</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="28 November 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">28</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="29 November 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">29</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell" last-day>
            <button
              aria-label="30 November 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">30</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell" end-of-first-week first-day>
            <button
              aria-label="1 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">1</span>
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell" start-of-first-full-week>
            <button
              aria-label="2 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">2</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="3 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">3</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="4 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">4</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="5 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">5</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="6 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">6</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="7 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">7</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="8 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">8</span>
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="9 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">9</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="10 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">10</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="11 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">11</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="12 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">12</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="13 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">13</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="14 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">14</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="15 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">15</span>
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="16 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">16</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="17 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">17</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="18 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">18</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="19 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">19</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="20 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">20</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="21 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">21</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="22 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">22</span>
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="23 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">23</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="24 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">24</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="25 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">25</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="26 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">26</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="27 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">27</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="28 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">28</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell" end-of-last-full-week>
            <button
              aria-label="29 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">29</span>
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell" start-of-last-week>
            <button
              aria-label="30 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">30</span>
            </button>
          </td>
          <td class="calendar__day-cell" last-day role="gridcell">
            <button
              aria-label="31 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">31</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell" first-day>
            <button
              aria-label="1 January 2019 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">1</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="2 January 2019 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">2</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="3 January 2019 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">3</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="4 January 2019 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">4</span>
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell" end-of-first-week>
            <button
              aria-label="5 January 2019 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">5</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`;
