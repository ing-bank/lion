import { expect, fixture } from '@open-wc/testing';
import '@lion/core/test-helpers/keyboardEventShimIE.js';
import sinon from 'sinon';

import { html } from '@lion/core';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers.js';

import { CalendarObject, DayObject } from '../test-helpers.js';

import { isSameDate } from '../src/utils/isSameDate.js';
import '../lion-calendar.js';

describe('<lion-calendar>', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  describe('Structure', () => {
    it('implements BEM structure', async () => {
      const el = await fixture(
        html`
          <lion-calendar></lion-calendar>
        `,
      );

      expect(el.shadowRoot.querySelector('.calendar')).to.exist;
      expect(el.shadowRoot.querySelector('.calendar__header')).to.exist;
      expect(el.shadowRoot.querySelector('.calendar__previous-month-button')).to.exist;
      expect(el.shadowRoot.querySelector('.calendar__next-month-button')).to.exist;
      expect(el.shadowRoot.querySelector('.calendar__month-heading')).to.exist;
      expect(el.shadowRoot.querySelector('.calendar__grid')).to.exist;
    });

    it('has heading with month and year', async () => {
      const clock = sinon.useFakeTimers({ now: new Date('2000/12/01').getTime() });

      const el = await fixture(
        html`
          <lion-calendar></lion-calendar>
        `,
      );

      expect(el.shadowRoot.querySelector('.calendar__month-heading')).dom.to.equal(`
        <h2
          id="month_and_year"
          class="calendar__month-heading"
          aria-live="polite"
          aria-atomic="true"
        >
          December 2000
        </h2>
      `);

      clock.restore();
    });

    it('has previous month button', async () => {
      const el = await fixture(
        html`
          <lion-calendar></lion-calendar>
        `,
      );
      expect(el.shadowRoot.querySelector('.calendar__previous-month-button')).dom.to.equal(`
        <button class="calendar__previous-month-button" aria-label="Previous month" title="Previous month">&lt;</button>
      `);
    });

    it('has next month button', async () => {
      const el = await fixture(
        html`
          <lion-calendar></lion-calendar>
        `,
      );
      expect(el.shadowRoot.querySelector('.calendar__next-month-button')).dom.to.equal(`
        <button class="calendar__next-month-button" aria-label="Next month" title="Next month">&gt;</button>
      `);
    });
  });

  describe('Public API', () => {
    it('has property "centralDate" that determines currently visible month', async () => {
      const elObj = new CalendarObject(
        await fixture(html`
          <lion-calendar .centralDate="${new Date('2014/05/15')}"></lion-calendar>
        `),
      );
      expect(elObj.activeMonthAndYear).to.equal('May 2014');
    });

    it('sets "centralDate" to today by default', async () => {
      const clock = sinon.useFakeTimers({ now: new Date('2013/03/15').getTime() });

      const el = await fixture(html`
        <lion-calendar></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(isSameDate(el.centralDate, new Date())).to.be.true;
      expect(elObj.activeMonthAndYear).to.equal('March 2013');

      clock.restore();
    });

    it('determines the date focusable with keyboard from "centralDate"', async () => {
      const elObj = new CalendarObject(
        await fixture(html`
          <lion-calendar .centralDate="${new Date('2017/07/05')}"></lion-calendar>
        `),
      );
      expect(
        elObj.checkForAllDayObjs(o => o.buttonEl.getAttribute('tabindex') === '0', n => n === 5),
      ).to.be.true;
      expect(
        elObj.checkForAllDayObjs(o => o.buttonEl.getAttribute('tabindex') === '-1', n => n !== 5),
      ).to.be.true;
    });

    it('has property "selectedDate" for the selected date', async () => {
      const el = await fixture(html`
        <lion-calendar .selectedDate="${new Date('2019/06/15')}"></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(elObj.getDayObj(15).isSelected).to.equal(true);
      expect(elObj.getDayObj(16).isSelected).to.equal(false);
      expect(elObj.getDayObj(14).isSelected).to.equal(false);
      el.selectedDate = new Date('2019/06/16');
      await el.updateComplete;
      expect(elObj.getDayObj(15).isSelected).to.equal(false);
    });

    it('gives priority to "centralDate" to display the month when "selectedDate" is also defined', async () => {
      const elObj = new CalendarObject(
        await fixture(html`
          <lion-calendar
            .centralDate="${new Date('2018/06/01')}"
            .selectedDate="${new Date('2018/07/15')}"
          ></lion-calendar>
        `),
      );
      expect(elObj.activeMonthAndYear).to.equal('June 2018');
    });

    it('changes "centralDate" from default to "selectedDate" on first render if no other custom "centralDate" is provided', async () => {
      const clock = sinon.useFakeTimers({ now: new Date('2010/01/01').getTime() });

      const el = await fixture(html`
        <lion-calendar .selectedDate="${new Date('2016/10/20')}"></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(isSameDate(el.centralDate, new Date('2016/10/20'))).to.be.true;
      expect(elObj.activeMonthAndYear).to.equal('October 2016');

      clock.restore();
    });

    it('does not change "centralDate" to "selectedDate" when new date is provided programmatically', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate="${new Date('2018/06/01')}"
          .selectedDate="${new Date('2018/06/02')}"
        ></lion-calendar>
      `);
      expect(isSameDate(el.centralDate, new Date('2018/06/01'))).to.be.true;
      el.selectedDate = new Date('2018/06/03');
      await el.updateComplete;
      expect(isSameDate(el.centralDate, new Date('2018/06/01'))).to.be.true;
    });

    it('does not set "selectedDate" by default', async () => {
      const el = await fixture(html`
        <lion-calendar></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      const today = new Date();
      expect(el.selectedDate).to.equal(undefined);
      expect(elObj.getDayObj(today.getDate()).isSelected).to.equal(false);
    });

    it('allows to reset "selectedDate"', async () => {
      const el = await fixture(html`
        <lion-calendar .selectedDate="${new Date('2019/06/15')}"></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      el.selectedDate = undefined;
      await el.updateComplete;
      expect(elObj.selectedDayObj).to.be.undefined;
    });

    it('sends event "user-selected-date-changed" when user selects a date', async () => {
      const dateChangedSpy = sinon.spy();
      const el = await fixture(html`
        <lion-calendar
          .selectedDate="${new Date('2000/12/12')}"
          @user-selected-date-changed="${dateChangedSpy}"
        ></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(dateChangedSpy.called).to.equal(false);
      elObj.getDayEl(15).click();
      await el.updateComplete;
      expect(dateChangedSpy.calledOnce).to.equal(true);
      expect(
        isSameDate(dateChangedSpy.args[0][0].detail.selectedDate, new Date('2000/12/15')),
      ).to.equal(true);
    });

    it('doesn\'t send event "user-selected-date-changed" when user selects a disabled date', async () => {
      const dateChangedSpy = sinon.spy();
      const disable15th = d => d.getDate() === 15;
      const el = await fixture(html`
        <lion-calendar
          .selectedDate="${new Date('2000/12/12')}"
          @user-selected-date-changed="${dateChangedSpy}"
          .disableDates=${disable15th}
        ></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      elObj.getDayEl(15).click();
      await el.updateComplete;
      expect(dateChangedSpy.called).to.equal(false);
    });

    it('exposes focusedDate getter', async () => {
      const el = await fixture(html`
        <lion-calendar .centralDate="${new Date('2019/06/01')}"></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(el.focusedDate).to.be.null;
      elObj.getDayEl(15).click();
      expect(isSameDate(el.focusedDate, new Date('2019/06/15'))).to.equal(true);
    });

    it('has a focusDate() method to focus an arbitrary date', async () => {
      const el = await fixture(html`
        <lion-calendar></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      await el.focusDate(new Date('2016/06/10'));
      expect(isSameDate(el.focusedDate, new Date('2016/06/10'))).to.be.true;
      expect(elObj.getDayObj(10).isFocused).to.be.true;
    });

    it('has a focusCentralDate() method to focus the central date', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate="${new Date('2015/12/02')}"
          .selectedDate="${new Date('2015/12/04')}"
        ></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      el.focusCentralDate();
      expect(isSameDate(el.focusedDate, new Date('2015/12/02'))).to.be.true;
      expect(elObj.getDayObj(2).isFocused).to.be.true;
    });

    it('has a focusSelectedDate() method to focus the selected date', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate="${new Date('2014/07/05')}"
          .selectedDate="${new Date('2014/07/07')}"
        ></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      await el.focusSelectedDate();
      expect(isSameDate(el.focusedDate, new Date('2014/07/07'))).to.be.true;
      expect(elObj.getDayObj(7).isFocused).to.be.true;
    });

    describe('Enabled Dates', () => {
      it('disables all days before "minDate" property', async () => {
        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2000/12/31')}"
            .minDate="${new Date('2000/12/09')}"
          >
          </lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.getDayObj(15).isDisabled).to.equal(false);
        elObj.dayEls.forEach((d, i) => {
          const shouldBeDisabled = i < 8;
          expect(new DayObject(d).isDisabled).to.equal(shouldBeDisabled);
        });
      });

      it('disables all days after "maxDate" property', async () => {
        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2000/12/01')}"
            .maxDate="${new Date('2000/12/09')}"
          >
          </lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.getDayObj(5).isDisabled).to.equal(false);
        elObj.dayEls.forEach((d, i) => {
          const shouldBeDisabled = i > 8;
          expect(new DayObject(d).isDisabled).to.equal(shouldBeDisabled);
        });
      });

      it('disables a date with disableDates function', async () => {
        const disable15th = d => d.getDate() === 15;
        const el = await fixture(
          html`
            <lion-calendar
              .selectedDate="${new Date('2000/12/01')}"
              .disableDates=${disable15th}
            ></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        elObj.dayEls.forEach((d, i) => {
          const shouldBeDisabled = i === 15 - 1;
          expect(new DayObject(d).isDisabled).to.equal(shouldBeDisabled);
        });

        el.selectedDate = new Date('2000/11/01'); // When month view updates, it should still work
        await el.updateComplete;
        elObj.dayEls.forEach((d, i) => {
          const shouldBeDisabled = i === 15 - 1;
          expect(new DayObject(d).isDisabled).to.equal(shouldBeDisabled);
        });
      });

      it('does not prevent initializing "centralDate" from "selectedDate" when today is disabled', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2019/06/03').getTime() });

        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2001/01/08')}"
            .disableDates=${day => day.getDate() === 3}
          ></lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(isSameDate(el.centralDate, new Date('2001/01/08'))).to.be.true;
        expect(elObj.activeMonthAndYear).to.equal('January 2001');

        clock.restore();
      });

      describe('Normalization', () => {
        it('normalizes all generated dates', async () => {
          function isNormalizedDate(d) {
            return d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;
          }

          const el = await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          );
          // The central date will be today's date: it's the date all other
          // dates in the month view will be derived from.
          expect(isNormalizedDate(el.centralDate)).to.be.true;
        });

        it('normalizes dates in date comparisons', async () => {
          const selectedDate = new Date('2000-11-04T03:00:00');
          // without normalization, selectedDate > maxDate would wrongfully be disabled
          const maxDate = new Date('2000-11-29T02:00:00');
          // without normalization, selectedDate < minDate would wrongfully be disabled
          const minDate = new Date('2000-11-02T04:00:00');

          const el = await fixture(
            html`
              <lion-calendar
                .selectedDate="${selectedDate}"
                .minDate="${minDate}"
                .maxDate="${maxDate}"
              ></lion-calendar>
            `,
          );
          const elObj = new CalendarObject(el);

          expect(elObj.getDayObj(29).isDisabled).to.equal(false);
          expect(elObj.getDayObj(30).isDisabled).to.equal(true);

          expect(elObj.getDayObj(2).isDisabled).to.equal(false);
          expect(elObj.getDayObj(1).isDisabled).to.equal(true);
        });
      });
    });
  });

  describe('Calendar header (month navigation)', () => {
    describe('Title', () => {
      it('contains secondary title displaying the current month and year in focus', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.activeMonthAndYear).to.equal('December 2000');
      });

      it('updates the secondary title when the displayed month/year changes', async () => {
        const el = await fixture(
          html`
            <lion-calendar .centralDate="${new Date('2000/12/12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        el.centralDate = new Date('1999/10/12');
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('October 1999');
      });

      describe('Accessibility', () => {
        it('has aria-live="polite" and aria-atomic="true" set on the secondary title', async () => {
          const elObj = new CalendarObject(
            await fixture(
              html`
                <lion-calendar></lion-calendar>
              `,
            ),
          );
          expect(elObj.monthHeadingEl.getAttribute('aria-live')).to.equal('polite');
          expect(elObj.monthHeadingEl.getAttribute('aria-atomic')).to.equal('true');
        });
      });
    });

    describe('Navigation', () => {
      it('has a button for navigation to previous month', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2001/01/01')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.previousMonthButtonEl).not.to.equal(null);
        expect(elObj.activeMonthAndYear).to.equal('January 2001');

        elObj.previousMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('December 2000');

        elObj.previousMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('November 2000');
      });

      it('has a button for navigation to next month', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.nextMonthButtonEl).not.to.equal(null);
        expect(elObj.activeMonthAndYear).to.equal('December 2000');

        elObj.nextMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('January 2001');

        elObj.nextMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('February 2001');
      });

      it('disables previousMonthButton and nextMonthButton based on disabled days accordingly', async () => {
        const el = await fixture(html`
          <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.activeMonthAndYear).to.equal('December 2000');
        expect(elObj.previousMonthButtonEl.hasAttribute('disabled')).to.equal(false);
        expect(elObj.nextMonthButtonEl.hasAttribute('disabled')).to.equal(false);

        el.minDate = new Date('2000/12/01');
        el.maxDate = new Date('2000/12/31');
        await el.updateComplete;

        expect(elObj.previousMonthButtonEl.hasAttribute('disabled')).to.equal(true);
        expect(elObj.nextMonthButtonEl.hasAttribute('disabled')).to.equal(true);

        elObj.previousMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('December 2000');

        elObj.previousMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('December 2000');
      });

      it('handles switch to previous month when dates are disabled', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

        const el = await fixture(html`
          <lion-calendar></lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.activeMonthAndYear).to.equal('December 2000');

        el.minDate = new Date('2000/11/20');
        await el.updateComplete;

        expect(elObj.previousMonthButtonEl.hasAttribute('disabled')).to.equal(false);
        expect(isSameDate(el.centralDate, new Date('2000/12/15'))).to.be.true;

        elObj.previousMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('November 2000');
        expect(isSameDate(el.centralDate, new Date('2000/11/21'))).to.be.true;

        clock.restore();
      });

      it('handles switch to next month when dates are disabled', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

        const el = await fixture(html`
          <lion-calendar></lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.activeMonthAndYear).to.equal('December 2000');

        el.maxDate = new Date('2001/01/10');
        await el.updateComplete;

        expect(elObj.nextMonthButtonEl.hasAttribute('disabled')).to.equal(false);
        expect(isSameDate(el.centralDate, new Date('2000/12/15'))).to.be.true;

        elObj.nextMonthButtonEl.click();
        await el.updateComplete;
        expect(elObj.activeMonthAndYear).to.equal('January 2001');
        expect(isSameDate(el.centralDate, new Date('2001/01/09'))).to.be.true;

        clock.restore();
      });

      describe('Accessibility', () => {
        it('navigate buttons have a aria-label and title attribute with accessible label', async () => {
          const el = await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.previousMonthButtonEl.getAttribute('title')).to.equal('Previous month');
          expect(elObj.previousMonthButtonEl.getAttribute('aria-label')).to.equal('Previous month');
          expect(elObj.nextMonthButtonEl.getAttribute('title')).to.equal('Next month');
          expect(elObj.nextMonthButtonEl.getAttribute('aria-label')).to.equal('Next month');
        });
      });
    });
  });

  describe('Calendar body (months view)', () => {
    it('renders the days of the week as table headers', async () => {
      const el = await fixture(
        html`
          <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
        `,
      );
      const elObj = new CalendarObject(el);
      expect(elObj.weekdayHeaderEls.map(h => h.textContent.trim())).to.deep.equal([
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat',
      ]);
    });

    describe('Day view', () => {
      it('adds "today" attribute if date is today', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

        const el = await fixture(
          html`
            <lion-calendar></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.getDayEl(15).hasAttribute('today')).to.be.true;

        expect(elObj.checkForAllDayObjs(d => d.isToday, [15])).to.equal(true);

        clock.restore();
      });

      it('adds "selected" attribute to the selected date', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.checkForAllDayObjs(obj => obj.el.hasAttribute('selected'), [12])).to.equal(
          true,
        );

        el.selectedDate = new Date('2000/12/15');
        await el.updateComplete;
        expect(elObj.checkForAllDayObjs(obj => obj.el.hasAttribute('selected'), [15])).to.equal(
          true,
        );
      });

      it('adds "disabled" attribute to disabled dates', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2000/12/10')}"
            .minDate="${new Date('2000/12/03')}"
            .maxDate="${new Date('2000/12/29')}"
          >
          </lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(
          elObj.checkForAllDayObjs(d => d.el.hasAttribute('disabled'), [1, 2, 30, 31]),
        ).to.equal(true);

        clock.restore();
      });
    });

    describe('User Interaction', () => {
      // For implementation, base on: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/grid/js/dataGrid.js

      describe('Keyboard Navigation', () => {
        it('focused day is reachable via tab (tabindex="0")', async () => {
          const el = await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDayObjs(d => d.buttonEl.getAttribute('tabindex') === '0', [12]),
          ).to.equal(true);
        });

        it('non focused days are not reachable via tab (have tabindex="-1")', async () => {
          const el = await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDayObjs(
              d => d.buttonEl.getAttribute('tabindex') === '-1',
              dayNumber => dayNumber !== 12,
            ),
          ).to.equal(true);
        });

        it('blocks navigation to disabled days', async () => {
          const el = await fixture(html`
            <lion-calendar
              .selectedDate="${new Date('2000/12/31')}"
              .minDate="${new Date('2000/12/09')}"
            >
            </lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDayObjs(
              d => d.buttonEl.getAttribute('tabindex') === '-1',
              dayNumber => dayNumber < 9,
            ),
          ).to.equal(true);
        });

        it('navigates through months with [pageup] [pagedown] keys', async () => {
          const el = await fixture(html`
            <lion-calendar .selectedDate="${new Date('2001/01/02')}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.activeMonthAndYear).to.equal('January 2001');

          el.__contentWrapperElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }));
          await el.updateComplete;
          expect(elObj.activeMonthAndYear).to.equal('December 2000');

          el.__contentWrapperElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'PageDown' }),
          );
          await el.updateComplete;
          expect(elObj.activeMonthAndYear).to.equal('January 2001');
        });

        it('navigates through years with [alt + pageup] [alt + pagedown] keys', async () => {
          const el = await fixture(html`
            <lion-calendar .selectedDate="${new Date('2001/01/02')}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.activeMonthAndYear).to.equal('January 2001');

          el.__contentWrapperElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'PageDown', altKey: true }),
          );
          await el.updateComplete;
          expect(elObj.activeMonthAndYear).to.equal('January 2002');

          el.__contentWrapperElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: 'PageUp', altKey: true }),
          );
          await el.updateComplete;
          expect(elObj.activeMonthAndYear).to.equal('January 2001');
        });

        describe('Arrow keys', () => {
          it('navigates (sets focus) to next row item via [arrow down] key', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2001/01/02')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowDown' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(2 + 7);
          });

          it('navigates (sets focus) to previous row item via [arrow up] key', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2001/01/02')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowUp' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(26); // of month before
          });

          it('navigates (sets focus) to previous column item via [arrow left] key', async () => {
            // 2000-12-12 is Tuesday; at 2nd of row
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(12 - 1);
          });

          it('navigates (sets focus) to next column item via [arrow right] key', async () => {
            // 2000-12-12 is Tuesday; at 2nd of row
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2000/12/12')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowRight' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(12 + 1);
          });

          it('navigates (sets focus) to next selectable column item via [arrow right] key', async () => {
            const el = await fixture(html`
              <lion-calendar
                .selectedDate="${new Date('2001/01/02')}"
                .disableDates=${day => day.getDate() === 3 || day.getDate() === 4}
              ></lion-calendar>
            `);
            const elObj = new CalendarObject(el);

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowRight' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(5);
          });

          it('navigates (sets focus) to next row via [arrow right] key if last item in row', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2019/01/05')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.centralDayObj.weekdayNameShort).to.equal('Sat');

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowRight' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(6);
            expect(elObj.focusedDayObj.weekdayNameShort).to.equal('Sun');
          });

          it('navigates (sets focus) to previous row via [arrow left] key if first item in row', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2019/01/06')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.centralDayObj.weekdayNameShort).to.equal('Sun');

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
            );
            await el.updateComplete;
            expect(elObj.focusedDayObj.monthday).to.equal(5);
            expect(elObj.focusedDayObj.weekdayNameShort).to.equal('Sat');
          });

          it('navigates to next month via [arrow right] key if last day of month', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2000/12/31')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonthAndYear).to.equal('December 2000');

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowRight' }),
            );
            await el.updateComplete;
            expect(elObj.activeMonthAndYear).to.equal('January 2001');
            expect(elObj.focusedDayObj.monthday).to.equal(1);
          });

          it('navigates to previous month via [arrow left] key if first day of month', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2001/01/01')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonthAndYear).to.equal('January 2001');

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
            );
            await el.updateComplete;
            expect(elObj.activeMonthAndYear).to.equal('December 2000');
            expect(elObj.focusedDayObj.monthday).to.equal(31);
          });

          it('navigates to next month via [arrow down] key if last row of month', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2000/12/30')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonthAndYear).to.equal('December 2000');

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowDown' }),
            );
            await el.updateComplete;
            expect(elObj.activeMonthAndYear).to.equal('January 2001');
            expect(elObj.focusedDayObj.monthday).to.equal(6);
          });

          it('navigates to previous month via [arrow up] key if first row of month', async () => {
            const el = await fixture(html`
              <lion-calendar .selectedDate="${new Date('2001/01/02')}"></lion-calendar>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonthAndYear).to.equal('January 2001');

            el.__contentWrapperElement.dispatchEvent(
              new KeyboardEvent('keydown', { key: 'ArrowUp' }),
            );
            await el.updateComplete;
            expect(elObj.activeMonthAndYear).to.equal('December 2000');
            expect(elObj.focusedDayObj.monthday).to.equal(26);
          });
        });
      });

      describe('Initial central', () => {
        it('is based on "selectedDate"', async () => {
          const el = await fixture(html`
            <lion-calendar .selectedDate=${new Date('2019/06/15')}></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.centralDayObj.monthday).to.equal(15);
        });

        it('is today if no selected date is available', async () => {
          const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

          const el = await fixture(html`
            <lion-calendar></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.centralDayObj.monthday).to.equal(15);

          clock.restore();
        });

        it('is on day closest to today, if today (and surrounding dates) is/are disabled', async () => {
          const el = await fixture(html`
            <lion-calendar
              .centralDate="${new Date('2000/12/15')}"
              .disableDates="${d => d.getDate() <= 16}"
            ></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.centralDayObj.monthday).to.equal(17);

          el.disableDates = d => d.getDate() >= 12;
          await el.updateComplete;
          expect(elObj.centralDayObj.monthday).to.equal(11);
        });

        it('future dates take precedence over past dates when "distance" between dates is equal', async () => {
          const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

          const el = await fixture(html`
            <lion-calendar .disableDates="${d => d.getDate() === 15}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.centralDayObj.monthday).to.equal(16);

          clock.restore();
        });

        it('will search 750 days in the past', async () => {
          const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

          const el = await fixture(html`
            <lion-calendar .disableDates="${d => d.getFullYear() > 1998}"></lion-calendar>
          `);
          expect(el.centralDate.getFullYear()).to.equal(1998);
          expect(el.centralDate.getMonth()).to.equal(11);
          expect(el.centralDate.getDate()).to.equal(31);

          clock.restore();
        });

        it('will search 750 days in the future', async () => {
          const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

          const el = await fixture(html`
            <lion-calendar .disableDates="${d => d.getFullYear() < 2002}"></lion-calendar>
          `);
          expect(el.centralDate.getFullYear()).to.equal(2002);
          expect(el.centralDate.getMonth()).to.equal(0);
          expect(el.centralDate.getDate()).to.equal(1);

          clock.restore();
        });

        it('throws if no available date can be found within +/- 750 days', async () => {
          const el = await fixture(html`
            <lion-calendar .disableDates="${d => d.getFullYear() < 2002}"></lion-calendar>
          `);

          expect(() => {
            el.centralDate = new Date('1900/01/01');
          }).to.throw(Error, 'Could not find a selectable date within +/- 750 day for 1900/1/1');
        });
      });

      /**
       * Not in scope:
       * - (virtual) scrolling: still under discussion. Wait for UX
       */
    });

    describe('Accessibility', () => {
      // Based on:
      // - https://codepen.io/erikkroes/pen/jJEWpR

      // Navigation and day labels based on:
      // - https://dequeuniversity.com/library/aria/date-pickers/sf-date-picker
      //   (recommended in W3C Editors Draft)

      // For implementation, base on:
      // https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/grid/js/dataGrid.js
      // As an enhancement, we detect when grid boundaries day are exceeded, so we move to
      // next/previous month.
      it('has role="application" to activate keyboard navigation', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        expect(elObj.rootEl.getAttribute('role')).to.equal('application');
      });

      it(`renders the calendar as a table element with role="grid", aria-readonly="true" and
        a caption (month + year)`, async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        expect(elObj.gridEl.getAttribute('role')).to.equal('grid');
        expect(elObj.gridEl.getAttribute('aria-readonly')).to.equal('true');
      });

      it('adds aria-labels to the weekday table headers', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        expect(elObj.weekdayHeaderEls.map(h => h.getAttribute('aria-label'))).to.eql([
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]);
      });

      it('renders each day as a button inside a table cell', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        const hasBtn = d => d.el.tagName === 'BUTTON';
        expect(elObj.checkForAllDayObjs(hasBtn)).to.equal(true);
      });

      it('renders days for previous and next months', async () => {
        const elObj = new CalendarObject(
          await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000/11/12')}"></lion-calendar>
          `),
        );
        const { previousMonthDayObjs, nextMonthDayObjs } = elObj;

        expect(previousMonthDayObjs.length).to.equal(3);
        expect(previousMonthDayObjs[0].cellIndex).to.equal(0);
        expect(previousMonthDayObjs[0].monthday).to.equal(29);
        expect(previousMonthDayObjs[1].cellIndex).to.equal(1);
        expect(previousMonthDayObjs[1].monthday).to.equal(30);
        expect(previousMonthDayObjs[2].cellIndex).to.equal(2);
        expect(previousMonthDayObjs[2].monthday).to.equal(31);

        expect(nextMonthDayObjs.length).to.equal(2);
        expect(nextMonthDayObjs[0].cellIndex).to.equal(5);
        expect(nextMonthDayObjs[0].monthday).to.equal(1);
        expect(nextMonthDayObjs[1].cellIndex).to.equal(6);
        expect(nextMonthDayObjs[1].monthday).to.equal(2);
      });

      it('sets aria-current="date" to todays button', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        const hasAriaCurrent = d => d.buttonEl.getAttribute('aria-current') === 'date';
        const monthday = new Date().getDate();
        expect(elObj.checkForAllDayObjs(hasAriaCurrent, [monthday])).to.equal(true);
      });

      it('sets aria-selected="true" on selected date button', async () => {
        const elObj = new CalendarObject(
          await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000/11/12')}"></lion-calendar>
          `),
        );
        const hasAriaSelected = d => d.buttonEl.getAttribute('aria-selected') === 'true';
        expect(elObj.checkForAllDayObjs(hasAriaSelected, [12])).to.equal(true);
      });

      // This implementation mentions "button" inbetween and doesn't mention table
      // column and row. As an alternative, see Deque implementation below.
      // it(`on focus on a day, the screen reader pronounces "day of the week", "day number"
      //    and "month" (in this order)', async () => {
      //   // implemented by labelelledby referencing row and column names
      //   const el = await fixture('<lion-calendar></lion-calendar>');
      // });

      // Alternative: Deque implementation
      it(`sets aria-label on button, that consists of
        "{day number} {month name} {year} {weekday name}"`, async () => {
        const elObj = new CalendarObject(
          await fixture(html`
            <lion-calendar .centralDate="${new Date('2000/11/12')}"></lion-calendar>
          `),
        );
        expect(
          elObj.checkForAllDayObjs(
            d =>
              d.buttonEl.getAttribute('aria-label') ===
              `${d.monthday} November 2000 ${d.weekdayNameLong}`,
          ),
        ).to.equal(true);
      });

      /**
       * Not in scope:
       * - reads the new focused day on month navigation"
       */
    });

    /**
     * Not in scope:
     * - show week numbers
     */
  });

  describe('Localization', () => {
    it('supports custom locale with a fallback to a global locale', async () => {
      const el = await fixture(html`
        <lion-calendar .selectedDate="${new Date('2019/12/20')}"></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(elObj.activeMonth).to.equal('December');

      el.locale = 'fr-FR';
      await el.updateComplete;
      expect(elObj.activeMonth).to.equal('décembre');

      localize.locale = 'cs-CZ';
      await el.updateComplete;
      expect(elObj.activeMonth).to.equal('décembre');

      el.locale = undefined;
      await el.updateComplete;
      expect(elObj.activeMonth).to.equal('prosinec');
    });

    it('displays the right translations according to locale', async () => {
      const el = await fixture(html`
        <lion-calendar></lion-calendar>
      `);

      const elObj = new CalendarObject(el);
      expect(elObj.nextMonthButtonEl.getAttribute('aria-label')).to.equal('Next month');

      localize.locale = 'nl-NL';
      await el.updateComplete;
      expect(elObj.nextMonthButtonEl.getAttribute('aria-label')).to.equal('Volgende maand');

      /**
       * TODO: add more tests, e.g. for:
       * - weekdays
       * - weekday abbreviations
       * - month names
       */
    });
  });
});
