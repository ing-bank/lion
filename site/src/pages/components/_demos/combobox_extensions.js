// @ts-check
/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/demo-components/combobox/src/md-combobox/md-combobox.js';
import '@lion/demo-components/combobox/src/gh-combobox/gh-combobox.js';
import '@lion/demo-components/combobox/src/wa-combobox/wa-combobox.js';
import '@lion/demo-components/combobox/src/google-combobox/google-combobox.js';

import obamaImgUrlMeta from '@lion/demo-components/combobox/src/wa-combobox/assets/obama.jpeg';
import trumpImgUrlMeta from '@lion/demo-components/combobox/src/wa-combobox/assets/trump.jpeg';
import bidenImgUrlMeta from '@lion/demo-components/combobox/src/wa-combobox/assets/biden.jpeg';
import bushImgUrlMeta from '@lion/demo-components/combobox/src/wa-combobox/assets/bush.jpeg';
import clintonImgUrlMeta from '@lion/demo-components/combobox/src/wa-combobox/assets/clinton.jpeg';

/** stories code **/
export const MaterialDesign = () => html`
  <md-combobox name="combo" label="Default">
    <md-option .choiceValue="${'Apple'}">Apple</md-option>
    <md-option .choiceValue="${'Artichoke'}">Artichoke</md-option>
    <md-option .choiceValue="${'Asparagus'}">Asparagus</md-option>
    <md-option .choiceValue="${'Banana'}">Banana</md-option>
    <md-option .choiceValue="${'Beets'}">Beets</md-option>
  </md-combobox>
`;
export const Github = () => html`
  <gh-combobox name="combo" label="Switch branches/tags">
    <gh-option href="https://www.github.com" .choiceValue="${'master'}" default>master</gh-option>
    <gh-option .choiceValue="${'develop'}">develop</gh-option>
    <gh-option .choiceValue="${'release'}">release</gh-option>
    <gh-option .choiceValue="${'feat/abc'}">feat/abc</gh-option>
    <gh-option .choiceValue="${'feat/xyz123'}">feat/xyz123</gh-option>
  </gh-combobox>
`;
export const Whatsapp = () => {
  const obamaImgUrl = obamaImgUrlMeta.src
  const trumpImgUrl = trumpImgUrlMeta.src
  const bidenImgUrl = bidenImgUrlMeta.src
  const bushImgUrl = bushImgUrlMeta.src
  const clintonImgUrl = clintonImgUrlMeta.src

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
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'MaterialDesign', story: MaterialDesign }, { key: 'Github', story: Github }, { key: 'Whatsapp', story: Whatsapp }, { key: 'GoogleSearch', story: GoogleSearch }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }
  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }
}