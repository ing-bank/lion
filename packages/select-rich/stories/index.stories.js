import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../../listbox/lion-listbox.js';
import '../../listbox/lion-option.js';
import '../../listbox/lion-optgroup.js';
import '../../listbox/lion-separator.js';
import '../lion-select-rich.js';
import '../../listbox/stories/md-option.js';

storiesOf('Forms|Select Rich', module).add(
  'lion-select-rich',
  () => html`
    <lion-select-rich>
      <lion-listbox slot="input">
        <md-option>is</md-option>
        <md-option>eventueel</md-option>
        <lion-optgroup label="ook" disabled>
          <md-option>een</md-option>
          <md-option>optie</md-option>
          <lion-separator></lion-separator>
          <md-option>in</md-option>
          <md-option>principe</md-option>
        </lion-optgroup>
      </lion-listbox>
    </lion-select-rich>
  `,
);
