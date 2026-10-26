/* eslint-disable import/no-relative-packages */
// The first two runners describe mixins that `@lion/ui/menu.js` does not re-export, so a Subclasser
// cannot extend the mixin they test. Open decision: export the mixins, or keep these runners
// internal (docs/guides/principles/test-suites.md explains the rule).
export { runInteractiveListMixinSuite } from '../components/menu/test-suites/InteractiveListMixin.suite.js';
export { runMultiLevelListMixinSuite } from '../components/menu/test-suites/MultiLevelListMixin.suite.js';
export { runLionMenuInteractionsSuite } from '../components/menu/test-suites/LionMenuInteractions.suite.js';
