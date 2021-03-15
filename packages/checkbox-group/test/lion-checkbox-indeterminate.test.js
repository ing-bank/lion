import { expect, fixture, html } from '@open-wc/testing';
import '@lion/checkbox-group/define';

/**
 * @typedef {import('../src/LionCheckboxIndeterminate').LionCheckboxIndeterminate} LionCheckboxIndeterminate
 * @typedef {import('../src/LionCheckboxGroup').LionCheckboxGroup} LionCheckboxGroup
 */

describe('<lion-checkbox-indeterminate>', () => {
  it('should have type = checkbox', async () => {
    // Arrange
    const el = await fixture(html`
      <lion-checkbox-indeterminate
        name="checkbox"
        .choiceValue="${'male'}"
      ></lion-checkbox-indeterminate>
    `);

    // Assert
    expect(el.getAttribute('type')).to.equal('checkbox');
  });

  it('should not be indeterminate by default if all children are unchecked', async () => {
    // Arrange
    const el = await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `);
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
  });

  it('should be indeterminate if one child is checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon" checked></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `);
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
  });

  it('should be checked if all children are checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes" checked></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon" checked></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie" checked></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?.checked).to.be.true;
  });

  it('should become indeterminate if one child is checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Act
    elIndeterminate._subCheckboxes[0].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
  });

  it('should become checked if all children are checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Act
    elIndeterminate._subCheckboxes[0].checked = true;
    elIndeterminate._subCheckboxes[1].checked = true;
    elIndeterminate._subCheckboxes[2].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?.checked).to.be.true;
  });

  it('should sync all children when parent is checked (from indeterminate to checked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon" checked></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Act
    elIndeterminate._inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?._subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(elIndeterminate?._subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(elIndeterminate?._subCheckboxes[2].hasAttribute('checked')).to.be.true;
  });

  it('should sync all children when parent is checked (from unchecked to checked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon"></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Act
    elIndeterminate._inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?._subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(elIndeterminate?._subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(elIndeterminate?._subCheckboxes[2].hasAttribute('checked')).to.be.true;
  });

  it('should sync all children when parent is checked (from checked to unchecked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <lion-checkbox-indeterminate label="Favorite scientists">
          <lion-checkbox slot="checkbox" label="Archimedes" checked></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Francis Bacon" checked></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Marie Curie" checked></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Act
    elIndeterminate._inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?._subCheckboxes[0].hasAttribute('checked')).to.be.false;
    expect(elIndeterminate?._subCheckboxes[1].hasAttribute('checked')).to.be.false;
    expect(elIndeterminate?._subCheckboxes[2].hasAttribute('checked')).to.be.false;
  });

  it('should work as expected with siblings checkbox-indeterminate', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]" label="Favorite scientists">
        <lion-checkbox-indeterminate label="Old Greek scientists" id="first-checkbox-indeterminate">
          <lion-checkbox
            slot="checkbox"
            label="Archimedes"
            .choiceValue=${'Archimedes'}
          ></lion-checkbox>
          <lion-checkbox slot="checkbox" label="Plato" .choiceValue=${'Plato'}></lion-checkbox>
          <lion-checkbox
            slot="checkbox"
            label="Pythagoras"
            .choiceValue=${'Pythagoras'}
          ></lion-checkbox>
        </lion-checkbox-indeterminate>
        <lion-checkbox-indeterminate
          label="17th Century scientists"
          id="second-checkbox-indeterminate"
        >
          <lion-checkbox
            slot="checkbox"
            label="Isaac Newton"
            .choiceValue=${'Isaac Newton'}
          ></lion-checkbox>
          <lion-checkbox
            slot="checkbox"
            label="Galileo Galilei"
            .choiceValue=${'Galileo Galilei'}
          ></lion-checkbox>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elFirstIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      '#first-checkbox-indeterminate',
    ));
    const elSecondIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      '#second-checkbox-indeterminate',
    ));

    // Act - check the first sibling
    elFirstIndeterminate._inputNode.click();
    await elFirstIndeterminate.updateComplete;
    await elSecondIndeterminate.updateComplete;

    // Assert - the second sibling should not be affected
    expect(elFirstIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elFirstIndeterminate?._subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(elFirstIndeterminate?._subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(elFirstIndeterminate?._subCheckboxes[2].hasAttribute('checked')).to.be.true;
    expect(elSecondIndeterminate?._subCheckboxes[0].hasAttribute('checked')).to.be.false;
    expect(elSecondIndeterminate?._subCheckboxes[1].hasAttribute('checked')).to.be.false;
  });

  it('should work as expected with nested indeterminate checkboxes', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]" label="Favorite scientists">
        <lion-checkbox-indeterminate label="Scientists" id="parent-checkbox-indeterminate">
          <lion-checkbox
            slot="checkbox"
            label="Isaac Newton"
            .choiceValue=${'Isaac Newton'}
          ></lion-checkbox>
          <lion-checkbox
            slot="checkbox"
            label="Galileo Galilei"
            .choiceValue=${'Galileo Galilei'}
          ></lion-checkbox>
          <lion-checkbox-indeterminate
            slot="checkbox"
            label="Old Greek scientists"
            id="nested-checkbox-indeterminate"
          >
            <lion-checkbox
              slot="checkbox"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></lion-checkbox>
            <lion-checkbox slot="checkbox" label="Plato" .choiceValue=${'Plato'}></lion-checkbox>
            <lion-checkbox
              slot="checkbox"
              label="Pythagoras"
              .choiceValue=${'Pythagoras'}
            ></lion-checkbox>
          </lion-checkbox-indeterminate>
        </lion-checkbox-indeterminate>
      </lion-checkbox-group>
    `));
    const elNestedIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      '#nested-checkbox-indeterminate',
    ));
    const elParentIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      '#parent-checkbox-indeterminate',
    ));

    // Act - check a nested checkbox
    elNestedIndeterminate?._subCheckboxes[0]._inputNode.click();
    await el.updateComplete;

    // Assert
    expect(elNestedIndeterminate?.hasAttribute('indeterminate')).to.be.true;
    expect(elParentIndeterminate?.hasAttribute('indeterminate')).to.be.true;

    // Act - check all nested checkbox
    elNestedIndeterminate?._subCheckboxes[1]._inputNode.click();
    elNestedIndeterminate?._subCheckboxes[2]._inputNode.click();
    await el.updateComplete;

    // Assert
    expect(elNestedIndeterminate?.hasAttribute('checked')).to.be.true;
    expect(elNestedIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elParentIndeterminate?.hasAttribute('checked')).to.be.false;
    expect(elParentIndeterminate?.hasAttribute('indeterminate')).to.be.true;

    // Act - finally check all remaining checkbox
    elParentIndeterminate?._subCheckboxes[0]._inputNode.click();
    elParentIndeterminate?._subCheckboxes[1]._inputNode.click();
    await el.updateComplete;

    // Assert
    expect(elNestedIndeterminate?.hasAttribute('checked')).to.be.true;
    expect(elNestedIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elParentIndeterminate?.hasAttribute('checked')).to.be.true;
    expect(elParentIndeterminate?.hasAttribute('indeterminate')).to.be.false;
  });

  it('should work as expected if extra html', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (await fixture(html`
      <lion-checkbox-group name="scientists[]">
        <div>
          Let's have some fun
          <div>Hello I'm a div</div>
          <lion-checkbox-indeterminate label="Favorite scientists">
            <div>useless div</div>
            <lion-checkbox slot="checkbox" label="Archimedes"></lion-checkbox>
            <lion-checkbox slot="checkbox" label="Francis Bacon"></lion-checkbox>
            <div>absolutely useless</div>
            <lion-checkbox slot="checkbox" label="Marie Curie"></lion-checkbox>
          </lion-checkbox-indeterminate>
        </div>
        <div>Too much fun, stop it !</div>
      </lion-checkbox-group>
    `));
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector(
      'lion-checkbox-indeterminate',
    ));

    // Act
    elIndeterminate._subCheckboxes[0].checked = true;
    elIndeterminate._subCheckboxes[1].checked = true;
    elIndeterminate._subCheckboxes[2].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?.checked).to.be.true;
  });
});
