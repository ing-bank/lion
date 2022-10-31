import { runListboxMixinSuite } from '@lion/ui/listbox-test-suites.js';

import '@lion/ui/define/lion-select-rich.js';

describe('<lion-select-rich> integration with ListboxMixin', () => {
  runListboxMixinSuite({ tagString: 'lion-select-rich' });
});
