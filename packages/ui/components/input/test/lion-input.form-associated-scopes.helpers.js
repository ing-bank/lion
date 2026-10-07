/**
 * Shared scenario for the form-associated demo: the same tag declared in two scoped registries,
 * once as today's `LionInput` and once as a `formAssociated` subclass of it (the shape a future
 * version would have).
 *
 * The define order matters — the capability belongs to the tag name for the whole page — and it can
 * only be observed once per page, so it is a parameter that each demo file pins.
 */
import { LitElement, html } from 'lit';
import { LionInput } from '../src/LionInput.js';
import { ScopedElementsMixin, supportsScopedRegistry } from '../../core/src/ScopedElementsMixin.js';

/**
 * What a future version would look like: the same component with `formAssociated` switched on, so
 * the form knows it as a form-associated custom element (the primitive it needs to publish its
 * value through `ElementInternals.setFormValue` instead of a light-DOM input).
 */
export class LionInputFormAssociated extends LionInput {
  static get formAssociated() {
    return true;
  }

  /** @param {HTMLFormElement | null} form */
  formAssociatedCallback(form) {
    this.__associatedForm = form;
  }

  /**
   * The value path a form-associated version would use. Recorded rather than thrown so the demo can
   * report *how* it failed.
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

/**
 * Whether the element is a form-associated custom element, as the browser sees it.
 *
 * @param {HTMLElement} el
 */
export function formAssociationOf(el) {
  try {
    const internals = el.attachInternals();
    return { associated: true, form: internals.form ? internals.form.localName : null };
  } catch (error) {
    return { associated: false, error: `${error.name}: ${error.message}` };
  }
}

/**
 * @param {Record<string, typeof HTMLElement>} scopedElements
 * @param {string} inputName
 * @param {string} tagName
 */
const hostFactory = (scopedElements, inputName, tagName) => {
  class VersionHost extends ScopedElementsMixin(LitElement) {
    /** @type {Record<string, typeof HTMLElement>} */
    static scopedElements = scopedElements;

    render() {
      return html`<form><lion-input name="${inputName}"></lion-input></form>`;
    }
  }
  // A host must be a *defined* custom element to be constructible.
  customElements.define(tagName, VersionHost);
  return VersionHost;
};

let runId = 0;

/**
 * Runs the scenario: today's `LionInput` in one registry, the form-associated subclass in another,
 * each declared in the requested order (which is the only thing that differs between the two demo
 * files, and the whole point of the investigation).
 *
 * @param {'current-first' | 'future-first'} order
 */
export async function runStory(order) {
  const scoped = supportsScopedRegistry();
  const suffix = `poc-face-${(runId += 1)}`;
  const CurrentHost = hostFactory({ 'lion-input': LionInput }, 'current', `${suffix}-current`);
  const FutureHost = hostFactory(
    { 'lion-input': LionInputFormAssociated },
    'future',
    `${suffix}-future`,
  );

  const registryCurrent = scoped ? new CustomElementRegistry() : customElements;
  const registryFuture = scoped ? new CustomElementRegistry() : customElements;

  if (scoped) {
    // Declare the tag by hand, in the requested order: the mixin only declares its `scopedElements`
    // when it creates the registry itself.
    const definitions =
      order === 'current-first'
        ? [
            [registryCurrent, LionInput],
            [registryFuture, LionInputFormAssociated],
          ]
        : [
            [registryFuture, LionInputFormAssociated],
            [registryCurrent, LionInput],
          ];
    for (const [registry, klass] of definitions) registry.define('lion-input', klass);
    // Pre-assigning the registry keeps the mixin's version of it out of the way.
    /** @type {any} */ (CurrentHost).__registry = registryCurrent;
    /** @type {any} */ (FutureHost).__registry = registryFuture;
  }

  const currentHost = new CurrentHost();
  const futureHost = new FutureHost();
  currentHost.setAttribute('data-version', 'current');
  futureHost.setAttribute('data-version', 'future');
  document.body.append(currentHost, futureHost);
  await Promise.all([currentHost.updateComplete, futureHost.updateComplete]);

  const currentInput = /** @type {LionInput} */ (
    currentHost.shadowRoot.querySelector('lion-input')
  );
  const futureInput = /** @type {LionInputFormAssociated} */ (
    futureHost.shadowRoot.querySelector('lion-input')
  );
  const futureForm = /** @type {HTMLFormElement} */ (futureHost.shadowRoot.querySelector('form'));

  const story = {
    scoped,
    order,
    currentInput,
    futureInput,
    futureForm,
    currentCtor: currentInput.constructor.name,
    futureCtor: futureInput.constructor.name,
    current: formAssociationOf(currentInput),
    future: formAssociationOf(futureInput),
    published:
      typeof futureInput.__publishToForm === 'function'
        ? futureInput.__publishToForm('future-value')
        : {
            ok: false,
            error:
              'not the form-associated version: without scoped registries the versions collapse',
          },
    callbackFired: Boolean(futureInput.__associatedForm),
    formData: [...new FormData(futureForm).entries()],
  };

  currentHost.remove();
  futureHost.remove();
  return story;
}
