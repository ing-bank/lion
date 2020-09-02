import { expect, fixture, html } from '@open-wc/testing';
import { renderLitAsNode } from '@lion/helpers';

import { getDeepActiveElement } from '../../src/utils/get-deep-active-element.js';
import { getFocusableElements } from '../../src/utils/get-focusable-elements.js';
import { keyCodes } from '../../src/utils/key-codes.js';
import { containFocus } from '../../src/utils/contain-focus.js';

function simulateTabWithinContainFocus() {
  const event = new CustomEvent('keydown', { detail: 0, bubbles: true });
  event.keyCode = keyCodes.tab;
  window.dispatchEvent(event);
}

function simulateTabInWindow(elToRecieveFocus) {
  window.dispatchEvent(new Event('blur'));
  elToRecieveFocus.focus();
  window.dispatchEvent(new Event('focusin'));
}

const interactionElementsNode = renderLitAsNode(html`
  <div>
    <button id="el1"></button>
    <a id="el2" href="#"></a>
    <div id="el3" tabindex="0"></div>
    <input id="el4" />
    <div id="el5" contenteditable="true"></div>
    <textarea id="el6"></textarea>
    <select id="el7">
      <option>1</option>
    </select>
  </div>
`);

const lightDomTemplate = html`
  <div>
    <button id="outside-1">outside 1</button>
    <div id="rootElement">${interactionElementsNode}</div>
    <button id="outside-2">outside 2</button>
  </div>
`;

const lightDomAutofocusTemplate = html`
  <div>
    <button id="outside-1">outside 1</button>

    <div id="rootElement">
      <button id="el1"></button>
      <a id="el2" href="#"></a>
      <div id="el3" tabindex="0"></div>
      <input id="el4" autofocus />
      <div id="el5" contenteditable="true"></div>
      <textarea id="el6"></textarea>
      <select id="el7">
        <option>1</option>
      </select>
    </div>

    <button id="outside-2">outside 2</button>
  </div>
`;

function createShadowDomNode() {
  const shadowDomNode = renderLitAsNode(html`
    <div>
      <button id="outside-1">outside 1</button>
      <div id="rootElementShadow"></div>
      <button id="outside-2">outside 2</button>
    </div>
  `);
  const rootElementShadow = shadowDomNode.querySelector('#rootElementShadow');
  rootElementShadow.attachShadow({ mode: 'open' });
  rootElementShadow.shadowRoot.appendChild(interactionElementsNode);
  return shadowDomNode;
}

describe('containFocus()', () => {
  it('starts focus at the root element when there is no element with [autofocus]', async () => {
    await fixture(lightDomTemplate);
    const root = document.getElementById('rootElement');
    const { disconnect } = containFocus(root);

    expect(getDeepActiveElement()).to.equal(root);
    expect(root.getAttribute('tabindex')).to.equal('-1');
    expect(root.style.getPropertyValue('outline-style')).to.equal('none');

    disconnect();
  });

  it('starts focus at the element with [autofocus] attribute', async () => {
    await fixture(lightDomAutofocusTemplate);
    const el = document.querySelector('input[autofocus]');
    const { disconnect } = containFocus(el);

    expect(getDeepActiveElement()).to.equal(el);

    disconnect();
  });

  it('on tab, focuses first focusable element if focus was on element outside root element', async () => {
    await fixture(lightDomTemplate);
    const root = document.getElementById('rootElement');
    const focusableElements = getFocusableElements(root);
    const { disconnect } = containFocus(root);

    document.getElementById('outside-1').focus();

    simulateTabWithinContainFocus();
    expect(getDeepActiveElement()).to.equal(focusableElements[0]);

    disconnect();
  });

  it('on tab, focuses first focusable element if focus was on the last focusable element', async () => {
    await fixture(lightDomTemplate);
    const root = document.getElementById('rootElement');
    const focusableElements = getFocusableElements(root);
    const { disconnect } = containFocus(root);

    focusableElements[focusableElements.length - 1].focus();

    simulateTabWithinContainFocus();
    expect(getDeepActiveElement()).to.equal(focusableElements[0]);

    disconnect();
  });

  it('on tab, does not interfere if focus remains within the root element', async () => {
    await fixture(lightDomTemplate);
    const root = document.getElementById('rootElement');
    const focusableElements = getFocusableElements(root);
    const { disconnect } = containFocus(root);

    focusableElements[2].focus();

    simulateTabWithinContainFocus();
    /**
     * We test if focus remained on the same element because we cannot simulate
     * actual tab key press. So the best we can do is if we didn't redirect focus
     * to the first element.
     */
    expect(getDeepActiveElement()).to.equal(focusableElements[2]);

    disconnect();
  });

  describe('Tabbing into window', () => {
    it('restores focus within root element', async () => {
      await fixture(lightDomTemplate);
      const root = document.getElementById('rootElement');
      const focusableElements = getFocusableElements(root);
      const { disconnect } = containFocus(root);

      // Simulate tab in window
      simulateTabInWindow(document.getElementById('outside-1'));
      expect(getDeepActiveElement()).to.equal(focusableElements[0]);

      // Simulate shift+tab in window
      simulateTabInWindow(document.getElementById('outside-2'));
      expect(getDeepActiveElement()).to.equal(focusableElements[focusableElements.length - 1]);

      disconnect();
    });

    it('restores focus within root element with shadow dom', async () => {
      const el = await fixture(html`${createShadowDomNode()}`);
      const root = el.querySelector('#rootElementShadow');
      const focusableElements = getFocusableElements(root);
      const { disconnect } = containFocus(root);

      // Simulate tab in window
      simulateTabInWindow(document.getElementById('outside-1'));
      expect(getDeepActiveElement()).to.equal(focusableElements[0]);

      // Simulate shift+tab in window
      simulateTabInWindow(document.getElementById('outside-2'));
      expect(getDeepActiveElement()).to.equal(focusableElements[focusableElements.length - 1]);

      disconnect();
    });

    it('keeps focus if already in rootElement', async () => {
      const el = await fixture(html`${createShadowDomNode()}`);
      const root = el.querySelector('#rootElementShadow');
      const focusableElements = getFocusableElements(root);
      const { disconnect } = containFocus(root);

      // Simulate tab in window
      simulateTabInWindow(focusableElements[0]);
      expect(getDeepActiveElement()).to.equal(focusableElements[0]);

      // Simulate shift+tab in window
      simulateTabInWindow(focusableElements[focusableElements.length - 1]);
      expect(getDeepActiveElement()).to.equal(focusableElements[focusableElements.length - 1]);

      disconnect();
    });
  });
});
