import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';
import { LightRenderMixin } from '../src/LightRenderMixin.js';

/**
 * Host with slot templates declared as prototype methods: the style documented by
 * the mixin itself, and the style that used to silently render empty light dom.
 */
class MethodStyle extends LightRenderMixin(LitElement) {
  static properties = { label: { type: String } };

  get slots() {
    return [
      { name: 'input', template: this.renderInput },
      { name: 'label', template: this.renderLabel },
    ];
  }

  constructor() {
    super();
    this.label = 'first';
  }

  render() {
    return html`<div class="wrapper">${this.renderInput()}${this.renderLabel()}</div>`;
  }

  renderInput() {
    return html`<input />`;
  }

  renderLabel() {
    return html`<label>${this.label}</label>`;
  }
}
customElements.define('light-render-method-style', MethodStyle);

/** Legacy SlotMixin shape: `get slots()` returning a name -> function map. */
class LegacyMapStyle extends LightRenderMixin(LitElement) {
  static properties = { label: { type: String } };

  constructor() {
    super();
    this.label = 'legacy';
  }

  get slots() {
    return {
      input: () => html`<input />`,
      label: () => html`<label>${this.label}</label>`,
      // legacy rerender object form
      extra: () => ({ template: html`<i>extra</i>` }),
    };
  }

  render() {
    return html`<div class="wrapper">
      <slot name="input"></slot><slot name="label"></slot><slot name="extra"></slot>
    </div>`;
  }
}
customElements.define('light-render-legacy-map', LegacyMapStyle);

/** Same, but with templates as instance fields (arrow functions). */
class FieldStyle extends LightRenderMixin(LitElement) {
  renderInput = () => html`<input />`;

  get slots() {
    return [{ name: 'input', template: this.renderInput }];
  }

  render() {
    return html`<div class="wrapper">${this.renderInput()}</div>`;
  }
}
customElements.define('light-render-field-style', FieldStyle);

/**
 * Field declared after `slots` -> template is undefined at that point.
 * The field form is also a type error (the host declares `slots` as an accessor), which is part of
 * why it is not the recommended authoring style; the runtime reports it as well.
 */
class WrongFieldOrder extends LightRenderMixin(LitElement) {
  // @ts-expect-error intentional: this is the authoring mistake the mixin has to catch
  slots = [{ name: 'input', template: this.renderInput }];

  renderInput = () => html`<input />`;

  render() {
    return html`<div class="wrapper">${this.renderInput()}</div>`;
  }
}
customElements.define('light-render-wrong-field-order', WrongFieldOrder);

/** Conditional slot: the template returns undefined. */
class ConditionalStyle extends LightRenderMixin(LitElement) {
  get slots() {
    return [
      { name: 'maybe', template: this.renderMaybe },
      { name: 'always', template: this.renderAlways },
    ];
  }

  render() {
    return html`<div>${this.renderMaybe()}${this.renderAlways()}</div>`;
  }

  renderMaybe() {
    return undefined;
  }

  renderAlways() {
    return html`<span>always</span>`;
  }
}
customElements.define('light-render-conditional', ConditionalStyle);

/** Subclass that calls super.<templateFn>() from an overridden template. */
class ParentStyle extends LightRenderMixin(LitElement) {
  get slots() {
    return [
      { name: 'input', template: this.renderInput },
      { name: 'label', template: this.renderLabel },
    ];
  }

  render() {
    return html`<div>${this.renderInput()}${this.renderLabel()}</div>`;
  }

  renderInput() {
    return html`<input />`;
  }

  renderLabel() {
    return html`<label>parent</label>`;
  }
}

class ChildStyle extends ParentStyle {
  get slots() {
    return [
      { name: 'input', template: this.renderInput },
      { name: 'label', template: this.renderLabel },
    ];
  }

  renderLabel() {
    return html`<label>child+${super.renderLabel()}</label>`;
  }
}
customElements.define('light-render-child-style', ChildStyle);

/**
 * Legacy SlotMixin composition over two classes, the pattern of the components that spread a
 * parent slot map (`{ ...super.slots, extra }`), e.g. LionInput and ListboxMixin.
 */
