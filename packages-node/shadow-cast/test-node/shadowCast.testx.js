const { expect } = require('chai');
const csstree = require('css-tree');
const { transformCss } = require('../src/transform-css/transform-css.js');
const { transformHtml } = require('../src/transform-html.js');
const { formatHtml } = require('../src/tools/formatting-utils.js');
const {
  getReplaceContext,
  getSurroundingCompoundParts,
} = require('../src/transform-css/helpers.js');
const {
  bemAdditionalHostMatcher,
  bemCreateCompoundFromStatePart,
} = require('../src/tools/bem/bem-helpers.js');

/**
 * @typedef {import('../types/csstree').SelectorPlain} SelectorPlain
 * @typedef {import('../types/shadow-cast').ReplaceFn} ReplaceFn
 * @typedef {import('../types/shadow-cast').SCNode} SCNode
 */

const normalizeCssFormat = (/** @type {string} */ stylesheetString) =>
  csstree.generate(csstree.parse(stylesheetString));

/**
 * ## Terminology
 * All terminology is based on the AST Node names found within css-tree.
 *
 * On top of this, a few additional definitions are used:
 * - SelectorPart: the individual entries of Selector.children: ['.comp', ' ', '.comp__child']
 * - Compound SelectorPart: two or more SelectorParts on the same dom element, e.g. '.comp.comp__child'
 */

// TODO: move to distinct file
describe('Helpers', () => {
  describe('getSurroundingCompoundParts', () => {
    it('gets preceeding and succeeding CssNodePlain[]', () => {
      const selector = csstree.toPlainObject(
        csstree.parse('.comp--x.comp.comp--y.comp--z .comp__element', { context: 'selector' }),
      ).children;
      const result = getSurroundingCompoundParts(selector[1], selector);

      // console.log(result.preceedingParts);
      expect(result.preceedingParts.length).to.equal(1);
      expect(csstree.generate(result.preceedingParts[0])).to.equal('.comp--x');

      expect(result.succeedingParts.length).to.equal(2);
      expect(csstree.generate(result.succeedingParts[0])).to.equal('.comp--y');
      expect(csstree.generate(result.succeedingParts[1])).to.equal('.comp--z');
    });

    it('gets no preceeding and succeeding CssNodePlain[] when whitespace inbetween', () => {
      const selector = csstree.toPlainObject(
        csstree.parse('.comp .comp__element', { context: 'selector' }),
      ).children;
      const result = getSurroundingCompoundParts(selector[2], selector);
      expect(result).to.eql({ preceedingParts: [], succeedingParts: [] });
    });
  });

  describe('getReplaceContext', () => {
    it('returns preceedingSiblings, succeedingSiblings and compounds', () => {
      const selector = /** @type {SCNode} */ (
        csstree.toPlainObject(
          csstree.parse(
            '.prec--x .prec--y.prec--z .match--compound1.match.match--compound2 .succ-x',
            { context: 'selector' },
          ),
        )
      );
      const { preceedingSiblings, succeedingSiblings, compounds } = getReplaceContext(
        selector,
        6 /** .match */,
      );

      expect(preceedingSiblings.map(p => csstree.generate(p))).to.eql([
        '.prec--x',
        ' ',
        '.prec--y',
        '.prec--z',
        ' ',
      ]);
      expect(compounds.map(p => csstree.generate(p))).to.eql([
        '.match--compound1',
        '.match--compound2',
      ]);
      expect(succeedingSiblings.map(p => csstree.generate(p))).to.eql([' ', '.succ-x']);
    });

    it('handles Whitespace and Combinator types', () => {
      const selector = /** @type {SCNode} */ (
        csstree.toPlainObject(csstree.parse('.prec .match + .succ', { context: 'selector' }))
      );
      const { preceedingSiblings, succeedingSiblings, compounds } = getReplaceContext(
        selector,
        2 /** .match */,
      );

      expect(preceedingSiblings.map(p => csstree.generate(p))).to.eql(['.prec', ' ']);
      expect(compounds.map(p => csstree.generate(p))).to.eql([]);
      expect(succeedingSiblings.map(p => csstree.generate(p))).to.eql(['+', '.succ']);
    });
  });
});

