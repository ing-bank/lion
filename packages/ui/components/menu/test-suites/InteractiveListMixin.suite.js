import { LitElement } from 'lit';
import { expect, html, fixture as _fixture, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { InteractiveListMixin } from '../src/InteractiveListMixin.js';
import { mimicKeyPress } from '../test-helpers/mimicKeyPress.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

class InteractiveListClass extends InteractiveListMixin(LitElement) {}

/**
 * @typedef {import('../types/InteractiveListMixinTypes.js').InteractiveListItemRole} InteractiveListItemRole
 */

/** @type {InteractiveListItemRole[]} */
const supportedRoles = [
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'treeitem',
  'radio',
  'checkbox',
];

/**
 * @typedef {import('../src/LionMenu.js').LionMenu} LionMenu
 * @typedef {import('lit').TemplateResult} TemplateResult
 *
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionMenu>} */ (_fixture);

/**
 * Makes an endless navigation loop fail fast instead of freezing the test runner.
 * Every navigation step reads the items of the host, so once they have been read far more
 * often than one key press could ever need, we throw.
 * @param {HTMLElement} el host element
 * @param {string} [itemsProp] name of the property that holds the items
 * @returns {() => void} restores the original property
 */
function failFastOnEndlessLoop(el, itemsProp = 'listItems', budget = 500) {
  let reads = 0;
  const ownDescriptor = Object.getOwnPropertyDescriptor(el, itemsProp);
  let proto = Object.getPrototypeOf(el);
  while (proto && !Object.getOwnPropertyDescriptor(proto, itemsProp)) {
    proto = Object.getPrototypeOf(proto);
  }
  const descriptor = /** @type {PropertyDescriptor} */ (
    ownDescriptor || Object.getOwnPropertyDescriptor(proto, itemsProp)
  );
  Object.defineProperty(el, itemsProp, {
    configurable: true,
    get() {
      reads += 1;
      if (reads > budget) {
        throw new Error(`Endless loop: ${itemsProp} was read more than ${budget} times`);
      }
      return descriptor.get ? descriptor.get.call(el) : descriptor.value;
    },
  });
  return () => {
    if (ownDescriptor) {
      Object.defineProperty(el, itemsProp, ownDescriptor);
    } else {
      // @ts-ignore - removing the own property restores the prototype getter
      // eslint-disable-next-line no-param-reassign
      delete el[itemsProp];
    }
  };
}

/**
 * Dispatches keydown on `el` and rethrows an error thrown by its listeners, so a fail-fast
 * guard surfaces as a regular test failure.
 * @param {HTMLElement} el
 * @param {string} key
 * @param {string} [code]
 */
function keyDownOrThrow(el, key, code = '') {
  /** @type {Error|undefined} */
  let listenerError;
  /** @param {ErrorEvent} ev */
  const onError = ev => {
    listenerError = ev.error;
    ev.preventDefault();
  };
  window.addEventListener('error', onError);
  try {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, code }));
  } finally {
    window.removeEventListener('error', onError);
  }
  if (listenerError) {
    throw listenerError;
  }
}

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{host: SuiteElement}>} [customConfig]
 */
