/* eslint-disable no-unused-expressions */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineCE, expect, fixture, html as staticHtml, unsafeStatic } from '@open-wc/testing';
import { ScopedElementsMixin as Lit2HybridScopedElementsMixin } from '@open-wc/scoped-elements-2';
import * as afterExports from '@lion/core';
import * as beforeExports from '@lion/core';
import * as _core2Exports from '../index.js.js.js';
import { Lit1HybridScopedElementsMixin } from '../hybrid-scoped-elements/Lit1HybridScopedElementsMixin.js.js.js';

/**
 * @typedef {import('@open-wc/scoped-elements/types/src/types').ScopedElementsHost} ScopedElementsHost1
 * @typedef {import('@open-wc/scoped-elements-2/types/src/types').ScopedElementsHost} ScopedElementsHost2
 */

const core2ExportNames = Object.keys(_core2Exports);

const { css: css2, html: html2, LitElement: LitElement2 } = afterExports;
const { css: css1, html: html1, LitElement: LitElement1 } = beforeExports;

/**
 * @param {object} options
 * @param {Lit1HybridScopedElementsMixin|Lit2HybridScopedElementsMixin} options.currentScopedElementsMixin
 * @param {LitElement1|LitElement2} options.currentLitElement
 * @param {html1|html2} options.currentHtml2Hybrid
 * @returns
 */
async function createScopedClass({
  currentScopedElementsMixin,
  currentLitElement,
  currentHtml2Hybrid,
}) {
  class MyEl extends currentLitElement {
    render() {
      return currentHtml2Hybrid`<div>x</div>`;
    }
  }
  class MyOtherEl extends MyEl {}
  // eslint-disable-next-line no-unused-vars
  /** @type {* & ScopedElementsHost1|ScopedElementsHost2} */
  // @ts-expect-error
  class Test extends currentScopedElementsMixin(currentLitElement) {
    static get scopedElements() {
      return {
        'shadow-el': MyEl,
        'light-el': MyOtherEl,
      };
    }

    connectedCallback() {
      super.connectedCallback();
      const lightEl = this.createScopedElement(this.getScopedTagName('light-el'));
      this.appendChild(lightEl);
    }

    render() {
      return currentHtml2Hybrid`<shadow-el></shadow-el><slot></slot>`;
    }
  }
  const tagName = defineCE(/** @type {* & HTMLElement} */ (Test));
  const tag = unsafeStatic(tagName);
  return /** @type {* & ScopedElementsHost1|ScopedElementsHost2} */ (
    fixture(staticHtml`<${tag}></${tag}>`)
  );
}

/**
 *
 * @param {*} core2Exports
 * @param {{isBefore:boolean}} opts
 */
export function runForwardCompatibilitySuite(core2Exports, { isBefore }) {
  const {
    LitElement,
    ScopedElementsMixin,
    isTemplateResult,
    cssHybrid,
    html2Hybrid,
    directive,
    Directive,
    render,
  } = core2Exports;

  describe('cssHybrid', () => {
    const hybridCssContent = cssHybrid`.x { border: 2px }`;

    const css1Content = css1`.x { border: 2px }`;
    const css2Content = css2`.x { border: 2px }`;

    describe('When used as outer tag', () => {
      it('works both ways with css1 variables inside', async () => {
        expect(() => {
          cssHybrid`${css1Content}`;
        }).to.not.throw();
      });

      it('does not work both ways with css2 variables inside', async () => {
        if (isBefore) {
          // This could only happen if people would have included lit2 css themselves,
          // bypassing _core2 (so not something we support)
          expect(() => {
            cssHybrid`${css2Content}`;
          }).to.throw();
        } else {
          expect(() => {
            cssHybrid`${css2Content}`;
          }).to.not.throw();
        }
      });
    });

    describe('When used as inner tag', () => {
      it('does not work both ways inside css2 context', async () => {
        if (isBefore) {
          // This could only happen if people would have included lit2 css themselves,
          // bypassing _core2 (so not something we support)
          expect(() => {
            css2`${hybridCssContent}`;
          }).to.throw();
        } else {
          expect(() => {
            css2`${hybridCssContent}`;
          }).to.not.throw();
        }
      });

      it('works inside css1 context', async () => {
        expect(() => {
          css1`${hybridCssContent}`;
        }).to.not.throw();
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
              return cssHybrid`.test { border: blue; }`;
            }
          }
        }).to.not.throw();
      });
    });
  });

  describe('ScopedElementsMixin', () => {
    it('creates a scoped element via "createScopedElement"', async () => {
      if (isBefore) {
        const elBefore = await createScopedClass({
          currentScopedElementsMixin: ScopedElementsMixin,
          currentLitElement: LitElement,
          currentHtml2Hybrid: html2Hybrid,
        });
        // This should use the v1 scoped elements shim
        expect(elBefore.children[0].tagName.toLowerCase()).to.equal(
          elBefore.getScopedTagName('light-el'),
        );
        // Make sure we are dealing with a different mechanism than below
        expect(elBefore.getScopedTagName('light-el')).to.not.equal('light-el');
      } else {
        const elAfter = await createScopedClass({
          currentScopedElementsMixin: ScopedElementsMixin,
          currentLitElement: LitElement,
          currentHtml2Hybrid: html2Hybrid,
        });
        // This should use the v2 scoped elements polyfill or native functionality
        expect(elAfter.children[0].tagName.toLowerCase()).to.equal('light-el');
        // expect(elAfter.registry.get('light-el')).to.equal(elAfter.constructor);
      }
    });
  });

  describe('Forward compatible catches', () => {
    it('catches hybrid methods with those that were used before', async () => {
      if (isBefore) {
        expect(cssHybrid).to.equal(css1);
        expect(html2Hybrid).to.equal(html1);
      }
    });
    it('method "isTemplateResult"', async () => {
      if (isBefore) {
        expect(isTemplateResult(html1`<div></div>`)).to.equal(true);
      } else {
        expect(isTemplateResult(html2`<div></div>`)).to.equal(true);
      }
    });
    it('ScopedElementsMixin', async () => {
      if (isBefore) {
        expect(core2Exports.ScopedElementsMixin).to.equal(Lit1HybridScopedElementsMixin);
      } else {
        expect(core2Exports.ScopedElementsMixin).to.equal(Lit2HybridScopedElementsMixin);
      }
    });
    it('all other methods (html/css/svg, directives etc.)', async () => {
      const allExports = core2ExportNames.filter(
        a =>
          ![
            'isTemplateResult',
            'cssHybrid',
            'html2Hybrid',
            'ScopedElementsMixin',
            'Directive',
            'directive',
            'renderHybrid',
          ].includes(a),
      );
      if (isBefore) {
        allExports.forEach(exportName => {
          expect(core2Exports[exportName]).to.equal(beforeExports[exportName]);
        });
      } else {
        allExports.forEach(exportName => {
          expect(core2Exports[exportName]).to.equal(afterExports[exportName]);
        });
      }
    });
  });

  describe('Hybrid custom directives', () => {
    class CustomDirective extends Directive {
      render() {
        return 'test';
      }
    }
    const custom = directive(CustomDirective);

    it('works inside html2Hybrid (v1 or v2)', async () => {
      let result;
      expect(() => {
        result = html2Hybrid`<span>${custom()}</span>`;
      }).to.not.throw();
      const container = document.createElement('div');
      // @ts-ignore
      render(result, container);
      expect(container).dom.to.equal(`<div><span>test</span></div>`);
    });
  });
}
