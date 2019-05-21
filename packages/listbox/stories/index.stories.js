import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-listbox.js';
import '../lion-option.js';
import '../lion-optgroup.js';
import '../lion-separator.js';

import './md-option.js';

storiesOf('Forms|Listbox', module).add(
  'lion-listbox',
  () => html`
    <button>knopje</button>

    <lion-listbox>
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
  `,
);
