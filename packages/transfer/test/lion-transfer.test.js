import { expect, fixture, html } from '@open-wc/testing';

/** @typedef {{_inputNode:HTMLElement}} ListBox */
// import sinon from 'sinon';
import '../lion-transfer.js';
// eslint-disable-next-line no-unused-vars

describe('lion-transfer', () => {
  /** @type {{leftListBox: ListBox, modelValue:{left:Array<string>, right:Array<string>},rightListBox: ListBox, leftList: Array<{checked: boolean}>, rightList: Array<{checked: boolean}>} & Element} element */
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<lion-transfer>
        <div slot="leftList">
          <lion-option .choiceValue="Apple">Apple</lion-option>
          <lion-option .choiceValue="Artichoke">Artichoke</lion-option>
          <lion-option .choiceValue="Asparagus">Asparagus</lion-option>
        </div>
        <button slot="transferToLeftActionSlot">To Left &lt;</button>
        <button slot="transferToRightActionSlot">To Right &gt;</button>
        <div slot="rightList">
          <lion-option .choiceValue="Banana">Banana</lion-option>
          <lion-option .choiceValue="Beets">Beets</lion-option>
          <lion-option .choiceValue="Bell pepper">Bell pepper</lion-option>
          <lion-option .choiceValue="Broccoli">Broccoli</lion-option>
          <lion-option .choiceValue="Brussels sprout">Brussels sprout</lion-option>
        </div>
      </lion-transfer>`,
    );
  });

  it('listBoxes should have provided options', () => {
    expect(element.leftListBox._inputNode.children.length).to.be.equal(3);
    expect(element.rightListBox._inputNode.children.length).to.be.equal(5);

    expect(element.leftList.length).to.be.equal(3);
    expect(element.rightList.length).to.be.equal(5);
  });

  it('select first option in left listboox and tranfer it to right listbox', () => {
    element.leftList[0].checked = true; // Apple
    const transferToRightAction = /** @type {HTMLElement} */ (element.shadowRoot?.querySelector(
      'slot[name="transferToRightActionSlot"]',
    ));
    transferToRightAction?.click();

    expect(element.leftList.length).to.be.equal(2);
    expect(element.rightList.length).to.be.equal(6);
    expect(element.modelValue.right[5]).to.equal('Apple');
  });

  it('select second option in right listboox and tranfer it to left listbox', () => {
    element.rightList[1].checked = true; // Beets
    const transferToLeftAction = /** @type {HTMLElement} */ (element.shadowRoot?.querySelector(
      'slot[name="transferToLeftActionSlot"]',
    ));
    transferToLeftAction?.click();

    expect(element.leftList.length).to.be.equal(4);
    expect(element.rightList.length).to.be.equal(4);
    expect(element.modelValue.left[3]).to.equal('Beets');
  });
});
