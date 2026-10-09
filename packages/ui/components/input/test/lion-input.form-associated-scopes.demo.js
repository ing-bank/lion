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
 * subclass that switches `formAssociated` on — the stand-in for the future version. **Today's
 * version declares the tag first**, which is what happens when an older major version is already on
 * the page and a newer one is added next to it. Whichever version defines the tag first decides for
 * the whole page whether that tag can be form-associated, so the future version silently loses the
 * capability and the value it publishes through `ElementInternals` never reaches the form.
 *
 * The failing assertion below is the point of the demo. Run it with:
 *
 *   npm run demo:form-associated-scopes                       # spec 1.x polyfill, forced
 *   SCOPED_POLYFILL=v0 npm run demo:form-associated-scopes    # the polyfill that is on npm today
 *   SCOPED_POLYFILL=none npm run demo:form-associated-scopes  # native support: passes
 *   SCOPED_POLYFILL=v1-reserved ...                           # with the polyfill's escape hatch
 *
 * The other order (the form-associated version declaring the tag first) is the companion file
 * `lion-input.form-associated-scopes-future-first.demo.js`.
 *
 * It is deliberately *not* named `*.test.js`, so the regular suite (which globs `**\/*.test.js`)
 * stays green; this is a demo of a limitation, not a regression test.
 */
import { expect } from '@open-wc/testing';
import { runStory } from './lion-input.form-associated-scopes.helpers.js';

describe('POC: two @lion/ui versions side by side, one form-associated', () => {
  it('the two versions cannot differ: the form-associated one loses form association', async () => {
    const story = await runStory('current-first');

    if (!story.scoped) {
      // Without scoped registries the two versions collapse onto one global definition, so the
      // scenario does not exist at all: that is the other, pre-existing limitation.
      expect(
        story.currentCtor,
        'without scoped registries both hosts share the single global definition',
      ).to.equal(story.futureCtor);
      return;
    }

    // Same tag, two scoped registries, two different versions of the component.
    expect(`${story.currentCtor}|${story.futureCtor}`).to.equal(
      'LionInput|LionInputFormAssociated',
    );

    // The asymmetry that is the bug: one is form-associated, the other is not.
    expect(
      story.current.associated,
      `the *current* version must not be form-associated, but it is (${JSON.stringify(story.current)})`,
    ).to.equal(false);

    expect(
      story.future.associated,
      [
        'the *future* version must be form-associated, but the tag was already defined by the',
        `version without it: ${JSON.stringify(story.future)}`,
        `publishing a value through ElementInternals: ${JSON.stringify(story.published)}`,
        `formAssociatedCallback fired: ${story.callbackFired}`,
        `form data: ${JSON.stringify(story.formData)}`,
      ].join('\n'),
    ).to.equal(true);
  });
});
