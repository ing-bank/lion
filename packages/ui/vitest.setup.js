// Setup file for Vitest to polyfill scoped custom element registry
import '@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';

// Make Mocha-style hooks available globally
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
globalThis.before = beforeAll;
globalThis.after = afterAll;
globalThis.beforeEach = beforeEach;
globalThis.afterEach = afterEach;

// Set up default locale for tests that depend on locale detection (like LionInputTel)
// Many tests expect en-GB locale
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = 'en-GB';
}
