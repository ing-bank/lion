# Transfer

`lion-transfer` component allows the user to shift/transfer one or more items between lists.

You cannot use interactive elements inside the options. Avoid very long names to
facilitate the understandability and perceivability for screen reader users. Sets of options
where each option name starts with the same word or phrase can also significantly degrade
usability for keyboard and screen reader users.

```js script
import { html } from 'lit-html';
import { Required } from '@lion/form-core';
import '@lion/listbox/lion-option.js';

import './lion-transfer.js';

export default {
  title: 'Others/Transfer',
};
```

```js preview-story
export const main = () => html`
  <lion-transfer>
    <div slot="leftList">
      <lion-option .choiceValue="Apple">Apple</lion-option>
      <lion-option .choiceValue="Artichoke">Artichoke</lion-option>
      <lion-option .choiceValue="Asparagus">Asparagus</lion-option>
    </div>
    <button slot="transferToLeftActionSlot">To Left &lt;</button>
    <button slot="transferToRightActionSlot">To Right &gt;</button>
    <div slot="rightList">
      <lion-option .choiceValue="Banana">Banana</lion-option>
      <lion-option .choiceValue="Beets">Beets</lion-option>
      <lion-option .choiceValue="Bell pepper">Bell pepper</lion-option>
      <lion-option .choiceValue="Broccoli">Broccoli</lion-option>
      <lion-option .choiceValue="Brussels sprout">Brussels sprout</lion-option>
    </div>
  </lion-transfer>
`;
```
