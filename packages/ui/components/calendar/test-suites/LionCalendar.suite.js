import { LionCalendar } from '@lion/ui/calendar.js';
import { expect, html, fixture, waitUntil, unsafeStatic, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import '@lion/ui/define/lion-calendar.js';
import { sendKeys } from '@web/test-runner-commands';

export function runCalendarSuite({ klass = LionCalendar } = {}) {
  const tagStringCalendar = defineCE(class extends klass {});
  const tagCalendar = unsafeStatic(tagStringCalendar);

  it('should fire keyboard press events on keydown', async () => {
    /**
     * Preserves day-grid keyboard handling on keydown.
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

    expect(keyUpSpy.called).to.equal(true);
  });
}
