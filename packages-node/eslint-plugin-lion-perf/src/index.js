import { noForcedLayoutReadsRule } from './rules/no-forced-layout-reads.js';
import { preferCheckVisibilityRule } from './rules/prefer-check-visibility.js';
import { preferCssContainmentRule } from './rules/prefer-css-containment.js';

export const rules = {
  'no-forced-layout-reads': noForcedLayoutReadsRule,
  'prefer-check-visibility': preferCheckVisibilityRule,
  'prefer-css-containment': preferCssContainmentRule,
};

export const configs = {
  recommended: {
    plugins: ['lion-perf'],
    rules: {
      'lion-perf/no-forced-layout-reads': 'error',
      'lion-perf/prefer-check-visibility': 'warn',
      'lion-perf/prefer-css-containment': 'warn',
    },
  },
};

export default {
  configs,
  rules,
};
