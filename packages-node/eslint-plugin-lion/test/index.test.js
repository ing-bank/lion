import { RuleTester } from 'eslint';
import { noForcedLayoutReadsRule } from '../src/rules/no-forced-layout-reads.js';
import { preferCheckVisibilityRule } from '../src/rules/prefer-check-visibility.js';
import { preferCssContainmentRule } from '../src/rules/prefer-css-containment.js';

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
});

describe('eslint-plugin-lion', () => {
  describe('no-forced-layout-reads', () => {
    ruleTester.run('no-forced-layout-reads', noForcedLayoutReadsRule, {
      invalid: [
        {
          code: 'for (let i = 0; i < items.length; i++) { const w = el.offsetWidth; }',
          errors: [{ messageId: 'inLoop' }],
        },
        {
          code: 'items.forEach(item => { const rect = el.getBoundingClientRect(); });',
          errors: [{ messageId: 'inLoop' }],
        },
        {
          code: 'el.style.width = "100px"; const w = el.offsetWidth;',
          errors: [{ messageId: 'postMutation' }],
        },
        {
          code: 'el.style.height = "50px"; const rect = el.getBoundingClientRect();',
          errors: [{ messageId: 'postMutation' }],
        },
      ],
      valid: [
        {
          code: 'const w = el.offsetWidth; el.style.width = w + "px";',
        },
        {
          code: 'const rect = el.getBoundingClientRect(); requestAnimationFrame(() => { el.style.width = rect.width + "px"; });',
        },
      ],
    });
  });

  describe('prefer-check-visibility', () => {
    ruleTester.run('prefer-check-visibility', preferCheckVisibilityRule, {
      invalid: [
        {
          code: 'if (el.offsetWidth) { console.log("visible"); }',
          errors: [{ messageId: 'preferCheckVisibility' }],
        },
        {
          code: 'const isVis = !!el.offsetHeight;',
          errors: [{ messageId: 'preferCheckVisibility' }],
        },
        {
          code: 'if (el.getClientRects()) { console.log("visible"); }',
          errors: [{ messageId: 'preferCheckVisibility' }],
        },
      ],
      valid: [
        {
          code: 'if (el.checkVisibility()) { console.log("visible"); }',
        },
        {
          code: 'const width = el.offsetWidth;',
        },
      ],
    });
  });

  describe('prefer-css-containment', () => {
    ruleTester.run('prefer-css-containment', preferCssContainmentRule, {
      invalid: [
        {
          code: 'class MyOverlayComponent { static get styles() { return [ css`:host { display: block; }` ]; } }',
          errors: [{ messageId: 'missingContainment' }],
        },
      ],
      valid: [
        {
          code: 'class MyOverlayComponent { static get styles() { return [ css`:host { display: block; contain: layout; }` ]; } }',
        },
        {
          code: 'class RegularButton { static get styles() { return [ css`:host { display: inline-block; }` ]; } }',
        },
      ],
    });
  });
});
