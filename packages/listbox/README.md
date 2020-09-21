# Listbox

A listbox widget presents a list of options and allows a user to select one or more of them.
A listbox that allows a single option to be chosen is a single-select listbox; one that allows
multiple options to be selected is a multi-select listbox.

> From [listbox wai-aria best practices](https://www.w3.org/TR/wai-aria-practices/#Listbox)

```js script
import { html } from '@lion/core';
import { Required } from '@lion/form-core';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { listboxData } from './docs/listboxData.js';
import './lion-option.js';
import './lion-listbox.js';

export default {
  title: 'Forms/Listbox',
};
```

```js preview-story
export const main = () => html`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
  </lion-listbox>
`;
```

## Features

- Single & Multiple Choice
- Orientation
- Rotation when using keyboard for selection

## How to use

### Installation

```bash
npm i --save @lion/listbox
```

## Examples

## Multiple choice

Add `multiple-choice` flag to allow multiple values to be selected.
This will:

- keep the listbox overlay open on click of an option
- display a list of selected option representations next to the text box
- make the value of type `Array` instead of `String`

```js preview-story
export const multiple = () => html`
  <lion-listbox name="combo" label="Multiple" multiple-choice>
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
    <lion-option .choiceValue=${'Bell pepper'}>Bell pepper</lion-option>
    <lion-option .choiceValue=${'Broccoli'}>Broccoli</lion-option>
    <lion-option .choiceValue=${'Brussels sprout'}>Brussels sprout</lion-option>
    <lion-option .choiceValue=${'Cabbage'}>Cabbage</lion-option>
    <lion-option .choiceValue=${'Carrot'}>Carrot</lion-option>
  </lion-listbox>
`;
```

## Orientation

When `orientation="horizontal"`, left and right arrow keys will be enabled, plus the screenreader
will be informed about the direction of the options.
By default, `orientation="vertical"` is set, which enables up and down arrow keys.

```js preview-story
export const orientationHorizontal = () => html`
  <lion-listbox name="combo" label="Orientation horizontal" orientation="horizontal">
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
    <lion-option .choiceValue=${'Bell pepper'}>Bell pepper</lion-option>
    <lion-option .choiceValue=${'Broccoli'}>Broccoli</lion-option>
    <lion-option .choiceValue=${'Brussels sprout'}>Brussels sprout</lion-option>
    <lion-option .choiceValue=${'Cabbage'}>Cabbage</lion-option>
    <lion-option .choiceValue=${'Carrot'}>Carrot</lion-option>
  </lion-listbox>
`;
```

With `multiple-choice` flag configured, multiple options can be checked.

```js preview-story
export const orientationHorizontalMultiple = () => html`
  <lion-listbox
    name="combo"
    label="Orientation horizontal multiple"
    orientation="horizontal"
    multiple-choice
  >
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
    <lion-option .choiceValue=${'Bell pepper'}>Bell pepper</lion-option>
    <lion-option .choiceValue=${'Broccoli'}>Broccoli</lion-option>
    <lion-option .choiceValue=${'Brussels sprout'}>Brussels sprout</lion-option>
    <lion-option .choiceValue=${'Cabbage'}>Cabbage</lion-option>
    <lion-option .choiceValue=${'Carrot'}>Carrot</lion-option>
  </lion-listbox>
`;
```

## Selection-follows-focus

When true, will synchronize activedescendant and selected element on arrow key navigation.
This behavior can usually be seen in `<select>` on the Windows platform.
Note that this behavior cannot be used when multiple-choice is true.
See [wai aria spec](https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus)

```js preview-story
export const selectionFollowsFocus = () => html`
  <lion-listbox name="combo" label="Selection follows focus" selection-follows-focus>
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
    <lion-option .choiceValue=${'Bell pepper'}>Bell pepper</lion-option>
    <lion-option .choiceValue=${'Broccoli'}>Broccoli</lion-option>
    <lion-option .choiceValue=${'Brussels sprout'}>Brussels sprout</lion-option>
    <lion-option .choiceValue=${'Cabbage'}>Cabbage</lion-option>
    <lion-option .choiceValue=${'Carrot'}>Carrot</lion-option>
  </lion-listbox>
`;
```

## Rotate keyboard navigation

`rotate-keyboard-navigation` attribute on the listbox will give the first option active state when navigated to the next option from last option.

```js preview-story
export const rotateKeyboardNavigation = () => html`
  <lion-listbox name="combo" label="Rotate keyboard navigation" rotate-keyboard-navigation>
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'}>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
    <lion-option .choiceValue=${'Bell pepper'}>Bell pepper</lion-option>
    <lion-option .choiceValue=${'Broccoli'}>Broccoli</lion-option>
    <lion-option .choiceValue=${'Brussels sprout'}>Brussels sprout</lion-option>
    <lion-option .choiceValue=${'Cabbage'}>Cabbage</lion-option>
    <lion-option .choiceValue=${'Carrot'}>Carrot</lion-option>
  </lion-listbox>
`;
```

## Disabled options

Navigation will skip over disabled options. Let's disable Artichoke and Brussel sprout, because they're gross.

```js preview-story
export const disabledRotateNavigation = () => html`
  <lion-listbox name="combo" label="Rotate with disabled options" rotate-keyboard-navigation>
    <lion-option .choiceValue=${'Apple'}>Apple</lion-option>
    <lion-option .choiceValue=${'Artichoke'} disabled>Artichoke</lion-option>
    <lion-option .choiceValue=${'Asparagus'}>Asparagus</lion-option>
    <lion-option .choiceValue=${'Banana'}>Banana</lion-option>
    <lion-option .choiceValue=${'Beets'}>Beets</lion-option>
    <lion-option .choiceValue=${'Bell pepper'}>Bell pepper</lion-option>
    <lion-option .choiceValue=${'Broccoli'}>Broccoli</lion-option>
    <lion-option .choiceValue=${'Brussel sprout'} disabled>Brussels sprout</lion-option>
    <lion-option .choiceValue=${'Cabbage'}>Cabbage</lion-option>
    <lion-option .choiceValue=${'Carrot'}>Carrot</lion-option>
  </lion-listbox>
`;
```
