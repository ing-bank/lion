import { expect } from '@open-wc/testing';
import { Disclosure } from '../../src/core/DisclosureCore.js';
import { stackSize } from '../../src/core/features/shared/stack.js';

/**
 * The features that close the platform gaps. The platform gives behaviour (top layer, light dismiss)
 * but leaves semantics, expanded state, dismissal policy, Escape precedence and backdrops to authors:
 * see https://hidde.blog/popover-accessibility/ and
 * https://www.scottohara.me/blog/2025/03/14/popovers.html
 */
describe('Disclosure gap features', () => {
  /** @type {HTMLElement} */
  let element;
  /** @type {HTMLDivElement} */
  let content;
  /** @type {HTMLDivElement} */
  let invoker;

  beforeEach(() => {
    element = document.createElement('div');
    content = document.createElement('div');
    content.id = 'the-content';
    invoker = document.createElement('div');
    element.appendChild(content);
    document.body.appendChild(element);
    document.body.appendChild(invoker);
  });

  afterEach(() => {
    element.remove();
    invoker.remove();
  });

  it('declares no role and no name when the descriptor declares none (no guessing)', async () => {
    const disclosure = new Disclosure({ element, content });
    await disclosure.show();

    expect(content.getAttribute('role')).to.be.null;
    expect(invoker.getAttribute('aria-expanded')).to.be.null;

    await disclosure.close();
  });

  it('sets the semantics the descriptor declares and keeps aria-expanded in sync', async () => {
    const disclosure = new Disclosure({
      element,
      content,
      descriptor: { role: 'dialog', label: 'Settings', invoker },
    });
    await disclosure.show();

    expect(content.getAttribute('role')).to.equal('dialog');
    expect(content.getAttribute('aria-label')).to.equal('Settings');
    expect(invoker.getAttribute('aria-controls')).to.equal('the-content');
    expect(invoker.getAttribute('aria-details')).to.equal('the-content');
    expect(invoker.getAttribute('aria-expanded')).to.equal('true');

    await disclosure.close();
    expect(invoker.getAttribute('aria-expanded')).to.equal('false');
  });

  it('dismisses on a pointer press outside only when lightDismiss is set', async () => {
    const plain = new Disclosure({ element, content });
    await plain.show();
    document.dispatchEvent(new PointerEvent('pointerdown'));
    expect(plain.open).to.be.true;
    await plain.close();

    const light = new Disclosure({ element, content, descriptor: { lightDismiss: true } });
    await light.show();
    element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(light.open, 'a press inside must not dismiss').to.be.true;

    document.dispatchEvent(new PointerEvent('pointerdown'));
    expect(light.open, 'a press outside must dismiss').to.be.false;
  });

  it('leaves focus-out dismissal off unless it is asked for', async () => {
    const plain = new Disclosure({ element, content });
    await plain.show();
    document.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(plain.open).to.be.true;
    await plain.close();

    const eager = new Disclosure({ element, content, descriptor: { dismissOnFocusOut: true } });
    await eager.show();
    document.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    expect(eager.open).to.be.false;
  });

  it('lets only the topmost of two nested disclosures react to Escape', async () => {
    const outerElement = document.createElement('div');
    const outerContent = document.createElement('div');
    const innerElement = document.createElement('div');
    const innerContent = document.createElement('div');
    outerElement.appendChild(outerContent);
    outerElement.appendChild(innerElement);
    innerElement.appendChild(innerContent);
    document.body.appendChild(outerElement);

    const outer = new Disclosure({
      element: outerElement,
      content: outerContent,
      descriptor: { closedby: 'any', modal: true },
    });
    const inner = new Disclosure({
      element: innerElement,
      content: innerContent,
      descriptor: { closedby: 'any' },
    });
    await outer.show();
    await inner.show();
    expect(stackSize()).to.equal(2);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(inner.open, 'the inner disclosure closes first').to.be.false;
    expect(outer.open, 'the modal behind it stays open').to.be.true;

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(outer.open).to.be.false;
    expect(stackSize(), 'the stack is empty again').to.equal(0);

    outerElement.remove();
  });

  it('paints a backdrop for a plain element and marks top-layer content instead', async () => {
    const disclosure = new Disclosure({ element, content, descriptor: { backdrop: true } });
    await disclosure.show();
    const backdrop = element.querySelector('.disclosure-backdrop');
    expect(backdrop).not.to.be.null;

    await disclosure.close();
    expect(element.querySelector('.disclosure-backdrop')).to.be.null;

    const dialog = document.createElement('dialog');
    element.appendChild(dialog);
    const modal = new Disclosure({
      element,
      content: dialog,
      descriptor: { backdrop: true, modal: true },
    });
    await modal.show();
    expect(dialog.hasAttribute('data-backdrop'), 'the platform paints ::backdrop itself').to.be
      .true;
    await modal.close();
    dialog.remove();
  });
});
