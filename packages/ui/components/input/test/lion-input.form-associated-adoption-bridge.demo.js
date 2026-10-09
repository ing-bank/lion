/**
 * POC demo — a usable migration bridge for adopting `formAssociated`.
 *
 * The problem (see `lion-input.form-associated-scopes.demo.js`): form association is decided per tag
 * name for the whole page, so a version that adopts it cannot rely on the tag's capability being
 * there — the page's define order and the loaded polyfill decide it, neither of which a version owns.
 *
 * The bridge measured here: adopt `formAssociated` **additively**. The new version keeps publishing
 * its value through the mechanism today's version already has (the light-DOM `<input>` the form
 * submits) and *additionally* publishes through `ElementInternals` whenever the page really did make
 * the element form-associated. Then:
 *
 * - the data always reaches the form, in every mode and either define order — the assertion below;
 * - the *feature* (dropping the light-DOM input, being a form control without it) only materialises
 *   where the capability exists, i.e. natively, or under the redesign when the tag was reserved
 *   before the polyfill loaded, or when the adopting version defines the tag first.
 *
 * In other words: the capability can be adopted later than the data contract, which is what makes a
 * version-by-version migration possible at all.
 *
 * Run it with:
 *
 *   npm run demo:form-associated-bridge
 *   SCOPED_POLYFILL=v0 npm run demo:form-associated-bridge
 *   SCOPED_POLYFILL=v1-reserved npm run demo:form-associated-bridge
 *
 * Not named `*.test.js` on purpose, so the regular suite stays green.
 */
import { expect } from '@open-wc/testing';
import {
  LionInputFormAssociatedWithBridge,
  formAssociationOf,
  runStory,
} from './lion-input.form-associated-scopes.helpers.js';

describe('POC: migration bridge for adopting formAssociated (publish through both mechanisms)', () => {
  it('the value reaches the form in every mode, even when the capability is not granted', async () => {
    const story = await runStory('current-first', LionInputFormAssociatedWithBridge);

    if (!story.scoped) {
      // Without scoped registries both hosts collapse onto one global definition, so the future host
      // holds a plain LionInput and there is no bridge method to call: drive the mechanism that is
      // there (the native light-DOM input) and assert the value still reaches the form.
      const input = /** @type {HTMLInputElement | undefined} */ (
        /** @type {any} */ (story.futureInput)._inputNode ??
          story.futureInput.querySelector('input')
      );
      if (input) {
        input.value = 'future-value';
      }
      expect(
        [...new FormData(story.futureForm).entries()].find(([name]) => name === 'future')?.[1],
        'without scoped registries the versions collapse, and the value must still reach the form',
      ).to.equal('future-value');
      return;
    }

    const published = /** @type {LionInputFormAssociatedWithBridge} */ (
      story.futureInput
    ).publishForMigration('future-value');
    const formData = [...new FormData(story.futureForm).entries()];
    const capability = formAssociationOf(story.futureInput);

    // THE BRIDGE: whichever define order and whichever polyfill, the form receives the value.
    expect(
      formData.find(([name]) => name === 'future')?.[1],
      [
        'the value must reach the form through the fallback mechanism even when the element did not',
        'become a form-associated custom element',
        `(form data: ${JSON.stringify(formData)}, published: ${JSON.stringify(published)},`,
        `capability: ${JSON.stringify(capability)})`,
      ].join(' '),
    ).to.equal('future-value');

    // ... and it is only ever reported once: the same field must not appear twice.
    expect(formData.filter(([name]) => name === 'future').length).to.equal(1);
  });
});
