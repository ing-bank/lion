import { expect } from '@esm-bundle/chai';
import { fixture, html, nextFrame, aTimeout } from '@open-wc/testing';
// @ts-expect-error - the package only ships types for its plugin entrypoint
import { visualDiff } from '@web/test-runner-visual-regression';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';

/**
 * The invoker is widened to the dropdown content width plus the room for its arrow, and the
 * dropdown follows the invoker. Without that, the dropdown ends up `_arrowWidth` narrower
 * than the invoker it belongs to.
 */
const template = html`
  <div style="width: 480px; padding: 32px; background: #fff;">
    <lion-select-rich label="Fruit" name="fruit">
      <lion-option .choiceValue=${'apple'} checked>Apple</lion-option>
      <lion-option .choiceValue=${'banana'}>A considerably longer option label</lion-option>
      <lion-option .choiceValue=${'cherry'}>Cherry</lion-option>
    </lion-select-rich>
  </div>
`;

/**
 * @param {Element} wrapper
 */
function getWidths(wrapper) {
  const selectRich = /** @type {any} */ (wrapper.querySelector('lion-select-rich'));
  const invokerRect = selectRich._invokerNode.getBoundingClientRect();
  const dropdownRect = selectRich._overlayCtrl.contentWrapperNode.getBoundingClientRect();
  return { invokerWidth: invokerRect.width, dropdownWidth: dropdownRect.width };
}

describe('select-rich dropdown width', () => {
  it('keeps the opened dropdown as wide as the invoker', async () => {
    const wrapper = await fixture(template);
    const selectRich = /** @type {any} */ (wrapper.querySelector('lion-select-rich'));
    selectRich.opened = true;
    await nextFrame();
    await aTimeout(400);
    await selectRich.updateComplete;
    await nextFrame();

    const { invokerWidth, dropdownWidth } = getWidths(wrapper);

    expect(
      dropdownWidth,
      `dropdown (${dropdownWidth.toFixed(2)}) should be as wide as the invoker (${invokerWidth.toFixed(2)})`,
    ).to.be.closeTo(invokerWidth, 0.5);

    await visualDiff(document.body, 'select-rich-dropdown-width');
  });

  it('renders the closed invoker without a dropdown', async () => {
    const wrapper = await fixture(template);
    const selectRich = /** @type {any} */ (wrapper.querySelector('lion-select-rich'));
    await aTimeout(400);
    await selectRich.updateComplete;
    await nextFrame();

    const { invokerWidth, dropdownWidth } = getWidths(wrapper);
    expect(invokerWidth).to.be.above(0);
    expect(dropdownWidth).to.equal(0);

    await visualDiff(document.body, 'select-rich-invoker-width');
  });
});
