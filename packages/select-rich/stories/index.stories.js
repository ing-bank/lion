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
    <lion-select-rich label="Select Rich">
      <lion-listbox slot="input">
        <md-option>or</md-option>
        <md-option>die</md-option>
        <md-option>trying</md-option>
      </lion-listbox>
    </lion-select-rich>
  `,
);
