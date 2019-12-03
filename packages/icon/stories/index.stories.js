import { html, storiesOf } from '@open-wc/demoing-storybook';
import '../lion-icon.js';
import {
  bug01,
  bug02,
  bug05,
  bug06,
  bug08,
  bug12,
  bug19,
  bug23,
  bug24,
} from './icons/bugs-collection.js';
import aliensSpaceship from './icons/space/aliens-spaceship.svg.js';
import moonFlag from './icons/space/moon-flag.svg.js';
import night from './icons/space/night.svg.js';
import sun from './icons/space/sun.svg.js';

storiesOf('Icon System|Icon')
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
      <lion-icon class="icon" .svg=${bug01}></lion-icon>
      <lion-icon class="icon" .svg=${bug02}></lion-icon>
      <h2>Here are some bugs with aria-label:</h2>
      <lion-icon class="icon" .svg=${bug05} aria-label="Skinny dung beatle"></lion-icon>
      <lion-icon class="icon" .svg=${bug06} aria-label="Butterfly"></lion-icon>
      <lion-icon class="icon" .svg=${bug08} aria-label="Ant"></lion-icon>
      <lion-icon class="icon" .svg=${bug12} aria-label="Striped beatle"></lion-icon>
      <lion-icon class="icon" .svg=${bug19} aria-label="Beatle with long whiskers"></lion-icon>
      <lion-icon class="icon" .svg=${bug23} aria-label="Swim beatle"></lion-icon>
      <lion-icon class="icon" .svg=${bug24} aria-label="Big forrest ant"></lion-icon>
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
        <lion-icon .svg=${moonFlag}></lion-icon>
        <span>A lion-icon will naturally fill its line height</span>
      </div>
      <br />
      <dl>
        <div>
          <dt class="big-para"><lion-icon .svg=${night}></lion-icon></dt>
          <dd class="big-para"><span>with font-size: 1.5em;</span></dd>
        </div>

        <div>
          <dt><lion-icon .svg=${aliensSpaceship} class="big-icon"></lion-icon></dt>
          <dd><span>with 70 &times; 70 pixels</span></dd>
        </div>

        <div>
          <dt><lion-icon .svg=${sun} class="medium-icon"></lion-icon></dt>
          <dd><span>unstyled icon</span></dd>
        </div>

        <div>
          <dt><lion-icon .svg=${sun} class="styled-sun medium-icon"></lion-icon></dt>
          <dd><span>with fill: gold; and :hover { fill: purple; }</span></dd>
        </div>
      </dl>
    `,
  )
  .add(
    'collections',
    () => html`
      <style>
        .icon {
          width: 32px;
          height: 32px;
        }
      </style>
      <code>
        // load them like so <br />
        import { bug05, bug06, bug08, bug12, bug19, bug23, bug24 } from
        './icons/bugs-collection.js'; </code
      ><br /><br />
      <lion-icon class="icon" .svg=${bug05} aria-label="Skinny dung beatle"></lion-icon>
      <lion-icon class="icon" .svg=${bug06} aria-label="Butterfly"></lion-icon>
      <lion-icon class="icon" .svg=${bug08} aria-label="Ant"></lion-icon>
      <lion-icon class="icon" .svg=${bug12} aria-label="Striped beatle"></lion-icon>
      <lion-icon class="icon" .svg=${bug19} aria-label="Beatle with long whiskers"></lion-icon>
      <lion-icon class="icon" .svg=${bug23} aria-label="Swim beatle"></lion-icon>
      <lion-icon class="icon" .svg=${bug24} aria-label="Big forrest ant"></lion-icon>
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
  );
