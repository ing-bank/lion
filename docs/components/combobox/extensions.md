---
title: 'Extensions'
parts:
  - Combobox
  - Extensions
eleventyNavigation:
  key: 'Combobox: Extensions'
  order: 30
  parent: Combobox
  title: Extensions
---

# Extensions

```js script
import { html } from '@mdjs/mdjs-preview';
import './src/md-combobox/md-combobox.js';
import './src/gh-combobox/gh-combobox.js';
import './src/wa-combobox/wa-combobox.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import './src/google-combobox/google-combobox.js';
/* eslint-disable */
// https://github.com/gustf/js-levenshtein/blob/master/index.js

function _min(d0, d1, d2, bx, ay) {
  return d0 < d1 || d2 < d1 ? (d0 > d2 ? d2 + 1 : d0 + 1) : bx === ay ? d1 : d1 + 1;
}

function levenshtein(a, b) {
  if (a === b) {
    return 0;
  }

  if (a.length > b.length) {
    var tmp = a;
    a = b;
    b = tmp;
  }

  var la = a.length;
  var lb = b.length;

  while (la > 0 && a.charCodeAt(la - 1) === b.charCodeAt(lb - 1)) {
    la--;
    lb--;
  }

  var offset = 0;

  while (offset < la && a.charCodeAt(offset) === b.charCodeAt(offset)) {
    offset++;
  }

  la -= offset;
  lb -= offset;

  if (la === 0 || lb < 3) {
    return lb;
  }

  var x = 0;
  var y;
  var d0;
  var d1;
  var d2;
  var d3;
  var dd;
  var dy;
  var ay;
  var bx0;
  var bx1;
  var bx2;
  var bx3;

  var vector = [];

  for (y = 0; y < la; y++) {
    vector.push(y + 1);
    vector.push(a.charCodeAt(offset + y));
  }

  var len = vector.length - 1;

  for (; x < lb - 3; ) {
    bx0 = b.charCodeAt(offset + (d0 = x));
    bx1 = b.charCodeAt(offset + (d1 = x + 1));
    bx2 = b.charCodeAt(offset + (d2 = x + 2));
    bx3 = b.charCodeAt(offset + (d3 = x + 3));
    dd = x += 4;
    for (y = 0; y < len; y += 2) {
      dy = vector[y];
      ay = vector[y + 1];
      d0 = _min(dy, d0, d1, bx0, ay);
      d1 = _min(d0, d1, d2, bx1, ay);
      d2 = _min(d1, d2, d3, bx2, ay);
      dd = _min(d2, d3, dd, bx3, ay);
      vector[y] = dd;
      d3 = d2;
      d2 = d1;
      d1 = d0;
      d0 = dy;
    }
  }

  for (; x < lb; ) {
    bx0 = b.charCodeAt(offset + (d0 = x));
    dd = ++x;
    for (y = 0; y < len; y += 2) {
      dy = vector[y];
      vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
      d0 = dy;
    }
  }

  return dd;
}
```

Below several extensions can be found. They illustrate that complex UI components can be created
easily from an extended Lion component, just by:

- **configuring**: setting properties or providing conditions via methods
- **enhancing**: adding extra html/styles/logic without changing behavior of the extended element
- **overriding**: replace html/styles/logic of the extended element with your own

## Material Design

```js preview-story
export const MaterialDesign = () => html`
  <md-combobox name="combo" label="Default">
    <md-option .choiceValue="${'Apple'}">Apple</md-option>
    <md-option .choiceValue="${'Artichoke'}">Artichoke</md-option>
    <md-option .choiceValue="${'Asparagus'}">Asparagus</md-option>
    <md-option .choiceValue="${'Banana'}">Banana</md-option>
    <md-option .choiceValue="${'Beets'}">Beets</md-option>
  </md-combobox>
`;
```

## Github

```js preview-story
export const Github = () => html`
  <gh-combobox name="combo" label="Switch branches/tags">
    <gh-option href="https://www.github.com" .choiceValue="${'master'}" default>master</gh-option>
    <gh-option .choiceValue="${'develop'}">develop</gh-option>
    <gh-option .choiceValue="${'release'}">release</gh-option>
    <gh-option .choiceValue="${'feat/abc'}">feat/abc</gh-option>
    <gh-option .choiceValue="${'feat/xyz123'}">feat/xyz123</gh-option>
  </gh-combobox>
`;
```

## Whatsapp

