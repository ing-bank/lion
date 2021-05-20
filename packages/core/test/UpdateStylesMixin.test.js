import { defineCE, expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { css, LitElement } from '../index.js';
import { UpdateStylesMixin } from '../src/UpdateStylesMixin.js';

describe('UpdateStylesMixin', () => {
  it('handles css variables && direct e.g. host css properties correctly', async () => {
    class UpdateStylesElement extends UpdateStylesMixin(LitElement) {
      static get styles() {
        return [
          css`
            :host {
              text-align: right;

              --color: rgb(128, 128, 128);
            }

            h1 {
              color: var(--color);
            }
          `,
        ];
      }

      render() {
        return html`<h1 id="header">hey</h1>`;
      }
    }

    const tag = defineCE(UpdateStylesElement);
    const el = /** @type {UpdateStylesElement} */ (await fixture(`<${tag}></${tag}>`));
    const header = /** @type {Element} */ (el.shadowRoot?.getElementById('header'));

    expect(window.getComputedStyle(header).color).to.equal('rgb(128, 128, 128)');
    expect(window.getComputedStyle(el).textAlign).to.equal('right');
    el.updateStyles({
      '--color': 'rgb(255, 0, 0)',
      'text-align': 'center',
    });

    await el.updateComplete;
    expect(window.getComputedStyle(header).color).to.equal('rgb(255, 0, 0)');
    expect(window.getComputedStyle(el).textAlign).to.equal('center');
  });

  it('preserves existing styles', async () => {
    class UpdateStylesElement extends UpdateStylesMixin(LitElement) {
      static get styles() {
        return [
          css`
            :host {
              --color: rgb(128, 128, 128);
            }

            h1 {
              color: var(--color);
            }
          `,
        ];
      }

      render() {
        return html`<h1 id="header">hey</h1>`;
      }
    }
    const tag = defineCE(UpdateStylesElement);
    const el = /** @type {UpdateStylesElement} */ (await fixture(`<${tag}></${tag}>`));
    const header = /** @type {Element} */ (el.shadowRoot?.getElementById('header'));

    expect(window.getComputedStyle(header).color).to.equal('rgb(128, 128, 128)');
    el.updateStyles({ '--color': 'rgb(255, 0, 0)' });

    expect(window.getComputedStyle(header).color).to.equal('rgb(255, 0, 0)');
    el.updateStyles({ 'text-align': 'left' });

    const styles = window.getComputedStyle(header);
    expect(styles.color).to.equal('rgb(255, 0, 0)');
    expect(styles.textAlign).to.equal('left');
  });
});
