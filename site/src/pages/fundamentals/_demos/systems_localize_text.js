/** script code **/
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { localize, formatNumber, formatDate, LocalizeMixin } from '@lion/ui/localize.js';
import '@lion/ui/define-helpers/sb-locale-switcher.js';
/** stories code **/
export const asFunction = () => {
  const wrapper = document.createElement('div');
  let message = 'Loading...';
  function update() {
    message = localize.msg('lit-html-example:body');
    render(
      html`
        <p>${message}</p>
        <sb-locale-switcher></sb-locale-switcher>
      `,
      wrapper,
    );
  }
  localize
    // TODO: look for Astro fix...
    // .loadNamespace({
    //   'lit-html-example': locale => import(`./assets/${locale}.js`),
    // })
    .then(() => {
      update();
    });
  localize.addEventListener('localeChanged', () => {
    localize.loadingComplete.then(() => update());
  });
  return wrapper;
};
export const webComponent = () => {
  class MessageExample extends LocalizeMixin(LitElement) {
    static get localizeNamespaces() {
      return [
        { 'lit-html-example': locale => import(`./assets/translations/${locale}.js`) },
        ...super.localizeNamespaces,
      ];
    }

    render() {
      return html`
        <div aria-live="polite">
          <p>${localize.msg('lit-html-example:body')}</p>
        </div>
      `;
    }
  }
  if (!customElements.get('message-example')) {
    customElements.define('message-example', MessageExample);
  }
  return html`
    <message-example></message-example>
    <sb-locale-switcher></sb-locale-switcher>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'asFunction', story: asFunction }, { key: 'webComponent', story: webComponent }];
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