import {
  csrFixture,
  ssrNonHydratedFixture,
  ssrHydratedFixture,
} from '@lit-labs/testing/fixtures.js';
import { a11ySnapshot, findAccessibilityNode } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import { html } from 'lit';
import { expect } from '@open-wc/testing';

function getTemplateContext(el) {
  let { templateContext } = el;
  const { currentLayout } = el.layoutCtrl;
  if (el.layouts[currentLayout]?.templateContext) {
    templateContext = el.layouts[currentLayout]?.templateContext(templateContext);
  }
  return templateContext;
}

for (const [fixture, fixtureMode] of [
  [csrFixture, 'csr'],
  /* [ssrNonHydratedFixture, 'ssr-hydrated'], [ssrHydratedFixture, 'ssr'],*/
]) {
  runUIMainNavSuite({
    fixture,
    fixtureMode,
    fixtureConfig: {
      modules: ['./ui-main-nav.js'],
      base: 'http://localhost:8000/src/components/UIMainNav/',
    },
  });
}

function runUIMainNavSuite({ fixture, fixtureConfig, fixtureMode }) {
  describe('UIMainNav', () => {
    describe('Navigation data', () => {
      it('has `[nav-data]` of type `NavLevel` for populating the navigation menu', async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(
          html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
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
          html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
          fixtureConfig,
        );

        // const anchor = el.shadowRoot.querySelector('[data-part="anchor"][data-level="1"]');

        // expect(anchor).to.equal('test');
      });

      it.skip("requires `NavDataItem.url` for displaying the navigation item url (when it's not a toggle for next level)", async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(html`<ui-main-nav></ui-main-nav>`, fixtureConfig);
      });

      // it.skip('supports `NavDataItem.iconId` for displaying an icon next to the name', async () => {
      //   const navData = { items: [{ name: 'home', url: '/', iconId }] };
      //   const el = await fixture(html`<ui-main-nav></ui-main-nav>`, fixtureConfig);
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
            html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
            fixtureConfig,
          );
        });

        it('renders multiple levels as collapsible buttons', async () => {
          const navData = { items: [{ name: 'home', url: '/' }] };
          const el = await fixture(html`<ui-main-nav></ui-main-nav>`, fixtureConfig);
        });
      });
    });

    describe('A11y', () => {});

    describe('L10n', () => {
      // it('supports translations', async () => {
      //   const navData = { items: [{ name: 'home', url: '/' }] };
      //   const el = await fixture(
      //     html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
      //     fixtureConfig,
      //   );
      //   //
      // });
    });

    describe('Anatomy (refs)', () => {
      describe('UIMainNavPartDirective', () => {
        it('supports templates', async () => {
          const navData = { items: [{ name: 'home', url: '/' }] };
          const el = await fixture(
            html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
            fixtureConfig,
          );
          //
        });
      });
    });

    describe('Subclassers', () => {
      it('supports templates', async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(
          html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
          fixtureConfig,
        );
        //
      });

      it('supports layouts', async () => {
        const navData = { items: [{ name: 'home', url: '/' }] };
        const el = await fixture(
          html`<ui-main-nav nav-data="${JSON.stringify(navData)}"></ui-main-nav>`,
          fixtureConfig,
        );
        //
      });
    });
  });
}
