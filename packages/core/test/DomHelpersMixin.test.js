import { expect, fixture, defineCE } from '@open-wc/testing';
import { LionLitElement, html } from '../src/LionLitElement.js';

describe('DomHelpersMixin', () => {
  describe('$id()', () => {
    it('provides access to element in Shadom DOM with "id" attribute', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <div id="myId">my element</div>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}></${tag}>`);
      expect(element.$id('myId').innerText).to.equal('my element');
    });

    it('memoizes element reference in cache', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <div id="myId">my element</div>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}></${tag}>`);
      element.$id('myId');
      element.shadowRoot.innerHTML = '';
      expect(element.$id('myId').innerText).to.equal('my element');
    });

    it('can be removed from cache (individually or completely) via _clearDomCache()', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <div id="myId">my element</div>
            `;
          }
        },
      );

      const element = await fixture(`<${tag}></${tag}>`);
      element.$id('myId');
      element.shadowRoot.innerHTML = '';
      element._clearDomCache('$id', 'myId');
      expect(element.$id('myId')).to.equal(undefined);

      const element2 = await fixture(`<${tag}></${tag}>`);
      element.$id('myId');
      element2.shadowRoot.innerHTML = '';
      element2._clearDomCache();
      expect(element2.$id('myId')).to.equal(undefined);
    });
  });

  describe('$name()', () => {
    it('provides access to element in Shadom DOM with "name" attribute', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <div name="myName">my element</div>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}></${tag}>`);
      expect(element.$name('myName').innerText).to.equal('my element');
    });

    it('memoizes element reference in cache', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <div name="myName">my element</div>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}></${tag}>`);
      element.$name('myName');
      element.shadowRoot.innerHTML = '';
      expect(element.$name('myName').innerText).to.equal('my element');
    });

    it('can be removed from cache (individually or completely) via _clearDomCache()', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <div name="myName">my element</div>
            `;
          }
        },
      );

      const element = await fixture(`<${tag}></${tag}>`);
      element.$name('myName');
      element.shadowRoot.innerHTML = '';
      element._clearDomCache('$name', 'myName');
      expect(element.$name('myName')).to.equal(undefined);

      const element2 = await fixture(`<${tag}></${tag}>`);
      element.$name('myName');
      element2.shadowRoot.innerHTML = '';
      element2._clearDomCache();
      expect(element2.$name('myName')).to.equal(undefined);
    });
  });

  describe('$$id()', () => {
    it('provides access to element in Light DOM with "id" attribute', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          createRenderRoot() {
            return this;
          }

          render() {
            return html`
              <div id="myId">my element</div>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}></${tag}>`);
      expect(element.$$id('myId').innerText).to.equal('my element');
    });

    it('memoizes element reference in cache', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          createRenderRoot() {
            return this;
          }

          render() {
            return html`
              <div id="myId">my element</div>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}></${tag}>`);
      element.$$id('myId');
      element.innerHTML = '';
      expect(element.$$id('myId').innerText).to.equal('my element');
    });

    it('can be removed from cache (individually or completely) via _clearDomCache()', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          createRenderRoot() {
            return this;
          }

          render() {
            return html`
              <div id="myId">my element</div>
            `;
          }
        },
      );

      const element = await fixture(`<${tag}></${tag}>`);
      element.$$id('myId');
      element.innerHTML = '';
      element._clearDomCache('$$id', 'myId');
      expect(element.$$id('myId')).to.equal(undefined);

      const element2 = await fixture(`<${tag}></${tag}>`);
      element.$$id('myId');
      element2.innerHTML = '';
      element2._clearDomCache();
      expect(element2.$$id('myId')).to.equal(undefined);
    });
  });

  describe('$$slot()', () => {
    it('provides access to element in Light DOM with "slot" attribute', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <slot name="mySlot"></slot>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}>
        <div slot="mySlot">my element</div>
      </${tag}>`);
      expect(element.$$slot('mySlot').innerText).to.equal('my element');
    });

    it('retrieves the first named slot that is a direct child of the element', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <!-- here the nested slots will be plotted -->
              <slot></slot>
              <!-- here the slots belonging to this component are plotted -->
              <slot name="slotA"></slot>
              <slot name="slotB"></slot>
              <slot name="slotC"></slot>
            `;
          }
        },
      );
      const tagNested = tag; // reuse the same component for nested slots with same slot names
      const fieldsetNested = await fixture(`
        <${tag}>
          <div slot="slotA">Get this slotA</div>
          <${tagNested}>
            <div slot="slotA">Don't get this slotA</div>
            <div slot="slotB">Don't get this slotB</div>
            <div slot="slotC">Don't get this slotC</div>
          </${tagNested}>
          <div slot="slotB">Get this slotB (2nd in dom, but belongs to 'upper tag')</div>
          <div slot="slotB">
            Don't get this slotB either
            (it only should get the first slot that is a direct child)
          </div>
        </${tag}>`);

      expect(fieldsetNested.$$slot('slotA').textContent).to.equal('Get this slotA');
      expect(fieldsetNested.$$slot('slotB').textContent).to.equal(
        "Get this slotB (2nd in dom, but belongs to 'upper tag')",
      );
      expect(fieldsetNested.$$slot('slotC')).to.equal(undefined);
    });

    it('memoizes element reference in cache', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <slot name="mySlot"></slot>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}>
        <div slot="mySlot">my element</div>
      </${tag}>`);
      element.$$slot('mySlot');
      element.innerHTML = '';
      expect(element.$$slot('mySlot').innerText).to.equal('my element');
    });

    it('can be removed from cache (individually or completely) via _clearDomCache()', async () => {
      const tag = defineCE(
        class extends LionLitElement {
          render() {
            return html`
              <slot name="mySlot"></slot>
            `;
          }
        },
      );
      const element = await fixture(`<${tag}>
        <div slot="mySlot">my element</div>
      </${tag}>`);
      element.$$slot('mySlot');
      element.innerHTML = '';
      element._clearDomCache('$$slot', 'mySlot');
      expect(element.$$slot('mySlot')).to.equal(undefined);

      const element2 = await fixture(`<${tag}>
        <div slot="mySlot">my element</div>
      </${tag}>`);
      element2.$$slot('mySlot');
      element2.innerHTML = '';
      element2._clearDomCache();
      expect(element2.$$slot('mySlot')).to.equal(undefined);
    });
  });
});
