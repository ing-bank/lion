import { expect, html, fixture, triggerFocusFor, nextFrame } from '@open-wc/testing';
import sinon from 'sinon';

import { localizeTearDown } from '@lion/localize/test-helpers.js';

import '@lion/checkbox/lion-checkbox.js';
import '../lion-checkbox-group.js';

beforeEach(() => {
  localizeTearDown();
});

describe('<lion-checkbox-group>', () => {
  // Note: these requirements seem to hold for checkbox-group only, not for radio-group (since we
  // cannot tab through all input elements).

  it(`becomes "touched" once the last element of a group becomes blurred by keyboard
    interaction (e.g. tabbing through the checkbox-group)`, async () => {
    const el = await fixture(`
      <lion-checkbox-group>
        <label slot="label">My group</label>
        <lion-checkbox name="myGroup[]" label="Option 1" value="1"></lion-checkbox>
        <lion-checkbox name="myGroup[]" label="Option 2" value="2"></lion-checkbox>
      </lion-checkbox-group>
    `);
    await nextFrame();

    const button = await fixture(`<button>Blur</button>`);

    el.children[1].focus();
    expect(el.touched).to.equal(false, 'initially, touched state is false');
    el.children[2].focus();
    expect(el.touched).to.equal(false, 'focus is on second checkbox');
    button.focus();
    expect(el.touched).to.equal(
      true,
      `focus is on element behind second checkbox
      (group has blurred)`,
    );
  });

  it(`becomes "touched" once the group as a whole becomes blurred via mouse interaction after
    keyboard interaction (e.g. focus is moved inside the group and user clicks somewhere outside
    the group)`, async () => {
    const groupWrapper = await fixture(`
      <div tabindex="0">
        <lion-checkbox-group>
          <label slot="label">My group</label>
          <lion-checkbox name="myGroup[]" label="Option 1" value="1"></lion-checkbox>
          <lion-checkbox name="myGroup[]" label="Option 2" vallue="2"></lion-checkbox>
        </lion-checkbox-group>
      </div>
    `);
    await nextFrame();

    const el = groupWrapper.children[0];
    await el.children[1].updateComplete;
    el.children[1].focus();
    expect(el.touched).to.equal(false, 'initially, touched state is false');
    el.children[2].focus(); // simulate tab
    expect(el.touched).to.equal(false, 'focus is on second checkbox');
    // simulate click outside
    sinon.spy(el, '_setTouchedAndPrefilled');
    groupWrapper.click(); // blur the group via a click
    expect(el._setTouchedAndPrefilled.callCount).to.equal(1);
    // For some reason, document.activeElement is not updated after groupWrapper.click() (this
    // happens on user clicks, not on imperative clicks). So we check if the private callbacks
    // for outside clicks are called (they trigger _setTouchedAndPrefilled call).
    // To make sure focus is moved, we 'help' the test here to mimic browser behavior.
    // groupWrapper.focus();
    await triggerFocusFor(groupWrapper);
    expect(el.touched).to.equal(true, 'focus is on element outside checkbox group');
  });

  it(`becomes "touched" once a single element of the group becomes "touched" via mouse interaction
    (e.g. user clicks on checkbox)`, async () => {
    const el = await fixture(`
      <lion-checkbox-group>
        <lion-checkbox name="myGroup[]"></lion-checkbox>
        <lion-checkbox name="myGroup[]"></lion-checkbox>
      </lion-checkbox-group>
    `);
    await nextFrame();

    el.children[1].focus();
    expect(el.touched).to.equal(false, 'initially, touched state is false');
    el.children[1].click();
    expect(el.touched).to.equal(
      true,
      `focus is initiated via a mouse event, thus
      fieldset/checkbox-group as a whole is considered touched`,
    );
  });

  it('can be required', async () => {
    const el = await fixture(html`
      <lion-checkbox-group .errorValidators=${[['required']]}>
        <lion-checkbox name="sports[]" .choiceValue=${'running'}></lion-checkbox>
        <lion-checkbox name="sports[]" .choiceValue=${'swimming'}></lion-checkbox>
      </lion-checkbox-group>
    `);
    await nextFrame();

    expect(el.error.required).to.be.true;
    el.formElements['sports[]'][0].choiceChecked = true;
    expect(el.error.required).to.be.undefined;
  });
});
