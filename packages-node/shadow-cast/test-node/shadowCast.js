const { expect } = require('chai');
// @ts-ignore
const csstree = require('css-tree');
const { transformCss } = require('../src/transformCss.js');
const { transformHtml, getCssSelectorsFromAnnotatedHtml } = require('../src/transformHtml.js');
const { formatHtml } = require('../src/formatting-utils.js');

const normalizeCssFormat = (/** @type {string} */ stylesheetString) =>
  csstree.generate(csstree.parse(stylesheetString));

const normalizeHtmlFormat = (/** @type {string} */ htmlString) => htmlString.trim();

describe('transformCss', () => {
  describe('Host', () => {
    it('converts css selectors to :host selectors', () => {
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

    it('converts compound css selectors to :host selectors', () => {
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
  });

  describe('Slots', () => {
    it('converts css selectors to ::slotted selectors', () => {
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

    it('converts css selectors to default ::slotted selectors', () => {
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

    it('supports compund ::slotted selectors', () => {
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

    it.skip('supports multiple ::slotted selectors', () => {
      /**
       * Imagine following html:
       * <div class="comp">
       *   <input class="comp__slotted-input: " ::slot::="slotted-input: ">
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
  });

  describe('States', () => {
    it('converts host state selectors to attribute selectors exposed by the component', () => {
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

    it('converts non host state selectors to attribute selectors exposed by the component', () => {
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

    it('throws when source state selector is non host and not accompanied by preceeding compound selector part', () => {
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
        `Please make sure to provide an element Selector part that the removed source state selector
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

    it('can couple multiple source selectors to host attributes', () => {
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
  });
});

describe('transformHtml', () => {
  it.only('creates css selectors from annotated html markup', () => {
    // Note: use '::' delimiter for attributes "host", "states" and "slot"
    // Use ":" for mapping states and ',' for separaing multiple state listings
    // A state can be defined via '[<host-attr>]:.local-selector'. Note that states are always mapped
    // to a host.
    const htmlSource = `
      <div class="comp" ::host::=".comp" ::states::="[invalid]:.comp--invalid, [warning]:.comp--warning">
        <input class="comp__input" ::slot::="input">
        <div class="comp__body" ::states::="[invalid]:.comp__body--invalid">
          ::slot::
        </div>
      </div>
    `;
    const result = getCssSelectorsFromAnnotatedHtml(htmlSource);
    expect(result).to.eql({
      host: '.comp',
      slots: { input: ['.comp__input'], '<default>': ['.comp__body > *'] },
      states: {
        '[invalid]': ['.comp--invalid', '.comp__body--invalid'],
        '[warning]': ['.comp--warning'],
      },
      shadowHtml: formatHtml(`
        <slot name="input"></slot>
        <div class="comp__body">
          <slot></slot>
        </div>`),
      slotHtml: ['<input slot="input">'],
    });
  });

  describe('Host', () => {
    it('leaves out host markup', () => {
      const source = `
        <div class="comp" :host:>
          <div class="comp__part"></div>
        </div>
      `;
      const config = {
        htmlSources: [source],
      };
      const expectedOutput = `
        <div class="comp__part"></div>
      `;

      const result = transformHtml(config);
      expect(normalizeHtmlFormat(result)).to.equal(normalizeHtmlFormat(expectedOutput));
    });
  });

  describe('Slots', () => {
    it('translates slots', () => {
      const source = `
        <div class="comp">
          <input class="comp__input" :slot:="input">
        </div>
      `;
      const config = {
        cssSources: [source],
        slots: { child: '.comp__slot {> ::slotted}' },
      };
      const expectedOutput = `
        <div class="comp">
          <input class="comp__input" :slot:="input">
        </div>
      `;

      const result = transformHtml(config);
      expect(normalizeHtmlFormat(result)).to.equal(normalizeHtmlFormat(expectedOutput));
    });
  });
});

describe('transformHtmlAndCss', () => {});

describe('ShadowCast', () => {});
