import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import '@lion/ui/define/lion-menu.js';
import { runLionMenuHybridSuite } from '../test-suites/LionMenuHybrid.suite.js';

runInteractiveListMixinSuite({ tagString: 'lion-menu' });
runLionMenuHybridSuite();
