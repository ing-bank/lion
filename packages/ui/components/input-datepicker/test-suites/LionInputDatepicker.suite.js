import { expect, html, fixture, waitUntil, unsafeStatic } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';

/** @typedef {import('@lion/ui/input-datepicker.js').LionInputDatepicker} LionInputDatepicker */

export function runDatepickerSuite({
  datepickerTagName = 'lion-input-datepicker',
  calendarTagName = 'lion-calendar',
} = {}) {
  const tag = unsafeStatic(datepickerTagName);

  it('should not reopen the datepicker popup when the date is selected by keyboard', async () => {
    /** @type {LionInputDatepicker} */
    const el = await fixture(html`<${tag} .modelValue="${new Date('2018/05/30')}"></${tag}>`);
    await el.updateComplete;

    // @ts-ignore
    const openDatepickerButton = el._invokerNode;
    openDatepickerButton?.focus();
    openDatepickerButton?.click();
    /**
     * @returns {HTMLElement | null | undefined}
     */
    const getSelectedDateEl = () =>
      el?.shadowRoot
        ?.querySelector(calendarTagName)
        ?.shadowRoot?.querySelector('.calendar__day-button[selected]');
    await waitUntil(getSelectedDateEl);
    getSelectedDateEl()?.focus();
    await sendKeys({ press: 'ArrowLeft' });
    await sendKeys({ press: 'Enter' });

    expect(el.opened).to.be.false;
  });
}
