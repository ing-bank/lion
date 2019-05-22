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
      <md-option aria-setsize="6" aria-posinset="1">is</md-option>
      <md-option aria-setsize="6" aria-posinset="2">eventueel</md-option>
      <lion-optgroup label="ook">
        <md-option aria-setsize="6" aria-posinset="3">een</md-option>
        <md-option aria-setsize="6" aria-posinset="4" disabled>optie</md-option>
        <lion-separator></lion-separator>
        <md-option aria-setsize="6" aria-posinset="5">in</md-option>
        <md-option aria-setsize="6" aria-posinset="6">principe</md-option>
      </lion-optgroup>
    </lion-listbox>
  `,
);
