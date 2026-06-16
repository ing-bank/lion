import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import { runLionMenuHybridSuite } from '../test-suites/LionMenuHybrid.suite.js';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-menu-overlay.js';

runInteractiveListMixinSuite({ tagString: 'lion-menu' });
runMultiLevelListMixinSuite({ tagString: 'lion-menu', tagChildString: 'lion-menu-overlay' });
runLionMenuHybridSuite();
