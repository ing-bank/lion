/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { expect } from '@open-wc/testing';
// @ts-expect-error Note we don't export these types yet
import { createRef, ref } from '@lion/core';
import {
  css as css2,
  unsafeCSS as unsafeCSS2,
  html as html2,
  isTemplateResult as isTemplateResult2,
  render as render2,
  LitElement as LitElement2,
  svg as svg2,
  repeat as repeat2,
} from '../index.js.js.js';
import {
  css as css1,
  unsafeCSS as unsafeCSS1,
  html as html1,
  CSSResult as CSSResult1,
  LitElement as LitElement1,
  svg as svg1,
  repeat as repeat1,
  render as render1,
} from '@lion/core';
import { html2Hybrid } from '../hybrid-lit/html2-hybrid-tag.js.js.js';
import { cssHybrid } from '../hybrid-lit/css-hybrid-tag.js.js.js';
import { svgHybrid } from '../hybrid-lit/svg-hybrid-tag.js.js.js';
import { isLit1TemplateResult as isTemplateResult1 } from '../helpers/isLit1TemplateResult.js.js.js';
/**
 * @typedef {import('../types').CSSResultHybrid} CSSResultHybrid
 * @typedef {import('../types').SVGTemplateResultHybrid} SVGTemplateResultHybrid
 * @typedef {import('lit').CSSResultGroup} CSSResultGroup2
 * @typedef {import('lit').TemplateResult} TemplateResult2
 */

