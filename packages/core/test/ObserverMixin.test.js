import { expect, fixture, defineCE } from '@open-wc/testing';
import sinon from 'sinon';
import { LionLitElement } from '../src/LionLitElement.js';

import { ObserverMixin } from '../src/ObserverMixin.js';

describe('ObserverMixin', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('throws if a syncObserver function is not found', async () => {
    class SyncTest extends ObserverMixin(class {}) {
      static get properties() {
        return { size: { type: 'String' } };
      }

      static get syncObservers() {
        return { _onSyncMissingFunction: ['size'] };
      }

      get localName() {
        return 'SyncTest';
      }
    }

    let error = false;
    try {
      new SyncTest(); // eslint-disable-line no-new
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal(
      'SyncTest does not have a function called _onSyncMissingFunction',
    );
  });

  it('throws if a asyncObserver function is not found', async () => {
    class AsyncTest extends ObserverMixin(class {}) {
      static get properties() {
        return { size: { type: 'String' } };
      }

      static get asyncObservers() {
        return { _onAsyncMissingFunction: ['size'] };
      }

      get localName() {
        return 'AsyncTest';
      }
    }

    let error = false;
    try {
      new AsyncTest(); // eslint-disable-line no-new
    } catch (err) {
      error = err;
    }
    expect(error).to.be.instanceOf(Error);
    expect(error.message).to.equal(
      'AsyncTest does not have a function called _onAsyncMissingFunction',
    );
  });

  // TODO: replace with requestUpdate()?
  it('provides triggerObserversFor() which can be used within a setter to hook into the observer system', async () => {
    const tag = defineCE(
      class extends ObserverMixin(LionLitElement) {
        static get syncObservers() {
          return { _onSyncSizeChanged: ['size'] };
        }

        static get asyncObservers() {
          return { _onAsyncSizeChanged: ['size'] };
        }

        set size(newValue) {
          const oldValue = this.__mySize;
          this.__mySize = newValue;
          this.triggerObserversFor('size', newValue, oldValue);
        }

        get size() {
          return this.__mySize;
        }

        _onSyncSizeChanged() {}

        _onAsyncSizeChanged() {}
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    const asyncSpy = sinon.spy(el, '_onAsyncSizeChanged');
    const syncSpy = sinon.spy(el, '_onSyncSizeChanged');

    el.size = 'tiny';
    expect(syncSpy.callCount).to.equal(1);
    expect(syncSpy.calledWith({ size: 'tiny' }, { size: undefined })).to.be.true;
    el.size = 'big';
    expect(syncSpy.callCount).to.equal(2);
    expect(syncSpy.calledWith({ size: 'big' }, { size: 'tiny' })).to.be.true;

    expect(asyncSpy.callCount).to.equal(0);

    await el.updateComplete;
    expect(syncSpy.callCount).to.equal(2);
    expect(asyncSpy.callCount).to.equal(1);
    expect(asyncSpy.calledWith({ size: 'big' }, { size: undefined })).to.be.true;

    el.size = 'medium';
    await el.updateComplete;
    expect(syncSpy.callCount).to.equal(3);
    expect(syncSpy.calledWith({ size: 'medium' }, { size: 'big' })).to.be.true;
    expect(asyncSpy.calledWith({ size: 'medium' }, { size: 'big' })).to.be.true;
  });

  describe('syncObservers', () => {
    it('calls observers immediately when the observed property is changed (newValue !== oldValue)', async () => {
      const tag = defineCE(
        class extends ObserverMixin(LionLitElement) {
          static get properties() {
            return { size: { type: String } };
          }

          static get syncObservers() {
            return { _onSizeChanged: ['size'] };
          }

          _onSizeChanged() {}
        },
      );
      const el = await fixture(`<${tag}></${tag}>`);
      const observerSpy = sinon.spy(el, '_onSizeChanged');
      expect(observerSpy.callCount).to.equal(0);
      el.size = 'tiny';
      expect(observerSpy.callCount).to.equal(1);
      el.size = 'tiny';
      expect(observerSpy.callCount).to.equal(1);
      el.size = 'big';
      expect(observerSpy.callCount).to.equal(2);
    });

    it('makes call to observer for every observed property change', async () => {
      const tag = defineCE(
        class extends ObserverMixin(LionLitElement) {
          static get properties() {
            return {
              size: { type: String },
              speed: { type: Number },
            };
          }

          static get syncObservers() {
            return {
              _onSpeedOrTypeChanged: ['size', 'speed'],
            };
          }

          _onSpeedOrTypeChanged() {
            this.__testSize = this.size;
          }
        },
      );
      const el = await fixture(`<${tag}></${tag}>`);
      const observerSpy = sinon.spy(el, '_onSpeedOrTypeChanged');

      el.size = 'big';
      expect(observerSpy.callCount).to.equal(1);
      expect(el.__testSize).to.equal('big');

      el.speed = 3;
      expect(observerSpy.callCount).to.equal(2);
      expect(
        observerSpy.calledWith(
          { size: 'big', speed: undefined },
          { size: undefined, speed: undefined },
        ),
      ).to.be.true;
      expect(observerSpy.calledWith({ size: 'big', speed: 3 }, { size: 'big', speed: undefined }))
        .to.be.true;
    });
  });

  describe('asyncObservers', () => {
    it('calls observer patched when the observed property is changed', async () => {
      const tag = defineCE(
        class extends ObserverMixin(LionLitElement) {
          static get properties() {
            return { size: { type: 'String' } };
          }

          static get asyncObservers() {
            return { _onAsyncSizeChanged: ['size'] };
          }

          _onAsyncSizeChanged() {}
        },
      );
      const el = await fixture(`<${tag}></${tag}>`);
      const observerSpy = sinon.spy(el, '_onAsyncSizeChanged');
      el.size = 'tiny';
      expect(observerSpy.callCount).to.equal(0);
      await el.updateComplete;
      expect(observerSpy.callCount).to.equal(1);
    });

    it('makes only one call to observer even if multiple observed attributes changed', async () => {
      const tag = defineCE(
        class extends ObserverMixin(LionLitElement) {
          static get properties() {
            return {
              size: { type: 'String' },
              speed: { type: 'Number' },
            };
          }

          static get asyncObservers() {
            return {
              _onAsyncSpeedOrTypeChanged: ['size', 'speed'],
            };
          }

          _onAsyncSpeedOrTypeChanged() {}
        },
      );
      const el = await fixture(`<${tag}></${tag}>`);
      const observerSpy = sinon.spy(el, '_onAsyncSpeedOrTypeChanged');
      el.size = 'big';
      el.speed = 3;
      expect(observerSpy.callCount).to.equal(0);
      await el.updateComplete;
      expect(observerSpy.callCount).to.equal(1);

      expect(
        observerSpy.calledWith({ size: 'big', speed: 3 }, { size: undefined, speed: undefined }),
      ).to.be.true;
    });
  });
});
