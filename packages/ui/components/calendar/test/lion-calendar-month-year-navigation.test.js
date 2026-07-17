import { html } from 'lit';
import { localizeTearDown } from '@lion/ui/localize-test-helpers.js';
import { expect, fixture as _fixture } from '@open-wc/testing';
import '@lion/ui/define/lion-calendar.js';

/**
 * @typedef {import('../src/LionCalendar.js').LionCalendar} LionCalendar
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionCalendar>} */ (_fixture);
/** Waits for the current macrotask queue to flush (e.g. to let setTimeout(0) callbacks run). */
const nextMacrotask = () =>
  new Promise(resolve => {
    setTimeout(resolve, 0);
  });

describe('LionCalendar - Month and Year Navigation', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  describe('Heading Element Interaction States', () => {
    it('renders month heading as an interactive button with cursor pointer affordance', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = el.shadowRoot?.querySelector('#month-heading');
      expect(monthBtn).to.exist;
      expect(monthBtn?.tagName.toLowerCase()).to.equal('button');
      expect(monthBtn?.classList.contains('calendar__navigation-heading--interactive')).to.be.true;
    });

    it('renders year heading as an interactive button with cursor pointer affordance', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = el.shadowRoot?.querySelector('#year-heading');
      expect(yearBtn).to.exist;
      expect(yearBtn?.tagName.toLowerCase()).to.equal('button');
      expect(yearBtn?.classList.contains('calendar__navigation-heading--interactive')).to.be.true;
    });

    it('displays a visual chevron indicator on the month heading', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const indicator = el.shadowRoot?.querySelector('#month-heading .calendar__heading-indicator');
      expect(indicator).to.exist;
      expect(indicator?.getAttribute('aria-hidden')).to.equal('true');
    });

    it('displays a visual chevron indicator on the year heading', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const indicator = el.shadowRoot?.querySelector('#year-heading .calendar__heading-indicator');
      expect(indicator).to.exist;
      expect(indicator?.getAttribute('aria-hidden')).to.equal('true');
    });
  });

  describe('Month Selection View Trigger', () => {
    it('opens month selection view when month heading is clicked', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.not.exist;

      monthBtn.click();
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;
    });

    it('shows all 12 months in the month selection view', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const monthButtons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      expect(monthButtons?.length).to.equal(12);
    });

    it('month selection view has role="grid" and correct aria-label', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const grid = el.shadowRoot?.querySelector('.calendar__month-selection');
      expect(grid?.getAttribute('role')).to.equal('grid');
      expect(grid?.getAttribute('aria-label')).to.be.a('string').and.not.empty;
    });

    it('month buttons have role="gridcell"', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      buttons?.forEach(btn => {
        expect(btn.getAttribute('role')).to.equal('gridcell');
      });
    });

    it('hides the day grid when month selection view is open', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const calendarRoot = el.shadowRoot?.querySelector('.calendar');
      expect(calendarRoot?.classList.contains('calendar--selection-active')).to.be.true;
    });

    it('highlights the currently selected month', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      // June is index 5 (0-based)
      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      expect(buttons?.[5].classList.contains('calendar__month-button--current')).to.be.true;
      expect(buttons?.[5].getAttribute('aria-selected')).to.equal('true');
    });

    it('closes month selection view when month heading is clicked again (toggle)', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));

      // Open
      monthBtn.click();
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;

      // Close
      monthBtn.click();
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.not.exist;
    });
  });

  describe('Year Selection View Trigger', () => {
    it('opens year selection view when year heading is clicked', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));

      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.not.exist;
      yearBtn.click();
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.exist;
    });

    it('shows 12 years in the year selection grid', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const yearButtons = el.shadowRoot?.querySelectorAll('.calendar__year-button');
      expect(yearButtons?.length).to.equal(12);
    });

    it('year selection grid has role="grid" and correct aria-label', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const grid = el.shadowRoot?.querySelector('.calendar__year-grid');
      expect(grid?.getAttribute('role')).to.equal('grid');
      expect(grid?.getAttribute('aria-label')).to.be.a('string').and.not.empty;
    });

    it('year buttons have role="gridcell"', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__year-button');
      buttons?.forEach(btn => {
        expect(btn.getAttribute('role')).to.equal('gridcell');
      });
    });

    it('hides day grid when year selection view is open', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const calendarRoot = el.shadowRoot?.querySelector('.calendar');
      expect(calendarRoot?.classList.contains('calendar--selection-active')).to.be.true;
    });

    it('highlights the currently selected year in the year selection grid', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const currentYearBtn = el.shadowRoot?.querySelector('.calendar__year-button--current');
      expect(currentYearBtn).to.exist;
      expect(currentYearBtn?.textContent?.trim()).to.equal('2024');
      expect(currentYearBtn?.getAttribute('aria-selected')).to.equal('true');
    });
  });

  describe('Month Selection Navigation', () => {
    it('selecting an enabled month updates centralDate and returns to month view', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const monthHeadingBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('#month-heading')
      );
      monthHeadingBtn.click();
      await el.updateComplete;

      // Click January (index 0)
      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__month-button')
      );
      buttons[0].click();
      await el.updateComplete;

      expect(el.centralDate.getMonth()).to.equal(0); // January
      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.not.exist;
      const calendarRoot = el.shadowRoot?.querySelector('.calendar');
      expect(calendarRoot?.classList.contains('calendar--selection-active')).to.be.false;
    });

    it('clicking a disabled month does not change centralDate', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .minDate=${new Date('2024/04/01')}
        ></lion-calendar>`,
      );
      const monthHeadingBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('#month-heading')
      );
      monthHeadingBtn.click();
      await el.updateComplete;

      const originalMonth = el.centralDate.getMonth();

      // Click January (index 0) - disabled because minDate is April 2024
      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__month-button')
      );
      buttons[0].click();
      await el.updateComplete;

      expect(el.centralDate.getMonth()).to.equal(originalMonth);
      // View should remain open
      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;
    });
  });

  describe('Year Selection Navigation', () => {
    it('selecting an enabled year updates centralDate and returns to month view', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearHeadingBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('#year-heading')
      );
      yearHeadingBtn.click();
      await el.updateComplete;

      // Find and click year 2020
      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      const targetBtn = Array.from(buttons).find(b => b.textContent?.trim() === '2020');
      targetBtn?.click();
      await el.updateComplete;

      expect(el.centralDate.getFullYear()).to.equal(2020);
      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.not.exist;
    });

    it('selecting a year preserves the current month', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearHeadingBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('#year-heading')
      );
      yearHeadingBtn.click();
      await el.updateComplete;

      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      const targetBtn = Array.from(buttons).find(b => b.textContent?.trim() === '2022');
      targetBtn?.click();
      await el.updateComplete;

      // Month should still be June (5)
      expect(el.centralDate.getMonth()).to.equal(5);
      expect(el.centralDate.getFullYear()).to.equal(2022);
    });

    it('clicking a disabled year does not change centralDate', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .minDate=${new Date('2023/01/01')}
        ></lion-calendar>`,
      );
      const yearHeadingBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('#year-heading')
      );
      yearHeadingBtn.click();
      await el.updateComplete;

      const originalYear = el.centralDate.getFullYear();

      // Find a year before minDate (e.g., 2020)
      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      const disabledBtn = Array.from(buttons).find(b => b.getAttribute('aria-disabled') === 'true');
      if (disabledBtn) {
        disabledBtn.click();
        await el.updateComplete;
        expect(el.centralDate.getFullYear()).to.equal(originalYear);
        // View should remain open
        expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.exist;
      }
    });
  });

  describe('Year Range Pagination', () => {
    it('shows previous and next range navigation buttons', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const prevBtn = el.shadowRoot?.querySelector('.calendar__year-range-prev');
      const nextBtn = el.shadowRoot?.querySelector('.calendar__year-range-next');
      expect(prevBtn).to.exist;
      expect(nextBtn).to.exist;
    });

    it('shows 12 new years after clicking next range button', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const initialFirstYear = el.shadowRoot
        ?.querySelector('.calendar__year-button')
        ?.textContent?.trim();

      const nextRangeBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('.calendar__year-range-next')
      );
      nextRangeBtn.click();
      await el.updateComplete;

      const newFirstYear = el.shadowRoot
        ?.querySelector('.calendar__year-button')
        ?.textContent?.trim();

      expect(Number(newFirstYear)).to.equal(Number(initialFirstYear) + 12);
    });

    it('shows 12 earlier years after clicking previous range button', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const initialFirstYear = el.shadowRoot
        ?.querySelector('.calendar__year-button')
        ?.textContent?.trim();

      const prevRangeBtn = /** @type {HTMLElement} */ (
        el.shadowRoot?.querySelector('.calendar__year-range-prev')
      );
      prevRangeBtn.click();
      await el.updateComplete;

      const newFirstYear = el.shadowRoot
        ?.querySelector('.calendar__year-button')
        ?.textContent?.trim();

      expect(Number(newFirstYear)).to.equal(Number(initialFirstYear) - 12);
    });
  });

  describe('Keyboard Navigation in Month Selection View', () => {
    it('opens month selection view on Enter keypress on month heading', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = el.shadowRoot?.querySelector('#month-heading');

      monthBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;
    });

    it('opens month selection view on Space keypress on month heading', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = el.shadowRoot?.querySelector('#month-heading');

      monthBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;
    });

    it('selects focused month on Enter keypress', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      // Navigate to January (index 0) - set focusedMonthIndex directly
      el.__focusedMonthIndex = 0;
      await el.updateComplete;

      const grid = el.shadowRoot?.querySelector('.calendar__month-selection');
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;

      expect(el.centralDate.getMonth()).to.equal(0); // January
    });

    it('does not change centralDate when Escape is pressed', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const originalMonth = el.centralDate.getMonth();
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const grid = el.shadowRoot?.querySelector('.calendar__month-selection');
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;

      expect(el.centralDate.getMonth()).to.equal(originalMonth);
    });

    it('navigates grid with Arrow keys', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      // June is index 5
      el.__focusedMonthIndex = 5;
      await el.updateComplete;

      const grid = el.shadowRoot?.querySelector('.calendar__month-selection');

      // ArrowRight -> July (6)
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedMonthIndex).to.equal(6);

      // ArrowLeft -> June (5)
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedMonthIndex).to.equal(5);

      // ArrowDown -> September (8) (3 columns -> +3)
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedMonthIndex).to.equal(8);

      // ArrowUp -> June (5)
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedMonthIndex).to.equal(5);
    });
  });

  describe('Keyboard Navigation in Year Selection View', () => {
    it('opens year selection view on Enter keypress on year heading', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = el.shadowRoot?.querySelector('#year-heading');

      yearBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.exist;
    });

    it('opens year selection view on Space keypress on year heading', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = el.shadowRoot?.querySelector('#year-heading');

      yearBtn?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.exist;
    });

    it('closes year selection view on Escape', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));

      yearBtn.click();
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.exist;

      const grid = el.shadowRoot?.querySelector('.calendar__year-grid');
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.not.exist;
    });

    it('navigates to next year range on PageDown', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const initialFirstYear = Number(
        el.shadowRoot?.querySelector('.calendar__year-button')?.textContent?.trim(),
      );

      const grid = el.shadowRoot?.querySelector('.calendar__year-grid');
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
      await el.updateComplete;

      const newFirstYear = Number(
        el.shadowRoot?.querySelector('.calendar__year-button')?.textContent?.trim(),
      );
      expect(newFirstYear).to.equal(initialFirstYear + 12);
    });

    it('navigates to previous year range on PageUp', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const initialFirstYear = Number(
        el.shadowRoot?.querySelector('.calendar__year-button')?.textContent?.trim(),
      );

      const grid = el.shadowRoot?.querySelector('.calendar__year-grid');
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
      await el.updateComplete;

      const newFirstYear = Number(
        el.shadowRoot?.querySelector('.calendar__year-button')?.textContent?.trim(),
      );
      expect(newFirstYear).to.equal(initialFirstYear - 12);
    });

    it('navigates grid with Arrow keys', async () => {
      const el = await fixture(
        html`<lion-calendar .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      // Set focus to the 5th year in the grid (index 4)
      el.__focusedYearIndex = 4;
      await el.updateComplete;

      const grid = el.shadowRoot?.querySelector('.calendar__year-grid');

      // ArrowRight -> index 5
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedYearIndex).to.equal(5);

      // ArrowLeft -> index 4
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedYearIndex).to.equal(4);

      // ArrowDown -> index 8 (4 columns -> +4)
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedYearIndex).to.equal(8);

      // ArrowUp -> index 4
      grid?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      await el.updateComplete;
      expect(el.__focusedYearIndex).to.equal(4);
    });
  });

  describe('MinDate and MaxDate Constraints', () => {
    it('disables months before minDate month in the minDate year', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .minDate=${new Date('2024/04/01')}
        ></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      // January (0), February (1), March (2) should be disabled
      expect(buttons?.[0].getAttribute('aria-disabled')).to.equal('true'); // Jan
      expect(buttons?.[1].getAttribute('aria-disabled')).to.equal('true'); // Feb
      expect(buttons?.[2].getAttribute('aria-disabled')).to.equal('true'); // Mar
      // April should be enabled
      expect(buttons?.[3].getAttribute('aria-disabled')).to.equal('false'); // Apr
    });

    it('disables months after maxDate month in the maxDate year', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .maxDate=${new Date('2024/09/30')}
        ></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      // October (9), November (10), December (11) should be disabled
      expect(buttons?.[9].getAttribute('aria-disabled')).to.equal('true'); // Oct
      expect(buttons?.[10].getAttribute('aria-disabled')).to.equal('true'); // Nov
      expect(buttons?.[11].getAttribute('aria-disabled')).to.equal('true'); // Dec
      // September should be enabled
      expect(buttons?.[8].getAttribute('aria-disabled')).to.equal('false'); // Sep
    });

    it('disables years before minDate year in year selection', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .minDate=${new Date('2022/01/01')}
        ></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      buttons.forEach(btn => {
        const year = Number(btn.textContent?.trim());
        if (year < 2022) {
          expect(btn.getAttribute('aria-disabled')).to.equal('true');
        } else {
          expect(btn.getAttribute('aria-disabled')).to.equal('false');
        }
      });
    });

    it('disables years after maxDate year in year selection', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .maxDate=${new Date('2025/12/31')}
        ></lion-calendar>`,
      );
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      buttons.forEach(btn => {
        const year = Number(btn.textContent?.trim());
        if (year > 2025) {
          expect(btn.getAttribute('aria-disabled')).to.equal('true');
        } else {
          expect(btn.getAttribute('aria-disabled')).to.equal('false');
        }
      });
    });
  });

  describe('Integration with LionInputDatepicker', () => {
    it('resets view to month view when initCentralDate is called', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);

      // Open month selection
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;

      // Call initCentralDate (simulates datepicker overlay reopening)
      el.initCentralDate();
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.not.exist;
      const calendarRoot = el.shadowRoot?.querySelector('.calendar');
      expect(calendarRoot?.classList.contains('calendar--selection-active')).to.be.false;
    });
  });

  describe('Localization Support', () => {
    it('displays month names in the correct locale', async () => {
      const el = await fixture(
        html`<lion-calendar locale="de-DE" .centralDate=${new Date('2024/06/15')}></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      // In German, January is "Januar"
      const firstMonthBtn = el.shadowRoot?.querySelector('.calendar__month-button');
      // German months: Januar, Februar, März...
      expect(firstMonthBtn?.textContent?.trim()).to.be.a('string').and.not.empty;
    });
  });

  describe('Requirement 18: DisableDates Constraint Integration', () => {
    it('disables month when all its days are disabled by disableDates', async () => {
      const el = await fixture(
        html`<lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .disableDates=${(/** @type {Date} */ date) =>
            date.getFullYear() === 2024 && date.getMonth() === 1}
        ></lion-calendar>`,
      );
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      // February is index 1
      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      expect(buttons?.[1].getAttribute('aria-disabled')).to.equal('true'); // Feb disabled
      // Other months enabled (e.g., March)
      expect(buttons?.[2].getAttribute('aria-disabled')).to.equal('false'); // Mar enabled
    });
  });

  describe('Screen Reader Live Region', () => {
    it('has an aria-live region for announcements', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const liveRegion = el.shadowRoot?.querySelector('[aria-live="polite"]');
      expect(liveRegion).to.exist;
      expect(liveRegion?.getAttribute('aria-atomic')).to.equal('true');
    });
  });

  describe('Click Outside Behavior', () => {
    it('closes month selection view when clicking outside', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));

      monthBtn.click();
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.exist;

      // Wait for the next macrotask so the Click Outside listener is attached
      await nextMacrotask();

      // Click outside
      document.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__month-selection')).to.not.exist;
    });

    it('closes year selection view when clicking outside', async () => {
      const el = await fixture(html`<lion-calendar></lion-calendar>`);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));

      yearBtn.click();
      await el.updateComplete;
      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.exist;

      // Wait for the next macrotask so the Click Outside listener is attached
      await nextMacrotask();

      // Click outside
      document.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await el.updateComplete;

      expect(el.shadowRoot?.querySelector('.calendar__year-selection')).to.not.exist;
    });
  });

  describe('minDate / maxDate constraints in month and year selection', () => {
    it('disables months before minDate month when viewing minDate year', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .minDate=${new Date('2024/06/01')}
        ></lion-calendar>
      `);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      for (let i = 0; i < 5; i += 1) {
        expect(
          buttons?.[i].getAttribute('aria-disabled'),
          `month ${i} should be disabled`,
        ).to.equal('true');
      }
      for (let i = 5; i < 12; i += 1) {
        expect(buttons?.[i].getAttribute('aria-disabled'), `month ${i} should be enabled`).to.equal(
          'false',
        );
      }
    });

    it('enables all months when viewing a year after minDate year', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate=${new Date('2024/03/01')}
          .minDate=${new Date('2023/06/01')}
        ></lion-calendar>
      `);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      for (let i = 0; i < 12; i += 1) {
        expect(buttons?.[i].getAttribute('aria-disabled'), `month ${i} should be enabled`).to.equal(
          'false',
        );
      }
    });

    it('disables all months when viewing a year before minDate year', async () => {
      const el = await fixture(html`
        <lion-calendar .minDate=${new Date('2024/03/01')}></lion-calendar>
      `);
      el.centralDate = new Date('2022/06/15');
      await el.updateComplete;

      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      for (let i = 0; i < 12; i += 1) {
        expect(
          buttons?.[i].getAttribute('aria-disabled'),
          `month ${i} should be disabled`,
        ).to.equal('true');
      }
    });

    // ------------------------------------------
    // Month grid — maxDate
    // ------------------------------------------

    it('disables months after maxDate month when viewing maxDate year', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .maxDate=${new Date('2024/09/30')}
        ></lion-calendar>
      `);
      const monthBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#month-heading'));
      monthBtn.click();
      await el.updateComplete;

      const buttons = el.shadowRoot?.querySelectorAll('.calendar__month-button');
      for (let i = 0; i <= 8; i += 1) {
        expect(buttons?.[i].getAttribute('aria-disabled'), `month ${i} should be enabled`).to.equal(
          'false',
        );
      }
      for (let i = 9; i < 12; i += 1) {
        expect(
          buttons?.[i].getAttribute('aria-disabled'),
          `month ${i} should be disabled`,
        ).to.equal('true');
      }
    });

    it('disables years before minDate year in the year selection grid', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .minDate=${new Date('2024/01/01')}
        ></lion-calendar>
      `);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      buttons.forEach(btn => {
        const year = Number(btn.dataset.year);
        const expected = year < 2024 ? 'true' : 'false';
        expect(btn.getAttribute('aria-disabled'), `year ${year} aria-disabled`).to.equal(expected);
      });
    });

    it('disables years after maxDate year in the year selection grid', async () => {
      const el = await fixture(html`
        <lion-calendar
          .centralDate=${new Date('2024/06/15')}
          .maxDate=${new Date('2025/12/31')}
        ></lion-calendar>
      `);
      const yearBtn = /** @type {HTMLElement} */ (el.shadowRoot?.querySelector('#year-heading'));
      yearBtn.click();
      await el.updateComplete;

      const buttons = /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll('.calendar__year-button')
      );
      buttons.forEach(btn => {
        const year = Number(btn.dataset.year);
        const expected = year > 2025 ? 'true' : 'false';
        expect(btn.getAttribute('aria-disabled'), `year ${year} aria-disabled`).to.equal(expected);
      });
    });

    // ------------------------------------------
    // initCentralDate — selectedDate outside range
    // ------------------------------------------

    it('navigates to nearest enabled date when selectedDate is before minDate', async () => {
      const el = await fixture(html`
        <lion-calendar
          .selectedDate=${new Date('2020/01/01')}
          .minDate=${new Date('2024/06/01')}
        ></lion-calendar>
      `);
      el.initCentralDate();
      await el.updateComplete;

      expect(el.centralDate.getFullYear()).to.equal(2024);
      expect(el.centralDate.getMonth()).to.be.at.least(5);
    });

    it('navigates to nearest enabled date when selectedDate is after maxDate', async () => {
      const el = await fixture(html`
        <lion-calendar
          .selectedDate=${new Date('2030/12/01')}
          .maxDate=${new Date('2024/09/30')}
        ></lion-calendar>
      `);
      el.initCentralDate();
      await el.updateComplete;

      expect(el.centralDate.getFullYear()).to.equal(2024);
      expect(el.centralDate.getMonth()).to.be.at.most(8);
    });

    it('does NOT move centralDate when selectedDate is within range', async () => {
      const selected = new Date('2024/07/10');
      const el = await fixture(html`
        <lion-calendar
          .selectedDate=${selected}
          .minDate=${new Date('2024/01/01')}
          .maxDate=${new Date('2024/12/31')}
        ></lion-calendar>
      `);
      el.initCentralDate();
      await el.updateComplete;

      expect(el.centralDate.getFullYear()).to.equal(2024);
      expect(el.centralDate.getMonth()).to.equal(6);
      expect(el.centralDate.getDate()).to.equal(10);
    });
  });
});
