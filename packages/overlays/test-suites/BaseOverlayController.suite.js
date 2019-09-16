import { expect, html, fixture } from '@open-wc/testing';
import sinon from 'sinon';

export const runBaseOverlaySuite = generateCtrl => {
  describe('shown', () => {
    it('has .isShown which defaults to false', () => {
      const ctrl = generateCtrl({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      expect(ctrl.isShown).to.be.false;
    });

    it('has async show() which shows the overlay', async () => {
      const ctrl = generateCtrl({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      await ctrl.show();
      expect(ctrl.isShown).to.be.true;
      expect(ctrl.show()).to.be.instanceOf(Promise);
    });

    it('has async hide() which hides the overlay', async () => {
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      expect(ctrl.content.tagName).to.equal('DIV');
    });

    it('throws if trying to assign a non function value to .contentTemplate', () => {
      expect(() =>
        generateCtrl({
          contentTemplate: 'foo',
        }),
      ).to.throw('.contentTemplate needs to be a function');
    });

    it('has .contentTemplate<Function> to render into .content', async () => {
      const ctrl = generateCtrl({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      await ctrl.show();
      expect(ctrl.content).to.have.trimmed.text('my content');
    });

    it('throws if .contentTemplate does not return a single child node', async () => {
      expect(() => {
        generateCtrl({
          contentTemplate: () => html``,
        });
      }).to.throw('The .contentTemplate needs to always return exactly one child node');

      expect(() => {
        generateCtrl({
          contentTemplate: () => html`
            <p>one</p>
            <p>two</p>
          `,
        });
      }).to.throw('The .contentTemplate needs to always return exactly one child node');
    });

    it('allows to change the .contentTemplate<Function>', async () => {
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
        contentNode: await fixture('<p>direct node</p>'),
      });
      expect(ctrl.content).to.have.trimmed.text('direct node');
    });

    it('throws if .contentData gets used without a .contentTemplate', async () => {
      const ctrl = generateCtrl({
        contentNode: await fixture('<p>direct node</p>'),
      });
      expect(() => {
        ctrl.contentData = {};
      }).to.throw('.contentData can only be used if there is a .contentTemplate');
    });
  });

  describe('_showHideMode="dom" (auto selected with .contentTemplate)', () => {
    it('removes dom content on hide', async () => {
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
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
      const ctrl = generateCtrl({
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
        generateCtrl({
          contentTemplate: () => '',
          contentNode: node,
        });
      }).to.throw('You can only provide a .contentTemplate or a .contentNode but not both');
    });

    it('throws if neither .contentTemplate or .contentNode get passed on', async () => {
      expect(() => {
        generateCtrl();
      }).to.throw('You need to provide a .contentTemplate or a .contentNode');
    });
  });

  describe('invoker', () => {
    // same as content just with invoker
  });

  describe('switching', () => {
    it('has a switchOut/In function', () => {
      const ctrl = generateCtrl({
        contentTemplate: () => html`
          <p>my content</p>
        `,
      });
      expect(ctrl.switchIn).to.be.a('function');
      expect(ctrl.switchOut).to.be.a('function');
    });
  });
};
