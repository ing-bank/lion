import { expect, html } from '@open-wc/testing';
import sinon from 'sinon';
import { OverlaysManager } from '../src/OverlaysManager.js';
import { OverlayController } from '../src/OverlayController.js';
import { renderAsNode } from '../../core/index.js';

describe('OverlaysManager', () => {
  let defaultOptions;
  let mngr;

  before(() => {
    defaultOptions = {
      placementMode: 'global',
      contentNode: () =>
        renderAsNode(html`
          <p>my content</p>
        `),
    };
  });

  beforeEach(() => {
    mngr = new OverlaysManager();
  });

  afterEach(() => {
    mngr.teardown();
  });

  it('provides .globalRootNode as a render target on first access', () => {
    expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
    const rootNode = mngr.globalRootNode;
    expect(document.body.querySelector('.global-overlays')).to.equal(rootNode);
  });

  it('provides .teardown() for cleanup', () => {
    const rootNode = mngr.globalRootNode;
    expect(document.body.querySelector('.global-overlays')).to.equal(rootNode);
    expect(document.head.querySelector('[data-global-overlays=""]')).not.be.undefined;

    mngr.teardown();
    expect(document.body.querySelectorAll('.global-overlays').length).to.equal(0);
    expect(document.head.querySelector('[data-global-overlays=""]')).be.null;

    // safety check via private access (do not use this)
    expect(mngr.constructor.__globalRootNode).to.be.undefined;
    expect(mngr.constructor.__globalStyleNode).to.be.undefined;
  });

  it('returns the newly added overlay', () => {
    const myController = new OverlayController(defaultOptions);
    expect(mngr.add(myController)).to.equal(myController);
  });

  it('can add/remove controllers', () => {
    const dialog = new OverlayController(defaultOptions);
    const popup = new OverlayController(defaultOptions);
    mngr.add(dialog);
    mngr.add(popup);

    expect(mngr.list).to.deep.equal([dialog, popup]);

    mngr.remove(popup);
    expect(mngr.list).to.deep.equal([dialog]);

    mngr.remove(dialog);
    expect(mngr.list).to.deep.equal([]);
  });

  it('throws if you try to add the same controller', () => {
    sinon.stub(console, 'warn');
    const ctrl = new OverlayController(defaultOptions);
    mngr.add(ctrl);
    mngr.add(ctrl);
    expect(console.warn.calledOnce).to.be.true;
    expect(console.warn.calledWith('controller instance is already added')).to.be.true;
  });

  it('throws if you try to remove a non existing controller', () => {
    const ctrl = new OverlayController(defaultOptions);
    expect(() => mngr.remove(ctrl)).to.throw('could not find controller to remove');
  });

  it('adds a reference to the manager to the controller', () => {
    const dialog = new OverlayController(defaultOptions);
    mngr.add(dialog);

    expect(dialog.manager).to.equal(mngr);
  });

  it('has a .shownList which is ordered based on last shown', async () => {
    const dialog = new OverlayController(defaultOptions);
    const dialog2 = new OverlayController(defaultOptions);
    mngr.add(dialog);
    mngr.add(dialog2);

    expect(mngr.shownList).to.deep.equal([]);

    await dialog.show();

    expect(mngr.shownList).to.deep.equal([dialog]);

    await dialog2.show();
    expect(mngr.shownList).to.deep.equal([dialog2, dialog]);

    await dialog.show();
    expect(mngr.shownList).to.deep.equal([dialog, dialog2]);

    await dialog.hide();
    expect(mngr.shownList).to.deep.equal([dialog2]);

    await dialog2.hide();
    expect(mngr.shownList).to.deep.equal([]);
  });
});
