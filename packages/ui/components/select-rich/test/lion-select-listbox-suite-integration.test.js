import { runListboxMixinSuite } from '@lion/ui/listbox-test-suites.js';

import { LionSelectRich } from '@lion/ui/select-rich.js';

describe('<lion-select-rich> integration with ListboxMixin', () => {
  runListboxMixinSuite({ classes: { host: LionSelectRich } });
});
