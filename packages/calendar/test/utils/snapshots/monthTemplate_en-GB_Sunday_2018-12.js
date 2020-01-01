const html = strings => strings[0];

export default html`
  <div id="js-content-wrapper">
    <table
      aria-labelledby="month_and_year"
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
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="25 November 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              25
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="26 November 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              26
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="27 November 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              27
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="28 November 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              28
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="29 November 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              29
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="30 November 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              30
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="1 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              1
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="2 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              2
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="3 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              3
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="4 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              4
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="5 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              5
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="6 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              6
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="7 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              7
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="8 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              8
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
              title=""
            >
              9
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="10 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              10
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="11 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              11
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="12 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              12
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="13 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              13
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="14 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              14
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="15 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              15
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
              title=""
            >
              16
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="17 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              17
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="18 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              18
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="19 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              19
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="20 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              20
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="21 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              21
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="22 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              22
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
              title=""
            >
              23
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="24 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              24
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="25 December 2018 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              25
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="26 December 2018 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              26
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="27 December 2018 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              27
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="28 December 2018 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              28
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="29 December 2018 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              29
            </button>
          </td>
        </tr>
        <tr role="row">
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="30 December 2018 Sunday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              30
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="31 December 2018 Monday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              31
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="1 January 2019 Tuesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              1
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="2 January 2019 Wednesday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              2
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="3 January 2019 Thursday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              3
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="4 January 2019 Friday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              4
            </button>
          </td>
          <td class="calendar__day-cell" role="gridcell">
            <button
              aria-label="5 January 2019 Saturday"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
              title=""
            >
              5
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`;
