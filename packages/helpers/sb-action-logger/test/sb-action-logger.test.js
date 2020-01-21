import { expect, fixture, html } from '@open-wc/testing';
import '../../sb-action-logger.js';

// Note: skips are left out of first iteration

describe('sb-action-logger', () => {
  it('has a default title "Action Logger"', async () => {
    const el = await fixture(html`
      <sb-action-logger></sb-action-logger>
    `);

    expect(el.shadowRoot.querySelector('.header__title').innerText).to.equal('Action Logger');
  });

  it('has a title property / attribute that can be overridden', async () => {
    const el = await fixture(html`
      <sb-action-logger title="Logging your favorite fruit"></sb-action-logger>
    `);

    const titleEl = el.shadowRoot.querySelector('.header__title');

    expect(titleEl.innerText).to.equal('Logging your favorite fruit');
  });

  describe('Logger behavior', () => {
    it('is possible to send something to the logger using the log method', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);

      el.log('Hello, World!');

      const loggerEl = el.shadowRoot.querySelector('.logger');

      expect(loggerEl.children.length).to.equal(1);
      expect(loggerEl.firstElementChild.innerText).to.equal('Hello, World!');
    });

    it('appends new logs to the logger', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);

      el.log('Hello, World!');
      el.log('Hello, Planet!');
      el.log('Hello, Earth!');
      el.log('Hello, World!');
      el.log('Hello, Planet!');

      const loggerEl = el.shadowRoot.querySelector('.logger');

      expect(loggerEl.children.length).to.equal(5);
    });

    it('shows a visual cue whenever something is logged to the logger', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);

      const cueEl = el.shadowRoot.querySelector('.header__log-cue-overlay');
      expect(cueEl.classList.contains('header__log-cue-overlay--slide')).to.be.false;

      el.log('Hello, World!');
      expect(cueEl.classList.contains('header__log-cue-overlay--slide')).to.be.true;
    });

    it('has a visual counter that counts the amount of total logs', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);

      const cueEl = el.shadowRoot.querySelector('.header__log-cue-overlay');

      expect(cueEl.classList.contains('.header__log-cue-overlay--slide')).to.be.false;

      el.log('Hello, World!');
      expect(cueEl.classList.contains('header__log-cue-overlay--slide')).to.be.true;
    });

    it('has a clear button that clears the logs and resets the counter', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);

      el.log('Hello, World!');
      el.log('Hello, Planet!');

      const clearBtn = el.shadowRoot.querySelector('.header__clear');
      clearBtn.click();

      expect(el.shadowRoot.querySelector('.logger').children.length).to.equal(0);
    });

    it('duplicate consecutive logs are kept as one, adds a visual counter', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);

      el.log('Hello, World!');
      el.log('Hello, World!');
      el.log('Hello, World!'); // 3 consecutive dupes
      el.log('Hello, Earth!');
      el.log('Hello, World!');
      el.log('Hello, Planet!');
      el.log('Hello, Planet!'); // 2 consecutive dupes

      const loggerEl = el.shadowRoot.querySelector('.logger');

      const firstLog = loggerEl.firstElementChild;
      const lastLog = loggerEl.lastElementChild;

      expect(loggerEl.children.length).to.equal(4);
      expect(firstLog.querySelector('.logger__log-count').innerText).to.equal('3');
      expect(lastLog.querySelector('.logger__log-count').innerText).to.equal('2');
    });

    it('can be set to simple mode for only showing a single log statement', async () => {
      const el = await fixture(html`
        <sb-action-logger simple></sb-action-logger>
      `);
      el.log('Hello, World!');
      const loggerEl = el.shadowRoot.querySelector('.logger');

      expect(loggerEl.children.length).to.equal(1);
      expect(loggerEl.firstElementChild.querySelector('code').innerText).to.equal('Hello, World!');

      el.log('Hello, Earth!');
      expect(loggerEl.children.length).to.equal(1);
      expect(loggerEl.firstElementChild.querySelector('code').innerText).to.equal('Hello, Earth!');

      el.log('Hello, Planet!');
      el.log('Hello, Planet!');
      expect(loggerEl.children.length).to.equal(1);
      expect(loggerEl.firstElementChild.querySelector('code').innerText).to.equal('Hello, Planet!');
      expect(loggerEl.firstElementChild.querySelector('.logger__log-count')).to.be.null;
    });
  });

  describe('Potential Additional Features', () => {
    it.skip('fires a sb-action-logged event when something is logged to the logger', async () => {
      const el = await fixture(html`
        <sb-action-logger></sb-action-logger>
      `);
      expect(el).to.be.true;
    });
  });
});
