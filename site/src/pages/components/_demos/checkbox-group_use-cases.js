/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-checkbox-group.js';
import '@lion/ui/define/lion-checkbox-indeterminate.js';
import '@lion/ui/define/lion-checkbox.js';
/** stories code **/
export const HtmlStory6 = () => html`<lion-checkbox-group name="scientists" label="Favorite scientists">
  <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue="${'Francis Bacon'}" checked></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue="${'Marie Curie'}"></lion-checkbox>
</lion-checkbox-group>`;
export const HtmlStory7 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists" disabled>
  <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
  <lion-checkbox label="Francis Bacon" .choiceValue="${'Francis Bacon'}"></lion-checkbox>
  <lion-checkbox label="Marie Curie" .choiceValue="${'Marie Curie'}"></lion-checkbox>
</lion-checkbox-group>`;
export const HtmlStory8 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox .choiceValue="${'Archimedes'}">
    <label slot="label"
      ><a href="https://wikipedia.org/wiki/Archimedes" target="_blank">Archimedes</a></label
    >
  </lion-checkbox>
  <lion-checkbox .choiceValue="${'Francis Bacon'}">
    <label slot="label"
      ><a href="https://wikipedia.org/wiki/Francis_Bacon" target="_blank">Francis Bacon</a></label
    >
  </lion-checkbox>
  <lion-checkbox .choiceValue="${'Marie Curie'}">
    <label slot="label"
      ><a href="https://wikipedia.org/wiki/Marie_Curie" target="_blank">Marie Curie</a></label
    >
  </lion-checkbox>
</lion-checkbox-group>`;
export const HtmlStory9 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox
    label="Archimedes"
    .choiceValue="${'Archimedes'}"
    help-text="Archimedes of Syracuse was a Greek mathematician, physicist, engineer, inventor, and astronomer"
  ></lion-checkbox>
  <lion-checkbox
    label="Francis Bacon"
    .choiceValue="${'Francis Bacon'}"
    help-text="Francis Bacon, 1st Viscount St Alban also known as Lord Verulam, was an English philosopher and statesman who served as Attorney General and as Lord Chancellor of England"
  ></lion-checkbox>
  <lion-checkbox
    label="Marie Curie"
    .choiceValue="${'Marie Curie'}"
    help-text="Marie Skłodowska Curie born Maria Salomea Skłodowska, was a Polish and naturalized-French physicist and chemist who conducted pioneering research on radioactivity"
  ></lion-checkbox>
</lion-checkbox-group>`;
export const event = ({ shadowRoot }) => html`
  <lion-checkbox-group
    name="scientists[]"
    label="Favorite scientists"
    @model-value-changed=${ev =>
      (ev.target.parentElement.querySelector('#selectedDinosaur').innerText = JSON.stringify(
        ev.target.modelValue,
        null,
        4,
      ))}
  >
    <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
    <lion-checkbox label="Francis Bacon" .choiceValue="${'Francis Bacon'}"></lion-checkbox>
    <lion-checkbox label="Marie Curie" .choiceValue="${'Marie Curie'}"></lion-checkbox>
  </lion-checkbox-group>
  <br />
  <span>Selected scientists: <strong id="selectedDinosaur">N/A</strong></span>
`;
export const HtmlStory10 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox-indeterminate label="Old Greek scientists">
    <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
    <lion-checkbox label="Plato" .choiceValue="${'Plato'}"></lion-checkbox>
    <lion-checkbox label="Pythagoras" .choiceValue="${'Pythagoras'}"></lion-checkbox>
  </lion-checkbox-indeterminate>
  <lion-checkbox-indeterminate label="17th Century scientists">
    <lion-checkbox label="Isaac Newton" .choiceValue="${'Isaac Newton'}"></lion-checkbox>
    <lion-checkbox label="Galileo Galilei" .choiceValue="${'Galileo Galilei'}"></lion-checkbox>
  </lion-checkbox-indeterminate>
</lion-checkbox-group>`;
export const HtmlStory11 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox-indeterminate label="Scientists">
    <lion-checkbox label="Isaac Newton" .choiceValue="${'Isaac Newton'}"></lion-checkbox>
    <lion-checkbox label="Galileo Galilei" .choiceValue="${'Galileo Galilei'}"></lion-checkbox>
    <lion-checkbox-indeterminate label="Old Greek scientists">
      <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
      <lion-checkbox label="Plato" .choiceValue="${'Plato'}"></lion-checkbox>
      <lion-checkbox label="Pythagoras" .choiceValue="${'Pythagoras'}"></lion-checkbox>
    </lion-checkbox-indeterminate>
  </lion-checkbox-indeterminate>
</lion-checkbox-group>`;
export const HtmlStory12 = () => html`<lion-checkbox-group name="scientists[]" label="Favorite scientists">
  <lion-checkbox-indeterminate mixed-state label="Scientists">
    <lion-checkbox label="Isaac Newton" .choiceValue="${'Isaac Newton'}"></lion-checkbox>
    <lion-checkbox label="Galileo Galilei" .choiceValue="${'Galileo Galilei'}"></lion-checkbox>
    <lion-checkbox-indeterminate mixed-state label="Old Greek scientists">
      <lion-checkbox label="Archimedes" .choiceValue="${'Archimedes'}"></lion-checkbox>
      <lion-checkbox label="Plato" .choiceValue="${'Plato'}"></lion-checkbox>
      <lion-checkbox label="Pythagoras" .choiceValue="${'Pythagoras'}"></lion-checkbox>
    </lion-checkbox-indeterminate>
  </lion-checkbox-indeterminate>
</lion-checkbox-group>`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory6', story: HtmlStory6 }, { key: 'HtmlStory7', story: HtmlStory7 }, { key: 'HtmlStory8', story: HtmlStory8 }, { key: 'HtmlStory9', story: HtmlStory9 }, { key: 'event', story: event }, { key: 'HtmlStory10', story: HtmlStory10 }, { key: 'HtmlStory11', story: HtmlStory11 }, { key: 'HtmlStory12', story: HtmlStory12 }];
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