import { expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';

/**
 * @typedef {import('../src/LionCheckbox.js').LionCheckbox} LionCheckbox
 * @typedef {import('../src/LionCheckboxIndeterminate.js').LionCheckboxIndeterminate} LionCheckboxIndeterminate
 * @typedef {import('../src/LionCheckboxGroup.js').LionCheckboxGroup} LionCheckboxGroup
 */

/**
 * @param {LionCheckboxIndeterminate} el
 */
function getCheckboxIndeterminateMembers(el) {
  const obj = getFormControlMembers(el);
  return {
    ...obj,
    ...{
      // @ts-ignore [allow-protected] in test
      _subCheckboxes: el._subCheckboxes,
    },
  };
}

/**
 * @param {{tagString?: string, groupTagString?: string, childTagString?: string}} [customConfig]
 */
export function runCheckboxIndeterminateSuite(customConfig) {
  const cfg = {
    tagString: null,
    groupTagString: null,
    childTagString: null,
    ...customConfig,
  };

  /** @type {{_$litStatic$: any}} */
  let tag;
  /** @type {{_$litStatic$: any}} */
  let groupTag;
  /** @type {{_$litStatic$: any}} */
  let childTag;

  before(async () => {
    tag = unsafeStatic(cfg.tagString);
    groupTag = unsafeStatic(cfg.groupTagString);
    childTag = unsafeStatic(cfg.childTagString);
  });

  describe('CheckboxIndeterminate', async () => {
    /** @type {{_$litStatic$: any}} */

    it('should have type = checkbox', async () => {
      // Arrange
      const el = await fixture(html`
        <${tag}
          name="checkbox"
          .choiceValue="${'male'}"
        ></${tag}>
      `);

      // Assert
      expect(el.getAttribute('type')).to.equal('checkbox');
    });

    it('should not be indeterminate by default if all children are unchecked', async () => {
      // Arrange
      const el = await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `);
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${cfg.tagString}`)
      );

      // Assert
      expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    });
  });

  it('should be indeterminate if one child is checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${groupTag} name="scientists[]">
        <${tag} label="Favorite scientists">
          <${childTag} label="Archimedes"></${childTag}>
          <${childTag} label="Francis Bacon" checked></${childTag}>
          <${childTag} label="Marie Curie"></${childTag}>
        </${tag}>
      </${groupTag}>
    `);

    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
  });

  it('should be checked if all children are checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes" checked></${childTag}>
            <${childTag} label="Francis Bacon" checked></${childTag}>
            <${childTag} label="Marie Curie" checked></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?.checked).to.be.true;
  });

  it('should become indeterminate if one child is checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );

    const { _subCheckboxes } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _subCheckboxes[0].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
  });

  it('should become checked if all children are checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _subCheckboxes[0].checked = true;
    _subCheckboxes[1].checked = true;
    _subCheckboxes[2].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?.checked).to.be.true;
  });

  it('should become indeterminate if all children except disabled ones are checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon" disabled></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _subCheckboxes[0].checked = true;
    _subCheckboxes[2].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
    expect(elIndeterminate?.checked).to.be.false;
  });

  it('should sync all children when parent is checked (from indeterminate to checked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon" checked></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate.hasAttribute('indeterminate')).to.be.false;
    expect(_subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[2].hasAttribute('checked')).to.be.true;
  });

  it('should not sync any disabled children when parent is checked (from indeterminate to checked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon" disabled></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate.hasAttribute('indeterminate')).to.be.true;
    expect(_subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[1].hasAttribute('checked')).to.be.false;
    expect(_subCheckboxes[2].hasAttribute('checked')).to.be.true;
  });

  it('should remain unchecked when parent is clicked and all children are disabled', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes" disabled></${childTag}>
            <${childTag} label="Francis Bacon" disabled></${childTag}>
            <${childTag} label="Marie Curie" disabled></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate.hasAttribute('checked')).to.be.false;
    expect(_subCheckboxes[0].hasAttribute('checked')).to.be.false;
    expect(_subCheckboxes[1].hasAttribute('checked')).to.be.false;
    expect(_subCheckboxes[2].hasAttribute('checked')).to.be.false;
  });

  it('should remain checked when parent is clicked and all children are disabled and checked', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes" disabled checked></${childTag}>
            <${childTag} label="Francis Bacon" disabled checked></${childTag}>
            <${childTag} label="Marie Curie" disabled checked></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate.hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[2].hasAttribute('checked')).to.be.true;
  });

  it('should sync all children when parent is checked (from unchecked to checked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes"></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate.hasAttribute('indeterminate')).to.be.false;
    expect(_subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(_subCheckboxes[2].hasAttribute('checked')).to.be.true;
  });

  it('should sync all children when parent is checked (from checked to unchecked)', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} label="Favorite scientists">
            <${childTag} label="Archimedes" checked></${childTag}>
            <${childTag} label="Francis Bacon" checked></${childTag}>
            <${childTag} label="Marie Curie" checked></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _inputNode.click();
    await elIndeterminate.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(_subCheckboxes[0].hasAttribute('checked')).to.be.false;
    expect(_subCheckboxes[1].hasAttribute('checked')).to.be.false;
    expect(_subCheckboxes[2].hasAttribute('checked')).to.be.false;
  });

  it('should work as expected with siblings checkbox-indeterminate', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]" label="Favorite scientists">
          <${tag}
            label="Old Greek scientists"
            id="first-checkbox-indeterminate"
          >
            <${childTag}
              slot="checkbox"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></${childTag}>
            <${childTag} label="Plato" .choiceValue=${'Plato'}></${childTag}>
            <${childTag}
              slot="checkbox"
              label="Pythagoras"
              .choiceValue=${'Pythagoras'}
            ></${childTag}>
          </${tag}>
          <${tag}
            label="17th Century scientists"
            id="second-checkbox-indeterminate"
          >
            <${childTag}
              slot="checkbox"
              label="Isaac Newton"
              .choiceValue=${'Isaac Newton'}
            ></${childTag}>
            <${childTag}
              slot="checkbox"
              label="Galileo Galilei"
              .choiceValue=${'Galileo Galilei'}
            ></${childTag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elFirstIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector('#first-checkbox-indeterminate')
    );

    const elSecondIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector('#second-checkbox-indeterminate')
    );

    const elFirstSubCheckboxes = getCheckboxIndeterminateMembers(elFirstIndeterminate);
    const elSecondSubCheckboxes = getCheckboxIndeterminateMembers(elSecondIndeterminate);

    // Act - check the first sibling
    elFirstSubCheckboxes._inputNode.click();
    await elFirstIndeterminate.updateComplete;
    await elSecondIndeterminate.updateComplete;

    // Assert - the second sibling should not be affected

    expect(elFirstIndeterminate.hasAttribute('indeterminate')).to.be.false;
    expect(elFirstSubCheckboxes._subCheckboxes[0].hasAttribute('checked')).to.be.true;
    expect(elFirstSubCheckboxes._subCheckboxes[1].hasAttribute('checked')).to.be.true;
    expect(elFirstSubCheckboxes._subCheckboxes[2].hasAttribute('checked')).to.be.true;

    expect(elSecondSubCheckboxes._subCheckboxes[0].hasAttribute('checked')).to.be.false;
    expect(elSecondSubCheckboxes._subCheckboxes[1].hasAttribute('checked')).to.be.false;
  });

  it('should work as expected with nested indeterminate checkboxes', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]" label="Favorite scientists">
          <${tag} label="Scientists" id="parent-checkbox-indeterminate">
            <${childTag}
              slot="checkbox"
              label="Isaac Newton"
              .choiceValue=${'Isaac Newton'}
            ></${childTag}>
            <${childTag}
              slot="checkbox"
              label="Galileo Galilei"
              .choiceValue=${'Galileo Galilei'}
            ></${childTag}>
            <${tag}
              slot="checkbox"
              label="Old Greek scientists"
              id="nested-checkbox-indeterminate"
            >
              <${childTag}
                slot="checkbox"
                label="Archimedes"
                .choiceValue=${'Archimedes'}
              ></${childTag}>
              <${childTag} label="Plato" .choiceValue=${'Plato'}></${childTag}>
              <${childTag}
                slot="checkbox"
                label="Pythagoras"
                .choiceValue=${'Pythagoras'}
              ></${childTag}>
            </${tag}>
          </${tag}>
        </${groupTag}>
      `)
    );
    const elNestedIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector('#nested-checkbox-indeterminate')
    );
    const elParentIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector('#parent-checkbox-indeterminate')
    );
    const elNestedSubCheckboxes = getCheckboxIndeterminateMembers(elNestedIndeterminate);
    const elParentSubCheckboxes = getCheckboxIndeterminateMembers(elParentIndeterminate);

    // Act - check a nested checkbox
    if (elNestedIndeterminate) {
      // @ts-ignore [allow-protected] in test
      elNestedSubCheckboxes._subCheckboxes[0]._inputNode.click();
    }
    await el.updateComplete;

    // Assert
    expect(elNestedIndeterminate?.hasAttribute('indeterminate')).to.be.true;
    expect(elParentIndeterminate?.hasAttribute('indeterminate')).to.be.true;

    // Act - check all nested checkbox
    // @ts-ignore [allow-protected] in test
    if (elNestedIndeterminate) elNestedSubCheckboxes._subCheckboxes[1]._inputNode.click();
    // @ts-ignore [allow-protected] in test
    if (elNestedIndeterminate) elNestedSubCheckboxes._subCheckboxes[2]._inputNode.click();
    await el.updateComplete;

    // Assert
    expect(elNestedIndeterminate?.hasAttribute('checked')).to.be.true;
    expect(elNestedIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elParentIndeterminate?.hasAttribute('checked')).to.be.false;
    expect(elParentIndeterminate?.hasAttribute('indeterminate')).to.be.true;

    // Act - finally check all remaining checkbox
    if (elParentIndeterminate) {
      // @ts-ignore [allow-protected] in test
      elParentSubCheckboxes._subCheckboxes[0]._inputNode.click();
    }
    if (elParentIndeterminate) {
      // @ts-ignore [allow-protected] in test
      elParentSubCheckboxes._subCheckboxes[1]._inputNode.click();
    }
    await el.updateComplete;

    // Assert
    expect(elNestedIndeterminate?.hasAttribute('checked')).to.be.true;
    expect(elNestedIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elParentIndeterminate?.hasAttribute('checked')).to.be.true;
    expect(elParentIndeterminate?.hasAttribute('indeterminate')).to.be.false;
  });

  it('should work as expected if extra html', async () => {
    // Arrange
    const el = /**  @type {LionCheckboxGroup} */ (
      await fixture(html`
        <${groupTag} name="scientists[]">
          <div>
            Let's have some fun
            <div>Hello I'm a div</div>
            <${tag} label="Favorite scientists">
              <div>useless div</div>
              <${childTag} label="Archimedes"></${childTag}>
              <${childTag} label="Francis Bacon"></${childTag}>
              <div>absolutely useless</div>
              <${childTag} label="Marie Curie"></${childTag}>
            </${tag}>
          </div>
          <div>Too much fun, stop it !</div>
        </${groupTag}>
      `)
    );
    const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
      el.querySelector(`${cfg.tagString}`)
    );
    const { _subCheckboxes } = getCheckboxIndeterminateMembers(elIndeterminate);

    // Act
    _subCheckboxes[0].checked = true;
    _subCheckboxes[1].checked = true;
    _subCheckboxes[2].checked = true;
    await el.updateComplete;

    // Assert
    expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    expect(elIndeterminate?.checked).to.be.true;
  });

  // https://www.w3.org/TR/wai-aria-practices-1.1/examples/checkbox/checkbox-2/checkbox-2.html
  describe('mixed-state', () => {
    it('can have a mixed-state (using mixed-state attribute), none -> indeterminate -> all, cycling through', async () => {
      const el = await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} mixed-state label="Favorite scientists">
            <${childTag} label="Archimedes" checked></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `);
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${cfg.tagString}`)
      );

      expect(elIndeterminate.mixedState).to.be.true;
      expect(elIndeterminate.checked).to.be.false;
      expect(elIndeterminate.indeterminate).to.be.true;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.true;
      expect(elIndeterminate.indeterminate).to.be.false;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.false;
      expect(elIndeterminate.indeterminate).to.be.false;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.false;
      expect(elIndeterminate.indeterminate).to.be.true;
    });

    it('should reset to old child checkbox states when reaching indeterminate state', async () => {
      const el = await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} mixed-state label="Favorite scientists">
            <${childTag} label="Archimedes" checked></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `);
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${cfg.tagString}`)
      );
      const checkboxEls = /** @type {LionCheckbox[]} */ (
        Array.from(el.querySelectorAll(`${cfg.childTagString}`))
      );

      expect(checkboxEls.map(checkboxEl => checkboxEl.checked)).to.eql([true, false, false]);

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(checkboxEls.map(checkboxEl => checkboxEl.checked)).to.eql([true, true, true]);

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(checkboxEls.map(checkboxEl => checkboxEl.checked)).to.eql([false, false, false]);

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(checkboxEls.map(checkboxEl => checkboxEl.checked)).to.eql([true, false, false]);
    });

    it('should no longer reach indeterminate state if the child boxes are all checked or all unchecked during indeterminate state', async () => {
      const el = await fixture(html`
        <${groupTag} name="scientists[]">
          <${tag} mixed-state label="Favorite scientists">
            <${childTag} label="Archimedes" checked></${childTag}>
            <${childTag} label="Francis Bacon"></${childTag}>
            <${childTag} label="Marie Curie"></${childTag}>
          </${tag}>
        </${groupTag}>
      `);
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${cfg.tagString}`)
      );
      const checkboxEls = /** @type {LionCheckbox[]} */ (
        Array.from(el.querySelectorAll(`${cfg.childTagString}`))
      );

      // Check when all child boxes in indeterminate state are unchecked
      // we don't have a tri-state, but a duo-state.

      // @ts-ignore for testing purposes, we access this protected getter
      checkboxEls[0]._inputNode.click();
      await elIndeterminate.updateComplete;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.true;
      expect(elIndeterminate.indeterminate).to.be.false;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.false;
      expect(elIndeterminate.indeterminate).to.be.false;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.true;
      expect(elIndeterminate.indeterminate).to.be.false;

      // Check when all child boxes in indeterminate state are getting checked
      // we also don't have a tri-state, but a duo-state.

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click(); // unchecked
      await elIndeterminate.updateComplete;
      for (const checkEl of checkboxEls) {
        // @ts-ignore for testing purposes, we access this protected getter
        checkEl._inputNode.click();
        // Give each checking of the sub checkbox a chance to finish updating
        // This means indeterminate state will be true for a bit and the state gets stored
        await checkEl.updateComplete;
        await elIndeterminate.updateComplete;
      }

      expect(elIndeterminate.checked).to.be.true;
      expect(elIndeterminate.indeterminate).to.be.false;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.false;
      expect(elIndeterminate.indeterminate).to.be.false;

      // @ts-ignore for testing purposes, we access this protected getter
      elIndeterminate._inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.true;
      expect(elIndeterminate.indeterminate).to.be.false;
    });
  });
}
