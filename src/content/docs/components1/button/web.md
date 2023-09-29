---
component: button
category: development
platform: web
type: component-development
---

# Button >> Web ||50

```js script
import { html } from 'ing-web/lit-2.js';
import { css } from 'ing-web/_lit-1-and-2-component-helpers.js';
import { orange, indigo, sky } from 'ing-web/style.js';
import { tooltipComponentStyle } from 'ing-web/_deprecated.js';
import 'ing-web/button.js';
import 'ing-web/icon.js';
import 'ing-web/tooltip.js';
import { IngButton } from 'ing-web/button.js';
customElements.define('ing-button', IngButton);


const buttonDemoStyle = css`
  ${tooltipComponentStyle}
  .demo-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: initial;
    min-width: 288px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .demo-box__column {
    flex: 1 1 288px;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: auto;
    min-width: 288px;
  }
  .u-bg-orange {
    background-color: var(--orange);
  }
  .u-bg-indigo {
    background-color: var(--indigo);
  }
  .u-bg-sky {
    background-color: var(--sky);
  }
  .u-bg-grey {
    background-color: var(--black6);
  }
  .demo-box--wallpaper {
    background-image: url('./dev-assets/ing-wallpaper.jpg');
    background-position: center;
    background-size: cover;
  }
  .demo-box__column ing-button {
    margin: 8px 0;
  }
`;
```

```js ::importSmallBlock('@lion/ui/docs/components/button/overview.md', '## Features')

```

## Text Button

### Purpose

A text button represents the lowest important action on a page or a page section. Button titles should be imperative to indicate the action.

### Appearance

The Text Button is available in four sizes (`font19` (default), `font16`, `font14` and `font12`).

Three colors are available on light backgrounds (`indigo` (default), `orange` and `grey`). On coloured backgrounds you have to use the `inverted` version which comes in three colors (`orange` (default), `indigo`, and `sky`).

All available color and size combinations are shown below, all others are not allowed due to having not enough color contrast.

```js story
export const textButton = () => {
  return html`
    <style>
      ${buttonDemoStyle.cssText}
    </style>

    <div class="demo-box">
      <div class="demo-box__column">
        <ing-button text>Text Button 19px</ing-button>

        <ing-button text font16>Text Button 16px</ing-button>

        <ing-button text font14>Text Button 14px</ing-button>

        <ing-button text font12>Text Button 12px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>

        <ing-button text font16>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 16px
        </ing-button>

        <ing-button text font14>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
          Text Button 14px
        </ing-button>
      </div>
    </div>

    <div class="demo-box">
      <div class="demo-box__column">
        <ing-button text orange>Text Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text orange>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>
      </div>
    </div>

    <div class="demo-box">
      <div class="demo-box__column">
        <ing-button text grey>Text Button 19px</ing-button>

        <ing-button text grey font16>Text Button 16px</ing-button>

        <ing-button text grey font14>Text Button 14px</ing-button>

        <ing-button text grey font12>Text Button 12px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text grey>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>

        <ing-button text grey font16>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 16px
        </ing-button>

        <ing-button text grey font14>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
          Text Button 14px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-grey">
      <div class="demo-box__column">
        <ing-button text>Text Button 19px</ing-button>

        <ing-button text font16>Text Button 16px</ing-button>

        <ing-button text font14>Text Button 14px</ing-button>

        <ing-button text font12>Text Button 12px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>

        <ing-button text font16>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 16px
        </ing-button>

        <ing-button text font14>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
          Text Button 14px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-grey">
      <div class="demo-box__column">
        <ing-button text grey>Text Button 19px</ing-button>

        <ing-button text grey font16>Text Button 16px</ing-button>

        <ing-button text grey font14>Text Button 14px</ing-button>

        <ing-button text grey font12>Text Button 12px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text grey>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>

        <ing-button text grey font16>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 16px
        </ing-button>

        <ing-button text grey font14>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
          Text Button 14px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-orange">
      <div class="demo-box__column">
        <ing-button text inverted>Text Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text inverted>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-indigo">
      <div class="demo-box__column">
        <ing-button text indigo inverted>Text Button 19px</ing-button>

        <ing-button text indigo inverted font16>Text Button 16px</ing-button>

        <ing-button text indigo inverted font14>Text Button 14px</ing-button>

        <ing-button text indigo inverted font12>Text Button 12px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text indigo inverted>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>

        <ing-button text indigo inverted font16>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 16px
        </ing-button>

        <ing-button text indigo inverted font14>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
          Text Button 14px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-sky">
      <div class="demo-box__column">
        <ing-button text sky inverted>Text Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button text sky inverted>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Text Button 19px
        </ing-button>
      </div>
    </div>
    ${['', 'u-bg-grey'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button text disabled>Disabled Text Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button text disabled>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Disabled Text Button 19px
            </ing-button>
          </div>
        </div>
      `,
    )} ${['u-bg-orange', 'u-bg-indigo', 'u-bg-sky'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button text disabled inverted>Disabled Text Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button text disabled inverted>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Disabled Text Button 19px
            </ing-button>
          </div>
        </div>
      `,
    )}
  `;
};
```

