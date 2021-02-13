# Inputs >> Combobox >> Examples ||30

```js script
import { html } from '@lion/core';
import './src/md-combobox/md-combobox.js';
import './src/gh-combobox/gh-combobox.js';
import './src/wa-combobox/wa-combobox.js';
```

```js preview-story
export const MaterialDesign = () => html`
  <md-combobox name="combo" label="Default">
    <md-option .choiceValue=${'Apple'}>Apple</md-option>
    <md-option .choiceValue=${'Artichoke'}>Artichoke</md-option>
    <md-option .choiceValue=${'Asparagus'}>Asparagus</md-option>
    <md-option .choiceValue=${'Banana'}>Banana</md-option>
    <md-option .choiceValue=${'Beets'}>Beets</md-option>
  </md-combobox>
`;
```

```js preview-story
export const Github = () => html`
  <gh-combobox name="combo" label="Switch branches/tags">
    <gh-option href="https://www.github.com" .choiceValue=${'master'} default>master</gh-option>
    <gh-option .choiceValue=${'develop'}>develop</gh-option>
    <gh-option .choiceValue=${'release'}>release</gh-option>
    <gh-option .choiceValue=${'feat/abc'}>feat/abc</gh-option>
    <gh-option .choiceValue=${'feat/xyz123'}>feat/xyz123</gh-option>
  </gh-combobox>
`;
```

```js preview-story
export const Whatsapp = () => html`
  <wa-combobox name="combo" label="Filter chats">
    <wa-option
      title="Barack Obama"
      text="Yup, let's try that for now👍"
      time="15:02"
      is-user-text
      is-user-text-read
      image="https://pbs.twimg.com/profile_images/822547732376207360/5g0FC8XX_400x400.jpg"
      .choiceValue=${'Barack Obama'}
    ></wa-option>
    <wa-option
      title="Donald Trump"
      text="Take care!"
      time="14:59"
      is-user-text
      image="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"
      .choiceValue=${'Donald Trump'}
    ></wa-option>
    <wa-option
      title="Joe Biden"
      text="Hehe😅. You too, man, you too..."
      time="yesterday"
      image="https://pbs.twimg.com/profile_images/1308769664240160770/AfgzWVE7_400x400.jpg"
      .choiceValue=${'Joe Biden'}
    ></wa-option>
    <wa-option
      title="George W. Bush"
      time="friday"
      text="You bet I will. Let's catch up soon!"
      image="https://pbs.twimg.com/profile_images/828483922266877954/ljYUWUCu_400x400.jpg"
      .choiceValue=${'George W. Bush'}
    ></wa-option>
    <wa-option
      title="Bill Clinton"
      time="thursday"
      text="Dude...😂 😂 😂"
      image="https://pbs.twimg.com/profile_images/1239440892664086529/iY0Z83Dr_400x400.jpg"
      .choiceValue=${'Bill Clinton'}
    ></wa-option>
  </wa-combobox>
`;
```
