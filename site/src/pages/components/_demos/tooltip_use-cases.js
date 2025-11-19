/** script code **/
import { css, html } from '@mdjs/mdjs-preview';
import { LionTooltip } from '@lion/ui/tooltip.js';
import '@lion/ui/define/lion-tooltip.js';
/** stories code **/
export const invokerRelation = () => {
  const invokerRelationConfig = { invokerRelation: 'label' };
  return html`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config="${invokerRelationConfig}">
      <button slot="invoker" class="demo-tooltip-invoker">📅</button>
      <div slot="content">Agenda<div>
    </lion-tooltip>
  `;
};
export const placements = () => {
  const placementTopConfig = { popperConfig: { placement: 'top' } };
  const placementRightConfig = { popperConfig: { placement: 'right' } };
  const placementBottomConfig = { popperConfig: { placement: 'bottom' } };
  const placementLeftConfig = { popperConfig: { placement: 'left' } };
  return html`
    <style>
      button[slot='invoker'] {
        margin: 50px;
      }
      div[slot='content'] {
        background-color: white;
        padding: 4px;
      }
    </style>
    <div class="demo-box-placements">
      <lion-tooltip has-arrow .config="${placementTopConfig}">
        <button slot="invoker">Top</button>
        <div slot="content">Top placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config="${placementRightConfig}">
        <button slot="invoker">Right</button>
        <div slot="content">Right placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config="${placementBottomConfig}">
        <button slot="invoker">Bottom</button>
        <div slot="content">Bottom placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config="${placementLeftConfig}">
        <button slot="invoker">Left</button>
        <div slot="content">Left placement</div>
      </lion-tooltip>
    </div>
  `;
};
export const overridePopperConfig = () => {
  const overridePopperConfig = {
    popperConfig: {
      placement: 'bottom-start',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'keepTogether',
          options: {},
          enabled: true,
        },
        {
          name: 'preventOverflow',
          options: {
            boundariesElement: 'viewport',
            padding: 16,
          },
          enabled: false,
        },
        {
          name: 'flip',
          options: {
            boundariesElement: 'viewport',
            padding: 4,
          },
          enabled: true,
        },
        {
          name: 'offset',
          options: {
            // Note the different offset notation
            offset: [0, 4],
          },
          enabled: true,
        },
      ],
    },
  };
  return html`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config="${overridePopperConfig}">
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip<div>
    </lion-tooltip>
  `;
};
export const arrow = () => html`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`;
export const customArrow = () => {
  if (!customElements.get('custom-tooltip')) {
    customElements.define(
      'custom-tooltip',
      class extends LionTooltip {
        static get styles() {
          return [
            ...super.styles,
            css`
              :host {
                --tooltip-arrow-width: 20px;
                --tooltip-arrow-height: 8px;
              }
            `,
          ];
        }
        constructor() {
          super();
          this.hasArrow = true;
        }
        _arrowTemplate() {
          return html`
            <svg viewBox="0 0 20 8" class="arrow__graphic">
              <path d="M 0,0 h 20 L 10,8 z"></path>
            </svg>
          `;
        }
      },
    );
  }
  return html`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <custom-tooltip>
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip</div>
    </custom-tooltip>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'invokerRelation', story: invokerRelation }, { key: 'placements', story: placements }, { key: 'overridePopperConfig', story: overridePopperConfig }, { key: 'arrow', story: arrow }, { key: 'customArrow', story: customArrow }];
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
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}