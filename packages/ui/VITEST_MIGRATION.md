# Vitest Migration for @lion/ui

This document describes the migration from Web Test Runner (WTR) to Vitest for the @lion/ui package.

## Overview

The @lion/ui package has been migrated to use Vitest with browser mode for testing. This provides:
- Faster test execution
- Better developer experience with Vitest UI
- Native browser testing support via Playwright
- Improved watch mode
- Better IDE integration

## Configuration

### Vitest Config (`vitest.config.js`)

The configuration includes:
- **Browser mode**: Tests run in real browsers (Chromium, Firefox, WebKit) via Playwright
- **Coverage**: V8 coverage provider with 95% thresholds
- **Timeouts**: 5s for tests, 10s for hooks
- **Setup files**: Loads scoped custom element registry polyfill

### Test Helpers (`test-helpers.js`)

Provides compatibility layer for:
- `@open-wc/testing` utilities (fixture, expect, html, etc.)
- `@web/test-runner-commands` (sendKeys, setViewport) mapped to Playwright APIs

## Running Tests

From the root directory:
```bash
# Run all tests (WTR for other packages, Vitest for @lion/ui)
npm test

# Run only @lion/ui tests
npm run test:browser:ui

# Or from packages/ui directory:
cd packages/ui
npm test                 # Run tests once
npm run test:watch       # Watch mode
npm run debug            # Debug with UI in Chromium
npm run debug:firefox    # Debug with UI in Firefox
npm run debug:webkit     # Debug with UI in WebKit
```

## Migration Guide

### For New Test Files

Import from the test helpers:
```javascript
import { describe, it } from 'vitest';
import { expect, fixture, html } from '../../test-helpers.js';
import { sendKeys } from '../../test-helpers.js';
```

### For Existing Test Files

A migration script is available to update imports automatically:
```bash
cd packages/ui
node scripts/update-test-imports.js
```

This replaces:
- `@open-wc/testing` → `../../test-helpers.js`
- `@web/test-runner-commands` → `../../test-helpers.js`
- Adds `describe` and `it` imports from `vitest`

### Manual Updates Required

Some patterns may need manual adjustment:
1. **Globals**: Vitest has `globals: true` enabled, so `describe`/`it` are available globally
2. **Async fixtures**: Already supported, no changes needed
3. **SSR testing**: May need different approach (lit-ssr plugin not yet integrated)

## Key Differences from WTR

| Feature | WTR | Vitest |
|---------|-----|--------|
| Test runner | Mocha/Chai | Vitest |
| Browser control | @web/test-runner-commands | Playwright via @vitest/browser |
| Coverage | Istanbul | V8 |
| Watch mode | Basic | Advanced with UI |
| Configuration | web-test-runner.config.mjs | vitest.config.js |

## Dependencies

New dependencies in `packages/ui/package.json`:
- `vitest`: Test framework
- `@vitest/browser`: Browser mode support
- `@vitest/ui`: Visual test UI
- `playwright`: Browser automation
- `@open-wc/testing-helpers`: Test utilities
- `@webcomponents/scoped-custom-element-registry`: Polyfill
- `sinon`: Mocking library

## Coverage

Coverage is collected for:
- `components/**/src/**/*.js`
- `exports/**/*.js`

Excluded:
- Test files and test suites
- Translations
- Scripts and configurations

Thresholds (95% for all metrics):
- Statements
- Branches
- Functions
- Lines

## Known Issues / Limitations

1. **SSR Testing**: Lit SSR plugin integration not yet implemented
2. **Multi-browser**: Tests run sequentially across browsers (can be slow)
3. **Import paths**: Test helpers use relative paths from test files

## Future Improvements

- [ ] Integrate lit-ssr plugin for SSR testing
- [ ] Optimize multi-browser test execution
- [ ] Add VSCode launch configurations for debugging
- [ ] Consider parallel browser execution
- [ ] Evaluate test sharding for faster CI

## Rollback Plan

If issues arise, you can temporarily switch back to WTR:

1. Update `packages/ui/package.json` scripts:
   ```json
   "test": "cd ../../ && npm run test:browser"
   ```

2. The WTR config at root level remains unchanged and functional for other packages

## Support

For questions or issues with the Vitest migration, please consult:
- [Vitest Documentation](https://vitest.dev/)
- [Vitest Browser Mode](https://vitest.dev/guide/browser/)
- [@vitest/browser GitHub](https://github.com/vitest-dev/vitest/tree/main/packages/browser)
