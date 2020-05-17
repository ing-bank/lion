import { expect, fixture, html } from '@open-wc/testing';
import '../lion-tooltip-arrow.js';
import '../lion-tooltip.js';

describe('lion-tooltip-arrow', () => {
  it('has a visual "arrow" element inside the content node', async () => {
    const el = await fixture(html`
      <lion-tooltip opened>
        <button slot="invoker">Tooltip button</button>
        <div slot="content">Hey there</div>
        <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
      </lion-tooltip>
    `);
    const arrowEl = el.querySelector('lion-tooltip-arrow');
    expect(arrowEl).dom.to.equal(`<lion-tooltip-arrow></lion-tooltip-arrow>`, {
      ignoreAttributes: ['slot', 'placement', 'x-arrow', 'style'],
    });
  });

  it('reflects popper placement in its own placement property and attribute', async () => {
    const el = await fixture(html`
      <lion-tooltip .config=${{ popperConfig: { placement: 'right' } }}>
        <button slot="invoker">Tooltip button</button>
        <div slot="content">Hey there</div>
        <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
      </lion-tooltip>
    `);
    el.opened = true;
    const arrowElement = el.querySelector('lion-tooltip-arrow');

    await el.repositionComplete;
    expect(arrowElement.getAttribute('placement')).to.equal('right');

    el.config = { popperConfig: { placement: 'bottom' } };
    // TODO: Remove this once changing configurations no longer closes your overlay
    // Currently it closes your overlay but doesn't set opened to false >:(
    el.opened = false;
    el.opened = true;

    await el.repositionComplete;
    expect(arrowElement.getAttribute('placement')).to.equal('bottom');
  });

  it('is hidden when attribute hidden is true', async () => {
    const el = await fixture(html`
      <lion-tooltip .config="${{}}">
        <div slot="content">
          Hey there
        </div>
        <button slot="invoker">Tooltip button</button>
        <lion-tooltip-arrow slot="arrow" hidden></lion-tooltip-arrow>
      </lion-tooltip>
    `);
    const arrowElement = el.querySelector('lion-tooltip-arrow');
    el.opened = true;

    await el.repositionComplete;
    expect(arrowElement).not.to.be.displayed;
  });

  it.skip('makes sure positioning of the arrow is correct', async () => {
    const el = await fixture(html`
      <lion-tooltip
        .config="${{
          popperConfig: {
            placement: 'right',
          },
        }}"
        style="position: relative; top: 10px;"
      >
        <div slot="content" style="height: 30px; background-color: red;">
          Hey there
        </div>
        <button slot="invoker" style="height: 30px;">Tooltip button</button>
        <lion-tooltip-arrow slot="arrow"></lion-tooltip-arrow>
      </lion-tooltip>
    `);
    const arrowElement = el.querySelector('lion-tooltip-arrow');
    el.opened = true;

    await el.repositionComplete;

    expect(getComputedStyle(arrowElement).getPropertyValue('top')).to.equal(
      '11px',
      '30px (content height) - 8px = 22px, divided by 2 = 11px offset --> arrow is in the middle',
    );

    expect(
      getComputedStyle(el.querySelector('lion-tooltip-arrow')).getPropertyValue('left'),
    ).to.equal(
      '-10px',
      `
        arrow height is 8px so this offset should be taken into account to align the arrow properly,
        as well as half the difference between width and height ((12 - 8) / 2 = 2)
      `,
    );
  });
});
