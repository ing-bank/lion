import { defineCE, expect, fixture } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { getDeepActiveElement } from '../src/getDeepActiveElement.js';

describe('getDeepActiveElement (core)', () => {
  it('returns document.body when nothing is focused', () => {
    /** @type {HTMLElement | null} */ (document.activeElement)?.blur();
    expect(getDeepActiveElement()).to.equal(document.body);
  });

  it('returns the focused element inside nested shadow roots', async () => {
    const innerTag = defineCE(
      class extends LitElement {
        render() {
          return html`<button id="inner">inner</button>`;
        }
      },
    );
    const outerTag = defineCE(
      class extends LitElement {
        render() {
          return html`${document.createElement(innerTag)}`;
        }
      },
    );
    const outer = await fixture(`<${outerTag}></${outerTag}>`);
    const inner = /** @type {LitElement} */ (outer.shadowRoot?.querySelector(innerTag));
    await inner.updateComplete;
    const button = /** @type {HTMLButtonElement} */ (inner.shadowRoot?.getElementById('inner'));
    button.focus();
    expect(getDeepActiveElement()).to.equal(button);
  });
});
