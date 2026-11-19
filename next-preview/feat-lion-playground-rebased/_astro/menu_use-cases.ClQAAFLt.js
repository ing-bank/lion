const e=`/** script code **/
import { html } from 'lit';
import '@lion/ui/define/lion-item.js';
import '@lion/ui/define/lion-menu.js';
import { applyMenuDemoStyles } from '/node_modules/_lion_docs/components/menu/applyMenuDemoStyles.js';

applyMenuDemoStyles();
/** stories code **/
export const HtmlStory34 = () => html\`<nav>
  <button data-invoker>Open menu</button>
  <lion-menu>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <button role="menuitem" data-invoker>Peek</button>
      <lion-menu>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu>
</nav>\`;
export const HtmlStory35 = () => html\`<nav>
  <lion-menu bar>
    <div>
      <a role="menuitem" data-invoker href="#home">home</a>
    </div>
    <div role="menuitem">Go to Definition</div>
    <div role="menuitem">Go to Type Definition</div>
    <div>
      <button role="menuitem" data-invoker>Details</button>
      <lion-menu>
        <div role="menuitem">Peek Call Hierarchy</div>
        <div role="separator"></div>
        <div role="menuitem">Peek Definition</div>
      </lion-menu>
    </div>
    <div role="separator"></div>
    <div role="menuitem">Find all References</div>
  </lion-menu>
</nav>\`;
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'HtmlStory34', story: HtmlStory34 }, { key: 'HtmlStory35', story: HtmlStory35 }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(\`[mdjs-story-name="\${story.key}"]\`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next-preview/feat-lion-playground-rebased/simulator","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}`;export{e as default};
