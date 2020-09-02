const { expect } = require('chai');
const { polymerToLitCodemod } = require('../../../src/program/codemods/polymer-to-lit.js');
const { formatJs, formatHtml } = require('../../../src/program/codemods/utils.js');

const tplPolymer = (body, { template } = {}) => `
  <dom-module id="test-element">
    ${template ? `<template>${template}</template>` : ''}
  </dom-module>
  <script>
    Polymer({
      is: 'test-element',
      ${body}
    });
  </script>
  `;

/**
 * @param {string[]} bs behavior names like [InputBehavior, MyBehavior]
 * @param {string} superClass like 'LitElement'
 * @returns {string} InputBehavior(MyBehavior(LitElement))
 */
const addMixins = (bs, superClass = 'LitElement') =>
  bs.map(b => `${b}(`).join('') + superClass + bs.map(() => ')').join('');

const tplLit = (body, { template, styles, imports, behaviorNames } = {}) => `
  import { LitElement, ${template ? 'html,' : ''} ${styles ? 'css,' : ''} } from 'lit-element';
  ${imports || ''}

  class TestElement extends ${behaviorNames ? addMixins(behaviorNames) : 'LitElement'} {
    ${template ? `render() {\nreturn html\`\n${template}\`;\n}` : ''}

    ${
      styles
        ? `static get styles() {\nreturn [${styles.map(s => `css\`${s}\``).join(',\n')}];\n}`
        : ''
    }

    ${body || ''}
  }
  customElements.define('test-element', TestElement);
  `;

const tplPolymerProp = (prop, body = '') => `
  <dom-module id="test-element">
  </dom-module>
  <script>
    Polymer({
      is: 'test-element',
      properties: {
        ${prop}
      },
      ${body}
    });
  </script>
  `;

const tplLitProp = (prop, body = '') => `
  import { LitElement } from "lit-element";

  class TestElement extends LitElement {
    static get properties() {
      return {
        ${prop},
      }
    }
    ${body}
  }
  customElements.define('test-element', TestElement);
`;

