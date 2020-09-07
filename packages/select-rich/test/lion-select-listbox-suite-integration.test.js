import { runListboxMixinSuite } from '@lion/listbox/test-suites/ListboxMixin.suite.js';
import '../lion-select-rich.js';

describe('<lion-select-rich> integration with ListboxMixin', () => {
  runListboxMixinSuite({ tagString: 'lion-select-rich' });
});
