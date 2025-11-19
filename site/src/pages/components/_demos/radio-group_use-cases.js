/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-radio-group.js';
import '@lion/ui/define/lion-radio.js';
/** stories code **/
export const preSelect = () => html`
  <lion-radio-group name="dinos_2" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}" checked></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
export const disabledRadio = () => html`
  <lion-radio-group name="dinos_4" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}" disabled></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
export const disabledGroup = () => html`
  <lion-radio-group name="dinos_6" label="What are your favourite dinosaurs?" disabled>
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
`;
export const label = () => html`
  <lion-radio-group name="dinos_7" label="Favourite dinosaur">
    <lion-radio .choiceValue="${'allosaurus'}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/allosaurus" target="_blank">allosaurus</a></label
      >
    </lion-radio>
    <lion-radio .choiceValue="${'brontosaurus'}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/brontosaurus" target="_blank">brontosaurus</a></label
      >
    </lion-radio>
    <lion-radio .choiceValue="${'diplodocus'}">
      <label slot="label"
        ><a href="https://wikipedia.org/wiki/diplodocus" target="_blank">diplodocus</a></label
      >
    </lion-radio>
  </lion-radio-group>
`;
export const helpText = () => html`
  <lion-radio-group name="dinosTwo" label="Favourite dinosaur">
    <lion-radio
      label="allosaurus"
      .choiceValue="${'allosaurus'}"
      help-text="Allosaurus is a genus of carnivorous theropod dinosaur that lived 155 to 145 million years ago during the late Jurassic period"
    ></lion-radio>
    <lion-radio
      label="brontosaurus"
      .choiceValue="${'brontosaurus'}"
      help-text="Brontosaurus is a genus of gigantic quadruped sauropod dinosaurs"
    ></lion-radio>
    <lion-radio
      label="diplodocus"
      .choiceValue="${'diplodocus'}"
      help-text="Diplodocus is a genus of diplodocid sauropod dinosaurs whose fossils were first discovered in 1877 by S. W. Williston"
    ></lion-radio>
  </lion-radio-group>
`;
export const event = ({ shadowRoot }) => html`
  <lion-radio-group
    name="dinosTwo"
    label="Favourite dinosaur"
    @model-value-changed=${ev =>
      (ev.target.parentElement.querySelector('#selectedDinosaur').innerText = ev.target.modelValue)}
  >
    <lion-radio label="allosaurus" .choiceValue="${'allosaurus'}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${'brontosaurus'}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${'diplodocus'}"></lion-radio>
  </lion-radio-group>
  <br />
  <span>Selected dinosaur: <strong id="selectedDinosaur">N/A</strong></span>
`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'preSelect', story: preSelect }, { key: 'disabledRadio', story: disabledRadio }, { key: 'disabledGroup', story: disabledGroup }, { key: 'label', story: label }, { key: 'helpText', story: helpText }, { key: 'event', story: event }];
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
  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }}