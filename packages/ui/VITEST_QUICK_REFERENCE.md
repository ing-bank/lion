# Vitest Quick Reference for @lion/ui

## 🚀 Quick Start

```bash
# From packages/ui directory
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run debug         # Debug with UI
```

## 📝 Test File Template

```javascript
import { describe, it } from 'vitest';
import { expect, fixture, html } from '../../test-helpers.js';
import { sendKeys } from '../../test-helpers.js';  // If needed
import '@lion/ui/define/lion-component.js';

describe('Component Name', () => {
  it('should do something', async () => {
    const el = await fixture(html`
      <lion-component></lion-component>
    `);
    
    expect(el).toBeDefined();
  });
});
```

## 🔄 Import Changes

### Before (WTR):
```javascript
import { expect, fixture } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
```

### After (Vitest):
```javascript
import { describe, it } from 'vitest';
import { expect, fixture, sendKeys } from '../../test-helpers.js';
```

## 🧪 Available Test Helpers

From `test-helpers.js`:
- `expect` - Vitest assertions
- `fixture` - Create test fixtures
- `fixtureSync` - Synchronous fixture
- `html` - Lit HTML template tag
- `unsafeStatic` - Dynamic tag names
- `defineCE` - Define custom element
- `elementUpdated` - Wait for updates
- `oneEvent` - Wait for single event
- `triggerBlurFor` - Trigger blur
- `triggerFocusFor` - Trigger focus
- `aTimeout` - Async timeout
- `nextFrame` - Wait for next frame
- `waitUntil` - Wait for condition
- `sendKeys` - Send keyboard input
- `setViewport` - Set viewport size

## 🎮 Common Patterns

### Basic Component Test
```javascript
it('renders correctly', async () => {
  const el = await fixture(html`<lion-button>Click</lion-button>`);
  expect(el.textContent).toBe('Click');
});
```

### Testing Properties
```javascript
it('handles disabled state', async () => {
  const el = await fixture(html`<lion-button disabled></lion-button>`);
  expect(el.disabled).toBe(true);
});
```

### Testing Events
```javascript
it('emits events', async () => {
  const el = await fixture(html`<lion-button>Click</lion-button>`);
  const handler = vi.fn();
  el.addEventListener('click', handler);
  el.click();
  expect(handler).toHaveBeenCalledTimes(1);
});
```

### Keyboard Interaction
```javascript
it('handles keyboard input', async () => {
  const el = await fixture(html`<lion-input></lion-input>`);
  el.focus();
  await sendKeys({ type: 'hello' });
  expect(el.value).toBe('hello');
});
```

### Waiting for Updates
```javascript
it('updates correctly', async () => {
  const el = await fixture(html`<lion-component></lion-component>`);
  el.value = 'new value';
  await elementUpdated(el);
  expect(el.value).toBe('new value');
});
```

## 🔍 Debugging

### Run Specific Test
```bash
npm test -- components/button/test/lion-button.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --grep "button"
```

### Debug Single Test
Add `.only` to focus on one test:
```javascript
it.only('should debug this test', async () => {
  // Only this test will run
});
```

### Skip Tests
```javascript
it.skip('should skip this test', async () => {
  // This test will be skipped
});
```

## 📊 Coverage

View coverage report:
```bash
npm test
# Coverage report: ../../coverage/index.html
```

Check coverage thresholds:
- Statements: 95%
- Branches: 95%
- Functions: 95%
- Lines: 95%

## 🛠️ Troubleshooting

### "Cannot find module test-helpers.js"
- Check relative path depth: `../../test-helpers.js`
- From `components/button/test/` → `../../test-helpers.js`
- From `components/form/validation/test/` → `../../../test-helpers.js`

### "describe is not defined"
- Add: `import { describe, it } from 'vitest';`

### "fixture is not defined"
- Add: `import { fixture } from '../../test-helpers.js';`

### Timeout errors
- Increase timeout: `it('test', { timeout: 10000 }, async () => { ... });`
- Or globally in `vitest.config.js`

## 🎯 Key Differences from WTR

| Feature | WTR | Vitest |
|---------|-----|--------|
| Import source | `@open-wc/testing` | `test-helpers.js` |
| Test globals | Auto-imported | Must import `describe`/`it` |
| Coverage | Istanbul | V8 |
| UI | None | `npm run debug` |
| Watch mode | Basic | Advanced |

## 💡 Tips

1. **Use globals**: Config has `globals: true`, so `describe`/`it` are available globally (but explicit imports are clearer)
2. **Parallel tests**: Vitest runs tests in parallel by default
3. **Fast refresh**: Watch mode is very fast, use it!
4. **UI mode**: Debug mode (`npm run debug`) is incredibly helpful
5. **Coverage**: Run tests with coverage to ensure high quality

## 📚 Learn More

- Full migration guide: `VITEST_MIGRATION.md`
- Migration summary: `MIGRATION_SUMMARY.md`
- Example test: `components/_examples/vitest-example.test.js`
