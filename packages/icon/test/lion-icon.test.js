import { nothing, until } from '@lion/core';
import { aTimeout, expect, fixture as _fixture, fixtureSync, html } from '@open-wc/testing';
import '../lion-icon.js';
import { icons } from '../src/icons.js';
import hammerSvg from './hammer.svg.js';
import heartSvg from './heart.svg.js';

/**
 * @typedef {(strings: TemplateStringsArray, ... expr: string[]) => string} TaggedTemplateLiteral
 * @typedef {import('../src/LionIcon').LionIcon} LionIcon
 * @typedef {import('@lion/core').TemplateResult} TemplateResult
 */
const fixture = /** @type {(arg: TemplateResult|string) => Promise<LionIcon>} */ (_fixture);

describe('lion-icon', () => {
  it('supports svg icon as a function which recieves a tag function as an argument and returns a tagged template literal', async () => {
    const iconFunction = /** @param {TaggedTemplateLiteral} tag */ tag =>
      tag`<svg data-test-id="svg"></svg>`;
    const el = await fixture(html`<lion-icon .svg=${iconFunction}></lion-icon>`);
    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg');
  });

  it('is hidden when attribute hidden is true', async () => {
    const iconFunction = /** @param {TaggedTemplateLiteral} tag */ tag =>
      tag`<svg data-test-id="svg"></svg>`;
    const el = await fixture(html`<lion-icon .svg=${iconFunction} hidden></lion-icon>`);
    expect(el).not.to.be.displayed;
  });

  it('supports svg icon as a lit-html template', async () => {
    const icon = html`<svg data-test-id="svg"></svg>`;
    const el = await fixture(html`<lion-icon .svg=${icon}></lion-icon>`);
    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg');
  });

  it('does not support string svg icon', async () => {
    const errorMessage =
      'icon accepts only lit-html templates or functions like "tag => tag`<svg>...</svg>`"';
    expect(() => {
      fixtureSync(html`<lion-icon .svg=${'<svg></svg>'}></lion-icon>`);
    }).to.throw(Error, errorMessage);
    expect(() => {
      fixtureSync(html`<lion-icon .svg=${() => '<svg></svg>'}></lion-icon>`);
    }).to.throw(Error, errorMessage);
  });

  it('displays an svg icon with an aria label attribute', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>`);

    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg-heart');
    expect(el.getAttribute('role')).to.equal('img');
    expect(el.getAttribute('aria-label')).to.equal('Love');
    expect(el.getAttribute('aria-hidden')).to.equal('false');
  });

  it('displays an svg icon with an aria hidden attribute', async () => {
    const el = await fixture(html`<lion-icon .svg=${hammerSvg}></lion-icon>`);
    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg-hammer');
    expect(el.getAttribute('aria-hidden')).to.equal('true');
    expect(el.hasAttribute('aria-label')).to.equal(false);
  });

  it('is accessible with an aria label', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>`);
    await expect(el).to.be.accessible();
  });

  it('is accessible without an aria label', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg}></lion-icon>`);
    await expect(el).to.be.accessible();
  });

  it('expect the svg icon to be aria-hidden', async () => {
    const icon = await fixture(html`<lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>`);
    expect(icon.children[0].getAttribute('aria-hidden')).to.equal('true');
  });

  it('expects svg-icons to have the attribute `focusable="false"` so the icon doesn\'t appear in tab-order in IE/Edge', async () => {
    const icon = await fixture(html`<lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>`);
    expect(icon.children[0].getAttribute('focusable')).to.equal('false');
  });

  it('can change the displayed icon', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>`);
    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg-heart');
    el.svg = hammerSvg;
    await el.updateComplete;
    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg-hammer');
  });

  it('can add or remove the aria-label attribute', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>`);
    const elHammer = await fixture(html`<lion-icon .svg=${hammerSvg}></lion-icon>`);

    // verify initial values
    expect(el.getAttribute('aria-label')).to.equal('Love');
    expect(el.getAttribute('aria-hidden')).to.equal('false');

    expect(elHammer.getAttribute('aria-hidden')).to.equal('true');
    expect(elHammer.hasAttribute('aria-label')).to.equal(false);

    // swap label and hidden on both icons
    el.ariaLabel = '';
    elHammer.ariaLabel = 'Hammer';

    await el.updateComplete;
    expect(el.getAttribute('aria-hidden')).to.equal('true');
    expect(el.hasAttribute('aria-label')).to.equal(false);

    await elHammer.updateComplete;
    expect(elHammer.getAttribute('aria-label')).to.equal('Hammer');
    expect(elHammer.getAttribute('aria-hidden')).to.equal('false');
  });

  it('supports dynamic icons using until directive', async () => {
    const svgLoading = new Promise(resolve => {
      window.addEventListener('importDone', resolve);
    });

    const el = await fixture(
      html`
        <lion-icon
          .svg=${until(
            import('./heart.svg.js').then(e => {
              dispatchEvent(new CustomEvent('importDone'));
              return e.default;
            }),
            html``,
          )}
          aria-label="Love"
        ></lion-icon>
      `,
    );

    await svgLoading;
    // We need to await the until directive is resolved and rendered to the dom
    // You can not use updateComplete as until renders on it's own
    await aTimeout(0);

    expect(el.children[0].getAttribute('data-test-id')).to.equal('svg-heart');
  });

  it('does not render "undefined" if changed from valid input to undefined', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg}></lion-icon>`);
    await el.updateComplete;
    el.svg = nothing;
    await el.updateComplete;
    expect(el.innerHTML).to.equal('<!----><!---->'); // don't use lightDom.to.equal(''), it gives false positives
  });

  it('does not render "null" if changed from valid input to null', async () => {
    const el = await fixture(html`<lion-icon .svg=${heartSvg}></lion-icon>`);
    await el.updateComplete;
    el.svg = nothing;
    await el.updateComplete;
    expect(el.innerHTML).to.equal('<!----><!---->'); // don't use lightDom.to.equal(''), it gives false positives
  });

  it('supports icons using an icon id', async () => {
    try {
      icons.addIconResolver('foo', () => heartSvg);
      const el = await fixture(html`<lion-icon icon-id="foo:lorem:ipsum"></lion-icon>`);

      expect(/** @type {HTMLElement} */ (el.children[0]).dataset.testId).to.equal('svg-heart');
    } finally {
      icons.removeIconResolver('foo');
    }
  });

  it('clears rendered icon when icon id is removed', async () => {
    try {
      icons.addIconResolver('foo', () => heartSvg);
      const el = await fixture(html`<lion-icon icon-id="foo:lorem:ipsum"></lion-icon>`);
      await el.updateComplete;
      el.removeAttribute('icon-id');
      await el.updateComplete;
      expect(el.children.length).to.equal(0);
    } finally {
      icons.removeIconResolver('foo');
    }
  });

  it('does not create race conditions when icon changed while resolving icon id', async () => {
    try {
      icons.addIconResolver(
        'foo',
        () => new Promise(resolve => setTimeout(() => resolve(heartSvg), 10)),
      );
      icons.addIconResolver(
        'bar',
        () => new Promise(resolve => setTimeout(() => resolve(hammerSvg), 4)),
      );
      const el = await fixture(html`<lion-icon icon-id="foo:lorem:ipsum"></lion-icon>`);

      await el.updateComplete;
      el.iconId = 'bar:lorem:ipsum';
      await el.updateComplete;
      await aTimeout(4);

      // heart is still loading at this point, but hammer came later so that should be later
      expect(/** @type {HTMLElement} */ (el.children[0]).dataset.testId).to.equal('svg-hammer');
      await aTimeout(10);
      // heart finished loading, but it should not be rendered because hammer came later
      expect(/** @type {HTMLElement} */ (el.children[0]).dataset.testId).to.equal('svg-hammer');
    } finally {
      icons.removeIconResolver('foo');
      icons.removeIconResolver('bar');
    }
  });
});
