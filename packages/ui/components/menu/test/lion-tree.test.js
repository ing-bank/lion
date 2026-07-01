import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
// import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import '@lion/ui/define/lion-tree.js';

runInteractiveListMixinSuite({ tagString: 'lion-tree' });
// TODO: fix failing tests. LionTree is missing a close function, should this be coming from the DisclosureMixin?
// runMultiLevelListMixinSuite({ tagString: 'lion-tree', tagChildString: 'lion-tree' });