describe('transformCss', () => {
  describe('Host', () => {
    it(`transforms traditional ('.comp') SelectorParts to :host SelectorParts`, () => {
      const from = `
        .comp {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
      };
      const to = `
        :host {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it('transforms SelectorLists (all Selectors separated by commas)', () => {
      const from = `
        .comp.comp--state .comp__child, .comp x, .comp y, span {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
      };
      const to = `
        :host(.comp--state) .comp__child, :host x, :host y, span {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    describe('Compound SelectorParts', () => {
      it('transforms compound SelectorParts to :host(<compound>) SelectorParts', () => {
        const from = `
          .comp.comp--invalid .comp__child {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
          :host(.comp--invalid) .comp__child {
            color: blue;
          }
        `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));
      });

      it('transforms compound SelectorParts to :host(<compound1><compound2>) SelectorParts', () => {
        const from = `
          .comp.comp--invalid.comp--warning .comp__child {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
          :host(.comp--invalid.comp--warning) .comp__child {
            color: blue;
          }
        `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));
      });

      it('works when host is not the first of compound SelectorParts', () => {
        const from = `
          .comp--invalid.comp.comp--warning .comp__child {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
        :host(.comp--invalid.comp--warning) .comp__child {
          color: blue;
        }
      `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));
      });

      it('works with nested PseudoSelectors', () => {
        const from = `
          .comp:not(.comp--warning) .comp__child {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
          :host(:not(.comp--warning)) .comp__child {
            color: blue;
          }
        `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));
      });

      describe('With states config', () => {
        it(`transforms compound SelectorParts to :host(<compound1><compound2>) SelectorParts when some states provided`, () => {
          const from = `
            .comp.comp--invalid.comp--warning .comp__child {
              color: blue;
            }
          `;
          const config = {
            cssSources: [from],
            host: '.comp',
            states: { '[invalid]': ['.comp--invalid'] },
          };
          const to = `
            :host([invalid].comp--warning) .comp__child {
              color: blue;
            }
          `;

          const result = transformCss(config);
          expect(result).to.equal(normalizeCssFormat(to));
        });

        it('transforms multiple compound SelectorParts to :host(<compound1><compound2>) SelectorParts when all states provided', () => {
          const from = `
          .comp.comp--invalid.comp--warning.comp--info .comp__child {
            color: blue;
          }
        `;
          const config = {
            cssSources: [from],
            host: '.comp',
            states: {
              '[invalid]': ['.comp--invalid'],
              '[warning]': ['.comp--warning'],
              '[info]': ['.comp--info'],
            },
          };
          const to = `
          :host([invalid][warning][info]) .comp__child {
            color: blue;
          }
        `;

          const result = transformCss(config);
          expect(result).to.equal(normalizeCssFormat(to));
        });

        it('works with nested PseudoSelectors', () => {
          const from = `
            .comp:not(.comp--warning) .comp__child {
              color: blue;
            }
          `;
          const config = {
            cssSources: [from],
            host: '.comp',
            states: { '[warning]': ['.comp--warning'] },
          };
          const to = `
            :host(:not([warning])) .comp__child {
              color: blue;
            }
          `;

          const result = transformCss(config);
          expect(result).to.equal(normalizeCssFormat(to));
        });
      });
    });
  });

  describe('Slots', () => {
    // N.B. for simplicity, we focus on slots only, IRL we would combine it with host and states

    it('transforms SelectorParts to ::slotted SelectorParts', () => {
      const from = `
        .comp .comp__child {
          color: blue;
        }
      `;

      const config = {
        cssSources: [from],
        slots: { child: ['.comp__child'] },
      };

      const to = `
        .comp ::slotted([slot="child"]) {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it('transforms Selectors to default ::slotted SelectorParts', () => {
      const from = `
        .comp .comp__default {
          color: blue;
        }
      `;

      const config = {
        cssSources: [from],
        slots: { '<default>': ['.comp__default'] },
      };

      const to = `
        .comp ::slotted(:not([slot])) {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it('supports compound ::slotted SelectorParts', () => {
      const from = `
        .comp .comp__child.compound {
          color: blue;
        }
      `;

      const config = {
        cssSources: [from],
        slots: { child: ['.comp__child'] },
      };

      const to = `
        .comp ::slotted([slot="child"].compound) {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it.skip('supports multiple ::slotted SelectorParts', () => {
      /**
       * Imagine following html:
       * <div class="comp">
       *   <input class="comp__slotted-input" ::slot::="slotted-input">
       *   <input class="comp__private-input">
       * </div>
       *
       * Although it would be a bad practice, multiple selectors could exist for the slot.
       */
      const from = `
        .comp .comp__slotted-input  {
          color: blue;
        }
        .comp .comp__private-input {
          color: green;
        }

        /** This reset should apply to both inputs (shadow and light dom) */
        .comp input {
          padding: 0;
        }
      `;

      const config = {
        cssSources: [from],
        slots: { 'slotted-input': ['.comp__slotted-input'] },
      };

      /**
       * As we can see, the original selector is preserved.
       */
      const to = `
        .comp ::slotted([slot="slotted-input"]) {
          color: blue;
        }
        .comp .comp__private-input {
          color: green;
        }

        /** This reset should apply to both inputs (shadow and light dom) */
        .comp input,
        .comp ::slotted([slot="slotted-input"]) {
          padding: 0;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it.skip('supports default slots inside elements via "> *" Selector', () => {
      /**
       * Usually, these selectors are generated from html strings fed to transformHtml (see below)
       */
      const from = `
        .comp .comp__default-wrapper > * {
          color: blue;
        }
      `;

      const config = {
        cssSources: [from],
        slots: { '<default>': ['.comp__default-wrapper > *'] },
      };

      const to = `
        .comp .comp__default-wrapper ::slotted(:not([slot])) {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });
  });

  describe('States', () => {
    it('transforms host state SelectorParts to attribute SelectorParts exposed on shadow dom host', () => {
      const from = `
        .comp.comp--invalid .comp__feedback {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp--invalid'] },
      };
      const to = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it('transforms non host state SelectorParts to attribute SelectorParts exposed by shadow dom host', () => {
      const from = `
        .comp .comp__feedback.comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };
      const to = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it('throws when source state SelectorPart is non host and not accompanied by preceeding compound SelectorPart', () => {
      const from = `
        .comp .comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };

      expect(() => transformCss(config)).to.throw(
        `Please make sure to provide an element SelectorPart that source state Selector .comp__feedback--invalid
part can "lean" on (a 'state target' that can work in conjunction with host Selector):
- correct: '.comp .comp__feedback.comp__feedback--invalid' -> ':host([invalid]) .comp__feedback'
- wrong: '.comp .comp__feedback--invalid' -> ':host([invalid]) <?>'`,
      );
    });

    it('throws when source state SelectorPart is non host and not accompanied by preceeding compound SelectorPart', () => {
      const from = `
        .comp .comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
        settings: {
          createCompoundFromStatePart: bemCreateCompoundFromStatePart,
        },
      };
      const to = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    //     it.only('throws when external context is defined before host', () => {
    //       const from = `
    //         .some-external-context .comp.comp__feedback--invalid {
    //           color: blue;
    //         }
    //       `;
    //       const config = {
    //         cssSources: [from],
    //         host: '.comp',
    //         states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
    //       };

    //       // console.log('result', transformCss(config))

    //       expect(() => transformCss(config)).to.throw(
    //         `Make sure your Selector starts with a host SelectorPart in Selector ".some-external-context .comp.comp__feedback--invalid".
    // So:
    // - correct: '.comp.comp--state' -> ':host([state])'
    // - incorrect: '.some-broader-context .comp.comp--state'.
    // Alternatively, consider configuring a helper like "bemCompoundHostHelper"`,
    //       );
    //     });

    it('throws when host is not defined', () => {
      const from = `
        .comp .comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };

      expect(() => transformCss(config)).to.throw(
        'A "states" configuration requires a "hostMatcher" function as well',
      );
    });

    it('can couple multiple source SelectorParts to host attributes', () => {
      const from = `
        .comp .comp__a.comp__a--invalid {
          color: blue;
        }
        .comp .comp__b.comp__b--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
        states: { '[invalid]': ['.comp__a--invalid', '.comp__b--invalid'] },
      };
      const to = `
        :host([invalid]) .comp__a {
          color: blue;
        }
        :host([invalid]) .comp__b {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    it(`autodetects host SelectorPart when state name (for instance .comp--state) starts with host name(for instance .comp)`, () => {
      const from = `
        .comp--invalid .comp__feedback {
          color: blue;
        }
      `;
      const config = {
        cssSources: [from],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp--invalid'] },
        settings: {
          additionalHostMatcher: bemAdditionalHostMatcher,
        },
      };
      const to = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(to));
    });

    describe('External context selectors', () => {
      it('filters out external context selectors', () => {
        const from = `
          [dir=rtl] .comp .comp__feedback, .comp .comp__feedback[dir=rtl] {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
        :host .comp__feedback[dir=rtl] {
          color: blue;
        }
      `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));

        // TODO: present actionlist with altered selector lists
      });

      it('removes complete Rule if SelectorList has no Selectors left', () => {
        const from = `
          [dir=rtl] .comp .comp__feedback {
            color: blue;
          }

          .another-rule {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
          .another-rule {
            color: blue;
          }
        `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));

        // TODO: present a list with altered selector lists
      });

      it(`removes complete Rule if SelectorList has no Selectors left and is contained by Atrule`, () => {
        const from = `
          @media screen and (min-width: 480px) {
            [dir=rtl] .comp .comp__feedback {
              color: blue;
            }

            .another-rule {
              color: blue;
            }
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
        };
        const to = `
          @media screen and (min-width: 480px) {
            .another-rule {
              color: blue;
            }
          }
        `;
        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));

        // TODO: present a list with altered selector lists
      });

      it('allows custom handlers', () => {
        const from = `
          [dir=rtl] .comp .comp__feedback {
            color: blue;
          }
        `;
        const config = {
          cssSources: [from],
          host: '.comp',
          settings: {
            contextSelectorHandler: /** @type {ReplaceFn}} */ ({
              preceedingSiblings,
              succeedingSiblings,
            }) => {
              /**
               * In a traditional (without shadow dom) context, we would put [dir=rtl] on the
               * body tag for instance, like:
               * <body dir="rtl">
               *   <div class="comp">
               *     <div class="comp__feedback"></div>
               *   </div>
               * <body>
               *
               * This needs to be translated into:
               * <my-comp dir=rtl></my-comp>
               *
               * Via js, the attr needs to be placed on my-comp
               */
              const firstPart = preceedingSiblings[0];
              if (
                firstPart.type === 'AttributeSelector' &&
                firstPart.name.name === 'dir' &&
                // @ts-expect-error
                firstPart.value.name === 'rtl'
              ) {
                const hostNodes = /** @type {SelectorPlain} */ (
                  csstree.toPlainObject(
                    csstree.parse(`:host([dir=rtl])`, {
                      context: 'selector',
                    }),
                  )
                ).children;
                const replacementNodes = [...hostNodes, ...succeedingSiblings];
                return { replacementNodes, replaceCompleteSelector: true };
              }
              return undefined;
            },
          },
        };
        const to = `
          :host([dir=rtl]) .comp__feedback {
            color: blue;
          }
        `;
        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(to));
      });
    });
  });
});

describe('transformHtml', () => {
  it('creates cssTransformConfig from annotated html markup', () => {
    // Note: use ':' delimiter for attributes "host", "states" and "slot"
    // Use ":" for mapping states and ',' for separaing multiple state listings
    // A state can be defined via '[<host-attr>]:.local-selector', on any level.
    // Note that states are always mapped to a host.
    const htmlSource = `
      <div class="comp" :host:=".comp" :states:="[invalid]:.comp--invalid, [warning]:.comp--warning">
        <input class="comp__input" :slot:="input:.comp__input">
        <div class="comp__body" :states:="[invalid]:.comp__body--invalid">
          :slot:
        </div>
      </div>
    `;
    const result = transformHtml(htmlSource).cssTransformConfig;
    expect(result.host).to.equal('.comp');
    expect(result.slots).to.eql({ input: ['.comp__input'], '<default>': ['.comp__body > *'] });
    expect(result.states).to.eql({
      '[invalid]': ['.comp--invalid', '.comp__body--invalid'],
      '[warning]': ['.comp--warning'],
    });
  });

  it('creates new shadow- and light dom html from annotated html markup', () => {
    const htmlSource = `
      <div class="comp" :host:=".comp" :states:="[invalid]:.comp--invalid, [warning]:.comp--warning">
        <input class="comp__input" :slot:="input:.comp__input">
        <div class="comp__body" :states:="[invalid]:.comp__body--invalid">
          :slot:
        </div>
      </div>
    `;

    const result = transformHtml(htmlSource);
    expect(result.shadowHtml).to.eql(
      formatHtml(`
      <slot name="input"></slot>
      <div class="comp__body">
        <slot></slot>
      </div>`),
    );
    expect(result.slotsHtml).to.eql(['<input slot="input">']);
  });

  describe('Host', () => {
    it('leaves out host markup', () => {
      const htmlSource = `
        <div class="comp" :host:=".comp">
          <div class="comp__body"></div>
        </div>
      `;
      const result = transformHtml(htmlSource);
      expect(result.shadowHtml).to.equal(formatHtml('<div class="comp__body"></div>'));
    });
  });

  describe('Slots', () => {
    it('translates slots', () => {
      const htmlSource = `
        <div class="comp" :host:=".comp">
          <div class="comp__body" :slot:="body:.comp__body"></div>
        </div>
      `;
      const result = transformHtml(htmlSource);
      expect(result.cssTransformConfig.slots).to.eql({ body: ['.comp__body'] });
      expect(result.slotsHtml).to.eql(['<div slot="body"></div>']);
      expect(result.shadowHtml).to.eql(formatHtml(`<slot name="body"></slot>`));
    });

    it('translates default slots to direct selector descendants', () => {
      const htmlSource = `
        <div class="comp" :host:=".comp">
          <div class="comp__body">
            :slot:
          </div>
        </div>
      `;
      const result = transformHtml(htmlSource);
      expect(result.cssTransformConfig.slots).to.eql({ '<default>': ['.comp__body > *'] });
      expect(result.slotsHtml).to.eql([]);
    });

    it('translates default slots to selectors', () => {
      const htmlSource = `
        <div class="comp" :host:=".comp">
          <div class="comp__body" :slot:="<default>:.comp__body"></div>
        </div>
      `;
      const result = transformHtml(htmlSource);
      expect(result.cssTransformConfig.slots).to.eql({ '<default>': ['.comp__body'] });
      expect(result.shadowHtml).to.equal('<slot></slot>\n');
    });
  });

  describe('States', () => {
    it('translates states', () => {
      const htmlSource = `
        <div class="comp" :host:=".comp" :states:="[invalid]:.comp--invalid, [warning]:.comp--warning">
          <div class="comp__body" :states:="[invalid]:.comp__body--invalid"></div>
        </div>
      `;
      const result = transformHtml(htmlSource);
      expect(result.cssTransformConfig.states).to.eql({
        '[invalid]': ['.comp--invalid', '.comp__body--invalid'],
        '[warning]': ['.comp--warning'],
      });
      expect(result.shadowHtml).to.equal('<div class="comp__body"></div>\n');
    });
  });
});

describe('transformHtmlAndCss', () => {});

describe('ShadowCast', () => {});