class LegacyParentMap extends LightRenderMixin(LitElement) {
  get slots() {
    return { input: () => html`<input id="from-parent" />` };
  }

  render() {
    return html`<div class="wrapper"><slot name="input"></slot></div>`;
  }
}

class LegacyChildMap extends LegacyParentMap {
  get slots() {
    return {
      ...super.slots,
      label: () => html`<label>composed by child</label>`,
    };
  }

  render() {
    return html`<div class="wrapper"><slot name="input"></slot><slot name="label"></slot></div>`;
  }
}
customElements.define('light-render-legacy-composed', LegacyChildMap);

/** Declares slots as a field while a parent declares the accessor: one of the two is shadowed. */
class FieldOnTopOfGetterParent extends LegacyParentMap {
  // @ts-expect-error intentional: the mixin reports this composition mistake at runtime
  slots = [{ name: 'label', template: () => html`<label>field wins</label>` }];
}
customElements.define('light-render-field-over-getter', FieldOnTopOfGetterParent);

/** Spreads the array shape into an object, which drops the slot names. */
class ArrayParentGetter extends LightRenderMixin(LitElement) {
  get slots() {
    return [{ name: 'input', template: () => html`<input id="array-parent" />` }];
  }

  render() {
    return html`<div class="wrapper"><slot name="input"></slot></div>`;
  }
}

class SpreadsArrayIntoObject extends ArrayParentGetter {
  get slots() {
    return { ...super.slots, extra: () => html`<span>extra</span>` };
  }
}
customElements.define('light-render-spread-array', SpreadsArrayIntoObject);

/**
 * @param {string} tag
 * @returns {any}
 */
const createEl = tag => document.createElement(tag);

/**
 * @param {string} tag
 * @returns {Promise<any>}
 */
const mount = async tag => {
  const host = await fixture(html`<div></div>`);
  const el = createEl(tag);
  host.appendChild(el);
  if ('updateComplete' in el) await el.updateComplete;
  return el;
};

/**
 * @param {string} tag
 * @param {string} childHtml
 * @returns {Promise<any>}
 */
const mountWithUserContent = async (tag, childHtml) => {
  const host = await fixture(html`<div></div>`);
  const el = createEl(tag);
  el.innerHTML = childHtml;
  host.appendChild(el);
  await el.updateComplete;
  return el;
};

