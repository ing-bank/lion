import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { EventTargetShim } from '../src/EventTargetShim.js';

describe('EventTargetShim', () => {
  class NonElementClass extends EventTargetShim {}

  it('implements "addEventListener"', async () => {
    const nonElementClass = new NonElementClass();
    const cb = sinon.spy();

    nonElementClass.addEventListener('my-event', cb);
    expect(cb).to.not.have.been.called;
    nonElementClass.dispatchEvent(new Event('my-event'));
    expect(cb).to.have.been.called;
  });

  it('implements "removeEventListener"', async () => {
    const nonElementClass = new NonElementClass();
    const cb = sinon.spy();

    nonElementClass.addEventListener('my-event', cb);
    expect(cb).to.not.have.been.called;
    nonElementClass.dispatchEvent(new Event('my-event'));
    expect(cb).to.have.been.calledOnce;

    nonElementClass.removeEventListener('my-event', cb);
    nonElementClass.dispatchEvent(new Event('my-event'));
    expect(cb).to.have.been.calledOnce;
  });

  it('implements "dispatchEvent"', async () => {
    const nonElementClass = new NonElementClass();
    const cb = sinon.spy();

    nonElementClass.addEventListener('my-event', cb);
    expect(cb).to.not.have.been.called;
    nonElementClass.dispatchEvent(new Event('my-event'));
    expect(cb).to.have.been.called;
  });
});
