const html = /** @param {TemplateStringsArray} strings */ strings => strings[0];

export default html`
  <div id="js-content-wrapper">
    <table aria-readonly="true" class="calendar__grid" data-wrap-cols="" role="grid">
      <thead>
        <tr>
          <th class="calendar__weekday-header" aria-label="Sunday" scope="col">Sun</th>
          <th class="calendar__weekday-header" aria-label="Monday" scope="col">Mon</th>
          <th class="calendar__weekday-header" aria-label="Tuesday" scope="col">Tue</th>
          <th class="calendar__weekday-header" aria-label="Wednesday" scope="col">Wed</th>
          <th class="calendar__weekday-header" aria-label="Thursday" scope="col">Thu</th>
          <th class="calendar__weekday-header" aria-label="Friday" scope="col">Fri</th>
          <th class="calendar__weekday-header" aria-label="Saturday" scope="col">Sat</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="calendar__day-cell" start-of-last-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">25</span>
              <span class="u-sr-only"> November 2018.</span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">26</span>
              <span class="u-sr-only"> November 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">27</span>
              <span class="u-sr-only"> November 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">28</span>
              <span class="u-sr-only"> November 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">29</span>
              <span class="u-sr-only"> November 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell" last-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">30</span>
              <span class="u-sr-only"> November 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell" end-of-first-week first-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">1</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="calendar__day-cell" start-of-first-full-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">2</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">3</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">4</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">5</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">6</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">7</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">8</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">9</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">10</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">11</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">12</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">13</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">14</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">15</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">16</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">17</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">18</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">19</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">20</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">21</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">22</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">23</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">24</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">25</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">26</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">27</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">28</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell" end-of-last-full-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">29</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="calendar__day-cell" start-of-last-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">30</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell" last-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">31</span>
              <span class="u-sr-only"> December 2018. </span>
            </div>
          </td>
          <td class="calendar__day-cell" first-day>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">1</span>
              <span class="u-sr-only"> January 2019. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">2</span>
              <span class="u-sr-only"> January 2019. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">3</span>
              <span class="u-sr-only"> January 2019. </span>
            </div>
          </td>
          <td class="calendar__day-cell">
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">4</span>
              <span class="u-sr-only"> January 2019. </span>
            </div>
          </td>
          <td class="calendar__day-cell" end-of-first-week>
            <div
              role="button"
              aria-disabled="false"
              aria-pressed="false"
              class="calendar__day-button"
              tabindex="-1"
            >
              <span class="calendar__day-button__text">5</span>
              <span class="u-sr-only"> January 2019. </span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`;
