import { runListboxMixinSuite } from '@lion/components/listbox-test-suites.js';

import '@lion/components/define/lion-select-rich.js';

describe('<lion-select-rich> integration with ListboxMixin', () => {
  runListboxMixinSuite({ tagString: 'lion-select-rich' });
});
