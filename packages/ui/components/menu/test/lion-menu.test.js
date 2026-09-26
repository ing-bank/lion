import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import { runMoreButtonMenuMixinSuite } from '../test-suites/MoreButtonMenuMixin.suite.js';
import { runLionMenuSuite } from '../test-suites/LionMenu.suite.js';
import '@lion/ui/define/lion-menu.js';

// The Mixin suites run against plain mixin hosts (their defaults) on purpose:
// LionMenu composes InteractiveListMixin + MultiLevelListMixin with the
// overlay/disclosure behavior, and the composite is covered by the LionMenu
// suites.
runInteractiveListMixinSuite();
runMultiLevelListMixinSuite();
runMoreButtonMenuMixinSuite({ tagString: 'lion-menu' });
runLionMenuSuite({ tagString: 'lion-menu' });
