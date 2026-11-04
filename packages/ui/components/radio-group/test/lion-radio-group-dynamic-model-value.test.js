import { expect, fixture, html } from '@open-wc/testing';
import { LitElement } from 'lit';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';

/**
 * Regression test for: modelValue set on lion-radio-group is ignored when children
 * (lion-radio elements) are rendered dynamically at the same time.
 *
 * Scenario (dynamic options wrapper):
 *   1. A wrapper LitElement owns `offers` and `selectedOffer`.
 *   2. Both are initially empty / ''.
 *   3. After the group's registrationComplete resolves (__isInitialModelValue becomes false),
 *      the wrapper receives new offers AND a selectedOffer simultaneously.
 *   4. Lit re-renders the wrapper in one batch: modelValue setter is called on lion-radio-group
 *      while formElements is still empty (the new lion-radio children haven't registered yet).
 *   5. Because __isInitialModelValue is already false the setter goes to the `else` branch and
 *      calls _setCheckedElements immediately on an empty list — nothing gets checked.
 *
 * Expected: after the update cycle settles, the matching lion-radio is checked and
 *           lion-radio-group.modelValue equals the value passed via .modelValue.
 */
describe('lion-radio-group: dynamic modelValue with simultaneously added children', () => {
  /**
   * A minimal wrapper that reproduces dynamically added options with a pre-selected modelValue
   * without needing ScopedElementsMixin or a second custom element layer.
   */
  class DynamicRadioWrapper extends LitElement {
    static get properties() {
      return {
        offers: { type: Array },
        selectedOffer: { attribute: false },
      };
    }

    constructor() {
      super();
      /** @type {{ id: string; name: string }[]} */
      this.offers = [];
      this.selectedOffer = '';
    }

    render() {
      return html`
        <lion-radio-group name="offer" .modelValue=${this.selectedOffer}>
          ${this.offers.map(
            o => html`<lion-radio label=${o.name} .choiceValue=${o.id}></lion-radio>`,
          )}
        </lion-radio-group>
      `;
    }
  }

  // Register with a unique tag so repeated test runs don't clash.
  if (!customElements.get('dynamic-radio-wrapper')) {
    customElements.define('dynamic-radio-wrapper', DynamicRadioWrapper);
  }

  it('applies modelValue correctly when children and value arrive after registrationComplete', async () => {
    const wrapper = /** @type {DynamicRadioWrapper} */ (
      await fixture(html`<dynamic-radio-wrapper></dynamic-radio-wrapper>`)
    );

    const group = /** @type {import('@lion/ui/radio-group.js').LionRadioGroup} */ (
      wrapper.shadowRoot?.querySelector('lion-radio-group')
    );

    // Wait for initial registration to complete so __isInitialModelValue becomes false.
    await group.registrationComplete;
    // One extra microtask to let connectedCallback's .then() flip the flag.
    await Promise.resolve();

    // Set offers AND selectedOffer in one synchronous tick
    // (matching the setTimeout callback in the original component).
    wrapper.offers = [
      { id: 'offer1', name: 'offer1' },
      { id: 'offer2', name: 'offer2' },
    ];
    wrapper.selectedOffer = 'offer2';

    // Allow Lit to re-render and lion-radio children to register.
    await wrapper.updateComplete;
    // lion-radio-group itself may also need an update cycle.
    await group.updateComplete;
    // Wait for the new registrationComplete to resolve (children re-registered).
    await group.registrationComplete;

    expect(group.modelValue).to.equal('offer2');
    const checkedRadio = group.formElements.find((/** @type {any} */ el) => el.checked);
    expect(checkedRadio?.choiceValue).to.equal('offer2');
  });

  it('applies serializedValue correctly when children and value arrive after registrationComplete', async () => {
    class DynamicRadioSerializedWrapper extends LitElement {
      static get properties() {
        return {
          offers: { type: Array },
          selectedOffer: { attribute: false },
        };
      }

      constructor() {
        super();
        /** @type {{ id: string; name: string }[]} */
        this.offers = [];
        this.selectedOffer = '';
      }

      render() {
        return html`
          <lion-radio-group name="offer" .serializedValue=${this.selectedOffer}>
            ${this.offers.map(
              o => html`<lion-radio label=${o.name} .choiceValue=${o.id}></lion-radio>`,
            )}
          </lion-radio-group>
        `;
      }
    }

    if (!customElements.get('dynamic-radio-serialized-wrapper')) {
      customElements.define('dynamic-radio-serialized-wrapper', DynamicRadioSerializedWrapper);
    }

    const wrapper = /** @type {DynamicRadioSerializedWrapper} */ (
      await fixture(html`<dynamic-radio-serialized-wrapper></dynamic-radio-serialized-wrapper>`)
    );

    const group = /** @type {import('@lion/ui/radio-group.js').LionRadioGroup} */ (
      wrapper.shadowRoot?.querySelector('lion-radio-group')
    );

    await group.registrationComplete;
    await Promise.resolve();

    wrapper.offers = [
      { id: 'offer1', name: 'offer1' },
      { id: 'offer2', name: 'offer2' },
    ];
    wrapper.selectedOffer = 'offer2';

    await wrapper.updateComplete;
    await group.updateComplete;
    await group.registrationComplete;

    expect(group.serializedValue).to.equal('offer2');
    const checkedRadio = group.formElements.find((/** @type {any} */ el) => el.checked);
    expect(checkedRadio?.choiceValue).to.equal('offer2');
  });

  it('applies formattedValue correctly when children and value arrive after registrationComplete', async () => {
    class DynamicRadioFormattedWrapper extends LitElement {
      static get properties() {
        return {
          offers: { type: Array },
          selectedOffer: { attribute: false },
        };
      }

      constructor() {
        super();
        /** @type {{ id: string; name: string }[]} */
        this.offers = [];
        this.selectedOffer = '';
      }

      render() {
        return html`
          <lion-radio-group name="offer" .formattedValue=${this.selectedOffer}>
            ${this.offers.map(
              o => html`<lion-radio label=${o.name} .choiceValue=${o.id}></lion-radio>`,
            )}
          </lion-radio-group>
        `;
      }
    }

    if (!customElements.get('dynamic-radio-formatted-wrapper')) {
      customElements.define('dynamic-radio-formatted-wrapper', DynamicRadioFormattedWrapper);
    }

    const wrapper = /** @type {DynamicRadioFormattedWrapper} */ (
      await fixture(html`<dynamic-radio-formatted-wrapper></dynamic-radio-formatted-wrapper>`)
    );

    const group = /** @type {import('@lion/ui/radio-group.js').LionRadioGroup} */ (
      wrapper.shadowRoot?.querySelector('lion-radio-group')
    );

    await group.registrationComplete;
    await Promise.resolve();

    wrapper.offers = [
      { id: 'offer1', name: 'offer1' },
      { id: 'offer2', name: 'offer2' },
    ];
    wrapper.selectedOffer = 'offer2';

    await wrapper.updateComplete;
    await group.updateComplete;
    await group.registrationComplete;

    expect(group.formattedValue).to.equal('offer2');
    const checkedRadio = group.formElements.find((/** @type {any} */ el) => el.checked);
    expect(checkedRadio?.choiceValue).to.equal('offer2');
  });
});
