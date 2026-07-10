import { LionCalendar } from '@lion/ui/calendar.js';
import { expect, html, fixture, waitUntil, unsafeStatic, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/ui/define/lion-calendar.js';
import { sendKeys } from '@web/test-runner-commands';

export function runCalendarSuite({ klass = LionCalendar } = {}) {
  const tagStringCalendar = defineCE(class extends klass {});
  const tagCalendar = unsafeStatic(tagStringCalendar);

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
    const test = () => {
      console.log('button keyup');
      keyUpSpy();
    };
    const getDialogEl = () => el.querySelector('dialog');
    const openDialogButtonClickHandler = () => getDialogEl()?.showModal();
    const userSelectedDateChangedHandler = () => getDialogEl()?.close();

    el = await fixture(html`
      <div>
        <button 
          @keyup="${test}" 
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
}
