import { describe, it, expect } from 'vitest';
import { fixture, html } from '../../../test-helpers.js';
import '@lion/ui/define/lion-button.js';

/**
 * Example test file showing Vitest migration patterns
 * This demonstrates the new import structure and testing approach
 */

describe('Example Vitest Test', () => {
  it('can create a fixture', async () => {
    const el = await fixture(html` <lion-button>Click me</lion-button> `);

    expect(el).toBeDefined();
    expect(el.tagName.toLowerCase()).toBe('lion-button');
  });

  it('can test component properties', async () => {
    const el = await fixture(html` <lion-button disabled>Disabled Button</lion-button> `);

    expect(el.disabled).toBe(true);
  });

  it('can test component content', async () => {
    const el = await fixture(html` <lion-button>Test Content</lion-button> `);

    expect(el.textContent?.trim()).toBe('Test Content');
  });
});