describe('Component', () => {
  describe('Imports', () => {
    it('rewrites local and external lib/module imports', () => {
      const htmlFrom = `
        <!-- this is part of bower.json -->
        <link rel="import" href="../external-lib/custom-el.html" />
        <link rel="import" href="my-local-file.html" />
      `;

      const to = `
        import 'external-lib/custom-el.js';
        import './my-local-file.js';
      `;

      const { parts } = polymerToLitCodemod(htmlFrom);
      expect(formatJs(parts.imports)).to.equal(formatJs(to));
    });

    it('rewrites behavior imports', () => {
      const htmlFrom = `
        <link rel="import" href="../external-behavior/external-behavior.html" />
        <link rel="import" href="my-local-behavior.html" />

        <dom-module id="test-element"></dom-module>

        <script>
          Polymer({
            is: 'test-element',
            behaviors: [Polymer.ExternalBehavior, Potential.Namespace.MyLocalBehavior],
          });
        </script>
      `;

      const imports = `import { ExternalBehavior } from 'external-behavior/external-behavior.js';
        import { MyLocalBehavior } from './my-local-behavior.js';
      `;

      const to = tplLit('', { imports, behaviorNames: ['ExternalBehavior', 'MyLocalBehavior'] });

      const { result } = polymerToLitCodemod(htmlFrom);
      expect(formatJs(result)).to.equal(formatJs(to));
    });

    it('omits polymer import', () => {
      const htmlFrom = `
      <link rel="import" href="../polymer/polymer.html" />
      <link rel="import" href="my-local-file.html" />
      `;

      const to = `
        import './my-local-file.js';
      `;

      const { parts } = polymerToLitCodemod(htmlFrom);
      expect(formatJs(parts.imports)).to.equal(formatJs(to));
    });
  });

  describe('Class', () => {
    it('rewrites to LitElement class structure', () => {
      const from = tplPolymer('');
      const to = tplLit('');

      const { result } = polymerToLitCodemod(from);
      expect(formatJs(result)).to.equal(formatJs(to));
    });

    // https://polymer-library.polymer-project.org/3.0/docs/devguide/properties#property-name-mapping
    describe('Properties', () => {
      it('rewrites properties object', () => {
        const from = tplPolymer(`
          properties: {
            propx: { type: Boolean },
            propy: { type: String },
          },`);

        const to = tplLit(`
          static get properties() {
            return {
              propx: { type: Boolean },
              propy: { type: String },
            }
          }`);

        const { result } = polymerToLitCodemod(from);
        expect(formatJs(result)).to.equal(formatJs(to));
      });

      it('converts camelcased attributes', () => {
        const from = tplPolymer(`
          properties: {
            propX: { type: Boolean },
          },`);

        const to = tplLit(`
          static get properties() {
            return {
              propX: { type: Boolean, attribute: 'prop-x' },
            }
          }`);

        const { result } = polymerToLitCodemod(from);
        expect(formatJs(result)).to.equal(formatJs(to));
      });

      it.skip('Adds comments to properties', () => {
        const from = `
            Polymer({
              is: 'test-elem',
              properties: {
                /**
                 * Does things
                 */
                propx: { type: String, value: 'init' },
                /**
                 * Also does things
                 */
                propy: { type: String },
              },
            });
          `;
        const to = `
            class TestElement extends LitElement {
              static get properties() {
                return {
                  propx: { type: String },
                }
              }
              constructor() {
                super();
                /**
                 * Does things
                 * @type { string }
                 */
                this.propx = 'init';
                /**
                 * Also does things
                 * @type { string }
                 */
                this.propy = undefined;
              }
            }
            customElements.define('test-elem', TestElement);
          `;
      });

      describe('Keys', () => {
        describe('type', () => {
          it('keeps type as object property', () => {
            const from = tplPolymerProp(`propx: { type: Boolean }`);
            const to = tplLitProp(`propx: { type: Boolean }`);

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });

          it('keeps type as direct value', () => {
            const from = tplPolymerProp(`propx: Boolean`);
            const to = tplLitProp(`propx: Boolean`);

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });
        });
        describe('value', () => {
          it('initializes value inside constructor', () => {
            const from = tplPolymerProp(`propx: { type: String, value: 'init' }`);
            const to = tplLitProp(
              `propx: { type: String }`,
              `
              constructor() {
                super();

                this.propx = 'init';
              }
              `,
            );

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });
        });
        describe('notify', () => {
          it('dispatches events on change', () => {
            const from = tplPolymerProp(`propX: { type: String, notify: true }`);
            const to = tplLitProp(
              `propX: { type: String, attribute: 'prop-x' }`,
              `
              requestUpdateInternal(name, oldValue) {
                super.requestUpdateInternal(name, oldValue);

                const notEqual = (value, old) => {
                  // This ensures (old==NaN, value==NaN) always returns false
                  return old !== value && (old === old || value === value);
                };

                if (name === 'propX' && notEqual(this.propX, oldValue)) {
                  this.dispatchEvent(new CustomEvent('prop-x-changed', { bubbles: true, composed: true, detail: { propX: this.propX } }));
                }
              }
              `,
            );

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });
        });
        describe('observe', () => {
          it('calls observer on change', () => {
            const from = tplPolymerProp(
              `propx: { type: String, observer: '_myObserver' }`,
              `
              _myObserver: function (propx) {
                // xyz
              },
            `,
            );
            const to = tplLitProp(
              `propx: { type: String }`,
              `
              requestUpdateInternal(name, oldValue) {
                super.requestUpdateInternal(name, oldValue);

                const notEqual = (value, old) => {
                  // This ensures (old==NaN, value==NaN) always returns false
                  return old !== value && (old === old || value === value);
                };

                if (name === 'propx' && notEqual(this.propx, oldValue)) {
                  this._myObserver(this.propx, oldValue);
                }
              }

              _myObserver(propx) {
                // xyz
              }
              `,
            );

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });
        });
        describe('computed', () => {
          it('calls computed on change', () => {
            const from = tplPolymerProp(
              `propx: { type: String, computed: '_myComputed(propy, propz)' },
               propy: String,
               propz: String`,
              `
              _myComputed: function(propy, propz) {
                return propy + propz;
              },
            `,
            );
            const to = tplLitProp(
              `propx: { type: String },
              propy: String,
              propz: String`,
              `
              requestUpdateInternal(name, oldValue) {
                super.requestUpdateInternal(name, oldValue);

                const notEqual = (value, old) => {
                  // This ensures (old==NaN, value==NaN) always returns false
                  return old !== value && (old === old || value === value);
                };

                if (name === 'propy' && notEqual(this.propy, oldValue)) {
                  this.propx = this._myComputed(this.propy, this.propz);
                }

                if (name === 'propz' && notEqual(this.propz, oldValue)) {
                  this.propx = this._myComputed(this.propy, this.propz);
                }
              }

              _myComputed(propy, propz) {
                return propy + propz;
              }
              `,
            );

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });
        });
        describe('readOnly', () => {
          it('rewrites getters and setters', () => {
            const from = tplPolymerProp(`propx: { type: String, readOnly: true }`);
            const to = tplLitProp(
              `propx: { type: String }`,
              `
              set propx(v) {} // readOnly

              get propx() {
                return this.__propx;
              }

            _setPropx(v) {
              this.__propx = v;
            }
          `,
            );

            const { result } = polymerToLitCodemod(from);
            expect(formatJs(result)).to.equal(formatJs(to));
          });
        });
        describe('reflectToAttribute', () => {
          const from = tplPolymerProp(`propx: { type: String, reflectToAttribute: true }`);
          const to = tplLitProp(`propx: { type: String, reflect: true }`);

          const { result } = polymerToLitCodemod(from);
          expect(formatJs(result)).to.equal(formatJs(to));
        });
      });
    });

    describe('Observers', () => {
      it('adds synchronous observers that depend on properties supplied', () => {
        const from = tplPolymer(`
            observers: ['methodA(a, b)', 'methodB(b, c)']
          `);
        const to = tplLit(`
          requestUpdateInternal(name, oldValue) {
            super.requestUpdateInternal(name, oldValue);

            const notEqual = (value, old) => {
              // This ensures (old==NaN, value==NaN) always returns false
              return old !== value && (old === old || value === value);
            };

            if ((name === 'a' && notEqual(this.a, oldValue)) || (name === 'b' && notEqual(this.b, oldValue))) {
              this.methodA(this.a, this.b);
            }

            if ((name === 'b' && notEqual(this.b, oldValue)) || (name === 'c' && notEqual(this.c, oldValue))) {
              this.methodB(this.b, this.c);
            }
          }`);

        const { result } = polymerToLitCodemod(from);
        expect(formatJs(result)).to.equal(formatJs(to));
      });
      it.skip('works with objects and arrays', () => {
        // https://polymer-library.polymer-project.org/3.0/docs/devguide/model-data
        const from = `
          Polymer({
            is: 'test-elem',
            properties: {
              a: Array,
              b: Object,
            },
            observers: [
              'method(a.*, b.*)'
            ]
          });
          `;
        const to = `
          class TestElement extends LitElement {
            requestUpdateInternal(name, oldValue) {
              super.requestUpdateInternal(name, oldValue);

              const notEqual = (value, old) => {
                // This ensures (old==NaN, value==NaN) always returns false
                return old !== value && (old === old || value === value);
              };

              if ((name === 'a' && notEqual(this.a, oldValue)) || (name === 'b' && notEqual(this.b, oldValue))) {
                this.method(this.a, this.b);
              }
            }

            set(str) {
              const [prop] = str.split('.');
              this.requestUpdate(prop);
            }
          }
          customElements.define('test-element', TestElement);`;
      });
    });

    describe('Behaviors', () => {
      it('rewrites behaviors to mixins', () => {
        const from = `
          <dom-module id="test-element"></dom-module>
          <script>
            Polymer({
              is: 'test-element',
              behaviors: [Polymer.PaperInputBehavior, Polymer.IronFormElementBehavior],
            });
          </script>
          `;
        const to = `
          import { LitElement } from "lit-element";

          class TestElement extends PaperInputBehavior(IronFormElementBehavior(LitElement)) {
          }
          customElements.define('test-element', TestElement);`;

        const { result } = polymerToLitCodemod(from);
        expect(formatJs(result)).to.equal(formatJs(to));
      });
    });

    describe.skip('Listeners', () => {
      it('adds internal listeners in firstUpdated', () => {
        const from = `
          Polymer({
            is: 'test-elem',
            listeners:  {
              'iron-input-ready': '_onIronInputReady',
              'special.tap': '_specialTap',
            },
          });
          `;
        const to = `
          class TestElement extends LitElement {
            constructor() {
              super();
              this._specialTap = this._specialTap.bind(this);
            }

            connectedCallback() {
              super.connectedCallback();
              this.shadowRoot.getElementById('special').addEventListener('tap', this._specialTap);
            }

            disconnectedCallback() {
              super.disconnectedCallback();
              this.shadowRoot.getElementById('special').removeEventListener('tap', this._specialTap);
            }

            firstUpdated(changedProperties) {
              super.firstUpdated(changedProperties);
              this.addEventListener('iron-input-ready', this._onInputReady);
            }
          }
          customElements.define('test-element', TestElement);`;
      });
    });

    describe.skip('HostAttributes', () => {
      it('rewrites behaviors to mixins', () => {
        const from = `
          Polymer({
            is: 'test-element',
            hostAttributes: {
              'string-attribute': 'Value',
              'boolean-attribute': true,
              'boolean-attribute-false': false,
              tabindex: 0
            }
          });
          `;
        const to = `
          class TestElement extends LitElement {
            connectedCallback() {
              super.connectedCallback();

              if (!this.hasAttribute('string-attribute') {
                this.setAttribute('string-attribute','Value');
              }
              this.setAttribute('string-attribute', '');
              this.removeAttribute('string-attribute-false');
              if (!this.hasAttribute('tabindex') {
                this.setAttribute('tabindex', 0);
              }
            }
          }
          customElements.define('test-element', TestElement);`;
      });
    });

    describe.skip('KeyBindings', () => {
      it('rewrites keyBindings to mixins', () => {
        const from = tplPolymer(`
          keyBindings: {
            'space': '_onKeydown', // same as 'space:keydown'
            'shift+tab': '_onKeydown',
            'enter:keypress': '_onKeypress',
            'esc:keyup': '_onKeyup',
          },
        `);
        const to = tplLit(`
          firstUpdated(changedProperties) {
            super.firstUpdated(changedProperties);

            this.__setupKeyBindings();
          }

          __setupKeyBindings() {
            // IE polyfill needs to be loaded
            this.addEventLisener('keydown', (event) => {
              switch (event.key) {
                case ' ':
                  this._onKeyDown(event);
                  break;
                case ' ':
                  if (event.shiftKey) {
                    this._onKeyDown(event);
                  }
                  break;
                default:
                  break;
              }
            });

            this.addEventLisener('keypress', (event) => {
              switch (event.key) {
                case 'Enter':
                  this._onKeyPress(event);
                  break;
                default:
                  break;
              }
            });

            this.addEventLisener('keyup', (event) => {
              switch (event.key) {
                case 'Escape':
                  this._onKeyUp(event);
                  break;
                default:
                  break;
              }
            });
          }
        `);
      });
    });

    describe('ShadowRoot selectors', () => {
      it('ID selectors', () => {
        const from = 'this.$.nativeInput';
        const to = "this.shadowRoot.getElementById('nativeInput')";
      });
      it('Query selectors', () => {
        const from = "this.$$('input')";
        const to = "this.shadowRoot.querySelector('input')";
      });
    });

    describe('Methods', () => {
      it('fire', () => {
        const from = "this.fire('my-event')";
        const to =
          "this.dispatchEvent(new CustomEvent('my-event', { bubbles: true, composed: true }))";
      });
      it('async', () => {
        const from = `
          this.async(function() {
            // access sibling or parent elements here
          });
        `;
        const to = `
          setTimeout(function() {
            // access sibling or parent elements here
          });
        `;
      });
    });
  });

  describe('Lifecycle', () => {
    it('created', () => {}); // constructor before default values
    it('ready', () => {}); // constructor
    it('attached', () => {}); // connected
    it('detached', () => {}); // disconnected
    it('attributeChanged', () => {}); // attributeChanged and call super first
    // https://polymer-library.polymer-project.org/1.0/docs/devguide/registering-elements#custom-constructor
    it('factoryImpl', () => {}); // constructor

    // beforeRegister?
  });
});

