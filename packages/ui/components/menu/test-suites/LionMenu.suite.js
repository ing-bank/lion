/* eslint-disable lit-a11y/click-events-have-key-events */
import { defineCE, expect, fixture as _fixture, html, unsafeStatic } from '@open-wc/testing';
import { LionMenu } from '../src/LionMenu.js';

/**
 * @typedef {import('../src/LionMenu.js').LionMenu} LionMenu
 * @typedef {import('lit').TemplateResult} TemplateResult
 *
 * @typedef {Object} TestConfig
 * @property {string} tagString
 */

const fixture = /** @type {(arg: TemplateResult) => Promise<LionMenu>} */ (_fixture);

/**
 * @param {TestConfig} [customConfig]
 */
export function runLionMenuSuite(customConfig) {
  const cfg = {
    tagString: customConfig?.tagString || defineCE(LionMenu),
  };

  const { tagString } = cfg;
  const tag = unsafeStatic(tagString);

  describe('LionMenu', () => {
    it('sets the correct role to the listNode', async () => {
      const el = await fixture(html`
        <${tag}>
          <div role="listitem" id="item-0">
            <a href="#foo">Item 0</a>
          </div>
          <div role="listitem" id="item-1">
            <a href="#bar">Item 1</a>
          </div>
        </${tag}>
      `);

      const listNode = el.querySelector('[slot="list"]');
      expect(listNode?.getAttribute('role')).to.equal('menu');
    });

    it('sets the correct role to the listNode when activeMode is tabbable-disclosure', async () => {
      const el = await fixture(html`
        <${tag} ._activeMode=${'tabbable-disclosure'}>
          <div role="listitem" id="item-0">
            <a href="#foo">Item 0</a>
          </div>
          <div role="listitem" id="item-1">
            <a href="#bar">Item 1</a>
          </div>
        </${tag}>
      `);
      const listNode = el.querySelector('[slot="list"]');
      expect(listNode?.getAttribute('role')).to.equal('list');
    });

    it('sets the correct roles when it is a bar', async () => {
      const el = await fixture(html`
        <${tag}>
          <div role="listitem" id="item-0">
            <a href="#foo">Item 0</a>
          </div>
          <div role="listitem" id="item-1">
            <a href="#bar">Item 1</a>
          </div>
        </${tag}>
      `);

      el._listRole = 'menu';
      expect(el._listRole).to.equal('menu');
      expect(el.orientation).to.equal('vertical');
      el.bar = true;
      await el.updateComplete;
      expect(el._listRole).to.equal('menubar');
      expect(el.orientation).to.equal('horizontal');
    });

    describe('Programmatic interaction', () => {
      it('allows groups within one menu level', async () => {
        const el = await fixture(html`
          <${tag}>
            <div role="menuitemcheckbox" aria-checked="false">Bold</div>
            <div role="menuitemcheckbox" aria-checked="false">Italic</div>
            <div role="separator"></div>
            <div role="group" aria-label="Text Color">
              <div role="menuitemradio" aria-checked="false">Blue</div>
              <div role="menuitemradio" aria-checked="false">Red</div>
              <div role="menuitemradio" aria-checked="false">Green</div>
            </div>
          </${tag}>
        `);
        el.setCheckedIndex(1);
        const item1 = el.listItems[1];
        const item3 = el.listItems[3];
        expect(item1.getAttribute('aria-checked')).to.equal('true');

        // change within checkbox group doesn't trigger a change on checkbox
        el.setCheckedIndex(0);
        expect(item1.getAttribute('aria-checked')).to.equal('true');

        // update outside checkbox group doesn't trigger a change on checkbox
        el.setCheckedIndex(3);
        expect(item1.getAttribute('aria-checked')).to.equal('true');
        expect(item3.getAttribute('aria-checked')).to.equal('true');

        // change within radio group triggers a change on radio button and not on checkbox
        el.setCheckedIndex(4);
        expect(item1.getAttribute('aria-checked')).to.equal('true');
        expect(item3.getAttribute('aria-checked')).to.equal('false');
      });
    });
  });
}
