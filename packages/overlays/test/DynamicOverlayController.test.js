import { expect, html } from '@open-wc/testing';
import sinon from 'sinon';

import { DynamicOverlayController } from '../src/DynamicOverlayController.js';
import { BaseOverlayController } from '../src/BaseOverlayController.js';

describe('DynamicOverlayController', () => {
  class FakeLocalCtrl extends BaseOverlayController {}
  class FakeGlobalCtrl extends BaseOverlayController {}

  const defaultOptions = {
    contentTemplate: () => html`
      <p>my content</p>
    `,
  };

  it('can add/remove controllers', () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    const local = new FakeLocalCtrl(defaultOptions);
    const local2 = new FakeLocalCtrl(defaultOptions);
    ctrl.add(global);
    ctrl.add(local);
    ctrl.add(local2);

    expect(ctrl.list).to.deep.equal([global, local, local2]);

    ctrl.remove(local2);
    expect(ctrl.list).to.deep.equal([global, local]);

    ctrl.remove(local);
    expect(ctrl.list).to.deep.equal([global]);
  });

  it('throws if you try to add the same controller twice', () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    ctrl.add(global);
    expect(() => ctrl.add(global)).to.throw('controller instance is already added');
  });

  it('will set the first added controller as active', () => {
    const ctrl = new DynamicOverlayController();
    expect(ctrl.active).to.be.undefined;

    const global = new FakeGlobalCtrl(defaultOptions);
    ctrl.add(global);

    expect(ctrl.active).to.equal(global);
  });

  it('throws if you try to remove a non existing controller', () => {
    const ctrl = new DynamicOverlayController();
    const global = new BaseOverlayController(defaultOptions);
    expect(() => ctrl.remove(global)).to.throw('could not find controller to remove');
  });

  it('will throw if you try to remove the active controller', () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    ctrl.add(global);

    expect(() => ctrl.remove(global)).to.throw(
      'You can not remove the active controller. Please switch first to a different controller via ctrl.switchTo()',
    );
  });

  it('can switch the active controller', () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    const local = new FakeLocalCtrl(defaultOptions);
    ctrl.add(global);
    ctrl.add(local);

    expect(ctrl.active).to.equal(global);

    ctrl.switchTo(local);
    expect(ctrl.active).to.equal(local);

    ctrl.switchTo(global);
    expect(ctrl.active).to.equal(global);
  });

  it('will call the active controllers show/hide when using .show() / .hide()', async () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    ctrl.add(global);

    const showSpy = sinon.spy(global, 'show');
    const hideSpy = sinon.spy(global, 'hide');

    await ctrl.show();
    expect(showSpy).to.has.callCount(1);

    await ctrl.hide();
    expect(hideSpy).to.has.callCount(1);
  });

  it('will throw when trying to switch while overlay is shown', async () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    const local = new FakeLocalCtrl(defaultOptions);
    ctrl.add(global);
    ctrl.add(local);

    await ctrl.show();
    expect(() => {
      ctrl.switchTo(local);
    }).to.throw('You can not switch overlays while being shown');
  });

  it('will call switchIn/Out functions of controllers', () => {
    const ctrl = new DynamicOverlayController();
    const global = new FakeGlobalCtrl(defaultOptions);
    const local = new FakeLocalCtrl(defaultOptions);
    ctrl.add(global);
    ctrl.add(local);

    const globalOutSpy = sinon.spy(global, 'switchOut');
    const globalInSpy = sinon.spy(global, 'switchIn');
    const localOutSpy = sinon.spy(local, 'switchOut');
    const localInSpy = sinon.spy(local, 'switchIn');

    ctrl.switchTo(local);
    expect(globalOutSpy).to.have.callCount(1);
    expect(localInSpy).to.have.callCount(1);

    ctrl.switchTo(global);
    expect(globalInSpy).to.have.callCount(1);
    expect(localOutSpy).to.have.callCount(1);

    // sanity check that wrong functions are not called
    expect(globalOutSpy).to.have.callCount(1);
    expect(localInSpy).to.have.callCount(1);
  });
});