```html
<ing-button text> Text Button 19px </ing-button>

<ing-button text indigo inverted font16>
  <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
  Text Button 16px
</ing-button>
```

## Outline Button

### Purpose

Outline buttons fall into the category medium-emphasis buttons.
An outline button represents an action on a page or a page section. The amount of outlined buttons on a page should be limited.

### Appearance

The Outline Button is available in four sizes (`font19` (default), `font16`, `font14` and `font12`).

Four colors (`orange` (default), `sky`, `indigo` and `grey`) are available for Outline buttons. For coloured backgrounds there is an `inverted` version.

All available color and size combinations are shown below, all others are not allowed due to having not enough color contrast.

```js story
export const outlineButton = () => {
  return html`
    <style>
      ${buttonDemoStyle.cssText}
    </style>
    ${['', 'u-bg-grey'].map(
      boxMod => html`
        ${boxMod === ''
          ? html`
              <div class="demo-box ${boxMod}">
                <div class="demo-box__column">
                  <ing-button outline>Outline Button 19px</ing-button>
                </div>

                <div class="demo-box__column">
                  <ing-button outline>
                    <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
                    Outline Button 19px
                  </ing-button>
                </div>
              </div>
            `
          : ''}
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button outline indigo>Outline Button 19px</ing-button>

            <ing-button outline indigo font16>Outline Button 16px</ing-button>

            <ing-button outline indigo font14>Outline Button 14px</ing-button>

            <ing-button outline indigo font12>Outline Button 12px</ing-button>
          </div>

          <div class="demo-box__column"></div>
        </div>
        ${boxMod === ''
          ? html`
              <div class="demo-box ${boxMod}">
                <div class="demo-box__column">
                  <ing-button outline sky>Outline Button 19px</ing-button>
                </div>

                <div class="demo-box__column">
                  <ing-button outline sky>
                    <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
                    Button ING Me Bold 19px
                  </ing-button>
                </div>
              </div>
            `
          : ''}
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button outline grey>Outline Button 19px</ing-button>
            ${boxMod === ''
              ? html`
                  <ing-button outline grey font16>Outline Button 16px</ing-button>

                  <ing-button outline grey font14>Outline Button 14px</ing-button>

                  <ing-button outline grey font12>Outline Button 12px</ing-button>
                `
              : ''}
          </div>

          <div class="demo-box__column">
            <ing-button outline grey>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Outline Button 19px
            </ing-button>
            ${boxMod === ''
              ? html`
                  <ing-button outline grey font16>
                    <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
                    Button ING Me Bold 16px
                  </ing-button>

                  <ing-button outline grey font14>
                    <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
                    Button ING Me Bold 14px
                  </ing-button>
                `
              : ''}
          </div>
        </div>
      `,
    )}
    <div class="demo-box u-bg-orange">
      <div class="demo-box__column">
        <ing-button outline inverted>Outline Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button outline inverted>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Outline Button 19px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-indigo">
      <div class="demo-box__column">
        <ing-button outline indigo inverted>Outline Button 19px</ing-button>

        <ing-button outline indigo inverted font16>Outline Button 16px</ing-button>

        <ing-button outline indigo inverted font14>Outline Button 14px</ing-button>

        <ing-button outline indigo inverted font12>Outline Button 12px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button outline indigo inverted>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Outline Button 19px
        </ing-button>

        <ing-button outline indigo inverted font16>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Outline Button 16px
        </ing-button>

        <ing-button outline indigo inverted font14>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
          Outline Button 14px
        </ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-sky">
      <div class="demo-box__column">
        <ing-button outline sky inverted>Outline Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button outline sky inverted>
          <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
          Outline Button 19px
        </ing-button>
      </div>
    </div>
    ${['', 'u-bg-grey'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button outline disabled>Disabled Outline Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button outline disabled>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Disabled Outline Button 19px
            </ing-button>
          </div>
        </div>
      `,
    )} ${['u-bg-orange', 'u-bg-indigo', 'u-bg-sky'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button outline disabled inverted>Disabled Outline Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button outline disabled inverted>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Disabled Outline Button 19px
            </ing-button>
          </div>
        </div>
      `,
    )}
  `;
};
```

