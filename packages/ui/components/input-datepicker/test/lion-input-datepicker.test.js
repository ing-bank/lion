import { LionCalendar, isSameDate } from '@lion/ui/calendar.js';
import { html, LitElement } from 'lit';
import { IsDateDisabled, MaxDate, MinDate, MinMaxDate } from '@lion/ui/form-core.js';
import { aTimeout, defineCE, expect, fixture as _fixture, nextFrame } from '@open-wc/testing';
import { mimicClick } from '@lion/ui/overlays-test-helpers.js';
import sinon from 'sinon';
import { setViewport } from '@web/test-runner-commands';
import { DatepickerInputObject } from '@lion/ui/input-datepicker-test-helpers.js';
import { LionInputDatepicker } from '@lion/ui/input-datepicker.js';

import '@lion/ui/define/lion-input-datepicker.js';

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */

/**
 * @param {LionInputDatepicker} datepickerEl
 */
function getProtectedMembersDatepicker(datepickerEl) {
  // @ts-ignore
  const { __invokerId: invokerId } = datepickerEl;
  return {
    invokerId,
  };
}

/**
 * @param {LionCalendar} calendarEl
 */
function getProtectedMembersCalendar(calendarEl) {
  return {
    // @ts-ignore
    dateSelectedByUser: (...args) => calendarEl.__dateSelectedByUser(...args),
  };
}

const fixture = /** @type {(arg: TemplateResult) => Promise<LionInputDatepicker>} */ (_fixture);