```js preview-story
export const Whatsapp = () => {
  // in Rocket this is resolved based on the URL, in astro this is resolved based on filesystem (or is it?)
  const obamaImgUrl = new URL('../src/wa-combobox/assets/obama.jpeg', import.meta.url).href;
  const trumpImgUrl = new URL('../src/wa-combobox/assets/trump.jpeg', import.meta.url).href;
  const bidenImgUrl = new URL('../src/wa-combobox/assets/biden.jpeg', import.meta.url).href;
  const bushImgUrl = new URL('../src/wa-combobox/assets/bush.jpeg', import.meta.url).href;
  const clintonImgUrl = new URL('../src/wa-combobox/assets/clinton.jpeg', import.meta.url).href;

  return html`
    <wa-combobox name="combo" label="Filter chats">
      <wa-option
        title="Barack Obama"
        text="Yup, let's try that for now👍"
        time="15:02"
        is-user-text
        is-user-text-read
        image="${obamaImgUrl}"
        .choiceValue="${'Barack Obama'}"
      ></wa-option>
      <wa-option
        title="Donald Trump"
        text="Take care!"
        time="14:59"
        is-user-text
        image="${trumpImgUrl}"
        .choiceValue="${'Donald Trump'}"
      ></wa-option>
      <wa-option
        title="Joe Biden"
        text="Hehe😅. You too, man, you too..."
        time="yesterday"
        image="${bidenImgUrl}"
        .choiceValue="${'Joe Biden'}"
      ></wa-option>
      <wa-option
        title="George W. Bush"
        time="friday"
        text="You bet I will. Let's catch up soon!"
        image="${bushImgUrl}"
        .choiceValue="${'George W. Bush'}"
      ></wa-option>
      <wa-option
        title="Bill Clinton"
        time="thursday"
        text="Dude...😂 😂 😂"
        image="${clintonImgUrl}"
        .choiceValue="${'Bill Clinton'}"
      ></wa-option>
    </wa-combobox>
  `;
};
```

**Whatsapp example shows:**

- advanced styling
- how to match/highlight text on multiple rows of the option (not just choiceValue)
- how to animate options

## Google Search

```js preview-story
export const GoogleSearch = () => {
  return html`
    <google-combobox name="combo" label="Google Search">
      <google-option
        href="https://www.google.com/search?query=apple"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${'Apple'}"
        >Apple</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Artichoke"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${'Artichoke'}"
        >Artichoke</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Asparagus"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${'Asparagus'}"
        >Asparagus</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Banana"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${'Banana'}"
        >Banana</google-option
      >
      <google-option
        href="https://www.google.com/search?query=Beets"
        target="_blank"
        rel="noopener noreferrer"
        .choiceValue="${'Beets'}"
        >Beets</google-option
      >
    </google-combobox>
    <div style="height:200px;"></div>
  `;
};
```

**Google Search example shows:**

- advanced styling
- how to use options that are links
- create exact user experience of Google Search, by:
  - using autocomplete 'list' as a fundament (we don't want inline completion in textbox)
  - enhancing `_showOverlayCondition`: open on focus
  - enhancing `_syncToTextboxCondition`: always sync to textbox when navigating by keyboard (this needs to be enabled, since it's not provided in the "autocomplete=list" preset)

## Custom match condition

When the preconfigurable match-mode conditions are not sufficient, a custom `matchCondition` function
decides which options match. This example matches when the typed text starts with the same letter as the
option and differs from it by fewer than 3 edits (including some other conditions), so spelling mistakes
are forgiven. Try typing `Aple` instead of `Apple`.

```js preview-story
export const customMatchCondition = () => html`
  <lion-combobox
    name="combo"
    label="Custom Match Mode 'levenshtein'"
    help-text="Spelling mistakes will be forgiven. Try typing 'Aple' instead of 'Apple'"
    .matchCondition="${({ choiceValue }, textboxValue) => {
      const oVal = choiceValue.toLowerCase();
      const tVal = textboxValue.toLowerCase();
      const t = 1; // treshold
      return oVal.slice(0, t) === tVal.slice(0, t) && levenshtein(oVal, tVal) < 3;
    }}"
  >
    <lion-option .choiceValue="${'Apple'}">Apple</lion-option>
    <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
    <lion-option .choiceValue="${'Asparagus'}">Asparagus</lion-option>
    <lion-option .choiceValue="${'Banana'}">Banana</lion-option>
    <lion-option .choiceValue="${'Beets'}">Beets</lion-option>
  </lion-combobox>
`;
```
