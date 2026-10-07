/**
 * POC demo, the other order: the form-associated version declares `lion-input` first.
 *
 * See `lion-input.form-associated-scopes.demo.js` for the scenario and the why. This file exists
 * because the define order is the deciding factor and it can only be observed once per page, so the
 * two orders need their own test runner page.
 *
 * Whether this order works is exactly the question "can two versions of the same tag differ in
 * `formAssociated`?" — run it in the same modes as the other demo file:
 *
 *   npm run demo:form-associated-scopes:future-first
 *   SCOPED_POLYFILL=v0 npm run demo:form-associated-scopes:future-first
 *   SCOPED_POLYFILL=none npm run demo:form-associated-scopes:future-first
 */
import { expect } from '@open-wc/testing';
import { runStory } from './lion-input.form-associated-scopes.helpers.js';

describe('POC: two @lion/ui versions side by side, form-associated first', () => {
  it('the form-associated version keeps its capability, the other one stays without it', async () => {
    const story = await runStory('future-first');

    if (!story.scoped) {
      expect(
        story.currentCtor,
        'without scoped registries both hosts share the single global definition',
      ).to.equal(story.futureCtor);
      return;
    }

    expect(`${story.currentCtor}|${story.futureCtor}`).to.equal(
      'LionInput|LionInputFormAssociated',
    );

    expect(
      story.future.associated,
      [
        'the *future* version declares the tag first, so it must be form-associated:',
        `${JSON.stringify(story.future)}`,
        `publishing a value through ElementInternals: ${JSON.stringify(story.published)}`,
        `form data: ${JSON.stringify(story.formData)}`,
      ].join('\n'),
    ).to.equal(true);

    // ... and the version that has not adopted the feature must not gain it.
    expect(
      story.current.associated,
      `the *current* version must not be form-associated, but it is (${JSON.stringify(story.current)})`,
    ).to.equal(false);
  });
});