describe('Template', () => {
  const toTpl = template => polymerToLitCodemod(tplPolymer('', { template })).parts.templates[0];

  describe('Attribute types', () => {
    it('rewrites attribute binding', () => {
      const from = toTpl(`<div attr$="[[value]]"></div>`);
      const to = `<div attr="\${this.value}"></div>`;

      expect(from).to.equal(formatHtml(to));
    });

    it('rewrites property binding', () => {
      const from = toTpl(`<div attr="[[value]]"></div>`);
      const to = `<div .attr="\${this.value}"></div>`;

      expect(from).to.equal(formatHtml(to));
    });

    it('rewrites event binding', () => {
      const from = toTpl(`<div on-click="_myMethod"></div>`);
      const to = `<div @click="\${this._myMethod}"></div>`;

      expect(from).to.equal(formatHtml(to));

      // const from2 = toTpl(`<div on-click="{{_myMethod}}"></div>`);
      // const to2 = `<div @click="\${this._myMethod}"></div>`;

      // expect(from2).to.equal(formatHtml(to2));
    });
  });

  describe('Expressions', () => {
    it('rewrites one way data binding', () => {
      const from = toTpl(`<div attr="[[value]]"></div>`);
      const to = `<div .attr="\${this.value}"></div>`;

      expect(from).to.equal(formatHtml(to));
    });

    it('rewrites two way data binding', () => {
      const from = toTpl(`<div attr="{{value}}"></div>`);
      const to = `<div .attr="\${this.value}" @attr-changed="\${({ currentTarget }) => this.value = currentTarget.value}"></div>`;

      expect(from).to.equal(formatHtml(to));
    });

    it('supports negations', () => {
      const from = toTpl(`<div attr="[[!value]]"></div>`);
      const to = `<div .attr="\${!this.value}"></div>`;

      expect(from).to.equal(formatHtml(to));
    });

    it('supports methods with arguments', () => {
      const from = toTpl(`<div attr="[[_update(arg1, arg2)]]"></div>`);
      const to = `<div .attr="\${this._update(this.arg1, this.arg2)}"></div>`;

      expect(from).to.equal(formatHtml(to));
    });

    it('supports non attribute expressions', () => {
      const from = toTpl(`<div>[[_update(arg1, arg2)]]</div>`);
      const to = `
        <div>
          \${this._update(this.arg1, this.arg2)}
        </div>`;

      expect(from).to.equal(formatHtml(to));
    });
  });

  describe('Loops and conditionals', () => {
    it('rewrites dom-repeats', () => {
      const from = toTpl(`
        <dom-repeat items="{{employees}}">
          <template>
            <div>First name: <span>{{item.first}}</span></div>
            <div>Last name: <span>{{item.last}}</span></div>
          </template>
        </dom-repeat>
      `);
      const to = `
        \${this.employees.map(item => html\`
          <div>
            First name:
            <span> \${item.first}</span>
          </div>
          <div>
            Last name:
            <span> \${item.last}</span>
          </div>
        \`)}
      `;

      expect(from).to.equal(formatHtml(to));

      const from2 = toTpl(`
        <template is="dom-repeat" items="[[employees]]">
          <div>First name: <span>[[item.first]]</span></div>
          <div>Last name: <span>[[item.last]]</span></div>
        </template>`);
      const to2 = `
        \${this.employees.map(item => html\`
          <div>
            First name:
            <span> \${item.first}</span></div>
          <div>
            Last name:
            <span> \${item.last}</span>
          </div>
        \`)}`;

      expect(from2).to.equal(formatHtml(to2));
    });

    it('rewrites dom-if', () => {
      const from = toTpl(`
        <dom-if if="[[condition]]">
          <template>
            <div>Content</div>
          </template>
        </dom-if>`);
      const to = `
        \${this.condition ? html\`
          <div>
            Content
          </div>
        \` : ''}`;

      expect(from).to.equal(formatHtml(to));

      const from2 = toTpl(`
        <template is="dom-if" if="[[condition]]">
          <div>Content</div>
        </template>`);
      const to2 = `
        \${this.condition ? html\`
          <div>
            Content
          </div>
        \` : ''}`;

      expect(from2).to.equal(formatHtml(to2));
    });
  });
});