// Testing whether we're actually exporting lit1 css variables & not css lit2,
// by expecting css vars to work in a lit1 context
describe('Lit hybrid', () => {
  describe('cssHybrid', () => {
    const hybridCssContent = cssHybrid`.x { border: 2px }`;
    const css1Content = css1`.x { border: 2px }`;
    const css2Content = css2`.x { border: 2px }`;
    const expectedCssText = '.x { border: 2px }';

    it('returns a CSSResult1 with "_$cssResult$" true', async () => {
      /** @type {CSSResultHybrid} */
      const result = cssHybrid`${css2Content}`;
      expect(result._$cssResult$).to.be.true;
      expect(result instanceof CSSResult1).to.be.true;
    });

    describe('When used as outer tag', () => {
      it('works with css1 tags inside', async () => {
        const result = cssHybrid`${css1Content}`;
        expect(result.cssText).to.equal(expectedCssText);
      });

      it('works with css2 tags inside', async () => {
        const result = cssHybrid`${css2Content}`;
        expect(result.cssText).to.equal(expectedCssText);
      });

      it('works with mixed tags inside', async () => {
        const result = cssHybrid`${css1Content}${css2Content}`;
        expect(result.cssText).to.equal(`${expectedCssText}${expectedCssText}`);
      });
    });

    describe('When used as inner tag', () => {
      it('works inside css2 context', async () => {
        // @ts-expect-error
        const result = css2`${hybridCssContent}`;
        expect(result.cssText).to.equal(expectedCssText);
      });
    });

    describe('When used inside LitElement (v1 or v2)', () => {
      it('works inside LitElement 1', async () => {
        expect(() => {
          // eslint-disable-next-line no-unused-vars
          class Test extends LitElement1 {
            static get styles() {
              return cssHybrid`.test { border: blue; }`;
            }
          }
        }).to.not.throw();
      });

      it('works inside LitElement 2', async () => {
        expect(() => {
          // eslint-disable-next-line no-unused-vars
          class Test extends LitElement2 {
            static get styles() {
              return /** @type {* & CSSResultGroup2} */ (cssHybrid`.test { border: blue; }`);
            }
          }
        }).to.not.throw();
      });
    });

    describe('When using unsafeCSS inside (v1 or v2)', () => {
      it('works with unsafeCSS1 inside', async () => {
        const result = cssHybrid`${unsafeCSS1`2`}`;
        expect(result.cssText).to.equal('2');
      });

      it('works with unsafeCSS2 inside', async () => {
        const result = cssHybrid`${unsafeCSS2`2`}`;
        expect(result.cssText).to.equal('2');
      });
    });
  });

  describe('html2Hybrid', () => {
    const hybridHtmlContent = html2Hybrid`<div>test</div>`;
    const html1Content = html1`<div>test</div>`;
    const html2Content = html2`<div>test</div>`;
    const expectedOuterHtml = '<div>test</div>';

    it('returns a HTMLResult2', async () => {
      let result;
      expect(() => {
        result = html2Hybrid`${html2Content}`;
      }).to.not.throw();
      expect(isTemplateResult2(result)).to.be.true;
    });

    describe('When used as outer tag', () => {
      it('works with html2 tags inside', async () => {
        /** @type {TemplateResult2} */
        let result;
        expect(() => {
          result = html2Hybrid`${html2Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtml);
      });

      it('works with html1 tags inside', async () => {
        let result;
        expect(() => {
          result = html2Hybrid`${html1Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtml);
      });

      it('works with mixed tags inside', async () => {
        let result;
        expect(() => {
          result = html2Hybrid`${html1Content}${html2Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtml + expectedOuterHtml);
      });
    });

    describe('When used as inner tag', () => {
      it('works inside html2 context', async () => {
        expect(() => {
          html2`${hybridHtmlContent}`;
        }).to.not.throw();
      });

      it('works inside html1 context', async () => {
        expect(() => {
          html1`${hybridHtmlContent}`;
        }).to.not.throw();
      });
    });

    describe('When used inside LitElement (v1 or v2)', () => {
      it('works inside LitElement 1', async () => {
        expect(() => {
          // eslint-disable-next-line no-unused-vars
          class Test extends LitElement1 {
            render() {
              return html2Hybrid`<div>x</div>`;
            }
          }
        }).to.not.throw();
      });

      it('works inside LitElement 2', async () => {
        expect(() => {
          // eslint-disable-next-line no-unused-vars
          class Test extends LitElement2 {
            render() {
              return html2Hybrid`<div>x</div>`;
            }
          }
        }).to.not.throw();
      });
    });

    describe('With directives (v1 or v2)', () => {
      const items = [{ name: 'x' }, { name: 'y' }];

      it('does not work with Lit 1 directives', async () => {
        let result;
        expect(() => {
          result = html2Hybrid`<ul>${repeat1(
            items,
            item => item.name,
            (item, index) => html2Hybrid` <li>${index}: ${item.name}</li>`,
          )}</ul>`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).dom.to.not.equal(`<div><ul><li>0: x</li><li>1: y</li></ul></div>`);
      });

      it('works with Lit 2 directives', async () => {
        let result;
        expect(() => {
          result = html2Hybrid`<ul>${repeat2(
            items,
            item => item.name,
            (item, index) => html2Hybrid` <li>${index}: ${item.name}</li>`,
          )}</ul>`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).dom.to.equal(`<div><ul><li>0: x</li><li>1: y</li></ul></div>`);
      });
    });

    describe('With svg (v1 or v2)', () => {
      const expectedOuterHtmlSvg = `<svg width="100" height="100">
        <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
      </svg>`;
      const svg1Content = svg1`<svg width="100" height="100">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>`;
      const svg2Content = svg2`<svg width="100" height="100">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>`;

      it('works with svg2 tags inside', async () => {
        /** @type {TemplateResult2} */
        let result;
        expect(() => {
          result = html2Hybrid`${svg2Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtmlSvg);
      });

      it('works with svg1 tags inside', async () => {
        /** @type {TemplateResult2} */
        let result;
        expect(() => {
          result = html2Hybrid`${svg1Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtmlSvg);
      });

      it('works with mixed tags inside', async () => {
        let result;
        expect(() => {
          result = html2Hybrid`${svg1Content}${svg2Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render2(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtmlSvg + expectedOuterHtmlSvg);
      });
    });
  });

  describe('svgHybrid', () => {
    const toTplStrArr = (/** @type {string[]} */ strs) => {
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      strs.raw = strs;
      return /** @type {* & TemplateStringsArray} */ (strs);
    };
    const expectedOuterHtmlSvg = `<svg width="100" height="100">
      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
    </svg>`;
    const svg1Content = svg1(toTplStrArr([expectedOuterHtmlSvg]));
    const svg2Content = svg2(toTplStrArr([expectedOuterHtmlSvg]));
    const hybridSvgContent = svgHybrid(toTplStrArr([expectedOuterHtmlSvg]));

    it('returns a SVGResult1 with "_$litType$" true', async () => {
      const result = svgHybrid`${svg2Content}`;
      expect(result._$litType$).to.equal(2);
      expect(isTemplateResult1(result)).to.be.true;
    });

    describe('When used as outer tag', () => {
      it('works with svg1 tags inside', async () => {
        let result;
        expect(() => {
          result = svgHybrid`${svg1Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render1(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtmlSvg);
      });

      it('works with svg2 tags inside', async () => {
        let result;
        expect(() => {
          result = svgHybrid`${svg2Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render1(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtmlSvg);
      });

      it('works with mixed tags inside', async () => {
        let result;
        expect(() => {
          result = svgHybrid`${svg1Content}${svg2Content}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render1(result, container);
        expect(container).lightDom.to.equal(`${expectedOuterHtmlSvg}${expectedOuterHtmlSvg}`);
      });
    });

    describe('When used as inner tag', () => {
      it('does not works inside svg2 context', async () => {
        let result;
        expect(() => {
          result = svg2`${hybridSvgContent}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render1(result, container);
        expect(container).lightDom.to.not.equal(expectedOuterHtmlSvg);
      });

      it('works inside svg1 context', async () => {
        let result;
        expect(() => {
          result = svg1`${hybridSvgContent}`;
        }).to.not.throw();
        const container = document.createElement('div');
        // @ts-ignore
        render1(result, container);
        expect(container).lightDom.to.equal(expectedOuterHtmlSvg);
      });
    });

    describe('When used inside LitElement (v1 or v2)', () => {
      it('works inside LitElement 1', async () => {
        expect(() => {
          // eslint-disable-next-line no-unused-vars
          class Test extends LitElement1 {
            render() {
              return svgHybrid(toTplStrArr([expectedOuterHtmlSvg]));
            }
          }
        }).to.not.throw();
      });

      it('works inside LitElement 2', async () => {
        expect(() => {
          // eslint-disable-next-line no-unused-vars
          class Test extends LitElement2 {
            render() {
              return svgHybrid(toTplStrArr([expectedOuterHtmlSvg]));
            }
          }
        }).to.not.throw();
      });
    });
  });
});

describe('Exported class based directives', () => {
  it('does not work inside html1', async () => {
    const inputRef = createRef();
    const result = html1`<input ${ref(inputRef)}>`;
    const container = document.createElement('div');
    expect(() => {
      // @ts-ignore
      render1(result, container);
    }).to.throw();
  });

  it('works inside html2Hybrid', async () => {
    const inputRef = createRef();
    let result;
    expect(() => {
      result = html2Hybrid`<input ${ref(inputRef)}>`;
    }).to.not.throw();
    const container = document.createElement('div');
    // @ts-ignore
    render2(result, container);
    expect(inputRef.value.tagName).to.equal(`INPUT`);
  });
});
