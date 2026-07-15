import '@lion/ui/define/lion-carousel.js';
import { expect, fixture as _fixture, html } from '@open-wc/testing';

/**
 * @typedef {import('../src/LionCarousel.js').LionCarousel} LionCarousel
 */

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionCarousel>} */ (_fixture);

describe('lion-carousel', () => {
  it('initializes with correct default property values', async () => {
    const el = await fixture(html`<lion-carousel></lion-carousel>`);
    expect(el.currentIndex).to.equal(1);
    expect(el.pagination).to.be.false;
    expect(el.slideshow).to.be.false;
  });

  it('renders slot content correctly', async () => {
    const el = await fixture(html`
      <lion-carousel>
        <div slot="slide">Slide 1</div>
        <div slot="slide">Slide 2</div>
      </lion-carousel>
    `);
    expect(el.slides.length).to.equal(2);
  });

  it('updates active slide on _nextSlide call', async () => {
    const el = await fixture(html`
      <lion-carousel>
        <div slot="slide">Slide 1</div>
        <div slot="slide">Slide 2</div>
      </lion-carousel>
    `);
    el.nextSlide();
    await el.updateComplete;
    expect(el.currentIndex).to.equal(2);
  });

  it('loops to the first slide from the last on _nextSlide call', async () => {
    const el = await fixture(html`
      <lion-carousel>
        <div slot="slide">Slide 1</div>
        <div slot="slide">Slide 2</div>
      </lion-carousel>
    `);
    el.currentIndex = 2;
    el.nextSlide();
    await el.updateComplete;
    expect(el.currentIndex).to.equal(1); // Loops back to the first slide
  });

  it('should start slideshow when slideShow is passed', async () => {
    const el = await fixture(html`<lion-carousel slideshow></lion-carousel>`);
    expect(el.slideshow).to.be.true;
    expect(el.slideShowTimer).to.exist;
    // @ts-ignore
    el._stopSlideShow(); // Clean up to prevent the timer from running
  });
});

describe('LionCarousel Accessibility', () => {
  it('passes accessibility tests', async () => {
    const el = await fixture(html`
      <lion-carousel>
        <div slot="slide">Slide 1</div>
        <div slot="slide">Slide 2</div>
      </lion-carousel>
    `);
    await expect(el).to.be.accessible();
  });

  it('passes accessibility tests with pagination enabled', async () => {
    const el = await fixture(html`
      <lion-carousel show-pagination>
        <div slot="slide">Slide 1</div>
        <div slot="slide">Slide 2</div>
      </lion-carousel>
    `);
    await expect(el).to.be.accessible();
  });

  it('passes accessibility tests during slideshow', async () => {
    const el = await fixture(html`
      <lion-carousel slideshow>
        <div slot="slide">Slide 1</div>
        <div slot="slide">Slide 2</div>
      </lion-carousel>
    `);

    // Simulate starting the slideshow
    // @ts-ignore
    el._startSlideShow();
    await el.updateComplete;

    // Wait for the next slide due to animations or transitions
    // await aTimeout(100);

    await expect(el).to.be.accessible();

    // Cleanup to stop the slideshow
    // @ts-ignore
    el._stopSlideShow();
  });
});
