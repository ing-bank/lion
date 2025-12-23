# @lion/ui Vitest Migration Checklist

## ✅ Phase 1: Setup (COMPLETED)

- [x] Install Vitest dependencies
- [x] Create vitest.config.js
- [x] Create vitest.setup.js
- [x] Create test-helpers.js compatibility layer
- [x] Update package.json scripts
- [x] Update root package.json with new test command
- [x] Create migration documentation
- [x] Create example test file
- [x] Add .vitest-cache to .gitignore
- [x] Install dependencies (npm install)

## 🔄 Phase 2: Test File Migration (TODO)

Choose one approach:

### Option A: Automated Migration (Recommended)
- [ ] Run migration script: `node scripts/update-test-imports.js`
- [ ] Review changed files
- [ ] Test a sample of updated test files
- [ ] Commit changes

### Option B: Manual Migration
For each test file:
- [ ] Replace `@open-wc/testing` imports with `test-helpers.js`
- [ ] Replace `@web/test-runner-commands` imports with `test-helpers.js`
- [ ] Add `describe` and `it` imports from `vitest`
- [ ] Verify relative path depth for test-helpers import

### Option C: Gradual Migration
- [ ] Identify critical components to test first
- [ ] Migrate one component suite at a time
- [ ] Test after each migration
- [ ] Document any issues encountered

## 🧪 Phase 3: Testing & Verification (TODO)

### Basic Verification
- [ ] Run `npm test` from packages/ui
- [ ] Verify all tests pass
- [ ] Check coverage reports
- [ ] Test debug mode: `npm run debug`
- [ ] Test watch mode: `npm run test:watch`

### Cross-Browser Testing
- [ ] Run tests in Chromium
- [ ] Run tests in Firefox (`npm run debug:firefox`)
- [ ] Run tests in WebKit (`npm run debug:webkit`)

### Integration Testing
- [ ] Run from root: `npm run test:browser:ui`
- [ ] Verify coverage thresholds are met (95%)
- [ ] Check that all 155+ test files run successfully

## 📋 Phase 4: Component-Specific Verification (TODO)

Test key components to ensure migration didn't break functionality:

### Core Components
- [ ] accordion
- [ ] button
- [ ] checkbox-group
- [ ] combobox
- [ ] dialog
- [ ] form
- [ ] input
- [ ] overlays
- [ ] radio-group
- [ ] select

### Complex Components
- [ ] input-datepicker (uses setViewport)
- [ ] select-rich (complex interactions)
- [ ] form integration tests
- [ ] overlay system tests

## 🔍 Phase 5: Edge Cases & Special Tests (TODO)

- [ ] Tests using `sendKeys` work correctly
- [ ] Tests using `setViewport` work correctly
- [ ] Tests using `aTimeout` work correctly
- [ ] Tests using `oneEvent` work correctly
- [ ] Tests using `elementUpdated` work correctly
- [ ] Tests with sinon mocks work correctly
- [ ] Tests with dynamic imports work
- [ ] SSR-related tests (if any)

## 📊 Phase 6: Coverage Analysis (TODO)

- [ ] Compare coverage with previous WTR results
- [ ] Identify any coverage gaps
- [ ] Address coverage regressions
- [ ] Document coverage improvements

## 🐛 Phase 7: Bug Fixes & Adjustments (TODO)

Track and fix issues found during migration:

- [ ] Issue: _________________________ (Status: _____)
- [ ] Issue: _________________________ (Status: _____)
- [ ] Issue: _________________________ (Status: _____)

## 📝 Phase 8: Documentation Updates (TODO)

- [ ] Update CONTRIBUTING.md if it exists
- [ ] Update main README.md with testing section
- [ ] Create/update developer onboarding docs
- [ ] Add Vitest tips to team wiki/docs

## 🎯 Phase 9: CI/CD Integration (TODO)

- [ ] Update CI pipeline to use Vitest
- [ ] Verify tests run in CI environment
- [ ] Configure parallel test execution if needed
- [ ] Set up coverage reporting in CI
- [ ] Update build badges if needed

## 🚀 Phase 10: Rollout & Communication (TODO)

- [ ] Announce migration to team
- [ ] Schedule training session if needed
- [ ] Share quick reference guide
- [ ] Monitor for issues in first week
- [ ] Gather feedback from developers

## 🎉 Phase 11: Cleanup (TODO)

After successful migration and stabilization:

- [ ] Remove WTR dependencies (optional - keep for other packages)
- [ ] Archive old WTR configs (if no longer needed)
- [ ] Clean up any temporary migration files
- [ ] Update package-lock.json
- [ ] Final documentation review

## 📈 Success Metrics

Track these to measure migration success:

- [ ] All 155+ test files passing
- [ ] Coverage maintained at ≥95%
- [ ] Test execution time (compare to WTR baseline)
- [ ] Developer satisfaction survey
- [ ] Zero critical bugs introduced

## ⚠️ Known Issues

Document known issues and workarounds:

1. **Node version warnings**: Node 16 shows warnings, but tests work. Upgrade to Node 18+ recommended.
2. **Import paths**: Relative paths require careful attention to depth
3. **SSR testing**: Lit SSR plugin not yet integrated

## 📞 Support

If you encounter issues:

1. Check [VITEST_QUICK_REFERENCE.md](./VITEST_QUICK_REFERENCE.md)
2. Review [VITEST_MIGRATION.md](./VITEST_MIGRATION.md)
3. Check Vitest documentation: https://vitest.dev/
4. Open an issue in the repository

---

**Migration Status**: Phase 1 Complete ✅ | Ready for Phase 2

**Last Updated**: December 23, 2025
