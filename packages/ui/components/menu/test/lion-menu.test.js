import { expect, fixture, html, waitUntil } from '@open-wc/testing';
import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import { runMoreButtonMenuMixinSuite } from '../test-suites/MoreButtonMenuMixin.suite.js';
import { runLionMenuSuite } from '../test-suites/LionMenu.suite.js';
import '@lion/ui/define/lion-menu.js';

// The Mixin suites run against plain mixin hosts (their defaults) on purpose:
// LionMenu composes InteractiveListMixin + MultiLevelListMixin with the
// overlay/disclosure behavior, and the composite is covered by the LionMenu
// suites.
runInteractiveListMixinSuite();
runMultiLevelListMixinSuite();
runMoreButtonMenuMixinSuite({ tagString: 'lion-menu' });
runLionMenuSuite({ tagString: 'lion-menu' });

describe('<lion-menu> opened state', () => {
  it('opens through its own API and keeps its items exposed as menuitems', async () => {
    const menu = /** @type {any} */ (
      await fixture(html`
        <lion-menu>
          <button slot="invoker">Menu</button>
          <div role="menuitem">Item one</div>
          <div role="menuitem">Item two</div>
        </lion-menu>
      `)
    );

    // The invoker's click and Enter both end up here; calling it directly keeps this test about the state
    // the component produces, not about the event plumbing (LionMenuInteractions.suite.js covers that).
    menu.toggle();
    await waitUntil(() => menu.opened === true, 'the menu opens', 3000);
    await menu.updateComplete;

    expect(menu.opened).to.equal(true);
    // The items stay menuitems in place. This is state, so it belongs here: a screen reader test would need
    // the overlay open, whose state depends on the rest of the run, and a closed menu makes the virtual
    // reader pass on the slotted items regardless - the announcement itself is asserted in the SR test.
    // The wrapper axe complains about, reachable here because a menu's overlay host stays inside the
    // component: it exists for the top layer only and carries no role of its own, so the announced role is
    // the content's. That is the DOM half of the proof; the reader half is in the SR test.
    const findWrapper = /** @param {any} root @returns {HTMLDialogElement | null} */ root => {
      const direct = root.querySelector?.('dialog[data-overlay-outer-wrapper]');
      if (direct) return direct;
      for (const el of root.querySelectorAll?.('*') ?? []) {
        if (el.shadowRoot) {
          const inner = findWrapper(el.shadowRoot);
          if (inner) return inner;
        }
      }
      return null;
    };
    const wrapper = findWrapper(document);
    expect(wrapper, 'the overlay wrapper exists while the menu is open').to.exist;
    expect(wrapper?.getAttribute('role'), 'and it carries no role of its own').to.equal('none');

    const items = [...menu.querySelectorAll('[role="menuitem"]')];
    expect(items.length, 'both items are exposed as menuitems').to.equal(2);
    expect(items.every(item => menu.contains(item))).to.equal(true);
    // `aria-allowed-role` (minor) is ignored on purpose: Lion's overlay wraps its content in
    // `<dialog role="none">`, and axe does not allow `none` on a `<dialog>`. The wrapper lands in the
    // component's subtree for a menu (unlike a global dialog or tooltip), which is the only reason it
    // shows up here. Reported upstream rather than silently worked around in the component.
    await expect(menu).to.be.accessible({ ignoredRules: ['aria-allowed-role'] });
  });
});
