import { fixture as _fixture, expect } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';

import '../lion-rating.js';

/**
 * @type {import("../src/LionRating").LionRating}
 */

/**
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 * @typedef {import('../src/LionRating').LionRating} LionRating
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionRating>} */ (_fixture);

//  functions
const getTotalItemsToShowAttribute = (
  /** @type {import("../src/LionRating").LionRating} */ element,
) => Number(element.getAttribute('totalItemsToShow'));
const getCurrentRateAttribute = (/** @type {import("../src/LionRating").LionRating} */ element) =>
  Number(element.getAttribute('currentRate'));

// Mock Data
const defaultTotalStarsToShow = 5;
const mockDefaultCurrentRate = 0;

describe('Rating', () => {
  describe('totalItemsToShow prop', () => {
    it('should show 5 stars when no prop is passed', async () => {
      const element = await fixture(html` <lion-rating></lion-rating> `);
      expect(getTotalItemsToShowAttribute(element)).to.equal(defaultTotalStarsToShow);
    });
    it('should change number of total stars when totalItemsToShow prop is passed', async () => {
      // update element with new data
      const mockTotalItemsToShow = 6;
      const element = await fixture(
        html` <lion-rating totalItemsToShow="${mockTotalItemsToShow}"></lion-rating> `,
      );

      expect(getTotalItemsToShowAttribute(element)).to.equal(mockTotalItemsToShow);
    });
  });

  describe('currentRate prop', () => {
    it('should not highlight stars when no currentRate prop is passed', async () => {
      const element = await fixture(html` <lion-rating></lion-rating> `);
      expect(getCurrentRateAttribute(element)).to.equal(mockDefaultCurrentRate);
    });
    it('should highlight stars when currentRate prop is passed', async () => {
      // update element with new currentRate
      const newMockCurrentRate = 4;
      const element = await fixture(
        html` <lion-rating currentRate="${newMockCurrentRate}"></lion-rating> `,
      );
      expect(getCurrentRateAttribute(element)).to.equal(newMockCurrentRate);
    });
  });

  describe('UI and styles', () => {
    it('should have enough radio buttons with proper class', async () => {
      const element = await fixture(
        html`<lion-rating totalItemsToShow="${defaultTotalStarsToShow}"></lion-rating> `,
      );
      const inputElements = element.shadowRoot?.querySelectorAll('.rating__input');

      expect(inputElements?.length).to.equal(defaultTotalStarsToShow);
    });

    it('should have enough label elements with proper class', async () => {
      const element = await fixture(
        html`<lion-rating totalItemsToShow="${defaultTotalStarsToShow}"></lion-rating> `,
      );
      const labelElements = element.shadowRoot?.querySelectorAll('.rating__label');

      expect(labelElements?.length).to.equal(defaultTotalStarsToShow);
    });

    it('should have label elements with proper arial-label', async () => {
      const lastElementLabel = '5stars';
      const element = await fixture(
        html`<lion-rating totalItemsToShow="${defaultTotalStarsToShow}"></lion-rating> `,
      );
      const labelElements = element.shadowRoot?.querySelectorAll('.rating__label');

      expect(labelElements?.[0].getAttribute('aria-label')).to.equal(lastElementLabel);
    });
  });

  describe('User interaction', () => {
    it('click on rate should change the highlited star', async () => {
      const element = await fixture(html` <lion-rating currentRate="2"></lion-rating> `);
      const starsItems = Array.from(
        /** @type {ShadowRoot} */ (element.shadowRoot).querySelectorAll('.rating__label'),
      );
      // @ts-ignore
      starsItems[starsItems.length - 1].click();
      expect(element.currentRate).to.equal(1);
    });

    it('fires on-rate-change event when interacting with the rating', async () => {
      const onRateChangeSpy = sinon.spy();
      const element = await fixture(
        html` <lion-rating currentRate="2" @on-rate-change=${onRateChangeSpy}></lion-rating> `,
      );

      const starsItems = Array.from(
        /** @type {ShadowRoot} */ (element.shadowRoot).querySelectorAll('.rating__label'),
      );

      const oneStar = starsItems[starsItems.length - 1];
      // @ts-ignore
      oneStar.click();
      expect(onRateChangeSpy).to.have.callCount(1);

      element.currentRate = 3;
      expect(onRateChangeSpy).to.have.callCount(2);
    });

    it('should not fires on-rate-change event on readonly is true when interacting with the rating', async () => {
      const onRateChangeSpy = sinon.spy();
      const element = await fixture(
        html`
          <lion-rating currentRate="2" readonly @on-rate-change=${onRateChangeSpy}></lion-rating>
        `,
      );

      const starsItems = Array.from(
        /** @type {ShadowRoot} */ (element.shadowRoot).querySelectorAll('.rating__label'),
      );

      const oneStar = starsItems[starsItems.length - 1];
      // @ts-ignore
      oneStar.click();
      expect(onRateChangeSpy).to.have.callCount(0);
    });
  });

  describe('Accessibility', () => {
    it('have label with rate value for each item', async () => {
      const element = await fixture(html` <lion-rating currentRate="2"></lion-rating> `);

      const starsItems = Array.from(
        /** @type {ShadowRoot} */ (element.shadowRoot).querySelectorAll('.rating__label'),
      );

      const fiveStarlabel = '5stars';
      const fiveStarAriaLabel = starsItems[0].getAttribute('aria-label');
      expect(fiveStarAriaLabel).exist.to.be.equal(fiveStarlabel);
    });
  });
});
