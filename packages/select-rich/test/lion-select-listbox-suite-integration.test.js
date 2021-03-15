import { runListboxMixinSuite } from '@lion/listbox/test-suites';
import '@lion/select-rich/define';

describe('<lion-select-rich> integration with ListboxMixin', () => {
  runListboxMixinSuite({ tagString: 'lion-select-rich' });
});
