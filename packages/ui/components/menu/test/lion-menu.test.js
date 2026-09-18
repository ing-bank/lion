import { runInteractiveListMixinSuite } from '../test-suites/InteractiveListMixin.suite.js';
import { runMultiLevelListMixinSuite } from '../test-suites/MultiLevelListMixin.suite.js';
import { runMoreButtonMenuMixinSuite } from '../test-suites/MoreButtonMenuMixin.suite.js';
import { runLionMenuSuite } from '../test-suites/LionMenu.suite.js';
import '@lion/ui/define/lion-menu.js';
import '@lion/ui/define/lion-menu-overlay.js';

runInteractiveListMixinSuite({ tagString: 'lion-menu' });
runMultiLevelListMixinSuite({ tagString: 'lion-menu', tagChildString: 'lion-menu-overlay' });
runMoreButtonMenuMixinSuite({ tagString: 'lion-menu' });
runLionMenuSuite({ tagString: 'lion-menu' });
