/* eslint-env mocha */
/* eslint-disable no-underscore-dangle */
import { expect, fixture, aTimeout, html } from '@open-wc/testing';
import { until } from '@lion/core';

import heartSvg from './heart.svg.js';
import hammerSvg from './hammer.svg.js';
import '../lion-icon.js';

describe('lion-icon', () => {
  it('displays an svg icon with an aria label attribute', async () => {
    const el = await fixture(
      html`
        <lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>
      `,
    );

    expect(el.children[0].id).to.equal('svg-heart');
    expect(el.getAttribute('role')).to.equal('img');
    expect(el.getAttribute('aria-label')).to.equal('Love');
    expect(el.getAttribute('aria-hidden')).to.equal('false');
  });

  it('displays an svg icon with an aria hidden attribute', async () => {
    const el = await fixture(
      html`
        <lion-icon .svg=${hammerSvg}></lion-icon>
      `,
    );
    expect(el.children[0].id).to.equal('svg-hammer');
    expect(el.getAttribute('aria-hidden')).to.equal('true');
    expect(el.hasAttribute('aria-label')).to.equal(false);
  });

  it('expects svg-icons to have the attribute `focusable="false"` so the icon doesn\'t appear in tab-order in IE/Edge', async () => {
    const icon = await fixture(
      html`
        <lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>
      `,
    );
    expect(icon.children[0].getAttribute('focusable')).to.equal('false');
  });

  it('can change the displayed icon', async () => {
    const el = await fixture(
      html`
        <lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>
      `,
    );
    expect(el.children[0].id).to.equal('svg-heart');
    el.svg = hammerSvg;
    await el.updateComplete;
    expect(el.children[0].id).to.equal('svg-hammer');
  });

  it('can add or remove the aria-label attribute', async () => {
    const el = await fixture(
      html`
        <lion-icon .svg=${heartSvg} aria-label="Love"></lion-icon>
      `,
    );
    const elHammer = await fixture(
      html`
        <lion-icon .svg=${hammerSvg}></lion-icon>
      `,
    );

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

  it('supports dynamic icons using promises', async () => {
    const el = await fixture(
      html`
        <lion-icon
          .svg=${import('./heart.svg.js').then(e => e.default)}
          aria-label="Love"
        ></lion-icon>
      `,
    );
    await el.svg;
    await el.updateComplete;
    expect(el.children[0].id).to.equal('svg-heart');
  });

  it('uses the default export, by default', async () => {
    const el = await fixture(
      html`
        <lion-icon .svg=${import('./heart.svg.js')} aria-label="Love"></lion-icon>
      `,
    );
    await el.svg;
    await el.updateComplete;
    expect(el.children[0].id).to.equal('svg-heart');
  });

  it('supports dynamic icon bundles', async () => {
    const el = await fixture(
      html`
        <lion-icon
          .svg=${import('./myIcon.bundle.js').then(e => e.heart)}
          aria-label="Love"
        ></lion-icon>
      `,
    );
    await el.svg;
    await el.updateComplete;
    expect(el.children[0].id).to.equal('svg-heart');
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
            '',
          )}
          aria-label="Love"
        ></lion-icon>
      `,
    );

    await svgLoading;
    // We need to await the until directive is resolved and rendered to the dom
    // You can not use updateComplete as until renders on it's own
    await aTimeout();

    expect(el.children[0].id).to.equal('svg-heart');
  });
});
