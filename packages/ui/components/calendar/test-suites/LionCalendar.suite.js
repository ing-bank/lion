import { html } from 'lit';
import { LionCalendar } from '@lion/ui/calendar.js';
import { expect, fixture as _fixture, waitUntil, unsafeStatic, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/ui/define/lion-calendar.js';
import { sendKeys } from '@web/test-runner-commands';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionCalendar>} */ (_fixture);

export function LionCalendarSuite({ klass = LionCalendar } = {}) {
  const tagStringCalendar = defineCE(class extends klass {});
  const tagCalendar = unsafeStatic(tagStringCalendar);

  describe('<lion-calendar>', () => {
    describe('Public API', () => {
      it('should fire keyboard press events on keyup and not on keydown', async () => {
        /**
         * This is a test for a corner case where `keydown`, `keyup` and `focus` events from different
         * elements are involeved at the same time. Here is the setup. There is a button that has a keyup handler.
         * When clicking on the button we open a dialog with the lion-calendar component.
         * When a user selects a date, we close the dialog, listening by the `user-selected-date-changed`
         * event from lion-calendar. And we do **not** expect the keyup handler from the dialog invoker button
         * gets triggered on the date select. However if pressing Enter when selecting the date is handled by
         * `keydown` event inside `lion-calendar`, then next we close the dialog on `user-selected-date-changed`,
         * the browser focuses automatically previously focused element which is the invoker button and
         * then the keupevent is fired. And since the currently focused element is the invoker button,
         * its keyup handler is triggered. And that is not we expect.
         * To fix it we make sure we trigger the `user-selected-date-changed` event on keyup.
         * Then when we close the dialog the invoker button does not get triggered on the keyup event from
         * initiated by the lion-calendar component
         */

        const keyUpSpy = sinon.spy();
        const el = await fixture(html`
        <div>
          <button @keyup="${keyUpSpy}">Open Dialog</button>
          <dialog>
            <${tagCalendar} .selectedDate="${new Date('2000/10/12')}"></${tagCalendar}>
          </dialog>
        </div>
      `);

        const openDialogButton = el.querySelector('button');
        const dialog = el.querySelector('dialog');
        const calendarEl = el.querySelector(tagCalendar);
        await calendarEl?.updateComplete;
        openDialogButton?.addEventListener('click', () => {
          dialog?.showModal();
        });
        openDialogButton?.addEventListener('keyup', () => {
          dialog?.showModal();
        });
        calendarEl?.addEventListener('user-selected-date-changed', () => {
          dialog?.close();
        });

        openDialogButton?.focus();
        openDialogButton?.click();
        const getSelectedDateEl = () =>
          calendarEl?.shadowRoot?.querySelector('.calendar__day-button[selected]');
        await waitUntil(getSelectedDateEl);
        getSelectedDateEl()?.focus();
        await sendKeys({ press: 'ArrowLeft' });
        await sendKeys({ press: 'Enter' });

        expect(keyUpSpy.called).to.equal(false);
      });
    });
  });
}
