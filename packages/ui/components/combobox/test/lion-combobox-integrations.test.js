import { css } from 'lit';
import { runListboxMixinSuite } from '@lion/ui/listbox-test-suites.js';
import '@lion/ui/define/lion-combobox.js';
import { runCustomChoiceGroupMixinSuite } from '../../form-core/test-suites/choice-group/CustomChoiceGroupMixin.suite.js';
import { LionCombobox } from '../src/LionCombobox.js';
import { ScopedStylesController } from '../../core/src/ScopedStylesController.js';

runListboxMixinSuite({ tagString: 'lion-combobox' });
runCustomChoiceGroupMixinSuite({
  parentTagString: 'lion-combobox',
  childTagString: 'lion-option',
});

// Test case for using ScopedStylesController inside the LionCombobox
class ComboboxWithScopedStyles extends LionCombobox {
  static scopedStyles() {
    return css`
      p {
        display: block;
      }
    `;
  }

  constructor() {
    super();
    this.scopedStylesController = new ScopedStylesController(this);
  }
}

customElements.define('combobox-with-scoped-styles', ComboboxWithScopedStyles);

runListboxMixinSuite({ tagString: 'combobox-with-scoped-styles' });
