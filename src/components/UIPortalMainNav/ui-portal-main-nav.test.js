import {
  csrFixture,
  ssrNonHydratedFixture,
  ssrHydratedFixture,
} from '@lit-labs/testing/fixtures.js';
import { a11ySnapshot, findAccessibilityNode } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import { html } from 'lit';
import { expect } from '@open-wc/testing';
import { initNavData } from './ui-portal-main-nav.js';

function getTemplateContext(el) {
  let { templateContext } = el;
  const { currentLayout } = el.layoutCtrl;
  if (el.layouts[currentLayout]?.templateContext) {
    templateContext = el.layouts[currentLayout]?.templateContext(templateContext);
  }
  return templateContext;
}

describe('initNavData', () => {
  it('adds `active` state for current url', () => {
    const myNavData = { items: [{ name: 'myName', url: '/my-url' }] };
    initNavData(myNavData, { activePath: '/my-url' });
    expect(myNavData).to.deep.equal({ items: [{ name: 'myName', url: '/my-url', active: true }] });

    const mySecondNavData = {
      items: [
        { name: 'myName', url: '/my-url' },
        { name: 'mySecondName', url: '/my-second-url' },
      ],
    };
    initNavData(mySecondNavData, { activePath: '/my-second-url' });
    expect(mySecondNavData).to.deep.equal({
      items: [
        { name: 'myName', url: '/my-url' },
        { name: 'mySecondName', url: '/my-second-url', active: true },
      ],
    });
  });

  it('adds `hasActiveChild` state to parent of current url', () => {
    const myNestedNavData = {
      items: [
        {
          name: 'myName',
          nextLevel: { items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item' }] },
        },
      ],
    };
    initNavData(myNestedNavData, { activePath: '/my-url/next-level-item' });
    expect(myNestedNavData).to.deep.equal({
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item', active: true }],
          },
        },
      ],
    });
  });

  it('resets all state when {shouldReset:true} provided', () => {
    const myActiveNavData = {
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item', active: true }],
          },
        },
      ],
    };
    initNavData(myActiveNavData, { shouldReset: true });
    expect(myActiveNavData).to.deep.equal({
      items: [
        {
          name: 'myName',
          nextLevel: {
            items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item' }],
          },
        },
      ],
    });
  });

  it('does not reset state when of a newly set active parent', () => {
    const myActiveNavData = {
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [
              {
                name: 'l1Item',
                url: '/my-url/l1-item',
                hasActiveChild: true,
                nextLevel: {
                  items: [
                    {
                      name: 'l2Item',
                      url: '/my-url/l1-item/l2-item',
                      active: true,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
    // When we set our parent to active, we should not reset the state
    const parentOfActive = myActiveNavData.items[0].nextLevel.items[0];

    initNavData(myActiveNavData, { shouldReset: true, activeItem: parentOfActive });

    expect(myActiveNavData).to.deep.equal({
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [
              {
                name: 'l1Item',
                active: true,
                url: '/my-url/l1-item',
                nextLevel: {
                  items: [
                    {
                      name: 'l2Item',
                      url: '/my-url/l1-item/l2-item',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });
});

for (const [fixture, fixtureMode] of [
  [csrFixture, 'csr'],
  /* [ssrNonHydratedFixture, 'ssr-hydrated'], [ssrHydratedFixture, 'ssr'],*/
]) {
  runUIPortalMainNavSuite({
    fixture,
    fixtureMode,
    fixtureConfig: {
      modules: ['./ui-portal-main-nav.js'],
      base: 'http://localhost:8000/src/components/UIPortalMainNav/',
    },
  });
}

function runUIPortalMainNavSuite({ fixture, fixtureConfig, fixtureMode }) {
  describe('UIPortalMainNav', () => {
    describe('Navigation data', () => {
      it('has `[nav-data]` of type `NavLevel` for populating the navigation menu', async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(
          html`<ui-portal-main-nav nav-data="${JSON.stringify(navData)}"></ui-portal-main-nav>`,
          fixtureConfig,
        );
        const templateContext = getTemplateContext(el);

        const snapshot = await a11ySnapshot();
        const homeLink = findAccessibilityNode(
          snapshot,
          node => node.name === navData.items[0].name && node.role === 'link',
        );
        expect(homeLink).to.not.be.null;
        const l1InvokerBtn = findAccessibilityNode(
          snapshot,
          node => node.name === templateContext.translations.l1Invoker && node.role === 'button',
        );
        expect(l1InvokerBtn).to.not.be.null;

        // if (fixtureMode === 'ssr') {
        //   return;
        //   // await visualDiff(el, 'default--ssr');
        // } else {
        //   el.refs['l1-invoker'].click();
        //   await el.updateComplete;
        //   console.log(el.refs['level-1']);
        //   console.log(el.layoutCtrl.currentLayout);

        //   await visualDiff(document.body, 'default--csr-and-hydrated');
        // }
        // expect(el.refs['root']).to.exist;
        // expect(el.refs['nav']).to.exist;
      });

      it.skip('requires `NavDataItem.name` for displaying the navigation item name', async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(
          html`<ui-portal-main-nav nav-data="${JSON.stringify(navData)}"></ui-portal-main-nav>`,
          fixtureConfig,
        );

        // const anchor = el.shadowRoot.querySelector('[data-part="anchor"][data-level="1"]');

        // expect(anchor).to.equal('test');
      });

      it.skip("requires `NavDataItem.url` for displaying the navigation item url (when it's not a toggle for next level)", async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(html`<ui-portal-main-nav></ui-portal-main-nav>`, fixtureConfig);
      });

      // it.skip('supports `NavDataItem.iconId` for displaying an icon next to the name', async () => {
      //   const navData = { items: [{ name: 'home', url: '/', iconId }] };
      //   const el = await fixture(html`<ui-portal-main-nav></ui-portal-main-nav>`, fixtureConfig);
      // });

      describe.skip('Multiple levels', () => {
        it('supports multiple levels via "nextLevel"', async () => {
          const navData = {
            items: [
              {
                name: 'home',
                url: '/',
                nextLevel: {
                  items: [
                    {
                      name: 'l1ItemA',
                      url: '/l1-item-a',
                    },
                    {
                      name: 'l1ItemB',
                      url: '/l1-item-b',
                      nextLevel: { items: [{ name: 'l2ItemA', url: '/l1-item-b/l2-item-a' }] },
                    },
                  ],
                },
              },
            ],
          };
          const el = await fixture(
            html`<ui-portal-main-nav nav-data="${JSON.stringify(navData)}"></ui-portal-main-nav>`,
            fixtureConfig,
          );
        });

        it('renders multiple levels as collapsible buttons', async () => {
          const navData = { items: [{ name: 'home', url: '/' }] };
          const el = await fixture(html`<ui-portal-main-nav></ui-portal-main-nav>`, fixtureConfig);
        });
      });
    });

    describe('A11y', () => {});

    describe('L10n', () => {
      // it('supports translations', async () => {
      //   const navData = { items: [{ name: 'home', url: '/' }] };
      //   const el = await fixture(
      //     html`<ui-portal-main-nav nav-data="${JSON.stringify(navData)}"></ui-portal-main-nav>`,
      //     fixtureConfig,
      //   );
      //   //
      // });
    });

    describe('Subclassers', () => {
      it('supports templates', async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(
          html`<ui-portal-main-nav nav-data="${JSON.stringify(navData)}"></ui-portal-main-nav>`,
          fixtureConfig,
        );
        //
      });
    });
  });
}
