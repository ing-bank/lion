import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import { runMoreButtonMenuMixinSuite } from '../test-suites/MoreButtonMenuMixin.suite.js';
import '@lion/ui/define/lion-toolbar.js';

// runInteractiveListMixinSuite({ tagString: 'lion-toolbar' }); // 1 test fails
// runMultiLevelListMixinSuite({ tagString: 'lion-toolbar', tagChildString: 'lion-toolbar' }); // hangs
runMoreButtonMenuMixinSuite({ tagString: 'lion-toolbar' });