describe('LightRenderMixin', () => {
  it('renders slot templates to light dom and adds slot outlets to shadow dom', async () => {
    const el = await mount('light-render-method-style');
    expect(el.querySelector('[slot="input"]')?.localName).to.equal('input');
    expect(el.querySelector('[slot="label"]')?.localName).to.equal('label');
    expect(Array.from(el.shadowRoot.querySelectorAll('slot')).map(s => s.name)).to.deep.equal([
      'input',
      'label',
    ]);
    expect(el.querySelector('input')?.assignedSlot?.name).to.equal('input');
  });

  it('renders template content with the host as receiver (regression: empty light dom)', async () => {
    const el = await mount('light-render-method-style');
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('first');
  });

  it('re-renders light dom on update, like it does for shadow dom', async () => {
    const el = await mount('light-render-method-style');
    el.label = 'second';
    await el.updateComplete;
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('second');
    expect(el.shadowRoot.querySelector('label')).to.equal(null);
  });

  it('supports templates declared as instance fields', async () => {
    const el = await mount('light-render-field-style');
    expect(el.querySelector('input')?.assignedSlot?.name).to.equal('input');
    expect(el.shadowRoot.querySelector('slot[name="input"]')).to.exist;
  });

  it('throws a descriptive error when a template field is declared after the slots array', () => {
    const el = createEl('light-render-wrong-field-order');
    expect(() => el.connectedCallback()).to.throw(/has no template function/);
  });

  it('accepts the legacy SlotMixin slots map (compat layer)', async () => {
    const el = await mount('light-render-legacy-map');
    expect(el.querySelector('input')?.assignedSlot?.name).to.equal('input');
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('legacy');
    // legacy SlotRerenderObject form: the template is unwrapped
    expect(el.querySelector('[slot="extra"]')?.localName).to.equal('i');
    el.label = 'legacy-2';
    await el.updateComplete;
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('legacy-2');
  });

  it('composes the legacy slot map of a parent class with `{ ...super.slots }`', async () => {
    const el = await mount('light-render-legacy-composed');
    // the slot of the parent class survives the composition
    expect(el.querySelector('input#from-parent')?.assignedSlot?.name).to.equal('input');
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('composed by child');
  });

  it('throws when a class field shadows the slots accessor of a parent class', () => {
    const el = createEl('light-render-field-over-getter');
    expect(() => el.connectedCallback()).to.throw(/shadows the accessor/);
  });

  it('throws when the array shape is spread into an object', () => {
    const el = createEl('light-render-spread-array');
    expect(() => el.connectedCallback()).to.throw(/numeric keys/);
  });

  it('takes over server rendered light dom on connect, without duplicating it', async () => {
    const host = await fixture(html`<div></div>`);
    const el = createEl('light-render-method-style');
    // the markup that renderLight() produces on the server (see the ssr test in @lion/astro-lit)
    el.innerHTML = `<div slot="input" data-light-render="ssr"><input class="ssr-input" /></div>
      <div slot="label" data-light-render="ssr"><label class="ssr-label">from ssr</label></div>`;
    host.appendChild(el);
    await el.updateComplete;

    // the server rendered wrappers are gone...
    expect(el.querySelectorAll('[data-light-render="ssr"]').length).to.equal(0);
    // ...and the light dom is the client render, exactly once
    const inputs = el.querySelectorAll('[slot="input"]');
    expect(inputs.length).to.equal(1);
    expect(inputs[0].localName).to.equal('input');
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('first');
    expect(el.querySelectorAll('[slot="label"]').length).to.equal(1);
  });

  it('does not override slot content provided by the user', async () => {
    const el = await mountWithUserContent(
      'light-render-method-style',
      '<span slot="input">user provided</span>',
    );
    const inputs = el.querySelectorAll('[slot="input"]');
    expect(inputs.length).to.equal(1);
    expect(inputs[0].textContent).to.equal('user provided');
    // the other slot is still authored
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('first');
  });

  it('skips slots whose template returns undefined', async () => {
    const el = await mount('light-render-conditional');
    expect(el.querySelector('[slot="maybe"]')).to.equal(null);
    expect(el.querySelector('[slot="always"]')?.localName).to.equal('span');
  });

  it('exposes _isPrivateSlot for authored slots only', async () => {
    const el = await mountWithUserContent(
      'light-render-method-style',
      '<span slot="input">user provided</span>',
    );
    expect(el._isPrivateSlot('label')).to.equal(true);
    expect(el._isPrivateSlot('input')).to.equal(false);
  });

  it('wraps authored light dom in _start_slot_/_end_slot_ comments (SlotMixin marker interop)', async () => {
    const el = await mount('light-render-method-style');
    const comments = Array.from(el.childNodes)
      .filter(n => n.nodeType === Node.COMMENT_NODE)
      .map(n => n.textContent);
    expect(comments).to.include('_start_slot_input_');
    expect(comments).to.include('_end_slot_input_');
  });

  it('does not leak render state between instances of the same class', async () => {
    const host = await fixture(html`<div></div>`);
    const a = createEl('light-render-method-style');
    const b = createEl('light-render-method-style');
    host.append(a, b);
    await Promise.all([a.updateComplete, b.updateComplete]);
    a.label = 'a-only';
    await Promise.all([a.updateComplete, b.updateComplete]);
    expect(a.querySelector('[slot="label"]')?.textContent).to.equal('a-only');
    expect(b.querySelector('[slot="label"]')?.textContent).to.equal('first');
  });

  it('supports subclasses overriding a template and calling super', async () => {
    const el = await mount('light-render-child-style');
    expect(el.querySelector('[slot="label"]')?.textContent).to.equal('child+parent');
    const shadowHtml = el.shadowRoot.innerHTML;
    expect(shadowHtml).to.contain('<slot name="input">');
    expect(shadowHtml).to.contain('<slot name="label">');
    expect(shadowHtml).to.not.contain('<label');
  });
});
