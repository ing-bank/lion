import { storiesOf, html } from '@open-wc/demoing-storybook';
import { until } from '@lion/core';

import { icons } from '../src/icons';
import bug05 from './icons/bugs/bug05.svg.js';
import '../lion-icon.js';

icons.addIconResolver('lion', async (collection, iconName) => {
  switch (collection) {
    case 'bugs':
      return (await import('./icons/bugs-collection.js'))[iconName];
    case 'space':
      return (await import('./icons/space-collection.js'))[iconName];
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
});

storiesOf('Icon System|Icon', module)
  .add(
    'default',
    () => html`
      <style>
        .icon {
          width: 32px;
          height: 32px;
        }
      </style>
      <h2>Here are some bugs:</h2>
      <h2>Here are some bugs with aria-label:</h2>
      <lion-icon class="icon" icon-id="lion:bugs:bug01"></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug02"></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug05" aria-label="Skinny dung beatle"></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug06" aria-label="Butterfly"></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug08" aria-label="Ant"></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug12" aria-label="Striped beatle"></lion-icon>
      <lion-icon
        class="icon"
        icon-id="lion:bugs:bug19"
        aria-label="Beatle with long whiskers"
      ></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug23" aria-label="Swim beatle"></lion-icon>
      <lion-icon class="icon" icon-id="lion:bugs:bug24" aria-label="Big forrest ant"></lion-icon>
    `,
  )
  .add(
    'icons fit automatically',
    () => html`
      <style>
        div {
          font-size: 20px;
          margin-bottom: 5px;
        }

        .big-para {
          font-size: 1.5em;
        }

        .big-icon {
          width: 70px;
          height: 70px;
        }

        .medium-icon {
          width: 48px;
          height: 48px;
        }

        .styled-sun {
          fill: gold;
        }

        .styled-sun:hover {
          fill: purple;
        }

        dt,
        dd {
          display: inline-block;
          vertical-align: middle;
          min-width: 80px;
          margin: 0;
        }
      </style>
      <div>
        <lion-icon icon-id="lion:space:moonFlag"></lion-icon>
        <span>A lion-icon will naturally fill its line height</span>
      </div>
      <br />
      <dl>
        <dt class="big-para"><lion-icon icon-id="lion:space:night"></lion-icon></dt>
        <dd class="big-para"><span>with font-size: 1.5em;</span></dd>
        <br />

        <dt><lion-icon icon-id="lion:space:alienSpaceship" class="big-icon"></lion-icon></dt>
        <dd><span>with 70 &times; 70 pixels</span></dd>
        <br />

        <dt><lion-icon icon-id="lion:space:sun" class="medium-icon"></lion-icon></dt>
        <dd><span>unstyled icon</span></dd>
        <br />

        <dt><lion-icon icon-id="lion:space:sun" class="styled-sun medium-icon"></lion-icon></dt>
        <dd><span>with fill: gold; and :hover { fill: purple; }</span></dd>
      </dl>
    `,
  )
  .add(
    'sync icons',
    () => html`
      <style>
        .icon {
          width: 32px;
          height: 32px;
        }
      </style>
      <code>
        // icons can be imported and rendered synchronously, note that this may impact performance:
        <br />
        import bug05 from './icons/bugs/bug05.js'; </code
      ><br /><br />
      <lion-icon class="icon" .svg=${bug05} aria-label="Skinny dung beatle"></lion-icon>
    `,
  )
  .add(
    'dynamic icons',
    () => html`
      <style>
        .icon {
          width: 32px;
          height: 32px;
        }
      </style>
      <lion-icon
        class="icon"
        .svg=${import('./icons/bugs/bug05.svg.js')}
        aria-label="Skinny dung beatle"
      ></lion-icon>
    `,
  )
  .add(
    'dynamic icons using until',
    () => html`
      <style>
        .icon {
          width: 32px;
          height: 32px;
        }
      </style>
      <lion-icon
        class="icon"
        .svg=${until(import('./icons/bugs/bug12.svg.js').then(e => e.default), 'Loading...')}
        aria-label="Striped beatle"
      ></lion-icon>
    `,
  );
