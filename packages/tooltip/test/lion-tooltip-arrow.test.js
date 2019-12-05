import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import '../lion-tooltip-arrow.js';
import '../lion-tooltip.js';

describe('lion-tooltip-arrow', () => {
  it('has a visual "arrow" element inside the content node', async () => {
    const el = await fixture(html`
      <lion-tooltip opened>
        <div slot="content">
          Hey there
        </div>
        <lion-button slot="invoker">Tooltip button</lion-button>
      </lion-tooltip>
    `);

    const arrowEl = el.querySelector('lion-tooltip-arrow');
    expect(arrowEl).dom.to.equal(`<lion-tooltip-arrow></lion-tooltip-arrow>`, {
      ignoreAttributes: ['x-arrow', 'placement', 'style'],
    });
    expect(arrowEl).shadowDom.to.equal(`
      <div class="arrow">
        <svg viewBox="0 0 100 80">
          <path d="M 0,0 h 100 L 50,80 z"></path>
        </svg>
      </div>
    `);
  });

  it('reflects popper placement in its own placement property and attribute', async () => {
    const el = await fixture(html`
      <lion-tooltip
        .config=${{
          popperConfig: {
            placement: 'right',
          },
        }}
      >
        <div slot="content">
          Hey there
        </div>
        <lion-button slot="invoker">Tooltip button</lion-button>
      </lion-tooltip>
    `);

    el.opened = true;
    await aTimeout(); // nextFrame is sometimes not enough
    expect(el.querySelector('lion-tooltip-arrow').getAttribute('placement')).to.equal('right');

    el.config = {
      popperConfig: {
        placement: 'bottom',
      },
    };

    // TODO: Remove this once changing configurations no longer closes your overlay
    // Currently it closes your overlay but doesn't set opened to false >:(
    el.opened = false;
    el.opened = true;
    await aTimeout();
    expect(el.querySelector('lion-tooltip-arrow').getAttribute('placement')).to.equal('bottom');
  });

  // Check that this succeeds in the browser. (last checked: 5th December 2019, 14:44)
  // It does not succeed in headless, same reason for popper positioning tests... should get this fixed
  it.skip('makes sure positioning of the arrow is correct', async () => {
    const el = await fixture(html`
      <lion-tooltip
        .config=${{
          popperConfig: {
            placement: 'right',
          },
        }}
      >
        <div slot="content" style="height: 30px; background-color: red;">
          Hey there
        </div>
        <lion-button slot="invoker">Tooltip button</lion-button>
      </lion-tooltip>
    `);
    el.opened = true;

    await aTimeout();
    expect(
      getComputedStyle(el.querySelector('lion-tooltip-arrow')).getPropertyValue('top'),
    ).to.equal(
      '12px',
      '30px content height - 6.39 arrow width = 23.61px, divided by 2 = 11.805px (12px) offset --> arrow is in the middle',
    );

    expect(
      getComputedStyle(el.querySelector('lion-tooltip-arrow')).getPropertyValue('left'),
    ).to.equal(
      '-6.39062px',
      'arrow width of the svg is 6.39062 pixels so this offset should be taken into account to align the arrow properly',
    );
  });
});