export function runInteractiveListMixinSuite({ classes = {}, tagString: legacyTagString } = {}) {
  const tagString = resolveSuiteTag(classes?.host, legacyTagString, InteractiveListClass);
  const tag = unsafeStatic(tagString);

  describe('InteractiveListMixin', () => {
    it(`supports items with role="${supportedRoles.join('|')}"`, async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          ${supportedRoles.map(role => html` <div role="${role}"></div> `)}
        </${tag}>
      `);
      // @ts-ignore - test element with InteractiveListMixin properties
      expect(el.listItems.length).to.equal(supportedRoles.length);
      supportedRoles.forEach((role, i) => {
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[i].getAttribute('role')).to.equal(role);
      });
    });

    it('moves elements to a private [slot=list] for optimal DX and a11y', async () => {
      const el = await fixture(html`
        <${tag} name="foo">
          <div role="menuitem" id="item1">Item 1</div>
          <div role="menuitem" id="item2">Item 2</div>
        </${tag}>
      `);
      // @ts-ignore - test element with InteractiveListMixin properties
      const listSlotNode = Array.from(el.children).find(c => c.slot === 'list');
      // @ts-ignore - accessing children property
      const listItemEls = Array.from(listSlotNode.children);
      // @ts-ignore - test element with InteractiveListMixin properties
      expect(listItemEls.includes(el.listItems[0])).to.be.true;
      // @ts-ignore - test element with InteractiveListMixin properties
      expect(listItemEls.includes(el.listItems[1])).to.be.true;
    });

    describe('Active mode', () => {
      it('supports "activedescendant" pattern', async () => {
        const el = await fixture(html`
        <${tag} name="foo" ._activeMode="${'activedescendant'}">
          <div role="menuitem" id="item1">Item 1</div>
          <div role="menuitem" id="item2">Item 2</div>
        </${tag}>
      `);
        // @ts-ignore - test element with InteractiveListMixin properties
        el.checkedIndex = 0;
        // @ts-ignore - test element with InteractiveListMixin properties
        const listSlotNode = Array.from(el.children).find(c => c.slot === 'list');

        // @ts-ignore - test element with InteractiveListMixin properties
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[0].hasAttribute('id')).to.be.true;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[1].hasAttribute('id')).to.be.true;
        expect(listSlotNode?.hasAttribute('aria-activedescendant')).to.be.false;
        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 1;
        expect(listSlotNode?.hasAttribute('aria-activedescendant')).to.be.true;
      });

      it('supports "roving-tabindex" pattern', async () => {
        const el = await fixture(html`
          <${tag} name="foo" ._activeMode="${'roving-tabindex'}">
            <div role="menuitem" id="item1">Item 1</div>
            <div role="menuitem" id="item2">Item 2</div>
          </${tag}>
        `);

        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 0;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[0].getAttribute('tabindex')).to.equal('0');
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[1].getAttribute('tabindex')).to.equal('-1');

        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 1;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[0].getAttribute('tabindex')).to.equal('-1');
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(el.listItems[1].getAttribute('tabindex')).to.equal('0');

        // @ts-ignore - test element with InteractiveListMixin properties
        el.activeIndex = 1;
        // @ts-ignore - test element with InteractiveListMixin properties
        expect(document.activeElement).to.equal(el.listItems[1]);
      });
    });

    describe('default selected', () => {
      it('sets the checkedIndex to 0 by default when hasNoDefaultSelected is false', async () => {
        const el = await fixture(html`
          <${tag}>
            <div role="menuitem" id="item1">Item 1</div>
          </${tag}>
        `);
        if (!el.hasNoDefaultSelected) {
          expect(el.checkedIndex).to.equal(0);
        }
      });

      it('sets the checkedIndex to -1 when hasNoDefaultSelected is true', async () => {
        const el = await fixture(html`
          <${tag} has-no-default-selected>
            <div role="menuitem" id="item1">Item 1</div>
          </${tag}>
        `);
        expect(el.checkedIndex).to.equal(-1);
      });
    });

    describe('Programmatic interaction', () => {
      // If we have the item line directly in the fixture the linting rule lit-a11y/role-has-required-aria-attrs
      // will fail. Inside our code we set the required aria attributes, but the linter doesn't know that.
      const item = /** @param {number} i, @param {string} role */ (i, role) => html`
        <div role="${role}" id="item${i}">Item ${i}</div>
      `;

      it('set checked state sets aria-current attribute with role="listitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'listitem')}
            ${item(2, 'listitem')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-current')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-current')).to.equal('false');
      });

      it('set checked state sets aria-selected attribute with role="option"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'option')}
            ${item(2, 'option')}
          </${tag}>
        `);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-selected')).to.equal('false');

        el.setCheckedIndex(1);
        expect(item1.getAttribute('aria-selected')).to.equal('true');

        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-selected')).to.equal('false');
      });

      it('set checked state sets aria-selected attribute with role="treeitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'treeitem')}
            ${item(2, 'treeitem')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        // @ts-ignore - test element with InteractiveListMixin properties
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-selected')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-selected')).to.equal('false');
      });

      it('set checked state sets aria-current attribute with role="menuitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'menuitem')}
            ${item(2, 'menuitem')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-current')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-current')).to.equal('false');
      });

      it('set checked state sets aria-checked attribute with role="menuitemradio"', async () => {
        const el = await fixture(html`
          <${tag}>
            ${item(1, 'menuitemradio')}
            ${item(2, 'menuitemradio')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-checked')).to.equal('true');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-checked')).to.equal('false');
      });

      it('set checked state sets aria-checked attribute with role="menuitemcheckbox"', async () => {
        const el = await fixture(html`
          <${tag} multiple>
            ${item(1, 'menuitemcheckbox')}
            ${item(2, 'menuitemcheckbox')}
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-checked')).to.equal('true');
        el.setCheckedIndex(0);
        // As this is multiple choice it doesn't unset the checked state
        expect(item1.getAttribute('aria-checked')).to.equal('true');
      });

      it('can set checked state to "page" for role="listitem"', async () => {
        const el = await fixture(html`
          <${tag}>
            <a role="listitem" id="item1" href="#">Item 1</a>
            <a role="listitem" id="item2" href="#">Item 2</a>
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        expect(item1.getAttribute('aria-current')).to.equal('page');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-current')).to.equal('false');
      });

      it('can set checked state to "mixed" for role="menuitemcheckbox"', async () => {
        const el = await fixture(html`
          <${tag} multiple>
            ${item(1, 'menuitemcheckbox')}
            ${item(2, 'menuitemcheckbox')}
          </${tag}>
        `);
        const item1 = el.listItems[1];
        // @ts-ignore - not yet supported property
        item1.mixedState = true;
        el.setCheckedIndex(1);
        expect(item1.getAttribute('aria-checked')).to.equal('mixed');
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-checked')).to.equal('mixed');
      });

      it('does not allow to set checkedIndex or activeIndex to be out of bound', async () => {
        const el = await fixture(html`
          <${tag} has-no-default-selected>
            <div role="menuitem" id="item1">Item 1</div>
          </${tag}>
        `);
        expect(() => {
          el.checkedIndex = -1;
          el.checkedIndex = 1;
        }).to.not.throw();
        expect(el.checkedIndex).to.equal(-1);
      });

      it('unsets checked on other options when option becomes checked', async () => {
        const el = await fixture(html`
          <${tag}>
            <div role="menuitem" id="item1">Item 1</div>
            <div role="menuitem" id="item2">Item 2</div>
          </${tag}>
        `);
        const { listItems } = el;
        el.setCheckedIndex(0);
        expect(listItems[0].hasAttribute('checked')).to.be.true;
        expect(listItems[1].hasAttribute('checked')).to.be.false;
        el.setCheckedIndex(1);
        expect(listItems[0].hasAttribute('checked')).to.be.false;
        expect(listItems[1].hasAttribute('checked')).to.be.true;
      });
    });

    it('sets aria-current="page" when the location href matches the item href', async () => {
      const el = await fixture(html`
        <${tag}>
          <div role="menuitem" id="item0">
            <a href="${window.location.href}">Item 0</a>
          </div>
            <div role="menuitem" id="item1">
              <a href="#bar">Item 1</a>
          </div>
        </${tag}>
      `);
      const item0 = el.listItems[0];
      expect(item0.getAttribute('aria-current')).to.equal('page');
    });

    describe('Pointer and keyboard edge cases', () => {
      const itemsTemplate = html`
        <div role="menuitemradio" aria-checked="false">Item 0</div>
        <div role="menuitemradio" aria-checked="false">Item 1</div>
        <div role="menuitemradio" aria-checked="false">Item 2</div>
      `;

      it('activates and checks the clicked item', async () => {
        const el = await fixture(html`<${tag}>${itemsTemplate}</${tag}>`);
        /** @type {HTMLElement} */ (el.listItems[2]).click();
        expect(el.activeIndex).to.equal(2);
        expect(el.listItems[2].hasAttribute('checked')).to.be.true;
      });

      it('ignores clicks outside of the items', async () => {
        const el = await fixture(html`<${tag}>${itemsTemplate}</${tag}>`);
        el.activeIndex = 1;
        // @ts-expect-error [allow-protected-in-tests]
        /** @type {HTMLElement} */ (el._listNode).click();
        expect(el.activeIndex).to.equal(1);
      });

      it('does not navigate with the keyboard when disabled', async () => {
        const el = await fixture(html`<${tag} disabled>${itemsTemplate}</${tag}>`);
        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 0;
        mimicKeyPress(_listNode, 'ArrowDown');
        expect(el.activeIndex).to.equal(0);
      });

      it('checks the active item on keyboard navigation when "selectionFollowsFocus" is set', async () => {
        const el = await fixture(html`<${tag} selection-follows-focus>${itemsTemplate}</${tag}>`);
        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 0;
        mimicKeyPress(_listNode, 'ArrowDown');
        expect(el.activeIndex).to.equal(1);
        expect(el.listItems[1].hasAttribute('checked')).to.be.true;
        mimicKeyPress(_listNode, 'End');
        expect(el.listItems[2].hasAttribute('checked')).to.be.true;
      });

      it('stays on the current item with "wrap" when no item is enabled', async () => {
        const el = await fixture(html`
          <${tag} wrap>
            <div role="menuitem" disabled>Item 0</div>
            <div role="menuitem" disabled>Item 1</div>
            <div role="menuitem" disabled>Item 2</div>
          </${tag}>
        `);
        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 0;
        const restore = failFastOnEndlessLoop(el);
        try {
          keyDownOrThrow(_listNode, 'ArrowDown');
        } finally {
          restore();
        }
        expect(el.activeIndex).to.equal(0);
      });
    });

    // Copy tests from ListboxMixin. Later, make this mixin a fundament of the ListboxMixin

    // axis
    // multiple
    // selectionFollowsFocus
    // wrap
    // _scrollTargetNode

    describe('api vocabulary (focusgroup)', () => {
      const itemTemplate = html`
        <div role="listitem" id="item-0">
          <button data-invoker>Item 0</button>
        </div>
        <div role="listitem" id="item-1">
          <a href="#baz">Item 1</a>
        </div>
        <div role="listitem" id="item-2">
          <a href="#foobar">Item 2</a>
        </div>
      `;

      it('uses "block" as the default axis and navigates vertically', async () => {
        const el = await fixture(html`<${tag}>${itemTemplate}</${tag}>`);
        expect(el.axis).to.equal('block');

        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 0;
        mimicKeyPress(_listNode, 'ArrowDown');
        expect(el.activeIndex).to.equal(1);
        mimicKeyPress(_listNode, 'ArrowRight');
        expect(el.activeIndex).to.equal(1);
      });

      it('navigates horizontally on axis="inline"', async () => {
        const el = await fixture(html`<${tag} axis="inline">${itemTemplate}</${tag}>`);
        expect(el.axis).to.equal('inline');
        expect(el.getAttribute('axis')).to.equal('inline');

        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 0;
        mimicKeyPress(_listNode, 'ArrowRight');
        expect(el.activeIndex).to.equal(1);
        mimicKeyPress(_listNode, 'ArrowDown');
        expect(el.activeIndex).to.equal(1);
      });

      it('reflects the axis property to the attribute', async () => {
        const el = await fixture(html`<${tag}>${itemTemplate}</${tag}>`);
        el.axis = 'inline';
        await el.updateComplete;
        expect(el.getAttribute('axis')).to.equal('inline');
      });

      it('wraps around at the first/last item when "wrap" is set', async () => {
        const el = await fixture(html`<${tag} wrap>${itemTemplate}</${tag}>`);
        expect(el.wrap).to.be.true;

        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 2;
        mimicKeyPress(_listNode, 'ArrowDown');
        expect(el.activeIndex).to.equal(0);
      });

      it('does not wrap around when "wrap" is not set', async () => {
        const el = await fixture(html`<${tag}>${itemTemplate}</${tag}>`);
        expect(el.wrap).to.be.false;

        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 2;
        mimicKeyPress(_listNode, 'ArrowDown');
        expect(el.activeIndex).to.equal(2);
      });

      it('wraps around to the last enabled item on [ArrowUp] when "wrap" is set', async () => {
        const el = await fixture(html`
          <${tag} wrap>
            <div role="menuitem">Item 0</div>
            <div role="menuitem">Item 1</div>
            <div role="menuitem" disabled>Item 2</div>
          </${tag}>
        `);
        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 0;
        const restore = failFastOnEndlessLoop(el);
        try {
          keyDownOrThrow(_listNode, 'ArrowUp');
        } finally {
          restore();
        }
        expect(el.activeIndex).to.equal(1);
      });

      it('wraps around to the first enabled item on [ArrowDown] when "wrap" is set', async () => {
        const el = await fixture(html`
          <${tag} wrap>
            <div role="menuitem" disabled>Item 0</div>
            <div role="menuitem">Item 1</div>
            <div role="menuitem">Item 2</div>
          </${tag}>
        `);
        // @ts-expect-error [allow-protected-in-tests]
        const { _listNode } = el;
        el.activeIndex = 2;
        const restore = failFastOnEndlessLoop(el);
        try {
          keyDownOrThrow(_listNode, 'ArrowDown');
        } finally {
          restore();
        }
        expect(el.activeIndex).to.equal(1);
      });

      it('applies "wrap" when it changes after the first render', async () => {
        const el = await fixture(html`<${tag}>${itemTemplate}</${tag}>`);
        expect(el.wrap).to.be.false;
        el.wrap = true;
        await el.updateComplete;
        expect(el.wrap).to.be.true;
      });
    });

    describe('Interactions', () => {
      describe('Keyboard navigation', () => {
        it('navigates between items on [ArrowDown] [ArrowUp] keys', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);

          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowDown');
          expect(el.activeIndex).to.be.equal(1);
          mimicKeyPress(_listNode, 'ArrowDown');
          expect(el.activeIndex).to.be.equal(2);
          mimicKeyPress(_listNode, 'ArrowUp');
          expect(el.activeIndex).to.be.equal(1);
        });

        it('navigates between items on [ArrowRight] [ArrowLeft] keys when axis is "inline" and _activeMode="tabbable-disclosure"', async () => {
          const el = await fixture(html`
            <${tag} axis="inline">
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);
          // @ts-expect-error [allow-protected-in-tests]
          el._activeMode = 'tabbable-disclosure';
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowRight');
          expect(el.activeIndex).to.be.equal(1);
          mimicKeyPress(_listNode, 'ArrowRight');
          expect(el.activeIndex).to.be.equal(2);
          mimicKeyPress(_listNode, 'ArrowLeft');
          expect(el.activeIndex).to.be.equal(1);
        });

        it('stops navigation by default at end of option list', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);

          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;

          // Normalize
          el.activeIndex = 0;

          mimicKeyPress(_listNode, 'ArrowUp');
          expect(el.activeIndex).to.be.equal(0);

          el.activeIndex = 2;
          mimicKeyPress(_listNode, 'ArrowDown');
          expect(el.activeIndex).to.be.equal(2);
        });

        it('navigates to first and last option with [Home] and [End] keys', async () => {
          const el = await fixture(html`
            <${tag} axis="inline">
              <div role="listitem" id="item-0">
                <button data-invoker>Item 0</button>
              </div>
              <div role="listitem" id="item-1">
                <a href="#baz">Item 1</a>
              </div>
              <div role="listitem" id="item-2">
                <a href="#foobar">Item 2</a>
              </div>
            </${tag}>
          `);

          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;

          // Normalize
          el.activeIndex = 2;

          mimicKeyPress(_listNode, 'Home');
          expect(el.activeIndex).to.equal(0);
          mimicKeyPress(_listNode, 'End');
          expect(el.activeIndex).to.equal(2);
        });

        it('navigates to the first enabled item with [Home] when the first item is disabled', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="menuitem" disabled>Item 0</div>
              <div role="menuitem">Item 1</div>
              <div role="menuitem">Item 2</div>
            </${tag}>
          `);
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 2;
          const restore = failFastOnEndlessLoop(el);
          try {
            keyDownOrThrow(_listNode, 'Home');
          } finally {
            restore();
          }
          expect(el.activeIndex).to.equal(1);
        });

        it('navigates to the last enabled item with [End] when the last item is disabled', async () => {
          const el = await fixture(html`
            <${tag}>
              <div role="menuitem">Item 0</div>
              <div role="menuitem">Item 1</div>
              <div role="menuitem" disabled>Item 2</div>
            </${tag}>
          `);
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 0;
          const restore = failFastOnEndlessLoop(el);
          try {
            keyDownOrThrow(_listNode, 'End');
          } finally {
            restore();
          }
          expect(el.activeIndex).to.equal(1);
        });
      });

      describe('Typeahead', () => {
        /** @type {import('sinon').SinonFakeTimers | undefined} */
        let clock;

        afterEach(() => {
          clock?.restore();
          clock = undefined;
        });

        const typeaheadFixture = () =>
          fixture(html`
            <${tag} ._activateOnTypedChars=${true}>
              <div role="menuitem">Red</div>
              <div role="menuitem">Teal</div>
              <div role="menuitem">Turquoise</div>
              <div role="menuitem">Turtle</div>
            </${tag}>
          `);

        it('activates the first item that matches a typed character', async () => {
          const el = await typeaheadFixture();
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 0;
          mimicKeyPress(_listNode, 't', 'KeyT');
          expect(el.activeIndex).to.equal(1);
        });

        it('activates the item that matches a sequence of typed characters', async () => {
          const el = await typeaheadFixture();
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 0;
          mimicKeyPress(_listNode, 't', 'KeyT');
          mimicKeyPress(_listNode, 'u', 'KeyU');
          expect(el.activeIndex).to.equal(2);
          mimicKeyPress(_listNode, 'r', 'KeyR');
          mimicKeyPress(_listNode, 't', 'KeyT');
          expect(el.activeIndex).to.equal(3);
        });

        it('matches typed characters case-insensitively', async () => {
          const el = await typeaheadFixture();
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 0;
          mimicKeyPress(_listNode, 'T', 'KeyT');
          expect(el.activeIndex).to.equal(1);
        });

        it('restarts the typeahead window on every typed character', async () => {
          const el = await typeaheadFixture();
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode, _activateOnCharTimeout } = el;
          el.activeIndex = 0;
          clock = sinon.useFakeTimers();

          mimicKeyPress(_listNode, 't', 'KeyT');
          clock.tick(_activateOnCharTimeout * 0.75);
          mimicKeyPress(_listNode, 'u', 'KeyU');
          // The window of the first character has passed by now, the window of the second has not
          clock.tick(_activateOnCharTimeout * 0.5);
          mimicKeyPress(_listNode, 'r', 'KeyR');
          // 'tur' still continues the sequence, so 'Turquoise' (and not 'Red') is active
          expect(el.activeIndex).to.equal(2);

          clock.tick(_activateOnCharTimeout);
          mimicKeyPress(_listNode, 'r', 'KeyR');
          // A pause longer than the window starts a new sequence
          expect(el.activeIndex).to.equal(0);
        });

        it('matches items that have a non-string value', async () => {
          const el = await fixture(html`
            <${tag} ._activateOnTypedChars=${true}>
              <div role="menuitem" .choiceValue=${10}>10</div>
              <div role="menuitem" .choiceValue=${20}>20</div>
            </${tag}>
          `);
          // @ts-expect-error [allow-protected-in-tests]
          const { _listNode } = el;
          el.activeIndex = 0;
          keyDownOrThrow(_listNode, '2', 'Digit2');
          expect(el.activeIndex).to.equal(1);
        });
      });
    });
  });
}