describe('Styles', () => {
  it('puts styles inside static getter', () => {
    const from = tplPolymer('', {
      template: `
        <style>
          :host {
            display: block;
          }

          :host([focused]) {
            outline: none;
          }

          :host([hidden]) {
            display: none !important;
          }

          input {
            /* Firefox sets a min-width on the input, which can cause layout issues */
            min-width: 0;
          }
        </style>
      `,
    });

    const to = tplLit('', {
      styles: [
        `
        :host {
          display: block;
        }

        :host([focused]) {
          outline: none;
        }

        :host([hidden]) {
          display: none !important;
        }

        input {
          /* Firefox sets a min-width on the input, which can cause layout issues */
          min-width: 0;
        }
      `,
      ],
    });

    const { result } = polymerToLitCodemod(from);
    expect(result).to.equal(formatJs(to));
  });

  it('imports external style modules', () => {
    const from = `
      <link rel="import" href="external-styles-1.html" />
      <link rel="import" href="external-styles-2.html" />

      <dom-module id="test-element">
        <template>
          <style import="external-styles-1 external-styles-2">
            :host {
              display: block;
            }

            :host([focused]) {
              outline: none;
            }

            :host([hidden]) {
              display: none !important;
            }

            input {
              /* Firefox sets a min-width on the input, which can cause layout issues */
              min-width: 0;
            }
            </style>
          </template>
        </dom-module>
      `;

    const to = `
      import { LitElement, css } from 'lit-element';
      import { externalStyles1 } from './external-styles-1.js';
      import { externalStyles2 } from './external-styles-2.js';

      export class TestElement extends LitElement {
        static get styles() {
          return [
            externalStyles1,
            externalStyles2,
            css\`
              :host {
                display: block;
              }

              :host([focused]) {
                outline: none;
              }

              :host([hidden]) {
                display: none !important;
              }

              input {
                /* Firefox sets a min-width on the input, which can cause layout issues */
                min-width: 0;
              }\`,
          ],
        }
      `;
  });

  it('supports defining css mixins', () => {
    const from = `
      --paper-font-common-base: {
        font-family: 'Roboto', 'Noto', sans-serif;
        color: blue;
      };`;
    const to = `
      --paper-font-common-base--font-family: 'Roboto', 'Noto', sans-serif;
      --paper-font-common-base--color: blue;
    `;
  });

  it('supports applying css mixins', () => {
    const mixinDefinedInPotentialParentChain = `
      --paper-font-common-base: {
        font-family: 'Roboto', 'Noto', sans-serif;
        color: blue;
      };`;
    const mixinDefinedInOtherPotentialParentChain = `
      --paper-font-common-base: {
        size: 16px;
      };`;

    const from = `
      .target {
        @apply --paper-font-common-base;
      };`;

    const to = `
      .target {
        /* [start] @apply --paper-font-common-base */
        font-family: var(--paper-font-common-base--font-family);
        color: var(--paper-font-common-base--color);
        size: var(--paper-font-common-base--size);
        /* [end] @apply --paper-font-common--base */
      }
        `;
  });
});

describe('Behavior Mixins', () => {
  const from = `
    <link rel="import" href="../polymer/polymer.html">
    <link rel="import" href="../iron-a11y-keys-behavior/iron-a11y-keys-behavior.html">

    <script>
      Polymer.PaperInputBehaviorImpl = {
        properties: {
          a: String,
        },
      }

      Polymer.PaperInputBehavior = [
        Polymer.IronA11yKeysBehavior,
        Polymer.PaperInputBehaviorImpl
      ];
    </script>
    `;

  const to = `
    import { dedupeMixin } from '@lion/core';
    import { ironA11yKeysBehavior } from 'iron-a11y-keys-behavior/ironA11yKeysBehavior.js';

    export const PaperInputBehavior = dedupeMixin((superClass) => class PaperInputBehavior extends IronA11yKeysBehavior(superClass) {
      static get properties() {
        return {
          a: String,
        }
      },
    });
    `;
});
