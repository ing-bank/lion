import { expect, fixture, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { html, LitElement } from '@lion/core';
import {
  maxDateValidator,
  minDateValidator,
  minMaxDateValidator,
  isDateDisabledValidator,
} from '@lion/validate';
import { LionCalendar } from '@lion/calendar';
import { isSameDate } from '@lion/calendar/src/utils/isSameDate.js';
import { DatepickerInputObject } from '../test-helpers.js';
import { LionInputDatepicker } from '../src/LionInputDatepicker.js';
import '../lion-input-datepicker.js';

describe('<lion-input-datepicker>', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  describe('Calendar Overlay', () => {
    it('implements calendar-overlay Style component', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
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

    it.skip('activates full screen mode on mobile screens', async () => {
      // TODO: should this be part of globalOverlayController as option?
    });

    it('has a close button, with a tooltip "Close"', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
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
        elObj.overlayHeadingEl.querySelector('slot[name="heading"]').assignedNodes()[0],
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
        elObj.overlayHeadingEl.querySelector('slot[name="heading"]').assignedNodes()[0],
      ).lightDom.to.equal('foo');
    });

    // TODO: fix the Overlay system, so that the backdrop/body cannot be focused
    it('closes the calendar on [esc] key', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);

      elObj.overlayController.contentNode.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Escape' }),
      );
      expect(elObj.overlayController.isShown).to.equal(false);
    });

    it('closes the calendar via close button', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);

      elObj.overlayCloseButtonEl.click();
      expect(elObj.overlayController.isShown).to.equal(false);
    });

    /**
     * Not in scope:
     * - centralDate can be overridden
     */
  });

  describe('Calendar Invoker', () => {
    it('adds invoker button that toggles the overlay on click in suffix slot ', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      expect(elObj.invokerEl).not.to.equal(null);
      expect(elObj.overlayController.isShown).to.be.false;
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);
    });

    // Relies on delegation of disabled property to invoker.
    // TODO: consider making this (delegation to interactive child nodes) generic functionality
    // inside LionField/FormControl. Or, for maximum flexibility, add a config attr
    // to the invoker node like 'data-disabled-is-delegated'
    it('delegates disabled state of host input', async () => {
      const el = await fixture(html`
        <lion-input-datepicker disabled></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      expect(elObj.overlayController.isShown).to.equal(false);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(false);
      el.disabled = false;
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);
    });

    it('disables invoker when host input is readonly', async () => {
      const el = await fixture(html`
        <lion-input-datepicker readonly></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      expect(elObj.overlayController.isShown).to.equal(false);
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(false);
      el.readOnly = false;
      await elObj.openCalendar();
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
      expect(isSameDate(el.modelValue, myOtherDate)).to.be.true;
    });

    it('closes the calendar overlay on "user-selected-date-changed"', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      // Make sure the calendar overlay is opened
      await elObj.openCalendar();
      expect(elObj.overlayController.isShown).to.equal(true);
      // Mimic user input: should fire the 'user-selected-date-changed' event
      await elObj.selectMonthDay(12);
      expect(elObj.overlayController.isShown).to.equal(false);
    });

    it('focuses interactable date on opening of calendar', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(elObj.calendarObj.focusedDayObj.el).not.to.equal(null);
    });

    describe('Validators', () => {
      /**
       * Validators are the Application Developer facing API in <lion-input-datepicker>:
       * - setting restrictions on min/max/disallowed dates will be done via validators
       * - all validators will be translated under the hood to enabledDates and passed to
       *   lion-calendar
       */
      it('converts isDateDisabledValidator to "disableDates" property', async () => {
        const no15th = d => d.getDate() !== 15;
        const no16th = d => d.getDate() !== 16;
        const no15thOr16th = d => no15th(d) && no16th(d);
        const el = await fixture(html`
          <lion-input-datepicker .errorValidators="${[isDateDisabledValidator(no15thOr16th)]}">
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.disableDates).to.equal(no15thOr16th);
      });

      it('converts minDateValidator to "minDate" property', async () => {
        const myMinDate = new Date('2019/06/15');
        const el = await fixture(html`
          <lion-input-datepicker .errorValidators=${[minDateValidator(myMinDate)]}>
          </lion-input-date>`);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.minDate).to.equal(myMinDate);
      });

      it('converts maxDateValidator to "maxDate" property', async () => {
        const myMaxDate = new Date('2030/06/15');
        const el = await fixture(html`
          <lion-input-datepicker .errorValidators=${[maxDateValidator(myMaxDate)]}>
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.maxDate).to.equal(myMaxDate);
      });

      it('converts minMaxDateValidator to "minDate" and "maxDate" property', async () => {
        const myMinDate = new Date('2019/06/15');
        const myMaxDate = new Date('2030/06/15');
        const el = await fixture(html`
          <lion-input-datepicker
            .errorValidators=${[minMaxDateValidator({ min: myMinDate, max: myMaxDate })]}
          >
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        await elObj.openCalendar();

        expect(elObj.calendarEl.minDate).to.equal(myMinDate);
        expect(elObj.calendarEl.maxDate).to.equal(myMaxDate);
      });

      /**
       * Not in scope:
       * - min/max attr (like platform has): could be added in future if observers needed
       */
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
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();

      expect(elObj.invokerEl.getAttribute('title')).to.equal('Open date picker');
      expect(elObj.invokerEl.getAttribute('aria-label')).to.equal('Open date picker');
    });

    // TODO: move this functionality to GlobalOverlay
    it('adds aria-haspopup="dialog" and aria-expanded="true" to invoker button', async () => {
      const el = await fixture(html`
        <lion-input-datepicker></lion-input-datepicker>
      `);
      const elObj = new DatepickerInputObject(el);

      expect(elObj.invokerEl.getAttribute('aria-haspopup')).to.equal('dialog');
      expect(elObj.invokerEl.getAttribute('aria-expanded')).to.equal('false');
    });
  });

  describe.skip('Subclassers', () => {
    describe('Providing a custom invoker', () => {
      it('can override the invoker template', async () => {
        const myTag = defineCE(
          class extends LionInputDatepicker {
            /** @override */
            _invokerTemplate() {
              return html`
                <my-button>Pick my date</my-button>
              `;
            }
          },
        );

        const myEl = await fixture(`<${myTag}></${myTag}>`);
        const myElObj = new DatepickerInputObject(myEl);
        expect(myElObj.invokerEl.tagName.toLowerCase()).to.equal('my-button');

        // All other tests will still pass. Small checkup:
        expect(myElObj.invokerEl.getAttribute('title')).to.equal('Open date picker');
        expect(myElObj.invokerEl.getAttribute('aria-label')).to.equal('Open date picker');
        expect(myElObj.invokerEl.getAttribute('aria-expanded')).to.equal('false');
        expect(myElObj.invokerEl.getAttribute('aria-haspopup')).to.equal('dialog');
        expect(myElObj.invokerEl.getAttribute('slot')).to.equal('suffix');
        expect(myElObj.invokerEl.getAttribute('id')).to.equal(myEl.__invokerId);
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

        const myEl = await fixture(`<${myTag}></${myTag}>`);
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
              return html`
                <my-calendar id="calendar"></my-calendar>
              `;
            }
          },
        );

        const myEl = await fixture(`<${myTag}></${myTag}>`);
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
            /** @override */
            _calendarOverlayTemplate() {
              return html`
                <my-calendar-overlay-frame id="calendar-overlay">
                  <span slot="heading">${this.calendarHeading}</span>
                  ${this._calendarTemplateConfig(this._calendarTemplate())}
                </my-calendar-overlay-frame>
              `;
            }

            /** @override */
            _onCalendarOverlayOpened(...args) {
              super._onCalendarOverlayOpened(...args);
              myOverlayOpenedCbHandled = true;
            }

            /** @override */
            _onCalendarUserSelectedChanged(...args) {
              super._onCalendarUserSelectedChanged(...args);
              myUserSelectedChangedCbHandled = true;
            }
          },
        );

        const myEl = await fixture(`<${myTag}></${myTag}>`);
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
      const el = form.children[0];
      await el.updateComplete;
      const elObj = new DatepickerInputObject(el);
      await elObj.openCalendar();
      expect(submitSpy.callCount).to.equal(0);
    });
  });
});
