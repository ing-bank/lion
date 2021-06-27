const { expect } = require('chai');
const csstree = require('css-tree');
const { transformCss } = require('../src/transformCss.js');
const { transformHtml } = require('../src/transformHtml.js');
const { formatHtml } = require('../src/tools/formatting-utils.js');

/**
 * @typedef {import('../types/csstree').SelectorPlain} SelectorPlain
 * @typedef {import('../types/shadow-cast').ReplaceFn} ReplaceFn
 */

const normalizeCssFormat = (/** @type {string} */ stylesheetString) =>
  csstree.generate(csstree.parse(stylesheetString));

/**
 * Definition of SelectorPart: the individual entries of
 * Selector.children: ['.comp', ' ', '.comp__child']
 */

describe('transformCss', () => {
  describe('Host', () => {
    it('converts SelectorParts to :host SelectorParts', () => {
      const source = `
        .comp {
          color:blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
      };
      const expectedOutput = `
        :host {
          color:blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it('converts compound SelectorParts to :host(<compound>) SelectorParts', () => {
      const source = `
      .comp.comp--invalid .comp__child {
        color:blue;
      }
    `;
      const config = {
        cssSources: [source],
        host: '.comp',
      };
      const expectedOutput = `
      :host(.comp--invalid) .comp__child {
        color:blue;
      }
    `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it('supports all Selectors in SelectorLists', () => {
      const source = `
      .comp.comp--state .comp__child, .comp x, .comp y, span {
        color:blue;
      }
    `;
      const config = {
        cssSources: [source],
        host: '.comp',
      };
      const expectedOutput = `
      :host(.comp--state) .comp__child, :host x, :host y, span {
        color:blue;
      }
    `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });
  });

  describe('Slots', () => {
    it('converts SelectorParts to ::slotted SelectorParts', () => {
      const source = `
        .comp .comp__child {
          color:blue;
        }
      `;

      const config = {
        cssSources: [source],
        slots: { child: ['.comp__child'] },
      };

      const expectedOutput = `
      .comp ::slotted([slot="child"]) {
        color:blue;
      }
    `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it('converts Selectors to default ::slotted SelectorParts', () => {
      // N.B. for simplicity, we focus on slots only, IRL we would combine it with host and states
      const source = `
        .comp .comp__default {
          color:blue;
        }
      `;

      const config = {
        cssSources: [source],
        slots: { '<default>': ['.comp__default'] },
      };

      const expectedOutput = `
        .comp ::slotted(:not([slot])) {
          color:blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it('supports compound ::slotted SelectorParts', () => {
      const source = `
        .comp .comp__child.compound {
          color:blue;
        }
      `;

      const config = {
        cssSources: [source],
        slots: { child: ['.comp__child'] },
      };

      const expectedOutput = `
        .comp ::slotted([slot="child"].compound) {
          color:blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it.skip('supports multiple ::slotted SelectorParts', () => {
      /**
       * Imagine following html:
       * <div class="comp">
       *   <input class="comp__slotted-input: " :slot:="slotted-input: ">
       *   <input class="comp__private-input">
       * </div>
       *
       * Although it would be a bad practice, multiple selectors could exist for the slot.
       */
      const source = `
        .comp .comp__slotted-input  {
          color:blue;
        }
        .comp .comp__private-input {
          color:green;
        }

        /** This reset should apply to both inputs (shadow and light dom) */
        .comp input {
          padding:0;
        }
      `;

      const config = {
        cssSources: [source],
        slots: { child: ['.comp__slotted-input', 'input'] },
      };

      /**
       * As we can see, the original selector is preserved.
       */
      const expectedOutput = `
        .comp .comp__slotted-input,
        .comp ::slotted([slot="input"]) {
          color:blue;
        }
        .comp .comp__private-input {
          color:green;
        }

        /** This reset should apply to both inputs (shadow and light dom) */
        .comp input,
        .comp ::slotted([slot="input"]) {
          padding:0;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it.skip('supports default slots inside elements via "> *" Selector', () => {
      /**
       * Usually, these selectors are generated from html strings fed to transformHtml (see below)
       */
      // N.B. for simplicity, we focus on slots only, IRL we would combine it with host and states
      const source = `
        .comp .comp__default-wrapper > * {
          color:blue;
        }
      `;

      const config = {
        cssSources: [source],
        slots: { '<default>': ['.comp__default-wrapper > *'] },
      };

      const expectedOutput = `
        .comp ::slotted(:not([slot])) {
          color:blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });
  });

  describe('States', () => {
    it('converts host state SelectorParts to attribute SelectorParts exposed on shadow dom host', () => {
      const source = `
        .comp.comp--invalid .comp__feedback {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp--invalid'] },
      };
      const expectedOutput = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it('converts non host state SelectorParts to attribute SelectorParts exposed by shadow dom host', () => {
      const source = `
        .comp .comp__feedback.comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };
      const expectedOutput = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it('throws when source state SelectorPart is non host and not accompanied by preceeding compound SelectorPart', () => {
      const source = `
        .comp .comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };

      expect(() => transformCss(config)).to.throw(
        `Please make sure to provide an element Selector part that source state selector .comp__feedback--invalid
part can "lean" on (a 'state target' that can work in conjunction with host selector):
- correct: '.comp .comp__feedback.comp__feedback--invalid' -> ':host([invalid]) .comp__feedback'
- wrong: '.comp .comp__feedback--invalid' -> ':host([invalid]) <?>'`,
      );
    });

    it('throws when external context is defined before host', () => {
      const source = `
        .some-external-context .comp.comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };

      expect(() => transformCss(config)).to.throw(
        `Make sure your selector starts with your host(.comp) (for selector with state selector (.comp__feedback--invalid).
So (assumed '.comp' is the host in our source):
- good: '.comp.comp--state' -> ':host([state])'
- wrong: '.some-broader-context .comp.comp--state'`,
      );
    });

    it('throws when host is not defined', () => {
      const source = `
        .comp .comp__feedback--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        states: { '[has-feedback-for~="error"]': ['.comp__feedback--invalid'] },
      };

      expect(() => transformCss(config)).to.throw(
        'A "states" configuration requires a "host" configuration as well',
      );
    });

    it('can couple multiple source SelectorParts to host attributes', () => {
      const source = `
        .comp .comp__a.comp__a--invalid {
          color: blue;
        }
        .comp .comp__b.comp__b--invalid {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
        states: { '[invalid]': ['.comp__a--invalid', '.comp__b--invalid'] },
      };
      const expectedOutput = `
        :host([invalid]) .comp__a {
          color: blue;
        }
        :host([invalid]) .comp__b {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    it(`autodetects host SelectorPart when state name (for instance .comp--state) starts with host name(for instance .comp)`, () => {
      const source = `
        .comp--invalid .comp__feedback {
          color: blue;
        }
      `;
      const config = {
        cssSources: [source],
        host: '.comp',
        states: { '[has-feedback-for~="error"]': ['.comp--invalid'] },
      };
      const expectedOutput = `
        :host([has-feedback-for~="error"]) .comp__feedback {
          color: blue;
        }
      `;

      const result = transformCss(config);
      expect(result).to.equal(normalizeCssFormat(expectedOutput));
    });

    describe('External context selectors', () => {
      it('filters out external context selectors', () => {
        const source = `
          [dir=rtl] .comp .comp__feedback, .comp .comp__feedback[dir=rtl] {
            color: blue;
          }
        `;
        const config = {
          cssSources: [source],
          host: '.comp',
        };
        const expectedOutput = `
        :host .comp__feedback[dir=rtl] {
          color: blue;
        }
      `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(expectedOutput));

        // TODO: present actionlist with altered selector lists
      });

      it('removes complete Rule if SelectorList has no Selectors left', () => {
        const source = `
          [dir=rtl] .comp .comp__feedback {
            color: blue;
          }

          .another-rule {
            color: blue;
          }
        `;
        const config = {
          cssSources: [source],
          host: '.comp',
        };
        const expectedOutput = `
          .another-rule {
            color: blue;
          }
        `;

        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(expectedOutput));

        // TODO: present a list with altered selector lists
      });

      it(`removes complete Rule if SelectorList has no Selectors left and is contained by Atrule`, () => {
        const source = `
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
          cssSources: [source],
          host: '.comp',
        };
        const expectedOutput = `
          @media screen and (min-width: 480px) {
            .another-rule {
              color: blue;
            }
          }
        `;
        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(expectedOutput));

        // TODO: present a list with altered selector lists
      });

      it('allows custom handlers', () => {
        const source = `
          [dir=rtl] .comp .comp__feedback {
            color: blue;
          }
        `;
        const config = {
          cssSources: [source],
          host: '.comp',
          settings: {
            contextSelectorHandler: /** @type {ReplaceFn}} */ ({
              preceedingSiblings,
              siblings,
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
                const hostNodes = /** @type {SelectorPlain} */ (csstree.toPlainObject(
                  csstree.parse(`:host([dir=rtl])`, {
                    context: 'selector',
                  }),
                )).children;
                const replacementNodes = [...hostNodes, ...siblings];
                return { replacementNodes, replaceCompleteSelector: true };
              }
              return undefined;
            },
          },
        };
        const expectedOutput = `
          :host([dir=rtl]) .comp__feedback {
            color: blue;
          }
        `;
        const result = transformCss(config);
        expect(result).to.equal(normalizeCssFormat(expectedOutput));
      });
    });
  });
});

describe('transformHtml', () => {
  it('creates css selectors from annotated html markup', () => {
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
