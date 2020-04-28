import { defineCE, expect, fixture, html } from '@open-wc/testing';
import { css, LitElement } from '../index.js';
import { UpdateStylesMixin } from '../src/UpdateStylesMixin.js';

describe('UpdateStylesMixin', () => {
  it('handles css variables && direct e.g. host css properties correctly', async () => {
    const tag = defineCE(
      class extends UpdateStylesMixin(LitElement) {
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
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(window.getComputedStyle(el.shadowRoot.getElementById('header')).color).to.equal(
      'rgb(128, 128, 128)',
    );
    expect(window.getComputedStyle(el).textAlign).to.equal('right');
    el.updateStyles({
      '--color': 'rgb(255, 0, 0)',
      'text-align': 'center',
    });

    await tag.updateComplete;
    expect(window.getComputedStyle(el.shadowRoot.getElementById('header')).color).to.equal(
      'rgb(255, 0, 0)',
    );
    expect(window.getComputedStyle(el).textAlign).to.equal('center');
  });

  it('preserves existing styles', async () => {
    const tag = defineCE(
      class extends UpdateStylesMixin(LitElement) {
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
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(window.getComputedStyle(el.shadowRoot.getElementById('header')).color).to.equal(
      'rgb(128, 128, 128)',
    );
    el.updateStyles({ '--color': 'rgb(255, 0, 0)' });

    await tag.updateComplete;
    expect(window.getComputedStyle(el.shadowRoot.getElementById('header')).color).to.equal(
      'rgb(255, 0, 0)',
    );
    el.updateStyles({ 'text-align': 'left' });

    await tag.updateComplete;
    const styles = window.getComputedStyle(el.shadowRoot.getElementById('header'));
    expect(styles.color).to.equal('rgb(255, 0, 0)');
    expect(styles.textAlign).to.equal('left');
  });
});
