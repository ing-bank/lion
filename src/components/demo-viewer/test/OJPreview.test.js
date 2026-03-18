import { expect, fixture as _fixture, html, aTimeout } from '@open-wc/testing';
import { OJPreview } from '../OJPreview/OJPreview.js';

/**
 * @typedef {import('../OJPreview/OJPreview.js').OJPreview} OJPreviewType
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

// Register OJPreview as a custom element for testing
if (!customElements.get('oj-preview')) {
  customElements.define('oj-preview', OJPreview);
}

const fixture = /** @type {(arg: TemplateResult) => Promise<OJPreviewType>} */ (_fixture);

describe('OJPreview', () => {
  describe('class instantiation', () => {
    it('creates an instance of the class', () => {
      const el = new OJPreview();

      expect(el).to.be.instanceOf(OJPreview);
    });

    it('initializes with default property values', () => {
      const el = new OJPreview();

      expect(el.darkModePref).to.equal('auto');
      expect(el.themePref).to.equal('auto');
      expect(el.devicePref).to.equal('auto');
      expect(el.surfacePref).to.equal('default');
      expect(el.isExpressive).to.be.false;
      expect(el.modifiers).to.be.an('object');
      expect(el._shouldShowModifierCombinator).to.be.false;
      expect(el._shouldShowCodePreview).to.be.false;
      expect(el._shouldShowModifierCombinationsMatrix).to.be.false;
    });

    it('initializes with zero modifier combinations', () => {
      const el = new OJPreview();

      expect(el.__amountOfModifierCombinations).to.equal(0);
    });
  });

  describe('property setters', () => {
    it('sets and gets themePref property', () => {
      const el = new OJPreview();

      el.themePref = 'retail';
      expect(el.themePref).to.equal('retail');

      el.themePref = 'legacy';
      expect(el.themePref).to.equal('legacy');
    });

    it('sets and gets darkModePref property', () => {
      const el = new OJPreview();

      el.darkModePref = 'dark';
      expect(el.darkModePref).to.equal('dark');

      el.darkModePref = 'light';
      expect(el.darkModePref).to.equal('light');
    });

    it('sets and gets devicePref property', () => {
      const el = new OJPreview();

      el.devicePref = 'mobile';
      expect(el.devicePref).to.equal('mobile');

      el.devicePref = 'desktop';
      expect(el.devicePref).to.equal('desktop');
    });

    it('sets and gets surfacePref property', () => {
      const el = new OJPreview();

      el.surfacePref = 'primary';
      expect(el.surfacePref).to.equal('primary');

      el.surfacePref = 'secondary';
      expect(el.surfacePref).to.equal('secondary');
    });

    it('sets and gets mdjsStoryName property', () => {
      const el = new OJPreview();

      el.mdjsStoryName = 'ButtonExpressive';
      expect(el.mdjsStoryName).to.equal('ButtonExpressive');
    });
  });

  describe('rendering methods', () => {
    it('renderSingleChoice creates a TemplateResult with radio buttons', () => {
      const el = new OJPreview();

      const result = el.renderSingleChoice({
        choices: ['option1', 'option2', 'option3'],
        name: 'testGroup',
        modelV: 'option1',
      });

      // Verify it returns a Lit TemplateResult
      expect(result.strings).to.be.an('array');
      expect(result.values).to.be.an('array');
    });

    it('renderMultiChoice creates a TemplateResult with checkboxes', () => {
      const el = new OJPreview();

      const result = el.renderMultiChoice({
        choices: ['option1', 'option2', 'option3'],
        name: 'testGroup',
        modelV: ['option1', 'option2'],
      });

      expect(result.strings).to.be.an('array');
      expect(result.values).to.be.an('array');
    });

    it('renderSelect creates a TemplateResult with select element', () => {
      const el = new OJPreview();

      const result = el.renderSelect({
        choices: ['option1', 'option2', 'option3'],
        name: 'testSelect',
        modelV: ['option1'],
      });

      expect(result.strings).to.be.an('array');
      expect(result.values).to.be.an('array');
    });
  });

  describe('static methods', () => {
    it('_isLionEl identifies lion-prefixed elements', () => {
      const lionEl = document.createElement('lion-button');
      const ingEl = document.createElement('ing-button');
      const divEl = document.createElement('div');

      expect(OJPreview._isLionEl(lionEl)).to.be.true;
      expect(OJPreview._isLionEl(ingEl)).to.be.true;
      expect(OJPreview._isLionEl(divEl)).to.be.false;
    });
  });

  describe('internal state management', () => {
    it('can toggle visibility of modifier combinator', () => {
      const el = new OJPreview();

      expect(el._shouldShowModifierCombinator).to.be.false;
      el._shouldShowModifierCombinator = true;
      expect(el._shouldShowModifierCombinator).to.be.true;
    });

    it('can toggle visibility of code preview', () => {
      const el = new OJPreview();

      expect(el._shouldShowCodePreview).to.be.false;
      el._shouldShowCodePreview = true;
      expect(el._shouldShowCodePreview).to.be.true;
    });

    it('can toggle visibility of modifier combinations matrix', () => {
      const el = new OJPreview();

      expect(el._shouldShowModifierCombinationsMatrix).to.be.false;
      el._shouldShowModifierCombinationsMatrix = true;
      expect(el._shouldShowModifierCombinationsMatrix).to.be.true;
    });
  });

  describe('property validation', () => {
    it('supports all expected theme values', () => {
      const el = new OJPreview();
      const themes = ['auto', 'legacy', 'retail', 'youth', 'business', 'private', 'wholesale', 'wireframe'];

      for (const theme of themes) {
        el.themePref = theme;
        expect(el.themePref).to.equal(theme);
      }
    });

    it('supports all expected device values', () => {
      const el = new OJPreview();
      const devices = ['auto', 'mobile', 'desktop'];

      for (const device of devices) {
        el.devicePref = device;
        expect(el.devicePref).to.equal(device);
      }
    });

    it('supports all expected dark mode values', () => {
      const el = new OJPreview();
      const modes = ['auto', 'light', 'dark'];

      for (const mode of modes) {
        el.darkModePref = mode;
        expect(el.darkModePref).to.equal(mode);
      }
    });

    it('supports all expected surface values', () => {
      const el = new OJPreview();
      const surfaces = [
        'default',
        'primary',
        'secondary',
        'tertiary',
        'quaternary',
        'neutral',
        'inverse',
      ];

      for (const surface of surfaces) {
        el.surfacePref = surface;
        expect(el.surfacePref).to.equal(surface);
      }
    });
  });

  describe('checkIfExpressive method', () => {
    it('sets isExpressive to true when story name contains "expressive"', () => {
      const el = new OJPreview();
      el.mdjsStoryName = 'ButtonExpressive';

      el.checkIfExpressive();

      expect(el.isExpressive).to.be.true;
    });

    it('sets isExpressive to false when story name contains "noexpressive"', () => {
      const el = new OJPreview();
      el.mdjsStoryName = 'ButtonNoExpressive';

      el.checkIfExpressive();

      expect(el.isExpressive).to.be.false;
    });
  });
});
