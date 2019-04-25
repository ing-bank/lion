/* eslint-env mocha */
/* eslint-disable no-underscore-dangle, no-unused-expressions, class-methods-use-this */
import { expect, fixture, defineCE } from '@open-wc/testing';

import { LionLitElement, html, css } from '../src/LionLitElement.js';

describe('LionLitElement', () => {
  describe('updateStyles()', () => {
    it('handles css variables && direct e.g. host css properties correctly', async () => {
      const elementName = defineCE(
        class extends LionLitElement {
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
            return html`
              <h1 id="header">hey</h1>
            `;
          }
        },
      );
      const shadowLion = await fixture(`<${elementName}></${elementName}>`);
      expect(window.getComputedStyle(shadowLion.$id('header')).color).to.equal(
        'rgb(128, 128, 128)',
      );
      expect(window.getComputedStyle(shadowLion).textAlign).to.equal('right');
      shadowLion.updateStyles({
        '--color': 'rgb(255, 0, 0)',
        'text-align': 'center',
      });

      await elementName.updateComplete;
      expect(window.getComputedStyle(shadowLion.$id('header')).color).to.equal('rgb(255, 0, 0)');
      expect(window.getComputedStyle(shadowLion).textAlign).to.equal('center');
    });

    it('preserves existing styles', async () => {
      const elementName = defineCE(
        class extends LionLitElement {
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
            return html`
              <h1 id="header">hey</h1>
            `;
          }
        },
      );
      const shadowLion = await fixture(`<${elementName}></${elementName}>`);
      expect(window.getComputedStyle(shadowLion.$id('header')).color).to.equal(
        'rgb(128, 128, 128)',
      );
      shadowLion.updateStyles({ '--color': 'rgb(255, 0, 0)' });

      await elementName.updateComplete;
      expect(window.getComputedStyle(shadowLion.$id('header')).color).to.equal('rgb(255, 0, 0)');
      shadowLion.updateStyles({ 'text-align': 'left' });

      await elementName.updateComplete;
      const styles = window.getComputedStyle(shadowLion.$id('header'));
      expect(styles.color).to.equal('rgb(255, 0, 0)');
      expect(styles.textAlign).to.equal('left');
    });
  });
});
