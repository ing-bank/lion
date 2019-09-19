import { expect, html, fixture } from '@open-wc/testing';
import '@lion/core/test-helpers/keyboardEventShimIE.js';
import sinon from 'sinon';
import { keyCodes } from '../src/utils/key-codes.js';
import { simulateTab } from '../src/utils/simulate-tab.js';

export const runBaseOverlaySuite = createCtrlFn => {
  describe('shown', () => {
    it('has .isShown which defaults to false', () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      expect(ctrl.isShown).to.be.false;
    });

    it('has async show() which shows the overlay', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      await ctrl.show();
      expect(ctrl.isShown).to.be.true;
      expect(ctrl.show()).to.be.instanceOf(Promise);
    });

    it('has async hide() which hides the overlay', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      await ctrl.hide();
      expect(ctrl.isShown).to.be.false;
      expect(ctrl.hide()).to.be.instanceOf(Promise);
    });

    it('fires "show" event once overlay becomes shown', async () => {
      const showSpy = sinon.spy();
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      ctrl.addEventListener('show', showSpy);
      await ctrl.show();
      expect(showSpy.callCount).to.equal(1);
      await ctrl.show();
      expect(showSpy.callCount).to.equal(1);
    });

    it('fires "hide" event once overlay becomes hidden', async () => {
      const hideSpy = sinon.spy();
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      ctrl.addEventListener('hide', hideSpy);
      await ctrl.show();
      await ctrl.hide();
      expect(hideSpy.callCount).to.equal(1);
      await ctrl.hide();
      expect(hideSpy.callCount).to.equal(1);
    });
  });

  describe('.contentTemplate', () => {
    it('has .content<Node> as a wrapper for a render target', () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      expect(ctrl.content.tagName).to.equal('DIV');
    });

    it('throws if trying to assign a non function value to .contentTemplate', () => {
      expect(() =>
        createCtrlFn({
          contentTemplate: 'foo',
        }),
      ).to.throw('.contentTemplate needs to be a function');
    });

    it('has .contentTemplate<Function> to render into .content', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      await ctrl.show();
      expect(ctrl.content).to.have.trimmed.text('my content');
    });

    it('throws if .contentTemplate does not return a single child node', async () => {
      expect(() => {
        createCtrlFn({
          contentTemplate: () => html``,
        });
      }).to.throw('The .contentTemplate needs to always return exactly one child node');

      expect(() => {
        createCtrlFn({
          contentTemplate: () => html`
            <p>one</p>
            <p>two</p>
          `,
        });
      }).to.throw('The .contentTemplate needs to always return exactly one child node');
    });

    it('allows to change the .contentTemplate<Function>', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <div><p>my content</p></div>
        `,
      });
      await ctrl.show();
      expect(ctrl.contentNode).to.have.trimmed.text('my content');

      ctrl.contentTemplate = () => html`
        <div>
          <p>new content</p>
          <p>my adjusted content</p>
        </div>
      `;
      expect(ctrl.contentNode).lightDom.to.equal(`
        <p>new content</p>
        <p>my adjusted content</p>
      `);
    });

    it('has .contentData which triggers a updates of the overlay content', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: ({ username = 'default user' } = {}) => html`
          <p>my content - ${username}</p>
        `,
      });
      await ctrl.show();
      expect(ctrl.content).to.have.trimmed.text('my content - default user');

      ctrl.contentData = { username: 'foo user' };
      expect(ctrl.content).to.have.trimmed.text('my content - foo user');
    });
  });

  describe('.contentNode', () => {
    it('accepts an .contentNode<Node> to directly set content', async () => {
      const ctrl = createCtrlFn({
        contentNode: await fixture('<p>direct node</p>'),
      });
      expect(ctrl.content).to.have.trimmed.text('direct node');
    });

    it('throws if .contentData gets used without a .contentTemplate', async () => {
      const ctrl = createCtrlFn({
        contentNode: await fixture('<p>direct node</p>'),
      });
      expect(() => {
        ctrl.contentData = {};
      }).to.throw('.contentData can only be used if there is a .contentTemplate');
    });
  });

  describe('_showHideMode="dom" (auto selected with .contentTemplate)', () => {
    it('removes dom content on hide', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });

      await ctrl.show();
      expect(ctrl.content).to.have.trimmed.text('my content');
      await ctrl.hide();
      expect(ctrl.content).to.be.empty;
    });
  });

  describe('_showHideMode="css" (auto selected with .contentNode)', () => {
    it('hides .contentNode via css on hide', async () => {
      const ctrl = createCtrlFn({
        contentNode: await fixture('<p>direct node</p>'),
      });

      await ctrl.show();
      expect(ctrl.contentNode).to.be.displayed;

      await ctrl.hide();
      expect(ctrl.contentNode).not.to.be.displayed;

      await ctrl.show();
      expect(ctrl.contentNode).to.be.displayed;
    });

    // do we even want to support contentTemplate?
    it.skip('hides .contentNode from a .contentTemplate via css on hide', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>direct node</p>
        `,
      });
      ctrl.__showHideMode = 'css';

      await ctrl.show();
      expect(ctrl.contentNode).to.be.displayed;

      await ctrl.hide();
      expect(ctrl.contentNode).not.to.be.displayed;

      await ctrl.show();
      expect(ctrl.contentNode).to.be.displayed;
    });

    it.skip('does not put a style display on .content when using a .contentTemplate', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>direct node</p>
        `,
      });
      ctrl.__showHideMode = 'css';

      await ctrl.show();
      expect(ctrl.content.style.display).to.be.empty;

      await ctrl.hide();
      expect(ctrl.content.style.display).to.be.empty;

      await ctrl.show();
      expect(ctrl.content.style.display).to.be.empty;
    });
  });

  describe('setup', () => {
    it('throws if .contentTemplate and .contentNode get passed on', async () => {
      const node = await fixture('<p>direct node</p>');
      expect(() => {
        createCtrlFn({
          contentTemplate: () => '',
          contentNode: node,
        });
      }).to.throw('You can only provide a .contentTemplate or a .contentNode but not both');
    });

    it('throws if neither .contentTemplate or .contentNode get passed on', async () => {
      expect(() => {
        createCtrlFn();
      }).to.throw('You need to provide a .contentTemplate or a .contentNode');
    });
  });

  describe('invoker', () => {
    // same as content just with invoker
  });

  describe('switching', () => {
    it('has a switchOut/In function', () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      expect(ctrl.switchIn).to.be.a('function');
      expect(ctrl.switchOut).to.be.a('function');
    });
  });

  describe('trapsKeyboardFocus (for a11y)', () => {
    it('focuses the overlay on show', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>Content</p>
        `,
      });
      // add element to dom to allow focus
      await fixture(html`
        ${ctrl.content}
      `);
      await ctrl.show();
      ctrl.enableTrapsKeyboardFocus();
      expect(ctrl.contentNode).to.equal(document.activeElement);
    });

    it('keeps focus within the overlay e.g. you can not tab out by accident', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <div><input /><input /></div>
        `,
      });
      // add element to dom to allow focus
      await fixture(html`
        ${ctrl.content}
      `);
      await ctrl.show();
      ctrl.enableTrapsKeyboardFocus();

      const elOutside = await fixture(html`
        <button>click me</button>
      `);
      const input1 = ctrl.contentNode.querySelectorAll('input')[0];
      const input2 = ctrl.contentNode.querySelectorAll('input')[1];

      input2.focus();
      // this mimics a tab within the contain-focus system used
      const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
      event.keyCode = keyCodes.tab;
      window.dispatchEvent(event);

      expect(elOutside).to.not.equal(document.activeElement);
      expect(input1).to.equal(document.activeElement);
    });

    it('allows to move the focus outside of the overlay if trapsKeyboardFocus is disabled', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <div><input /></div>
        `,
      });
      // add element to dom to allow focus
      await fixture(html`
        ${ctrl.content}
      `);
      await ctrl.show();
      ctrl.enableTrapsKeyboardFocus();

      const elOutside = await fixture(html`
        <input />
      `);
      const input = ctrl.contentNode.querySelector('input');

      input.focus();
      simulateTab();

      expect(elOutside).to.equal(document.activeElement);
    });
  });

  describe('hidesOnEsc', () => {
    it('hides when [escape] is pressed', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>Content</p>
        `,
      });
      await ctrl.show();
      ctrl.enableHidesOnEsc();

      ctrl.contentNode.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      expect(ctrl.isShown).to.be.false;
    });

    it('stays shown when [escape] is pressed on outside element', async () => {
      const ctrl = createCtrlFn({
        contentTemplate: () => html`
          <p>Content</p>
        `,
      });
      await ctrl.show();
      ctrl.enableHidesOnEsc();

      document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
      expect(ctrl.isShown).to.be.true;
    });
  });
};
