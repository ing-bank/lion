import { expect } from '@open-wc/testing';
import { LegacyDisclosure } from '../src/legacy-adapter.js';

/**
 * The compatibility contract: extensions written before the platform vocabulary must keep working,
 * while the state machine underneath owns the timing.
 */
describe('LegacyDisclosure (compatibility layer)', () => {
  /** @type {HTMLElement} */
  let element;
  /** @type {LegacyDisclosure} */
  let legacy;
  /** @type {string[]} */
  let seen;

  beforeEach(() => {
    element = document.createElement('div');
    const content = document.createElement('div');
    element.appendChild(content);
    document.body.appendChild(element);
    legacy = new LegacyDisclosure({ element, content, descriptor: { closedby: 'none' } });
    seen = [];
    [
      'before-show',
      'before-opened',
      'show',
      'opened-changed',
      'before-hide',
      'before-closed',
      'hide',
      'closed-changed',
    ].forEach(name => element.addEventListener(name, () => seen.push(name)));
  });

  afterEach(async () => {
    await legacy.teardown();
    element.remove();
  });

  it('presents the legacy names for open state and actions', async () => {
    expect(legacy.opened).to.be.false;
    expect(legacy.isShown).to.be.false;

    await legacy.show();
    expect(legacy.opened).to.be.true;
    expect(legacy.isShown).to.be.true;
    expect(element.hasAttribute('open')).to.be.true;

    legacy.opened = false;
    expect(legacy.opened).to.be.false;
  });

  it('maps the platform events onto the legacy events, in order', async () => {
    await legacy.show();
    await legacy.hide();
    expect(seen).to.deep.equal([
      'before-show',
      'before-opened',
      'show',
      'opened-changed',
      'before-hide',
      'before-closed',
      'hide',
      'closed-changed',
    ]);
  });

  it('lets a legacy before-show listener cancel the opening', async () => {
    element.addEventListener('before-show', event => event.preventDefault());
    await legacy.show();
    expect(legacy.opened).to.be.false;
  });

  it('closes on the legacy close-overlay input and resolves the completion promises', async () => {
    const shown = legacy._showComplete;
    await legacy.show();
    await shown;

    element.dispatchEvent(new Event('close-overlay', { bubbles: true }));
    await legacy._hideComplete;
    expect(legacy.opened).to.be.false;
  });
});