```html
<ing-button outline> Outline Button 19px </ing-button>

<ing-button outline indigo inverted font16>
  <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
  Outline Button 16px
</ing-button>
```

## Filled buttons

### Purpose

Filled buttons have high-emphasis. A filled button represents an important action on a page or a page section.

### When to use

Generally, filled buttons are used for conversional actions such as ‘Sign me up’, ‘Acquire this product’. Orange is the preferred color, as long as it’s accessible. Use Indigo and gray otherwise. Filled buttons could be accompanied by an outline button or a text button. The amount of filled buttons on a page should be limited. The amount of filled buttons on a page section should be one.

### On top of imagery

Filled buttons can be placed on top of imagery as long as the button colour has enough contrast with the image background.

### Appearance

The Filled Button is available in four sizes (`font19` (default), `font16`, `font14` and `font12`).

Four colors (`orange` (default), `sky`, `indigo` and `grey`) are available for Filled buttons. For colored backgrounds there is an `inverted` version.

All available color and size combinations are shown below, all others are not allowed due to having not enough color contrast.

Icon colors are limited to Orange and White by the Brand Guidelines. This results in a very small set of filled buttons with icons. Buttons with icons should only be used when absolutely necessary.

```js story
export const filledButton = () => {
  return html`
    <style>
      ${buttonDemoStyle.cssText}
    </style>
    ${['', 'u-bg-grey'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button>Filled Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Filled Button 19px
            </ing-button>
          </div>
        </div>

        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button indigo>Filled Button 19px</ing-button>

            <ing-button indigo font16>Filled Button 16px</ing-button>

            <ing-button indigo font14>Filled Button 14px</ing-button>

            <ing-button indigo font12>Filled Button 12px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button indigo>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Filled Button 19px
            </ing-button>

            <ing-button indigo font16>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Filled Button 16px
            </ing-button>

            <ing-button indigo font14>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockFilled"></ing-icon>
              Filled Button 14px
            </ing-button>
          </div>
        </div>

        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button sky>Filled Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button sky>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Filled Button 19px
            </ing-button>
          </div>
        </div>

        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button grey>Filled Button 19px</ing-button>

            <ing-button grey font16>Filled Button 16px</ing-button>

            <ing-button grey font14>Filled Button 14px</ing-button>

            <ing-button grey font12>Filled Button 12px</ing-button>
          </div>

          <div class="demo-box__column"></div>
        </div>
      `,
    )}
    <div class="demo-box u-bg-grey">
      <div class="demo-box__column">
        <ing-button inverted>Filled Button 19px</ing-button>

        <ing-button inverted font16>Filled Button 16px</ing-button>

        <ing-button inverted font14>Filled Button 14px</ing-button>

        <ing-button inverted font12>Filled Button 12px</ing-button>
      </div>

      <div class="demo-box__column"></div>
    </div>

    <div class="demo-box u-bg-orange">
      <div class="demo-box__column">
        <ing-button inverted>Filled Button 19px</ing-button>

        <ing-button inverted font16>Filled Button 16px</ing-button>

        <ing-button inverted font14>Filled Button 14px</ing-button>

        <ing-button inverted font12>Filled Button 12px</ing-button>
      </div>

      <div class="demo-box__column"></div>
    </div>

    <div class="demo-box u-bg-indigo">
      <div class="demo-box__column">
        <ing-button indigo inverted>Filled Button 19px</ing-button>

        <ing-button indigo inverted font16>Filled Button 16px</ing-button>

        <ing-button indigo inverted font14>Filled Button 14px</ing-button>

        <ing-button indigo inverted font12>Filled Button 12px</ing-button>
      </div>

      <div class="demo-box__column"></div>
    </div>

    <div class="demo-box u-bg-sky">
      <div class="demo-box__column">
        <ing-button sky inverted>Filled Button 19px</ing-button>

        <ing-button sky inverted font16>Filled Button 16px</ing-button>

        <ing-button sky inverted font14>Filled Button 14px</ing-button>

        <ing-button sky inverted font12>Filled Button 12px</ing-button>
      </div>

      <div class="demo-box__column"></div>
    </div>
    ${['', 'u-bg-grey'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button disabled>Disabled Filled Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button disabled>
              <ing-icon slot="icon-before" icon-id="ing:devices:clockOutline"></ing-icon>
              Disabled Filled Button 19px
            </ing-button>
          </div>
        </div>
      `,
    )} ${['u-bg-orange', 'u-bg-indigo', 'u-bg-sky'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button disabled inverted>Disabled Filled Button 19px</ing-button>
          </div>

          <div class="demo-box__column"></div>
        </div>
      `,
    )}
  `;
};
```

```html
<ing-button> Filled Button 19px </ing-button>

<ing-button indigo inverted font16> Filled Button 16px </ing-button>
```

## Sticky Buttons

### Purpose

Sticky buttons float and stay in the viewport, that’s why they have the highest-emphasis.

### When to use

Use a sticky button when you want the button to be in the viewport at all times. If present, it represents the most important action on a page. The sticky button is always visible in a certain viewport in a fixed position. It doesn’t scroll with the rest of the page.

Per page there can be only one sticky button or one group in which two sticky buttons are joined. Use of a sticky button is not mandatory. The active background colour of this type of button is 20% lighter than the hover background color. Sticky buttons are never part of a form.

If roughly 80% of the users come to a page for a certain action, use a sticky button for that action. Example: Transfer money on the homepage of the closed environment.

### Relationship with a filled button

If there’s a filled button representing an important action being scrolled out of the viewport, you could consider showing a sticky button.

### Appearance

The Sticky Button is available in three colors (`Orange` (default), `Sky` and `Indigo`).
Orange and Sky Sticky Buttons only come in one size (`font19`), the Indigo Sticky Buttons exist in two sizes (`font19` and `font16`).

```js story
export const stickyButton = () => {
  return html`
    <style>
      ${buttonDemoStyle}
    </style>
    ${['', 'u-bg-grey'].map(
      boxMod => html`
        <div class="demo-box ${boxMod}">
          <div class="demo-box__column">
            <ing-button elevated>Sticky Button 19px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button indigo elevated>Sticky Button 19px</ing-button>

            <ing-button indigo elevated font16>Sticky Button 16px</ing-button>
          </div>

          <div class="demo-box__column">
            <ing-button sky elevated>Sticky Button 19px</ing-button>
          </div>
        </div>
      `,
    )}
    <div class="demo-box u-bg-orange">
      <div class="demo-box__column">
        <ing-button elevated>Sticky Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button indigo elevated>Sticky Button 19px</ing-button>

        <ing-button indigo elevated font16>Sticky Button 16px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button sky elevated>Sticky Button 19px</ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-indigo">
      <div class="demo-box__column">
        <ing-button elevated>Sticky Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button indigo elevated>Sticky Button 19px</ing-button>

        <ing-button indigo elevated font16>Sticky Button 16px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button sky elevated>Sticky Button 19px</ing-button>
      </div>
    </div>

    <div class="demo-box u-bg-sky">
      <div class="demo-box__column">
        <ing-button elevated>Sticky Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button indigo elevated>Sticky Button 19px</ing-button>

        <ing-button indigo elevated font16>Sticky Button 16px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button sky elevated>Sticky Button 19px</ing-button>
      </div>
    </div>

    <div class="demo-box demo-box--wallpaper">
      <div class="demo-box__column">
        <ing-button elevated>Sticky Button 19px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button indigo elevated>Sticky Button 19px</ing-button>

        <ing-button indigo elevated font16>Sticky Button 16px</ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button sky elevated>Sticky Button 19px</ing-button>
      </div>
    </div>
  `;
};
```

```html
<ing-button elevated> Sticky Button 19px </ing-button>

<ing-button elevated indigo font16> Sticky Button 16px </ing-button>
```

```js ::importBlock('@lion/ui/docs/components/button/use-cases.md', '## With click handler')

```

```js ::importBlock('@lion/ui/docs/components/button/use-cases.md', '## Disabled button')

```

## Icon Position

Icons can be positioned in before or after the text of the button. This counts for Text, Outline, Filled and Sticky buttons. You can use the `icon-before` and `icon-after` slots to place the icon.
Common examples for buttons with icons are:

- previous/next
- download

### Guidelines

- The standard position is `after`, only make us of `before` when you have a solid use case.
- Please only use filledin icons in buttons

```js preview-story
export const iconPosition = () => {
  return html`
    <style>
      ${buttonDemoStyle.cssText}
    </style>

    <div class="demo-box">
      <div class="demo-box__column">
        <ing-button outline indigo font16>
          <ing-icon slot="icon-before" icon-id="ing:arrows:arrowLeftFilled"></ing-icon>
          Previous
        </ing-button>
      </div>

      <div class="demo-box__column">
        <ing-button outline indigo font16>
          Next
          <ing-icon slot="icon-after" icon-id="ing:arrows:arrowRightFilled"></ing-icon>
        </ing-button>
      </div>
    </div>

    <div class="demo-box">
      <div class="demo-box__column">
        <ing-button filledin orange font19>
          Download
          <ing-icon slot="icon-after" icon-id="ing:functionalities:downloadFilled"></ing-icon>
        </ing-button>
      </div>
    </div>
  `;
};
```

## Usage with native web form

`<ing-button>` supports the following use cases:

- Submit on button click
- Submit on button enter or space keypress
- Submit on enter keypress inside an input
- Reset native form fields when using type="reset"

```js preview-story
export const withinForm = () => html`
  <form
    @submit=${ev => {
      ev.preventDefault();
      console.log('submit handler', ev.target);
    }}
  >
    <label for="firstNameId">First name</label>

    <input id="firstNameId" name="firstName" />

    <label for="lastNameId">Last name</label>

    <input id="lastNameId" name="lastName" />

    <ing-button type="submit" @click=${ev => console.log('click submit handler', ev.target)}>
      Submit
    </ing-button>
  </form>
`;
```

Important notes:

- A `<ing-button type="submit">` is mandatory for the last use case, if you have multiple inputs. This is native behaviour.
- `@click` on `<ing-button type="submit">` and `@submit` on `<form>` are triggered by these use cases. We strongly encourage you to listen to the submit handler if your goal is to do something on form-submit.
- To prevent form submission full page reloads, add a **submit handler on the form** `@submit` with `event.preventDefault()`. Adding it on the `<ing-button type="submit">` is not enough.

## Web considerations

```js ::importBlockContent('@lion/ui/docs/components/button/use-cases.md', '## Considerations')
module.exports.replace = node => {
  if (node.value) {    
    let newValue = node.value;
    newValue = newValue.replace(/<lion-button>/gs, '<ing-button>');
    node.value = newValue;
  }
  return node;
};
```

## How to use

```bash
npm i --save ing-web
```

```js
import { IngButton } from 'ing-web/button.js';
```
