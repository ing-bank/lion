import { html } from 'lit/static-html.js';
import { LionCalendar, isSameDate } from '@lion/ui/calendar.js';
import { expect, fixture, fixture as _fixture, unsafeStatic, waitUntil } from '@open-wc/testing';
import '@lion/ui/define/lion-calendar.js';
import { sendKeys } from '@web/test-runner-commands';
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';
import {
  CalendarObject as DefaultCalendarObject,
  DayObject,
} from '@lion/ui/calendar-test-helpers.js';
import sinon from 'sinon';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {{ classes?: Record<string, CustomElementConstructor>, klass?: typeof LionCalendar, tagString?: string }} [customConfig]
 */
/**
 * @param {{
 *   classes?: Record<string, CustomElementConstructor>,
 *   klass?: typeof LionCalendar,
 *   tagString?: string,
 *   CalendarObject?: typeof DefaultCalendarObject,
 * }} [customConfig]
 */
export function runCalendarSuite({
  classes = {},
  klass = LionCalendar,
  tagString,
  // The tests address the calendar through this page object; an extension layer whose navigation
  // markup differs (ING renders its own button element) passes its own subclass overriding the node
  // getters instead of the suite learning about that markup.
  CalendarObject = DefaultCalendarObject,
} = {}) {
  const tagStringCalendar = resolveSuiteTag(classes.host, tagString, klass);
  const tagCalendar = unsafeStatic(tagStringCalendar);

  /**
   * The accessible name of a node, whatever mechanism carries it (`title`, `aria-label`, or a
   * `label` on the node itself or a child element).
   * @param {Element|null|undefined} node
   * @returns {string|null}
   */
  function accessibleName(node) {
    return (
      node?.getAttribute('title') ||
      node?.getAttribute('aria-label') ||
      node?.getAttribute('label') ||
      node?.querySelector?.('[label]')?.getAttribute('label') ||
      node?.shadowRoot?.querySelector?.('[label]')?.getAttribute('label') ||
      null
    );
  }

  // A failing test that never reaches its `clock.restore()` used to leak fake timers into the
  // next test, which then awaited a timer that never fires and wedged the rest of the file.
  afterEach(() => sinon.restore());

  it('should fire keyboard press events on keyup and not on keydown', async () => {
    /**
     * This test covers a corner case where `keydown`, `keyup`, and `focus` events happen across different elements.
     *
     * Setup:
     * - There is a dialog invoker button that has a keyup handler.
     * - The dialog invoker button gets focused (important!) and then opens the dialog on click.
     * - The dialog contains lion-calendar.
     * - When a date is selected, the dialog closes.
     *
     * Expected behavior:
     * - The dialog invoker button's `keyup` handler should not run when a date is selected in the calendar.
     *
     * The problem:
     * - Pressing Enter on a date is handled by `keydown` inside `lion-calendar`.
     * - The dialog then closes on `user-selected-date-changed` event.
     * - The browser automatically returns focus to the previously focused element (the dialog invoker button).
     * - The keyup event then fires on the now-focused dialog invoker button, triggering its keyup
     *     handler unexpectedly.
     *
     * Fix being verified:
     * - Fire `user-selected-date-changed` on `keyup` instead of `keydown`.
     * - This prevents the dialog invoker button from receiving and handling that `keyup` after the dialog closes.
     */

    /** @type {HTMLElement} */
    let el;
    const keyUpSpy = sinon.spy();
    const getDialogEl = () => el.querySelector('dialog');
    const openDialogButtonClickHandler = () => getDialogEl()?.showModal();
    const userSelectedDateChangedHandler = () => getDialogEl()?.close();

    el = await fixture(html`
      <div>
        <button 
          @keyup="${keyUpSpy}" 
          @click="${openDialogButtonClickHandler}"
        >
          Open Dialog
        </button>
        <dialog>
          <${tagCalendar} 
            .selectedDate="${new Date('2000/10/12')}" 
            @user-selected-date-changed="${userSelectedDateChangedHandler}"
          >
          </${tagCalendar}>
        </dialog>
      </div>
    `);

    const openDialogButton = el.querySelector('button');
    const calendarEl = /** @type {LionCalendar} */ (el.querySelector(tagStringCalendar));
    await calendarEl?.updateComplete;

    openDialogButton?.focus();
    openDialogButton?.click();
    /**
     * @returns {HTMLElement | null | undefined}
     */
    const getSelectedDateEl = () =>
      calendarEl?.shadowRoot?.querySelector('.calendar__day-button[selected]');
    await waitUntil(getSelectedDateEl);
    getSelectedDateEl()?.focus();
    await sendKeys({ press: 'ArrowLeft' });
    await sendKeys({ press: 'Enter' });

    expect(keyUpSpy.called).to.equal(false);
  });
  /**
   * @typedef {import('../src/LionCalendar.js').LionCalendar} LionCalendar
   * @typedef {import('lit').TemplateResult} TemplateResult
   */

  const fixtureForSuite = /** @type {(arg: TemplateResult) => Promise<LionCalendar>} */ (_fixture);
  /**
   * @param {HTMLElement} el
   * @returns {HTMLElement | null | undefined}
   */
  const getSelectedDateEl = el => el?.shadowRoot?.querySelector('.calendar__day-button[selected]');
  /**
   * @param {HTMLElement} el
   * @returns {void}
   */
  const focusSelectedDate = el => getSelectedDateEl(el)?.focus();

  describe('<lion-calendar>', () => {
    const localizeManager = getLocalizeManager();

    beforeEach(() => {
      localizeTearDown();
    });

    describe('Structure', () => {
      it('implements BEM structure', async () => {
        const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);

        const elObj = new CalendarObject(el);
        expect(elObj.rootEl).to.exist;
        expect(elObj.headerEl).to.exist;
        expect(elObj.previousYearButtonEl).to.exist;
        expect(elObj.nextYearButtonEl).to.exist;
        expect(elObj.yearHeadingEl).to.exist;
        expect(elObj.gridEl).to.exist;
      });

      it('has heading with month and year', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2000/12/01').getTime() });

        const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);

        expect(el.shadowRoot?.querySelector('#year')).dom.to.equal(`
          <h2
            id="year"
            class="calendar__navigation-heading"
            aria-atomic="true"
          >
            2000
          </h2>
        `);
        expect(el.shadowRoot?.querySelector('#month')).dom.to.equal(`
        <h2
          id="month"
          class="calendar__navigation-heading"
          aria-atomic="true"
        >
          December
        </h2>
      `);

        clock.restore();
      });

      it('has previous year button', async () => {
        const el = await fixtureForSuite(
          html`<${tagCalendar} .centralDate=${new Date('2019/11/20')}></${tagCalendar}>`,
        );
        expect(accessibleName(new CalendarObject(el).previousYearButtonEl)).to.equal(
          'Previous year, November 2018',
        );
      });

      it('has next year button', async () => {
        const el = await fixtureForSuite(
          html`<${tagCalendar} .centralDate=${new Date('2019/11/20')}></${tagCalendar}>`,
        );
        expect(accessibleName(new CalendarObject(el).nextYearButtonEl)).to.equal(
          'Next year, November 2020',
        );
      });

      it('has previous month button', async () => {
        const el = await fixtureForSuite(
          html`<${tagCalendar} .centralDate=${new Date('2019/11/20')}></${tagCalendar}>`,
        );
        expect(accessibleName(new CalendarObject(el).previousMonthButtonEl)).to.equal(
          'Previous month, October 2019',
        );
      });

      it('has next month button', async () => {
        const el = await fixtureForSuite(
          html`<${tagCalendar} .centralDate=${new Date('2019/11/20')}></${tagCalendar}>`,
        );
        expect(accessibleName(new CalendarObject(el).nextMonthButtonEl)).to.equal(
          'Next month, December 2019',
        );
      });
    });

    describe('Public API', () => {
      it('has property "centralDate" that determines currently visible month', async () => {
        const elObj = new CalendarObject(
          await fixtureForSuite(html`
            <${tagCalendar} .centralDate="${new Date('2014/05/15')}"></${tagCalendar}>
          `),
        );
        expect(elObj.activeMonth).to.equal('May');
        expect(elObj.activeYear).to.equal('2014');
      });

      it('sets "centralDate" to today by default', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2013/03/15').getTime() });

        const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
        const elObj = new CalendarObject(el);
        expect(isSameDate(el.centralDate, new Date())).to.be.true;
        expect(elObj.activeMonth).to.equal('March');
        expect(elObj.activeYear).to.equal('2013');

        clock.restore();
      });

      it('determines the date focusable with keyboard from "centralDate"', async () => {
        const elObj = new CalendarObject(
          await fixtureForSuite(html`
            <${tagCalendar} .centralDate="${new Date('2017/07/05')}"></${tagCalendar}>
          `),
        );
        expect(
          elObj.checkForAllDayObjs(
            /** @param {DayObject} o */ o => o.buttonEl.getAttribute('tabindex') === '0',
            /** @param {number} n */ n => n === 5,
          ),
        ).to.be.true;
        expect(
          elObj.checkForAllDayObjs(
            /** @param {DayObject} o */ o => o.buttonEl.getAttribute('tabindex') === '-1',
            /** @param {number} n */ n => n !== 5,
          ),
        ).to.be.true;
      });

      it('has property "selectedDate" for the selected date', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar} .selectedDate="${new Date('2019/06/15')}"></${tagCalendar}>
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
          await fixtureForSuite(html`
            <${tagCalendar}
              .centralDate="${new Date('2018/06/01')}"
              .selectedDate="${new Date('2018/07/15')}"
            ></${tagCalendar}>
          `),
        );
        expect(elObj.activeMonth).to.equal('June');
        expect(elObj.activeYear).to.equal('2018');
      });

      it('changes "centralDate" from default to "selectedDate" on first render if no other custom "centralDate" is provided', async () => {
        const clock = sinon.useFakeTimers({ now: new Date('2010/01/01').getTime() });

        const el = await fixtureForSuite(html`
          <${tagCalendar} .selectedDate="${new Date('2016/10/20')}"></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        expect(isSameDate(el.centralDate, new Date('2016/10/20'))).to.be.true;
        expect(elObj.activeMonth).to.equal('October');
        expect(elObj.activeYear).to.equal('2016');
        clock.restore();
      });

      it('does not change "centralDate" to "selectedDate" when new date is provided programmatically', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .centralDate="${new Date('2018/06/01')}"
            .selectedDate="${new Date('2018/06/02')}"
          ></${tagCalendar}>
        `);
        expect(isSameDate(el.centralDate, new Date('2018/06/01'))).to.be.true;
        el.selectedDate = new Date('2018/06/03');
        await el.updateComplete;
        expect(isSameDate(el.centralDate, new Date('2018/06/01'))).to.be.true;
      });

      it('does not set "selectedDate" by default', async () => {
        const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
        const elObj = new CalendarObject(el);
        const today = new Date();
        expect(el.selectedDate).to.equal(undefined);
        expect(elObj.getDayObj(today.getDate()).isSelected).to.equal(false);
      });

      it('allows to reset "selectedDate"', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar} .selectedDate="${new Date('2019/06/15')}"></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        el.selectedDate = undefined;
        await el.updateComplete;
        expect(elObj.selectedDayObj).to.be.undefined;
      });

      it('recalculates "centralDate" when "selectedDate" is reset', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar} .selectedDate="${new Date('2019/06/15')}"></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        el.selectedDate = undefined;
        await el.updateComplete;
        expect(elObj.selectedDayObj).to.be.undefined;
        expect(isSameDate(el.centralDate, new Date('2019/06/15'))).to.be.true;
      });

      it('sends event "user-selected-date-changed" when user selects a date via mouse', async () => {
        const dateChangedSpy = sinon.spy();
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .selectedDate="${new Date('2000/12/12')}"
            @user-selected-date-changed="${dateChangedSpy}"
          ></${tagCalendar}>
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

      it('doesn\'t send event "user-selected-date-changed" when user selects a disabled date via mouse', async () => {
        const dateChangedSpy = sinon.spy();
        const disable15th = /** @param {Date} d */ d => d.getDate() === 15;
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .selectedDate="${new Date('2000/12/12')}"
            @user-selected-date-changed="${dateChangedSpy}"
            .disableDates=${disable15th}
          ></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        elObj.getDayEl(15).click();
        await el.updateComplete;
        expect(dateChangedSpy.called).to.equal(false);
        expect(isSameDate(/** @type {Date} */ (el.selectedDate), new Date('2000/12/12'))).to.be
          .true;
      });

      it.skip('sends event "user-selected-date-changed" when user selects a date via [Enter]', async () => {
        /**
         * TODO fix me
         * The dispatchEvent of [Enter] should has to be on contentWrapperElement to be called
         * But to get "selected" a check is done if the action comes from a button.
         */
        const dateChangedSpy = sinon.spy();
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .selectedDate="${new Date('2000/10/12')}"
            @user-selected-date-changed="${dateChangedSpy}"
          ></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);

        el.__contentWrapperElement?.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
        );
        await el.updateComplete;
        expect(elObj.activeMonth).to.equal('October');
        expect(elObj.activeYear).to.equal('2000');
        expect(elObj.focusedDayObj?.monthday).to.equal(11);

        el.__contentWrapperElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await el.updateComplete;
        expect(isSameDate(/** @type {Date} */ (el.selectedDate), new Date('2000/10/11'))).to.be
          .true;
        expect(dateChangedSpy.called).to.equal(true);
      });

      it('doesn\'t send event "user-selected-date-changed" when user selects a disabled date via [Enter]', async () => {
        const dateChangedSpy = sinon.spy();
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .selectedDate="${new Date('2000/10/12')}"
            .minDate="${new Date('2000/10/12')}"
            @user-selected-date-changed="${dateChangedSpy}"
          ></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);

        focusSelectedDate(el);
        await sendKeys({ press: 'ArrowLeft' });
        await el.updateComplete;
        expect(elObj.activeMonth).to.equal('October');
        expect(elObj.activeYear).to.equal('2000');
        expect(elObj.focusedDayObj?.monthday).to.equal(11);

        await sendKeys({ press: 'Enter' });
        await el.updateComplete;
        expect(isSameDate(/** @type {Date} */ (el.selectedDate), new Date('2000/10/12'))).to.be
          .true;
        expect(dateChangedSpy.called).to.equal(false);
      });

      it('exposes focusedDate getter', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar} .centralDate="${new Date('2019/06/01')}"></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        expect(el.focusedDate).to.be.null;
        elObj.getDayEl(15).click();
        expect(isSameDate(/** @type {Date} */ (el.focusedDate), new Date('2019/06/15'))).to.equal(
          true,
        );
      });

      it('has a focusDate() method to focus an arbitrary date', async () => {
        const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
        const elObj = new CalendarObject(el);
        await el.focusDate(new Date('2016/06/10'));
        expect(isSameDate(/** @type {Date} */ (el.focusedDate), new Date('2016/06/10'))).to.be.true;
        expect(elObj.getDayObj(10).isFocused).to.be.true;
      });

      it('has a focusCentralDate() method to focus the central date', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .centralDate="${new Date('2015/12/02')}"
            .selectedDate="${new Date('2015/12/04')}"
          ></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        el.focusCentralDate();
        expect(isSameDate(/** @type {Date} */ (el.focusedDate), new Date('2015/12/02'))).to.be.true;
        expect(elObj.getDayObj(2).isFocused).to.be.true;
      });

      it('has a focusSelectedDate() method to focus the selected date', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .centralDate="${new Date('2014/07/05')}"
            .selectedDate="${new Date('2014/07/07')}"
          ></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        await el.focusSelectedDate();
        expect(isSameDate(/** @type {Date} */ (el.focusedDate), new Date('2014/07/07'))).to.be.true;
        expect(elObj.getDayObj(7).isFocused).to.be.true;
      });

      it('has a initCentralDate() method for external contexts like datepickers', async () => {
        const initialCentralDate = new Date('2014/07/05');
        const initialSelectedDate = new Date('2014/07/07');
        const el = await fixtureForSuite(
          html`<${tagCalendar}
            .centralDate="${initialCentralDate}"
            .selectedDate="${initialSelectedDate}"
          ></${tagCalendar}>`,
        );

        expect(el.selectedDate).to.equal(initialSelectedDate);
        expect(el.centralDate).to.equal(initialCentralDate);

        const newSelectedDate = new Date('2015/07/05');
        el.selectedDate = newSelectedDate;
        el.initCentralDate();
        expect(el.centralDate).to.equal(newSelectedDate);
        el.selectedDate = undefined;
        el.initCentralDate();
        expect(el.centralDate).to.equal(initialCentralDate);
      });

      describe('Enabled Dates', () => {
        it('disables all days before "minDate" property', async () => {
          const el = await fixtureForSuite(html`
            <${tagCalendar}
              .selectedDate="${new Date('2000/12/31')}"
              .minDate="${new Date('2000/12/09')}"
            >
            </${tagCalendar}>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.getDayObj(15).isDisabled).to.equal(false);
          elObj.dayEls.forEach((d, i) => {
            const shouldBeDisabled = i < 8;
            expect(new DayObject(d).isDisabled).to.equal(shouldBeDisabled);
          });
        });

        it('disables all days after "maxDate" property', async () => {
          const el = await fixtureForSuite(html`
            <${tagCalendar}
              .selectedDate="${new Date('2000/12/01')}"
              .maxDate="${new Date('2000/12/09')}"
            >
            </${tagCalendar}>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.getDayObj(5).isDisabled).to.equal(false);
          elObj.dayEls.forEach((d, i) => {
            const shouldBeDisabled = i > 8;
            expect(new DayObject(d).isDisabled).to.equal(shouldBeDisabled);
          });
        });

        it('disables a date with disableDates function', async () => {
          /** @param {Date} d */
          const disable15th = d => d.getDate() === 15;
          const el = await fixtureForSuite(html`
            <${tagCalendar}
              .selectedDate="${new Date('2000/12/01')}"
              .disableDates=${disable15th}
            ></${tagCalendar}>
          `);
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

          const el = await fixtureForSuite(html`
            <${tagCalendar}
              .selectedDate="${new Date('2001/01/08')}"
              .disableDates=${/** @param {Date} date */ date => date.getDate() === 3}
            ></${tagCalendar}>
          `);
          const elObj = new CalendarObject(el);
          expect(isSameDate(el.centralDate, new Date('2001/01/08'))).to.be.true;
          expect(elObj.activeMonth).to.equal('January');
          expect(elObj.activeYear).to.equal('2001');

          clock.restore();
        });

        it('requires the user to set an appropriate centralDate even when minDate and maxDate are equal', async () => {
          const clock = sinon.useFakeTimers({ now: new Date('2019/06/03').getTime() });

          const el = await fixtureForSuite(html`
            <${tagCalendar}
              .minDate="${new Date('2019/07/03')}"
              .maxDate="${new Date('2019/07/03')}"
            ></${tagCalendar}>
          `);
          const elSetting = await fixtureForSuite(html`
            <${tagCalendar}
              .centralDate="${new Date('2019/07/03')}"
              .minDate="${new Date('2019/07/03')}"
              .maxDate="${new Date('2019/07/03')}"
            ></${tagCalendar}>
          `);

          clock.restore();
          expect(isSameDate(el.centralDate, new Date('2019/07/03'))).to.be.true;
          expect(isSameDate(elSetting.centralDate, new Date('2019/07/03'))).to.be.true;
        });

        describe('Normalization', () => {
          it('normalizes all generated dates', async () => {
            /** @param {Date} d */
            function isNormalizedDate(d) {
              return d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;
            }

            const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
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

            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .selectedDate="${selectedDate}"
                .minDate="${minDate}"
                .maxDate="${maxDate}"
              ></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);

            expect(elObj.getDayObj(29).isDisabled).to.equal(false);
            expect(elObj.getDayObj(30).isDisabled).to.equal(true);

            expect(elObj.getDayObj(2).isDisabled).to.equal(false);
            expect(elObj.getDayObj(1).isDisabled).to.equal(true);
          });
        });
      });
    });

    describe('Calendar navigation', () => {
      describe('Title', () => {
        it('contains secondary title displaying the current month and year in focus', async () => {
          const el = await fixtureForSuite(
            html`<${tagCalendar}
           
            .selectedDate="${new Date('2000/12/12')}"
          ></${tagCalendar}>`,
          );
          const elObj = new CalendarObject(el);
          expect(elObj.activeMonth).to.equal('December');
          expect(elObj.activeYear).to.equal('2000');
        });

        it('updates the secondary title when the displayed month/year changes', async () => {
          const el = await fixtureForSuite(
            html`<${tagCalendar} .centralDate="${new Date('2000/12/12')}"></${tagCalendar}>`,
          );
          const elObj = new CalendarObject(el);
          el.centralDate = new Date('1999/10/12');
          await el.updateComplete;
          expect(elObj.activeMonth).to.equal('October');
          expect(elObj.activeYear).to.equal('1999');
        });

        describe('Accessibility', () => {
          it('has aria-atomic="true" set on the secondary title', async () => {
            const elObj = new CalendarObject(
              await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`),
            );
            expect(elObj.monthHeadingEl?.getAttribute('aria-atomic')).to.equal('true');
          });
        });
      });

      describe('Navigation', () => {
        describe('finding enabled dates', () => {
          it('has helper for `findNextEnabledDate()`, `findPreviousEnabledDate()`, `findNearestEnabledDate()`', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .selectedDate="${new Date('2001/01/02')}"
                .disableDates=${
                  /** @param {Date} date */ date => date.getDate() === 3 || date.getDate() === 4
                }
              ></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);

            el.focusDate(el.findNextEnabledDate());
            await el.updateComplete;
            expect(elObj.focusedDayObj?.monthday).to.equal(5);

            el.focusDate(el.findPreviousEnabledDate());
            await el.updateComplete;
            expect(elObj.focusedDayObj?.monthday).to.equal(2);

            el.focusDate(el.findNearestEnabledDate());
            await el.updateComplete;
            expect(elObj.focusedDayObj?.monthday).to.equal(1);
          });

          it('future dates take precedence over past dates when "distance" between dates is equal', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .disableDates="${/** @param {Date} d */ d => d.getDate() === 15}"
              ></${tagCalendar}>
            `);
            el.focusDate(el.findNearestEnabledDate(new Date()));
            await el.updateComplete;

            const elObj = new CalendarObject(el);
            expect(elObj.centralDayObj?.monthday).to.equal(16);

            clock.restore();
          });

          it('will search 750 days in the past', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .disableDates="${/** @param {Date} d */ d => d.getFullYear() > 1998}"
              ></${tagCalendar}>
            `);
            el.focusDate(el.findNearestEnabledDate(new Date()));
            await el.updateComplete;

            expect(el.centralDate.getFullYear()).to.equal(1998);
            expect(el.centralDate.getMonth()).to.equal(11);
            expect(el.centralDate.getDate()).to.equal(31);

            clock.restore();
          });

          it('will search 750 days in the future', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .disableDates="${/** @param {Date} d */ d => d.getFullYear() < 2002}"
              ></${tagCalendar}>
            `);

            el.focusDate(el.findNearestEnabledDate(new Date()));
            await el.updateComplete;

            expect(el.centralDate.getFullYear()).to.equal(2002);
            expect(el.centralDate.getMonth()).to.equal(0);
            expect(el.centralDate.getDate()).to.equal(1);

            clock.restore();
          });

          it('throws if no available date can be found within +/- 750 days', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .disableDates="${/** @param {Date} d */ d => d.getFullYear() < 2002}"
              ></${tagCalendar}>
            `);

            expect(() => {
              el.findNextEnabledDate(new Date('1900/01/01'));
            }).to.throw(Error, 'Could not find a selectable date within +/- 750 day for 1900/1/1');
          });
        });

        describe('Year', () => {
          it('has a button for navigation to previous year', async () => {
            const el = await fixtureForSuite(
              html`<${tagCalendar} .selectedDate="${new Date('2001/01/01')}"></${tagCalendar}>`,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.previousYearButtonEl).not.to.equal(null);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');

            /** @type {HTMLElement} */ (elObj.previousYearButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2000');

            /** @type {HTMLElement} */ (elObj.previousYearButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('1999');
          });

          it('has a button for navigation to next year', async () => {
            const el = await fixtureForSuite(
              html`<${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>`,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.nextYearButtonEl).not.to.equal(null);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');

            /** @type {HTMLElement} */ (elObj.nextYearButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2001');

            /** @type {HTMLElement} */ (elObj.nextYearButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2002');
          });

          it('disables previousYearButton and nextYearButton based on disabled days accordingly', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/06/12')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('June');
            expect(elObj.activeYear).to.equal('2000');
            expect(elObj.previousYearButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(elObj.nextYearButtonEl?.hasAttribute('disabled')).to.equal(false);

            el.minDate = new Date('2000/01/01');
            el.maxDate = new Date('2000/12/31');
            await el.updateComplete;

            expect(elObj.previousYearButtonEl?.hasAttribute('disabled')).to.equal(true);
            expect(elObj.nextYearButtonEl?.hasAttribute('disabled')).to.equal(true);

            /** @type {HTMLElement} */ (elObj.previousYearButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('June');
            expect(elObj.activeYear).to.equal('2000');

            el.minDate = new Date('1999/12/31');
            el.maxDate = new Date('2001/01/01');
            await el.updateComplete;

            expect(elObj.previousYearButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(elObj.nextYearButtonEl?.hasAttribute('disabled')).to.equal(false);
          });

          it('sets label to correct month previousYearButton and nextYearButton based on disabled days accordingly', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/06/12')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            el.minDate = new Date('1999/07/12');
            el.maxDate = new Date('2001/05/12');
            await el.updateComplete;

            expect(elObj.previousYearButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(accessibleName(elObj.previousYearButtonEl)).to.equal('Previous year, July 1999');
            expect(elObj.nextYearButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(accessibleName(elObj.nextYearButtonEl)).to.equal('Next year, May 2001');
          });
        });

        describe('Month', () => {
          it('has a button for navigation to previous month', async () => {
            const el = await fixtureForSuite(
              html`<${tagCalendar} .selectedDate="${new Date('2001/01/01')}"></${tagCalendar}>`,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.previousMonthButtonEl).not.to.equal(null);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');

            /** @type {HTMLElement} */ (elObj.previousMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');

            /** @type {HTMLElement} */ (elObj.previousMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('November');
            expect(elObj.activeYear).to.equal('2000');
          });

          it('has a button for navigation to next month', async () => {
            const el = await fixtureForSuite(
              html`<${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>`,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.nextMonthButtonEl).not.to.equal(null);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            /** @type {HTMLElement} */ (elObj.nextMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');

            /** @type {HTMLElement} */ (elObj.nextMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('February');
            expect(elObj.activeYear).to.equal('2001');
          });

          it('disables previousMonthButton and nextMonthButton based on disabled days accordingly', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            expect(elObj.previousMonthButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(elObj.nextMonthButtonEl?.hasAttribute('disabled')).to.equal(false);

            el.minDate = new Date('2000/12/01');
            el.maxDate = new Date('2000/12/31');
            await el.updateComplete;

            expect(elObj.previousMonthButtonEl?.hasAttribute('disabled')).to.equal(true);
            expect(elObj.nextMonthButtonEl?.hasAttribute('disabled')).to.equal(true);
            /** @type {HTMLElement} */ (elObj.previousMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            /** @type {HTMLElement} */ (elObj.previousMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
          });

          it('handles switch to previous month when dates are disabled', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');

            el.minDate = new Date('2000/11/20');
            await el.updateComplete;

            expect(elObj.previousMonthButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(isSameDate(el.centralDate, new Date('2000/12/15'))).to.be.true;

            /** @type {HTMLElement} */ (elObj.previousMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('November');
            expect(elObj.activeYear).to.equal('2000');
            expect(isSameDate(el.centralDate, new Date('2000/11/15'))).to.be.true;

            clock.restore();
          });

          it('handles switch to next month when dates are disabled', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');

            el.maxDate = new Date('2001/01/10');
            await el.updateComplete;

            expect(elObj.nextMonthButtonEl?.hasAttribute('disabled')).to.equal(false);
            expect(isSameDate(el.centralDate, new Date('2000/12/15'))).to.be.true;
            /** @type {HTMLElement} */ (elObj.nextMonthButtonEl).click();
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
            expect(isSameDate(el.centralDate, new Date('2001/01/15'))).to.be.true;

            clock.restore();
          });

          it('supports navigating from larger months to smaller ones (day counts)', async () => {
            // given
            const inputDate = new Date('2019/08/31');
            const element = await fixtureForSuite(html`
              <${tagCalendar} .centralDate="${inputDate}"> </${tagCalendar}>
            `);
            // when
            const remote = new CalendarObject(element);
            /** @type {HTMLElement} */ (remote.nextMonthButtonEl).click();
            await element.updateComplete;
            // then
            expect(remote.activeMonth).to.equal('September');
            expect(remote.activeYear).to.equal('2019');
            expect(remote.centralDayObj?.el).dom.to.equal(`
              <div
                class="calendar__day-button"
                aria-disabled="false"
                role="button"
                tabindex="0"
                aria-pressed="false"
                past=""
                current-month="">
                <span class="calendar__day-button__text">
                  30
                </span>
                <span class="u-sr-only">
                  September 2019 Monday
                </span>
              </div>
            `);
          });
        });

        describe('Accessibility', () => {
          it('navigate buttons have a aria-label and title attribute with accessible label', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            // month
            expect(accessibleName(elObj.previousMonthButtonEl)).to.equal(
              'Previous month, November 2000',
            );
            expect(accessibleName(elObj.previousMonthButtonEl)).to.equal(
              'Previous month, November 2000',
            );
            expect(accessibleName(elObj.nextMonthButtonEl)).to.equal('Next month, January 2001');
            expect(accessibleName(elObj.nextMonthButtonEl)).to.equal('Next month, January 2001');

            // year
            expect(accessibleName(elObj.previousYearButtonEl)).to.equal(
              'Previous year, December 1999',
            );
            expect(accessibleName(elObj.previousYearButtonEl)).to.equal(
              'Previous year, December 1999',
            );
            expect(accessibleName(elObj.nextYearButtonEl)).to.equal('Next year, December 2001');
            expect(accessibleName(elObj.nextYearButtonEl)).to.equal('Next year, December 2001');
          });

          it('disables a date with disableDates function provide a correct message', async () => {
            /** @param {Date} d */
            const disable15th = d => d.getDate() === 15;
            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .selectedDate="${new Date('2000/12/01')}"
                .disableDates=${disable15th}
              ></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.getDayObj(15).isDisabled).to.equal(true);
            expect(elObj.getDayObj(15).el).dom.to.equal(`
              <div
                class="calendar__day-button"
                aria-disabled="true"
                role="button"
                tabindex="-1"
                aria-pressed="false"
                past=""
                current-month="">
                <span class="calendar__day-button__text">
                  15
                </span>
                <span class="u-sr-only">
                  December 2000 Friday This date is unavailable. Please choose another date.
                </span>
              </div>
            `);
          });

          it('disables days before "minDate" property provide a correct message', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .selectedDate="${new Date('2000/12/31')}"
                .minDate="${new Date('2000/12/09')}"
              >
              </${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.getDayObj(1).isDisabled).to.equal(true);
            expect(elObj.getDayObj(1).el).dom.to.equal(`
              <div
                class="calendar__day-button"
                aria-disabled="true"
                role="button"
                tabindex="-1"
                aria-pressed="false"
                past=""
                current-month="">
                <span class="calendar__day-button__text">
                  1
                </span>
                <span class="u-sr-only">
                  December 2000 Friday This date is unavailable. Earliest available date is 9 December 2000. Please choose another date.
                </span>
              </div>
            `);
          });

          it('disables days after "maxDate" property provide a correct message', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .selectedDate="${new Date('2000/12/31')}"
                .maxDate="${new Date('2000/12/09')}"
              >
              </${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.getDayObj(30).isDisabled).to.equal(true);
            expect(elObj.getDayObj(30).el).dom.to.equal(`
              <div
                class="calendar__day-button"
                aria-disabled="true"
                role="button"
                tabindex="-1"
                aria-pressed="false"
                past=""
                current-month="">
                <span class="calendar__day-button__text">
                  30
                </span>
                <span class="u-sr-only">
                  December 2000 Saturday This date is unavailable. Latest available date is 9 December 2000. Please choose another date.
                </span>
              </div>
            `);
          });
        });
      });
    });

    describe('Calendar body (months view)', () => {
      it('renders the days of the week as table headers', async () => {
        const el = await fixtureForSuite(
          html`<${tagCalendar}
            .firstDayOfWeek=${0}
            .selectedDate="${new Date('2000/12/12')}"
          ></${tagCalendar}>`,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.weekdayHeaderEls.map(h => h.textContent?.trim())).to.deep.equal([
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

          const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
          const elObj = new CalendarObject(el);
          expect(elObj.getDayEl(15).hasAttribute('today')).to.be.true;

          expect(
            elObj.checkForAllDayObjs(/** @param {DayObject} d */ d => d.isToday, [15]),
          ).to.equal(true);

          clock.restore();
        });

        it('adds "selected" attribute to the selected date', async () => {
          const el = await fixtureForSuite(
            html`<${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>`,
          );
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDayObjs(
              /** @param {DayObject} obj */ obj => obj.el.hasAttribute('selected'),
              [12],
            ),
          ).to.equal(true);

          el.selectedDate = new Date('2000/12/15');
          await el.updateComplete;
          expect(
            elObj.checkForAllDayObjs(
              /** @param {DayObject} obj */ obj => obj.el.hasAttribute('selected'),
              [15],
            ),
          ).to.equal(true);
        });

        it('adds aria-disabled="true" attribute to disabled dates', async () => {
          const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

          const el = await fixtureForSuite(html`
            <${tagCalendar}
              .selectedDate="${new Date('2000/12/10')}"
              .minDate="${new Date('2000/12/03')}"
              .maxDate="${new Date('2000/12/29')}"
            >
            </${tagCalendar}>
          `);
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDayObjs(
              /** @param {DayObject} d */ d => d.el.getAttribute('aria-disabled') === 'true',
              [1, 2, 30, 31],
            ),
          ).to.equal(true);

          clock.restore();
        });
      });

      describe('User Interaction', () => {
        // For implementation, base on: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/grid/js/dataGrid.js

        describe('Keyboard Navigation', () => {
          it('focused day is reachable via tab (tabindex="0")', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(
              elObj.checkForAllDayObjs(
                /** @param {DayObject} d */ d => d.buttonEl.getAttribute('tabindex') === '0',
                [12],
              ),
            ).to.equal(true);
          });

          it('non focused days are not reachable via tab (have tabindex="-1")', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(
              elObj.checkForAllDayObjs(
                /** @param {DayObject} d */ d => d.buttonEl.getAttribute('tabindex') === '-1',
                /** @param {number} dayNumber */ dayNumber => dayNumber !== 12,
              ),
            ).to.equal(true);
          });

          it('blocks navigation to disabled days', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar}
                .selectedDate="${new Date('2000/12/31')}"
                .minDate="${new Date('2000/12/09')}"
              >
              </${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(
              elObj.checkForAllDayObjs(
                /** @param {DayObject} d */ d => d.buttonEl.getAttribute('tabindex') === '-1',
                /** @param {number} dayNumber */ dayNumber => dayNumber < 9,
              ),
            ).to.equal(true);
          });

          it('navigates through months with [pageup] [pagedown] keys', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2001/01/02')}"></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');

            focusSelectedDate(el);
            await sendKeys({ press: 'PageUp' });

            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');

            await sendKeys({ press: 'PageDown' });
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
          });

          it('navigates through years with [alt + pageup] [alt + pagedown] keys', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2001/01/02')}"></${tagCalendar}>
            `);
            focusSelectedDate(el);

            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');

            await sendKeys({
              down: 'Alt',
            });
            await sendKeys({
              press: 'PageDown',
            });
            await sendKeys({
              up: 'Alt',
            });

            await el.updateComplete;
            focusSelectedDate(el);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2002');

            await sendKeys({
              down: 'Alt',
            });
            await sendKeys({
              press: 'PageUp',
            });
            await sendKeys({
              up: 'Alt',
            });
            await el.updateComplete;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
          });

          describe('Arrow keys', () => {
            it('navigates (sets focus) to next row item via [arrow down] key', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2001/01/02')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowDown' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(2 + 7);
            });

            it('navigates (sets focus) to previous row item via [arrow up] key', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2001/01/02')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowUp' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(26); // of month before
            });

            it('navigates (sets focus) to previous column item via [arrow left] key', async () => {
              // 2000-12-12 is Tuesday; at 2nd of row
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowLeft' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(12 - 1);
            });

            it('navigates (sets focus) to next column item via [arrow right] key', async () => {
              // 2000-12-12 is Tuesday; at 2nd of row
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2000/12/12')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowRight' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(12 + 1);
            });

            it('navigates (sets focus) to next column item via [arrow right] key', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar}
                  .selectedDate="${new Date('2001/01/02')}"
                  .disableDates=${
                    /** @param {Date} date */ date => date.getDate() === 3 || date.getDate() === 4
                  }
                ></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowRight' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(3);
            });

            it('navigates (sets focus) to next row via [arrow right] key if last item in row', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar}
                  .firstDayOfWeek=${0}
                  .selectedDate="${new Date('2019/01/05')}"
                ></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);
              expect(elObj.centralDayObj?.weekdayNameShort).to.equal('Sat');

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowRight' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(6);
              expect(elObj.focusedDayObj?.weekdayNameShort).to.equal('Sun');
            });

            it('navigates (sets focus) to previous row via [arrow left] key if first item in row', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar}
                  .firstDayOfWeek=${0}
                  .selectedDate="${new Date('2019/01/06')}"
                ></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);
              expect(elObj.centralDayObj?.weekdayNameShort).to.equal('Sun');

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowLeft' });
              await el.updateComplete;
              expect(elObj.focusedDayObj?.monthday).to.equal(5);
              expect(elObj.focusedDayObj?.weekdayNameShort).to.equal('Sat');
            });

            it('navigates to next month via [arrow right] key if last day of month', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2000/12/31')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);
              expect(elObj.activeMonth).to.equal('December');
              expect(elObj.activeYear).to.equal('2000');

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowRight' });
              await el.updateComplete;
              expect(elObj.activeMonth).to.equal('January');
              expect(elObj.activeYear).to.equal('2001');
              expect(elObj.focusedDayObj?.monthday).to.equal(1);
            });

            it('navigates to previous month via [arrow left] key if first day of month', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2001/01/01')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);
              expect(elObj.activeMonth).to.equal('January');
              expect(elObj.activeYear).to.equal('2001');

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowLeft' });
              await el.updateComplete;
              expect(elObj.activeMonth).to.equal('December');
              expect(elObj.activeYear).to.equal('2000');
              expect(elObj.focusedDayObj?.monthday).to.equal(31);
            });

            it('navigates to next month via [arrow down] key if last row of month', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2000/12/30')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);
              expect(elObj.activeMonth).to.equal('December');
              expect(elObj.activeYear).to.equal('2000');

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowDown' });
              await el.updateComplete;
              expect(elObj.activeMonth).to.equal('January');
              expect(elObj.activeYear).to.equal('2001');
              expect(elObj.focusedDayObj?.monthday).to.equal(6);
            });

            it('navigates to previous month via [arrow up] key if first row of month', async () => {
              const el = await fixtureForSuite(html`
                <${tagCalendar} .selectedDate="${new Date('2001/01/02')}"></${tagCalendar}>
              `);
              const elObj = new CalendarObject(el);
              expect(elObj.activeMonth).to.equal('January');
              expect(elObj.activeYear).to.equal('2001');

              focusSelectedDate(el);
              await sendKeys({ press: 'ArrowUp' });
              await el.updateComplete;
              expect(elObj.activeMonth).to.equal('December');
              expect(elObj.activeYear).to.equal('2000');
              expect(elObj.focusedDayObj?.monthday).to.equal(26);
            });
          });
        });

        describe('Initial central', () => {
          it('is based on "selectedDate"', async () => {
            const el = await fixtureForSuite(html`
              <${tagCalendar} .selectedDate=${new Date('2019/06/15')}></${tagCalendar}>
            `);
            const elObj = new CalendarObject(el);
            expect(elObj.centralDayObj?.monthday).to.equal(15);
          });

          it('is today if no selected date is available', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
            const elObj = new CalendarObject(el);
            expect(elObj.centralDayObj?.monthday).to.equal(15);

            clock.restore();
          });

          it('is nearest to today if no selected date is available and today is disabled', async () => {
            const clock = sinon.useFakeTimers({ now: new Date('2000/12/15').getTime() });

            const calWithMin = await fixtureForSuite(
              html`<${tagCalendar} .minDate=${new Date('2000/12/25')}></${tagCalendar}>`,
            );
            const calObjWithMin = new CalendarObject(calWithMin);
            expect(calObjWithMin.centralDayObj?.monthday).to.equal(25);

            const calWithMax = await fixtureForSuite(
              html`<${tagCalendar} .maxDate=${new Date('2000/12/05')}></${tagCalendar}>`,
            );
            const calObjWithMax = new CalendarObject(calWithMax);
            expect(calObjWithMax.centralDayObj?.monthday).to.equal(5);

            const calWithDisabled = await fixtureForSuite(
              html`<${tagCalendar}
                .disableDates=${/** @param {Date} date */ date => date.getDate() === 15}
              ></${tagCalendar}>`,
            );
            await calWithDisabled.updateComplete;

            const calObjWithDisabled = new CalendarObject(calWithDisabled);
            expect(calObjWithDisabled.centralDayObj?.monthday).to.equal(16);

            clock.restore();
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
            await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`),
          );
          expect(elObj.rootEl?.getAttribute('role')).to.equal('application');
        });

        it(`renders the calendar as a table element with role="grid", aria-readonly="true" and
          a caption (month + year)`, async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`),
          );
          expect(elObj.gridEl?.getAttribute('role')).to.equal('grid');
          expect(elObj.gridEl?.getAttribute('aria-readonly')).to.equal('true');
        });

        it('adds aria-labels to the weekday table headers', async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`<${tagCalendar} .firstDayOfWeek=${0}></${tagCalendar}>`),
          );
          expect(elObj.weekdayHeaderEls.map(h => accessibleName(h))).to.eql([
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
            await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`),
          );
          const hasBtn = /** @param {DayObject} d */ d =>
            d.el.tagName === 'DIV' && d.el.getAttribute('role') === 'button';
          expect(elObj.checkForAllDayObjs(hasBtn)).to.equal(true);
        });

        it('renders days for previous and next months', async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`
              <${tagCalendar}
                .firstDayOfWeek=${0}
                .selectedDate="${new Date('2000/11/12')}"
              ></${tagCalendar}>
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

          expect(nextMonthDayObjs.length).to.equal(9);
          expect(nextMonthDayObjs[0].cellIndex).to.equal(5);
          expect(nextMonthDayObjs[0].monthday).to.equal(1);
          expect(nextMonthDayObjs[1].cellIndex).to.equal(6);
          expect(nextMonthDayObjs[1].monthday).to.equal(2);
          expect(nextMonthDayObjs[2].cellIndex).to.equal(0);
          expect(nextMonthDayObjs[2].monthday).to.equal(3);
          expect(nextMonthDayObjs[3].cellIndex).to.equal(1);
          expect(nextMonthDayObjs[3].monthday).to.equal(4);
          expect(nextMonthDayObjs[4].cellIndex).to.equal(2);
          expect(nextMonthDayObjs[4].monthday).to.equal(5);
          expect(nextMonthDayObjs[5].cellIndex).to.equal(3);
          expect(nextMonthDayObjs[5].monthday).to.equal(6);
          expect(nextMonthDayObjs[6].cellIndex).to.equal(4);
          expect(nextMonthDayObjs[6].monthday).to.equal(7);
          expect(nextMonthDayObjs[7].cellIndex).to.equal(5);
          expect(nextMonthDayObjs[7].monthday).to.equal(8);
          expect(nextMonthDayObjs[8].cellIndex).to.equal(6);
          expect(nextMonthDayObjs[8].monthday).to.equal(9);
        });

        it('renders days for next months in the last month of the year', async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`
              <${tagCalendar}
                .firstDayOfWeek=${0}
                .selectedDate="${new Date('2020/12/12')}"
              ></${tagCalendar}>
            `),
          );
          const { nextMonthDayObjs } = elObj;
          expect(nextMonthDayObjs.length).to.equal(9);
          expect(nextMonthDayObjs[0].cellIndex).to.equal(5);
          expect(nextMonthDayObjs[0].monthday).to.equal(1);
          expect(nextMonthDayObjs[1].cellIndex).to.equal(6);
          expect(nextMonthDayObjs[1].monthday).to.equal(2);
          expect(nextMonthDayObjs[2].cellIndex).to.equal(0);
          expect(nextMonthDayObjs[2].monthday).to.equal(3);
          expect(nextMonthDayObjs[3].cellIndex).to.equal(1);
          expect(nextMonthDayObjs[3].monthday).to.equal(4);
          expect(nextMonthDayObjs[4].cellIndex).to.equal(2);
          expect(nextMonthDayObjs[4].monthday).to.equal(5);
          expect(nextMonthDayObjs[5].cellIndex).to.equal(3);
          expect(nextMonthDayObjs[5].monthday).to.equal(6);
          expect(nextMonthDayObjs[6].cellIndex).to.equal(4);
          expect(nextMonthDayObjs[6].monthday).to.equal(7);
          expect(nextMonthDayObjs[7].cellIndex).to.equal(5);
          expect(nextMonthDayObjs[7].monthday).to.equal(8);
          expect(nextMonthDayObjs[8].cellIndex).to.equal(6);
          expect(nextMonthDayObjs[8].monthday).to.equal(9);
        });

        it('renders days for previous months in the first month of the year', async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`
              <${tagCalendar}
                .firstDayOfWeek=${0}
                .selectedDate="${new Date('2020/01/12')}"
              ></${tagCalendar}>
            `),
          );
          const { previousMonthDayObjs } = elObj;
          expect(previousMonthDayObjs.length).to.equal(3);
          expect(previousMonthDayObjs[0].cellIndex).to.equal(0);
          expect(previousMonthDayObjs[0].monthday).to.equal(29);
          expect(previousMonthDayObjs[1].cellIndex).to.equal(1);
          expect(previousMonthDayObjs[1].monthday).to.equal(30);
          expect(previousMonthDayObjs[2].cellIndex).to.equal(2);
          expect(previousMonthDayObjs[2].monthday).to.equal(31);
        });

        it('sets aria-current="date" to todays button', async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`),
          );
          const hasAriaCurrent = /** @param {DayObject} d */ d =>
            d.buttonEl.getAttribute('aria-current') === 'date';
          const monthday = new Date().getDate();
          expect(elObj.checkForAllDayObjs(hasAriaCurrent, [monthday])).to.equal(true);
        });

        it('sets aria-pressed="true" on selected date button', async () => {
          const elObj = new CalendarObject(
            await fixtureForSuite(html`
              <${tagCalendar} .selectedDate="${new Date('2000/11/12')}"></${tagCalendar}>
            `),
          );
          const hasAriaPressed = /** @param {DayObject} d */ d =>
            d.buttonEl.getAttribute('aria-pressed') === 'true';
          expect(elObj.checkForAllDayObjs(hasAriaPressed, [12])).to.equal(true);
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
        const el = await fixtureForSuite(html`
          <${tagCalendar} .selectedDate="${new Date('2019/12/20')}"></${tagCalendar}>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.activeMonth).to.equal('December');

        el.locale = 'fr-FR';
        await el.updateComplete;
        expect(elObj.activeMonth).to.equal('décembre');

        localizeManager.locale = 'cs-CZ';
        await el.updateComplete;
        expect(elObj.activeMonth).to.equal('décembre');

        el.locale = '';
        await el.updateComplete;
        expect(elObj.activeMonth).to.equal('prosinec');
      });

      it('displays the right translations according to locale', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .firstDayOfWeek=${0}
            .centralDate=${new Date('2019/11/20')}
          ></${tagCalendar}>
        `);

        const elObj = new CalendarObject(el);
        expect(accessibleName(elObj.nextMonthButtonEl)).to.equal('Next month, December 2019');

        expect(accessibleName(elObj.previousMonthButtonEl)).to.equal(
          'Previous month, October 2019',
        );

        expect(elObj.weekdayHeaderEls.map(h => accessibleName(h))).to.eql([
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]);

        expect(elObj.weekdayHeaderEls.map(h => h.textContent?.trim())).to.deep.equal([
          'Sun',
          'Mon',
          'Tue',
          'Wed',
          'Thu',
          'Fri',
          'Sat',
        ]);

        localizeManager.locale = 'nl-NL';
        await el.localizeNamespacesLoaded;
        await el.updateComplete;
        expect(accessibleName(elObj.nextMonthButtonEl)).to.equal('Volgende maand, december 2019');

        expect(accessibleName(elObj.previousMonthButtonEl)).to.equal('Vorige maand, oktober 2019');

        expect(elObj.weekdayHeaderEls.map(h => accessibleName(h))).to.eql([
          'zondag',
          'maandag',
          'dinsdag',
          'woensdag',
          'donderdag',
          'vrijdag',
          'zaterdag',
        ]);

        expect(elObj.weekdayHeaderEls.map(h => h.textContent?.trim())).to.deep.equal([
          'zo',
          'ma',
          'di',
          'wo',
          'do',
          'vr',
          'za',
        ]);
      });
    });

    describe('Accessibility', () => {
      it('is accessible', async () => {
        const el = await fixtureForSuite(html`<${tagCalendar}></${tagCalendar}>`);
        await expect(el).to.be.accessible();
      });

      it('is accessible with a date selected', async () => {
        const today = new Date();
        const selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const el = await fixtureForSuite(
          html`<${tagCalendar} .selectedDate="${selectedDate}"></${tagCalendar}>`,
        );
        await expect(el).to.be.accessible();
      });

      it('is accessible with disabled dates', async () => {
        const el = await fixtureForSuite(html`
          <${tagCalendar}
            .disableDates=${
              /** @param {Date} date */ date => date.getDay() === 6 || date.getDay() === 0
            }
          ></${tagCalendar}>
        `);
        await expect(el).to.be.accessible();
      });

      it('is hidden when attribute hidden is true', async () => {
        const el = await fixtureForSuite(html`<${tagCalendar} hidden></${tagCalendar}>`);
        expect(el).not.to.be.displayed;
      });
    });
  });
}
