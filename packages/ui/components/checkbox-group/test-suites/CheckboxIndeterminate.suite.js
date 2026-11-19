import { aTimeout, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import { getFormControlMembers } from '@lion/ui/form-core-test-helpers.js';
import {
  LionCheckbox,
  LionCheckboxGroup,
  LionCheckboxIndeterminate,
} from '@lion/ui/checkbox-group.js';
import { resolveSuiteTag } from '../../core/test-helpers/resolveSuiteTag.js';

/**
 * @typedef {import('@lion/ui/types/test-suites.js').SuiteElement} SuiteElement
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
 * `tagString`, `klass` and the older role tag keys are deprecated: pass `classes` instead (Lion
 * itself uses `classes` everywhere).
 * @param {import('@lion/ui/types/test-suites.js').SuiteConfig<{'checkbox-group': SuiteElement; checkbox: SuiteElement; host: SuiteElement}, {childTagString?: any; groupTagString?: any}>} [customConfig]
 */
export function runCheckboxIndeterminateSuite({
  classes: {
    host: hostEl = LionCheckboxIndeterminate,
    'checkbox-group': groupEl = LionCheckboxGroup,
    checkbox: childEl = LionCheckbox,
  } = {},
  tagString: legacyTagString,
  groupTagString: legacyGroupTagString,
  childTagString: legacyChildTagString,
} = {}) {
  const tagString = resolveSuiteTag(hostEl, legacyTagString);
  const groupTagString = resolveSuiteTag(groupEl, legacyGroupTagString);
  const childTagString = resolveSuiteTag(childEl, legacyChildTagString);

  const tags = {
    host: unsafeStatic(tagString),
    'checkbox-group': unsafeStatic(groupTagString),
    checkbox: unsafeStatic(childTagString),
  };

  describe('CheckboxIndeterminate', async () => {
    /** @type {{_$litStatic$: any}} */

    it('should have type = checkbox', async () => {
      // Arrange
      const el = await fixture(html`
        <${tags.host}
          name="checkbox"
          .choiceValue="${'male'}"
        ></${tags.host}>
      `);

      // Assert
      expect(el.getAttribute('type')).to.equal('checkbox');
    });

    it('should not be indeterminate by default if all children are unchecked', async () => {
      // Arrange
      const el = await fixture(html`
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `);
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );

      // Assert
      expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
    });

    it('should be indeterminate if one child is checked', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
          <${tags.checkbox} label="Francis Bacon" checked></${tags.checkbox}>
          <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );
      // Assert
      expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
    });

    it('should be checked if all children are checked', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" checked></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie" checked></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );

      // Assert
      expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
      expect(elIndeterminate?.checked).to.be.true;
    });

    it('should become indeterminate if one child is checked', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" disabled></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );
      const { _subCheckboxes } = getCheckboxIndeterminateMembers(elIndeterminate);

      // Act
      _subCheckboxes[0].checked = true;
      _subCheckboxes[2].checked = true;
      await el.updateComplete;

      // Assert
      expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.true;
      expect(elIndeterminate?.checked).to.be.true;
    });

    it('should be checked when all children are prechecked', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
          <${tags.checkbox} checked label="Francis Bacon"></${tags.checkbox}>
          <${tags.checkbox} checked label="Marie Curie"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );

      // Assert
      expect(elIndeterminate?.hasAttribute('checked')).to.be.true;
    });

    it('should be checked when it has one prechecked child', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );

      // Assert
      expect(elIndeterminate?.hasAttribute('checked')).to.be.true;
    });

    it('should be unchecked when it has an disabled checked child and an unchecked child', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} disabled checked label="Archimedes"></${tags.checkbox}>
          <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );

      // Assert
      expect(elIndeterminate?.hasAttribute('checked')).to.be.false;
    });

    it('should be indeterminated when some of the children are prechecked', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
          <${tags.checkbox} checked label="Francis Bacon"></${tags.checkbox}>
          <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );

      // Assert
      expect(elIndeterminate.hasAttribute('indeterminate')).to.be.true;
    });

    it('should sync all children when parent is checked (from indeterminate to checked)', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" checked></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" disabled></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" disabled></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" disabled></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie" disabled></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" disabled checked></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" disabled checked></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie" disabled checked></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon" checked></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie" checked></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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

    it('should sync all prechecked children when parent is indeterminate and some of the children are disabled (from checked to unchecked)', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} disabled label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} checked label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );
      const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

      // Act
      _inputNode.click();
      await elIndeterminate.updateComplete;

      // Assert
      expect(elIndeterminate?.hasAttribute('indeterminate')).to.be.false;
      expect(_inputNode?.hasAttribute('indeterminate')).to.be.false;
      expect(_subCheckboxes[0].hasAttribute('checked')).to.be.false;
      expect(_subCheckboxes[1].hasAttribute('checked')).to.be.false;
      expect(_subCheckboxes[2].hasAttribute('checked')).to.be.false;
    });

    it('should stay as indeterminated after it is clicked, when it is interminated already and some children are disabled', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} label="Favorite scientists">
            <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
            <${tags.checkbox} disabled label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );
      const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);

      // Act
      _inputNode.click();
      await elIndeterminate.updateComplete;

      // Assert
      expect(elIndeterminate.hasAttribute('indeterminate')).to.be.true;
      expect(_inputNode.indeterminate).to.be.true;
      expect(_subCheckboxes[0].hasAttribute('checked')).to.be.true;
      expect(_subCheckboxes[2].hasAttribute('checked')).to.be.true;
    });

    it('should work as expected with siblings checkbox-indeterminate', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]" label="Favorite scientists">
          <${tags.host}
            label="Old Greek scientists"
            id="first-checkbox-indeterminate"
          >
            <${tags.checkbox}
              slot="checkbox"
              label="Archimedes"
              .choiceValue=${'Archimedes'}
            ></${tags.checkbox}>
            <${tags.checkbox} label="Plato" .choiceValue=${'Plato'}></${tags.checkbox}>
            <${tags.checkbox}
              slot="checkbox"
              label="Pythagoras"
              .choiceValue=${'Pythagoras'}
            ></${tags.checkbox}>
          </${tags.host}>
          <${tags.host}
            label="17th Century scientists"
            id="second-checkbox-indeterminate"
          >
            <${tags.checkbox}
              slot="checkbox"
              label="Isaac Newton"
              .choiceValue=${'Isaac Newton'}
            ></${tags.checkbox}>
            <${tags.checkbox}
              slot="checkbox"
              label="Galileo Galilei"
              .choiceValue=${'Galileo Galilei'}
            ></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
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

    it('should work as expected when new checkbox was added', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
          <${tags.checkbox} checked label="Francis Bacon" checked></${tags.checkbox}>
          <${tags.checkbox} checked label="Marie Curie"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );
      expect(elIndeterminate.hasAttribute('indeterminate')).to.be.false;

      // Act
      const newChild = document.createElement(/** @type {string} */ (childTagString));
      elIndeterminate.appendChild(newChild);
      await elIndeterminate.updateComplete;

      // Assert
      expect(elIndeterminate.hasAttribute('indeterminate')).to.be.true;
    });

    it('should work as expected when an existing checkbox was removed', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="Favorite scientists">
          <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
          <${tags.checkbox} checked label="Francis Bacon" checked></${tags.checkbox}>
          <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);

      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
      );
      expect(elIndeterminate.hasAttribute('indeterminate')).to.be.true;
      expect(elIndeterminate.checked).to.be.false;

      // Act: remove the only unchecked child, so all remaining children are checked
      const uncheckedChild = /** @type {LionCheckbox} */ (
        elIndeterminate.querySelector(`${childTagString}[label="Marie Curie"]`)
      );
      uncheckedChild.remove();
      await aTimeout(0);
      await elIndeterminate.updateComplete;

      // Assert
      const { _subCheckboxes, _inputNode } = getCheckboxIndeterminateMembers(elIndeterminate);
      expect(_subCheckboxes).to.not.include(uncheckedChild);
      expect(_subCheckboxes.length).to.equal(2);
      expect(elIndeterminate.indeterminate).to.be.false;
      expect(elIndeterminate.hasAttribute('indeterminate')).to.be.false;
      expect(elIndeterminate.checked).to.be.true;

      // Toggling the parent no longer touches the removed child
      _inputNode.click();
      await elIndeterminate.updateComplete;
      expect(elIndeterminate.checked).to.be.false;
      expect(_subCheckboxes.every(checkbox => !checkbox.checked)).to.be.true;
      expect(uncheckedChild.checked).to.be.false;
    });

    it('updates its state when a nested child of a nested indeterminate checkbox is removed', async () => {
      const el = /**  @type {LionCheckboxGroup} */ await fixture(html`
      <${tags['checkbox-group']} name="scientists[]">
        <${tags.host} label="All" id="outer">
          <${tags.checkbox} checked label="Archimedes"></${tags.checkbox}>
          <${tags.host} label="Nested" id="nested">
            <${tags.checkbox} checked label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags.host}>
      </${tags['checkbox-group']}>
    `);
      const outer = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector('#outer'));
      const nested = /**  @type {LionCheckboxIndeterminate} */ (el.querySelector('#nested'));
      expect(outer.indeterminate).to.be.true;
      expect(nested.indeterminate).to.be.true;

      /** @type {LionCheckbox} */ (
        nested.querySelector(`${childTagString}[label="Marie Curie"]`)
      ).remove();
      await aTimeout(0);
      await outer.updateComplete;

      expect(nested.indeterminate).to.be.false;
      expect(nested.checked).to.be.true;
      expect(outer.indeterminate).to.be.false;
      expect(outer.checked).to.be.true;
    });

    it('should work as expected with nested indeterminate checkboxes', async () => {
      // Arrange
      const el = /**  @type {LionCheckboxGroup} */ (
        await fixture(html`
        <${tags['checkbox-group']} name="scientists[]" label="Favorite scientists">
          <${tags.host} label="Scientists" id="parent-checkbox-indeterminate">
            <${tags.checkbox}
              slot="checkbox"
              label="Isaac Newton"
              .choiceValue=${'Isaac Newton'}
            ></${tags.checkbox}>
            <${tags.checkbox}
              slot="checkbox"
              label="Galileo Galilei"
              .choiceValue=${'Galileo Galilei'}
            ></${tags.checkbox}>
            <${tags.host}
              slot="checkbox"
              label="Old Greek scientists"
              id="nested-checkbox-indeterminate"
            >
              <${tags.checkbox}
                slot="checkbox"
                label="Archimedes"
                .choiceValue=${'Archimedes'}
              ></${tags.checkbox}>
              <${tags.checkbox} label="Plato" .choiceValue=${'Plato'}></${tags.checkbox}>
              <${tags.checkbox}
                slot="checkbox"
                label="Pythagoras"
                .choiceValue=${'Pythagoras'}
              ></${tags.checkbox}>
            </${tags.host}>
          </${tags.host}>
        </${tags['checkbox-group']}>
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
        <${tags['checkbox-group']} name="scientists[]">
          <div>
            Let's have some fun
            <div>Hello I'm a div</div>
            <${tags.host} label="Favorite scientists">
              <div>useless div</div>
              <${tags.checkbox} label="Archimedes"></${tags.checkbox}>
              <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
              <div>absolutely useless</div>
              <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
            </${tags.host}>
          </div>
          <div>Too much fun, stop it !</div>
        </${tags['checkbox-group']}>
      `)
      );
      const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
        el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} mixed-state label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `);
        const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
          el.querySelector(`${tagString}`)
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} mixed-state label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `);
        const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
          el.querySelector(`${tagString}`)
        );
        const checkboxEls = /** @type {LionCheckbox[]} */ (
          Array.from(el.querySelectorAll(`${childTagString}`))
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
        <${tags['checkbox-group']} name="scientists[]">
          <${tags.host} mixed-state label="Favorite scientists">
            <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
            <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
            <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
          </${tags.host}>
        </${tags['checkbox-group']}>
      `);
        const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
          el.querySelector(`${tagString}`)
        );
        const checkboxEls = /** @type {LionCheckbox[]} */ (
          Array.from(el.querySelectorAll(`${childTagString}`))
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

    describe('accessibility', () => {
      it('is accessible', async () => {
        const el = /** @type {LionCheckboxGroup} */ (
          await fixture(html`
            <${tags['checkbox-group']} name="scientists[]">
              <${tags.host} label="Favorite scientists">
                <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
                <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
                <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
              </${tags.host}>
            </${tags['checkbox-group']}>
          `)
        );
        await expect(el).to.be.accessible();
      });

      it('has role="list" and its children role="listitem"', async () => {
        const el = await fixture(html`
          <${tags['checkbox-group']} name="scientists[]">
            <${tags.host} label="Favorite scientists">
              <${tags.checkbox} label="Archimedes" checked></${tags.checkbox}>
              <${tags.checkbox} label="Francis Bacon"></${tags.checkbox}>
              <${tags.checkbox} label="Marie Curie"></${tags.checkbox}>
            </${tags.host}>
          </${tags['checkbox-group']}>
        `);
        const elIndeterminate = /**  @type {LionCheckboxIndeterminate} */ (
          el.querySelector(`${tagString}`)
        );

        expect(
          elIndeterminate.shadowRoot
            ?.querySelector('.choice-field__nested-checkboxes')
            ?.getAttribute('role'),
        ).to.equal('list');
        expect(elIndeterminate.children[0].getAttribute('role')).to.equal('listitem');
      });
    });
  });
}
