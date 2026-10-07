/**
 * POC demo — two versions of @lion/ui side by side, one of them form-associated.
 *
 * Scoped elements exist so that two major versions of the library can run on one page. A future
 * version of Lion wants to adopt `formAssociated` for its form components (today they register with
 * a form through a native light-DOM `<input>`; a form-associated version could talk to the form
 * through `ElementInternals` instead and stop needing light DOM).
 *
 * This file proves that the two do not coexist, with the shipped component: the same tag
 * (`lion-input`) is declared in two scoped registries, once as today's `LionInput` and once as a
 * subclass that switches `formAssociated` on — a stand-in for the future version. Whichever
 * version defines the tag *first* decides for the whole page whether that tag can be
 * form-associated; the other one silently keeps (or wrongly gains) the old behaviour.
 *
 * The failing assertion below is the point of the demo: it fails wherever the tag is resolved
 * through a polyfilled scoped registry, and passes on a browser that implements scoped registries
 * natively. Run it with:
 *
 *   SCOPED_POLYFILL=v1 node node_modules/@web/test-runner/dist/bin.js \
 *     --config web-test-runner.scoped-spec.config.mjs \
 *     --files "packages/ui/components/input/test/lion-input.form-associated-scopes.demo.js"
 *
 * It is deliberately *not* named `*.test.js`, so the regular suite (which globs `**\/*.test.js`)
 * stays green; this is a demo of a limitation, not a regression test.
 */
import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';
import { LionInput } from '../src/LionInput.js';
import { ScopedElementsMixin, supportsScopedRegistry } from '../../core/src/ScopedElementsMixin.js';

/**
 * What a future version would look like: the same component with `formAssociated` switched on, so
 * the form knows it as a form-associated custom element (that is the primitive it needs to publish
 * its value through `ElementInternals.setFormValue` instead of a light-DOM input).
 */
class LionInputFormAssociated extends LionInput {
  static get formAssociated() {
    return true;
  }

  /** @param {HTMLFormElement | null} form */
  formAssociatedCallback(form) {
    this.__associatedForm = form;
  }

  /**
   * The value path a form-associated version would use. Recorded rather than asserted so the demo
   * can report *how* it failed instead of just throwing.
   *
   * @param {string} value
   */
  __publishToForm(value) {
    try {
      this.attachInternals().setFormValue(value);
      this.__publishOutcome = { ok: true };
    } catch (error) {
      this.__publishOutcome = { ok: false, error: `${error.name}: ${error.message}` };
    }
    return this.__publishOutcome;
  }
}

/** Today's version: not form-associated, registers through a native light-DOM input. */
class CurrentVersionHost extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-input': LionInput };

  render() {
    return html`<form><lion-input name="current"></lion-input></form>`;
  }
}

/** The future version: form-associated. */
class FutureVersionHost extends ScopedElementsMixin(LitElement) {
  static scopedElements = { 'lion-input': LionInputFormAssociated };

  render() {
    return html`<form><lion-input name="future"></lion-input></form>`;
  }
}
customElements.define('poc-host-current', CurrentVersionHost);
customElements.define('poc-host-future', FutureVersionHost);

/**
 * Whether the element is a form-associated custom element, as the browser sees it.
 *
 * @param {HTMLElement} el
 */
function formAssociationOf(el) {
  try {
    const internals = el.attachInternals();
    return { associated: true, form: internals.form ? internals.form.localName : null };
  } catch (error) {
    return { associated: false, error: `${error.name}: ${error.message}` };
  }
}

describe('POC: two @lion/ui versions side by side, one form-associated', () => {
  it('the two versions cannot differ: the form-associated one loses form association', async () => {
    // Today's version is loaded (and therefore defines the tag) first, which is what happens when
    // an older major version is already on the page and a newer one is added next to it.
    const currentHost = /** @type {CurrentVersionHost} */ (
      await fixture(html`<poc-host-current></poc-host-current>`)
    );
    const futureHost = /** @type {FutureVersionHost} */ (
      await fixture(html`<poc-host-future></poc-host-future>`)
    );

    const currentInput = /** @type {LionInput} */ (
      currentHost.shadowRoot.querySelector('lion-input')
    );
    const futureInput = /** @type {LionInputFormAssociated} */ (
      futureHost.shadowRoot.querySelector('lion-input')
    );
    const futureForm = /** @type {HTMLFormElement} */ (futureHost.shadowRoot.querySelector('form'));

    // Without scoped registries the two versions collapse onto one global definition, so the
    // scenario does not exist at all: that is the other, pre-existing limitation (and why scoped
    // elements were introduced in the first place).
    const currentRegistry = /** @type {{registry: CustomElementRegistry}} */ (currentHost).registry;
    const futureRegistry = /** @type {{registry: CustomElementRegistry}} */ (futureHost).registry;
    if (!supportsScopedRegistry()) {
      expect(
        [currentInput.constructor.name, futureInput.constructor.name].join('|'),
        'without scoped registries both hosts share the global definition, so "two versions side by side" is impossible',
      ).to.equal('LionInput|LionInput');
      return;
    }

    // The two classes really are different versions of the same component, in their own registries.
    expect(currentInput.constructor).to.equal(LionInput);
    expect(futureInput.constructor).to.equal(LionInputFormAssociated);
    expect(currentRegistry).to.not.equal(futureRegistry);

    // The asymmetry that is the bug: same tag, one form-associated, one not.
    const current = formAssociationOf(currentInput);
    const future = formAssociationOf(futureInput);
    const published = futureInput.__publishToForm('future-value');
    const formData = new FormData(futureForm);

    expect(
      current.associated,
      `the *current* version must not be form-associated, but it is (${JSON.stringify(current)})`,
    ).to.equal(false);

    expect(
      future.associated,
      [
        'the *future* version must be form-associated, but the tag was already defined by the',
        `version without it: ${JSON.stringify(future)}`,
        `publishing a value through ElementInternals: ${JSON.stringify(published)}`,
        `formAssociatedCallback fired: ${Boolean(futureInput.__associatedForm)}`,
        `form data: ${JSON.stringify([...formData.entries()])}`,
      ].join('\n'),
    ).to.equal(true);
  });
});
