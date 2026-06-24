import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import '@lion/ui/define/lion-tree.js';

runInteractiveListMixinSuite({ tagString: 'lion-tree' });
runMultiLevelListMixinSuite({ tagString: 'lion-tree', tagChildString: 'lion-tree' });