describe('<lion-input-datepicker>', () => {
  describe('Calendar Overlay', () => {
    it('implements calendar-overlay Style component', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      expect(elObj.overlayEl.shadowRoot.querySelector('.calendar-overlay')).not.to.equal(null);
      expect(elObj.overlayEl.shadowRoot.querySelector('.calendar-overlay__header')).not.to.equal(
        null,
      );
      expect(elObj.overlayEl.shadowRoot.querySelector('.calendar-overlay__heading')).not.to.equal(
        null,
      );
      expect(
        elObj.overlayEl.shadowRoot.querySelector('.calendar-overlay__close-button'),
      ).not.to.equal(null);
    });

    it('has a close button, with a tooltip "Close"', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      // Since tooltip not ready, use title which can be progressively enhanced in extension layers.
      expect(elObj.overlayCloseButtonEl.getAttribute('title')).to.equal('Close');
      expect(elObj.overlayCloseButtonEl.getAttribute('aria-label')).to.equal('Close');
    });

    it('has a default title based on input label', async () => {
      const el = await fixture(html`
        <lion-input-datepicker
          .label="${'Pick your date'}"
          .modelValue="${new Date('2020-02-15')}"
        ></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(
        /** @type {HTMLSlotElement} */ (
          elObj.overlayHeadingEl.querySelector('slot[name="heading"]')
        ).assignedNodes()[0],
      ).lightDom.to.equal('Pick your date');
    });

    it('can have a custom heading', async () => {
      const el = await fixture(html`
        <lion-input-datepicker
          label="Pick your date"
          calendar-heading="foo"
        ></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(
        /** @type {HTMLSlotElement} */ (
          elObj.overlayHeadingEl.querySelector('slot[name="heading"]')
        ).assignedNodes()[0],
      ).lightDom.to.equal('foo');
    });

    it('closes the calendar on [esc] key', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);

      elObj.overlayController.contentNode.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Escape' }),
      );
      await nextFrame();
      expect(elObj.overlayController.isShown).to.equal(false);
    });

    it('closes the calendar via close button', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);

      elObj.overlayCloseButtonEl.click();
      await nextFrame();
      expect(elObj.overlayController.isShown).to.equal(false);
    });

    it('closes the calendar via outside click event', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);

      mimicClick(document.body);
      await aTimeout(0);
      expect(elObj.overlayController.isShown).to.be.false;
    });

    /**
     * Not in scope:
     * - centralDate can be overridden
     */
  });

  describe('Calendar Invoker', () => {
    it('adds invoker button that toggles the overlay on click in suffix slot ', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      expect(elObj.invokerEl).not.to.equal(null);
      expect(elObj.overlayController.isShown).to.be.false;
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);
    });

    it('delegates disabled state of host input', async () => {
      const el = await fixture(html`<lion-input-datepicker disabled></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      expect(elObj.overlayController.isShown).to.equal(false);
      await elObj.openCalendar({ click: true });
      expect(elObj.overlayController.isShown).to.equal(false);
      el.disabled = false;
      await elObj.openCalendar({ click: true });
      expect(elObj.overlayController.isShown).to.equal(true);
    });

    it('disables invoker when host input is readonly', async () => {
      const el = await fixture(html`<lion-input-datepicker readonly></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      expect(elObj.overlayController.isShown).to.equal(false);
      await elObj.openCalendar({ click: true });
      expect(elObj.overlayController.isShown).to.equal(false);
      el.readOnly = false;
      await elObj.openCalendar({ click: true });
      expect(elObj.overlayController.isShown).to.equal(true);
    });
  });

  describe('Input - calendar synchronization', () => {
    it('syncs modelValue with lion-calendar', async () => {
      const myDate = new Date('2019/06/15');
      const myOtherDate = new Date('2019/06/28');
      const el = await fixture(html`
        <lion-input-datepicker .modelValue="${myDate}"></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.calendarEl.selectedDate).to.equal(myDate);
      await elObj.selectMonthDay(myOtherDate.getDate());
      expect(isSameDate(/** @type {Date} */ (el.modelValue), myOtherDate)).to.be.true;
    });

    it('restores centralDate when modelValue is cleared', async () => {
      const myDate = new Date('2019/06/15');
      const el = await fixture(html` <lion-input-datepicker></lion-input-datepicker> `);
      const elObj = new DatepickerInputObject(el);
      const initialCentralDate = elObj.calendarEl.centralDate;
      el.modelValue = myDate;

      await elObj.openCalendar();
      expect(elObj.calendarEl.selectedDate).to.equal(myDate);
      expect(elObj.calendarEl.centralDate).to.equal(myDate);

      el.modelValue = undefined;
      expect(elObj.calendarEl.centralDate).to.equal(myDate);
      await elObj.closeCalendar();
      await elObj.openCalendar();

      expect(elObj.calendarEl.centralDate).to.equal(initialCentralDate);
    });

    it('closes the calendar overlay on "user-selected-date-changed"', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      // Make sure the calendar overlay is opened
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);
      // Mimic user input: should fire the 'user-selected-date-changed' event
      await elObj.selectMonthDay(12);
      await el.updateComplete; // safari take a little longer
      expect(elObj.overlayController.isShown).to.equal(false);
    });

    it('focuses selected date on opening of calendar', async () => {
      const el = await fixture(html`
        <lion-input-datepicker .modelValue="${new Date()}"></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      await aTimeout(0);
      expect(
        isSameDate(
          /** @type {Date} */ (elObj.calendarEl.focusedDate),
          /** @type {Date} */ (elObj.calendarEl.selectedDate),
        ),
      ).to.be.true;
    });

    it('focuses central date on opening of calendar if no date selected', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      await aTimeout(0);
      expect(
        isSameDate(
          /** @type {Date} */ (elObj.calendarEl.focusedDate),
          elObj.calendarEl.centralDate,
        ),
      ).to.be.true;
    });

    it('fires model-value-changed with isTriggeredByUser on click', async () => {
      let isTriggeredByUser;
      const myDate = new Date('2019/12/15');
      const myOtherDate = new Date('2019/12/18');
      const el = await fixture(html`
        <lion-input-datepicker
          .modelValue="${myDate}"
          @model-value-changed="${(/** @type {CustomEvent} */ event) => {
            isTriggeredByUser = event.detail.isTriggeredByUser;
          }}"
        >
        </lion-input-datepicker>
      `);

      const elObj = new DatepickerInputObject(el);
      // Make sure the calendar overlay is opened
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);
      // Mimic user input: should fire the 'user-selected-date-changed' event
      await elObj.selectMonthDay(myOtherDate.getDate());
      await el.updateComplete; // safari take a little longer
      expect(isTriggeredByUser).to.be.true;
      expect(el.value).to.equal('18/12/2019');
    });

    describe('Validators', () => {
      /**
       * Validators are the Application Developer facing API in <lion-input-datepicker>:
       * - setting restrictions on min/max/disallowed dates will be done via validators
       * - all validators will be translated under the hood to enabledDates and passed to
       *   lion-calendar
       */
      it('converts IsDateDisabled validator to "disableDates" property', async () => {
        const no15th = /** @param {Date} d */ d => d.getDate() !== 15;
        const no16th = /** @param {Date} d */ d => d.getDate() !== 16;
        const no15thOr16th = /** @param {Date} d */ d => no15th(d) && no16th(d);
        const el = await fixture(html`
          <lion-input-datepicker .validators="${[new IsDateDisabled(no15thOr16th)]}">
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.disableDates).to.equal(no15thOr16th);
      });

      it('converts MinDate validator to "minDate" property', async () => {
        const myMinDate = new Date('2019/06/15');
        const el = await fixture(html` <lion-input-datepicker
          .validators="${[new MinDate(myMinDate)]}"
        >
        </lion-input-datepicker>`);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.minDate).to.equal(myMinDate);
      });

      it('converts MaxDate validator to "maxDate" property', async () => {
        const myMaxDate = new Date('2030/06/15');
        const el = await fixture(html`
          <lion-input-datepicker .validators=${[new MaxDate(myMaxDate)]}> </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.maxDate).to.equal(myMaxDate);
      });

      it('converts MinMaxDate validator to "minDate" and "maxDate" property', async () => {
        const myMinDate = new Date('2019/06/15');
        const myMaxDate = new Date('2030/06/15');
        const el = await fixture(html`
          <lion-input-datepicker
            .validators=${[new MinMaxDate({ min: myMinDate, max: myMaxDate })]}
          >
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.minDate).to.equal(myMinDate);
        expect(elObj.calendarEl.maxDate).to.equal(myMaxDate);
      });

      it('should sync MinDate validator param with Calendar MinDate', async () => {
        const myMinDateValidator = new MinDate(new Date('2020/02/02'));
        const el = await fixture(html`
          <lion-input-datepicker .validators="${[myMinDateValidator]}"> </lion-input-datepicker>
        `);
        myMinDateValidator.param = new Date('2020/01/01');

        expect(el.__calendarMinDate.toString()).to.equal(new Date('2020/01/01').toString());
      });

      it('should sync MaxDate validator param with Calendar MaxDate', async () => {
        const myMaxDateValidator = new MaxDate(new Date('2020/02/02'));
        const el = await fixture(html`
          <lion-input-datepicker .validators="${[myMaxDateValidator]}"> </lion-input-datepicker>
        `);
        myMaxDateValidator.param = new Date('2020/03/03');

        expect(el.__calendarMaxDate.toString()).to.equal(new Date('2020/03/03').toString());
      });

      it('should sync MinMaxDate validator param with Calendar Min And Max Date', async () => {
        const myMinDate = new Date('2019/06/15');
        const myMaxDate = new Date('2030/06/15');
        const myMinMaxDateValidator = new MinMaxDate({ min: myMinDate, max: myMaxDate });
        const el = await fixture(html`
          <lion-input-datepicker .validators=${[myMinMaxDateValidator]}> </lion-input-datepicker>
        `);

        myMinMaxDateValidator.param = {
          min: new Date('2019/05/15'),
          max: new Date('2019/07/15'),
        };

        expect(el.__calendarMinDate.toString()).to.equal(new Date('2019/05/15').toString());
        expect(el.__calendarMaxDate.toString()).to.equal(new Date('2019/07/15').toString());
      });

      /**
       * Not in scope:
       * - min/max attr (like platform has): could be added in future if observers needed
       */
    });
  });

  describe('Calendar smoke tests', () => {
    it('responds properly to keyboard events', async () => {
      const el = await fixture(html`
        <lion-input-datepicker calendar-heading="foo"></lion-input-datepicker>
      `);
      const calendarEl = /** @type {LionCalendar} */ (
        el.shadowRoot?.querySelector('lion-calendar')
      );
      const { dateSelectedByUser } = getProtectedMembersCalendar(calendarEl);
      // First set a fixed date as if selected by a user
      dateSelectedByUser(new Date('December 17, 2020 03:24:00 GMT+0000'));

      await el.updateComplete;
      const elObj = new DatepickerInputObject(el);

      // Open the calendar
      await elObj.openCalendar();

      // Move focus to 18th of December
      calendarEl.shadowRoot
        ?.querySelector('#js-content-wrapper')
        ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      expect(/** @type {Date} */ (calendarEl.focusedDate).getTime()).to.equal(
        new Date('December 18, 2020 03:24:00 GMT+0000').getTime(),
      );
    });

    it('responds properly to click events', async () => {
      const el = await fixture(html`
        <lion-input-datepicker calendar-heading="foo"></lion-input-datepicker>
      `);
      const calendarEl = /** @type {LionCalendar} */ (
        el.shadowRoot?.querySelector('lion-calendar')
      );
      const { dateSelectedByUser } = getProtectedMembersCalendar(calendarEl);

      // First set a fixed date as if selected by a user
      dateSelectedByUser(new Date('December 17, 2020 03:24:00 GMT+0000'));
      await el.updateComplete;
      const elObj = new DatepickerInputObject(el);

      // Open the calendar
      await elObj.openCalendar();

      // Select the first date button, which is 29th of previous month (November)
      const firstDateBtn = /** @type {HTMLButtonElement} */ (
        calendarEl?.shadowRoot?.querySelector('.calendar__day-button')
      );
      firstDateBtn.click();

      expect(/** @type {Date} */ (el.modelValue).getTime()).to.equal(
        new Date('November 29, 2020 03:24:00 GMT+0000').getTime(),
      );
    });
  });

  describe('Accessibility', () => {
    it('has a heading of level 1', async () => {
      const el = await fixture(html`
        <lion-input-datepicker calendar-heading="foo"></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      const hNode = elObj.overlayHeadingEl;
      const headingIsLevel1 =
        hNode.tagName === 'H1' ||
        (hNode.getAttribute('role') === 'heading' && hNode.getAttribute('aria-level') === '1');
      expect(headingIsLevel1).to.be.true;
    });

    it('adds accessible label to invoker button', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      expect(elObj.invokerEl.getAttribute('title')).to.equal('Open date picker');
      expect(elObj.invokerEl.getAttribute('aria-label')).to.equal('Open date picker');
    });

    it('adds [aria-expanded] to invoker button', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);

      expect(elObj.invokerEl.getAttribute('aria-expanded')).to.equal('false');
      await elObj.openCalendar();
      expect(elObj.invokerEl.getAttribute('aria-expanded')).to.equal('true');
      await elObj.closeCalendar();
      expect(elObj.invokerEl.getAttribute('aria-expanded')).to.equal('false');
    });

    it('is accessible when closed', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);

      await expect(elObj.invokerEl).to.be.accessible();
      await expect(elObj.calendarEl).to.be.accessible();
    });

    it('is accessible when open', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      await expect(elObj.calendarEl).to.be.accessible();
      elObj.overlayCloseButtonEl.click();
    });

    it('has accessible invoker when open', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      await expect(elObj.invokerEl).to.be.accessible();
      elObj.overlayCloseButtonEl.click();
    });

    it('is accessible with a disabled date', async () => {
      const no15th = /** @param {Date} d */ d => d.getDate() !== 15;
      const el = await fixture(html`
        <lion-input-datepicker .validators=${[new IsDateDisabled(no15th)]}> </lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      await expect(elObj.calendarEl).to.be.accessible();
      elObj.overlayCloseButtonEl.click();
    });
  });

  describe.skip('Subclassers', () => {
    describe('Providing a custom invoker', () => {
      it('can override the invoker template', async () => {
        const myTag = defineCE(
          class extends LionInputDatepicker {
            /** @override */
            _invokerTemplate() {
              return html`<my-button>Pick my date</my-button>`;
            }
          },
        );

        const myEl = await fixture(html`<${myTag}></${myTag}>`);
        const myElObj = new DatepickerInputObject(myEl);
        const { invokerId } = getProtectedMembersDatepicker(myEl);
        expect(myElObj.invokerEl.tagName.toLowerCase()).to.equal('my-button');

        // All other tests will still pass. Small checkup:
        expect(myElObj.invokerEl.getAttribute('title')).to.equal('Open date picker');
        expect(myElObj.invokerEl.getAttribute('aria-label')).to.equal('Open date picker');
        expect(myElObj.invokerEl.getAttribute('aria-expanded')).to.equal('false');
        expect(myElObj.invokerEl.getAttribute('aria-haspopup')).to.equal('dialog');
        expect(myElObj.invokerEl.getAttribute('slot')).to.equal('suffix');
        expect(myElObj.invokerEl.getAttribute('id')).to.equal(invokerId);
        await myElObj.openCalendar();
        expect(myElObj.overlayController.isShown).to.equal(true);
      });

      it('can allocate the picker in a different slot supported by LionField', async () => {
        /**
         * It's important that this api is used instead of Subclassers providing a slot.
         * When the input-datepicker knows where the calendar invoker is, it can attach
         * the right logic, localization and accessibility functionality.
         */
        const myTag = defineCE(
          class extends LionInputDatepicker {
            constructor() {
              super();
              this._calendarInvokerSlot = 'prefix';
            }
          },
        );

        const myEl = await fixture(html`<${myTag}></${myTag}>`);
        const myElObj = new DatepickerInputObject(myEl);
        expect(myElObj.invokerEl.getAttribute('slot')).to.equal('prefix');
      });
    });

    describe('Providing a custom calendar', () => {
      it('can override the calendar template', async () => {
        customElements.define(
          'my-calendar',
          class extends LionCalendar {
            constructor() {
              super();
              // Change some defaults
              this.firstDayOfWeek = 1; // Start on Mondays instead of Sundays
              this.weekdayHeaderNotation = 'narrow'; // 'T' instead of 'Thu'
            }
          },
        );

        const myTag = defineCE(
          class extends LionInputDatepicker {
            _calendarTemplate() {
              return html`<my-calendar id="calendar"></my-calendar>`;
            }
          },
        );

        const myEl = await fixture(html`<${myTag}></${myTag}>`);
        const myElObj = new DatepickerInputObject(myEl);

        // All other tests will still pass. Small checkup:
        await myElObj.openCalendar();
        expect(myElObj.calendarEl.tagName.toLowerCase()).to.equal('my-calendar');
      });
    });

    describe('Providing a custom overlay', () => {
      it('can override the overlay template', async () => {
        // Keep in mind there is no logic inside this overlay frame; it only handles visuals.
        // All interaction should be delegated to parent, which interacts with the calendar
        // component
        customElements.define(
          'my-calendar-overlay-frame',
          class extends LitElement {
            render() {
              // eslint-disable-line class-methods-use-this
              return html`
                <div class="c-calendar-overlay">
                  <slot></slot>
                  <div class="c-calendar-overlay__footer">
                    <button id="cancel-button" class="c-calendar-overlay__cancel-button">
                      Cancel
                    </button>
                  </div>
                </div>
              `;
            }
          },
        );

        let myOverlayOpenedCbHandled = false;
        let myUserSelectedChangedCbHandled = false;

        const myTag = defineCE(
          class extends LionInputDatepicker {
            // TODO: this method doesn't exist on LionInputDatepicker, so if we re-enable these tests, they should be redone
            // /** @override */
            // _calendarOverlayTemplate() {
            //   return html`
            //     <my-calendar-overlay-frame id="calendar-overlay">
            //       <span slot="heading">${this.calendarHeading}</span>
            //     </my-calendar-overlay-frame>
            //   `;
            // }

            /** @override */
            _onCalendarOverlayOpened() {
              super._onCalendarOverlayOpened();
              myOverlayOpenedCbHandled = true;
            }

            /**
             * @override
             * @param {{ target: { selectedDate: Date }}} opts
             */
            _onCalendarUserSelectedChanged({ target: { selectedDate } }) {
              super._onCalendarUserSelectedChanged({ target: { selectedDate } });
              myUserSelectedChangedCbHandled = true;
            }
          },
        );

        const myEl = await fixture(html`<${myTag}></${myTag}>`);
        const myElObj = new DatepickerInputObject(myEl);

        // All other tests will still pass. Small checkup:
        await myElObj.openCalendar();
        expect(myElObj.overlayEl.tagName.toLowerCase()).to.equal('my-calendar-overlay-frame');
        expect(myOverlayOpenedCbHandled).to.be.true;
        await myElObj.selectMonthDay(1);
        expect(myUserSelectedChangedCbHandled).to.be.true;
      });

      it.skip('can configure the overlay presentation based on media query switch', async () => {});
    });
  });

  describe('regression tests', async () => {
    it('does not submit a form when datepicker is opened', async () => {
      const submitSpy = sinon.spy();
      const form = await fixture(html`
        <form @submit="${submitSpy}">
          <lion-input-datepicker></lion-input-datepicker>
        </form>
      `);
      const el = /** @type {LionInputDatepicker} */ (form.children[0]);
      await el.updateComplete;
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(submitSpy.callCount).to.equal(0);
    });

    it('is hidden when attribute hidden is true', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);

      await el.updateComplete;
      const myElObj = new DatepickerInputObject(el);
      await myElObj.openCalendar();
      myElObj.overlayEl.hidden = true;
      await el.updateComplete;
      expect(getComputedStyle(myElObj.overlayEl).display).to.equal('none', 'Display is not none');
    });
  });

  describe('responsive', async () => {
    it('opens as bottom sheet on mobile', async () => {
      await setViewport({ width: 360, height: 640 });
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const myElObj = new DatepickerInputObject(el);
      await myElObj.openCalendar();
      expect(el.hasArrow).to.be.false;
      expect(
        el?.shadowRoot?.contains(myElObj.overlayController.contentNode),
        'Datepicker does not get rendered as bottom sheet',
      ).to.be.false;
    });

    it('opens as popover on desktop', async () => {
      await setViewport({ width: 1200, height: 640 });
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      const myElObj = new DatepickerInputObject(el);
      await myElObj.openCalendar();
      expect(el.hasArrow).to.be.true;
      expect(
        el?.shadowRoot?.contains(myElObj.overlayController.contentNode),
        'Datepicker does not get rendered as a popover',
      ).to.be.true;
    });

    // TODO: fix a bug in overlays which does not move global nodes back to the local dom
    it.skip('can switch between bottom sheet and popover', async () => {
      const el = await fixture(html`<lion-input-datepicker></lion-input-datepicker>`);
      await el.updateComplete;
      const myElObj = new DatepickerInputObject(el);

      await setViewport({ width: 360, height: 640 });
      await myElObj.openCalendar();
      expect(
        el?.shadowRoot?.contains(myElObj.overlayController.contentNode),
        'Datepicker does not get rendered as bottom sheet',
      ).to.be.false;

      await myElObj.closeCalendar();
      await setViewport({ width: 1200, height: 640 });
      await myElObj.openCalendar();
      expect(
        el?.shadowRoot?.contains(myElObj.overlayController.contentNode),
        'Datepicker does not get rendered as a popover',
      ).to.be.true;
    });
  });
});
