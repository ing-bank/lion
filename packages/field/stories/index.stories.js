import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-field.js';

storiesOf('Forms|Field|Values', module)
.add(
  'Uses model value for data synchronisation',
  () => html`
    <lion-field
      .modelValue="${'myValue'}"
      @model-value-changed="${({ target }) => { console.log(target)}}">
      <input slot="input">
    </lion-field>
  `,
)
.add(
  'Uses .parser to create model values from view values',
  () => html`
    <lion-field id="f"
      .parser="${(v) => Number(v)}"
      .modelValue="${2.22}">
      <input slot="input">
    </lion-field>
    <output>${f.modelValue}</output>
  `,
)
.add(
  'Uses .formatter to create view value',
  () => html`
    <lion-field .modelValue="${'myValue'}" @model-value-changed="${() => {}}">
      <input slot="input">
    </lion-field>
  `,
);
