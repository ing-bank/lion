Design: Button: Orange Juice



This is the OJ2 documentation site. Looking for the
[OJ1 documentation](https://orangejuice.ing.net/v4/index.html)?

Show Menu

[![Orange Juice logo](/_merged_assets/logo.svg)
![Orange Juice logo](/_merged_assets/logo-inverse.svg)
Orange Juice](/)

[Getting started](/gettlion-started/)
[Fundamentals](/fundamentals/)
[Develop](/develop/)
[Tooling](/tooling/)
[Components](/components/)

# Design: Button

A button web component that is easily stylable and accessible.

```
export const main = () => html` <lion-button>Default</lion-button> `;
```

Buttons are expressive components, which means they can change colours when used on an [expressive surface](../../surface/design/), so they always have enough colour contrast.

## Hierarchy

Presenting a clear hierarchy between the different buttons in a layout, guides the reader’s eyes to the most important call to actions. Buttons are used to initialize an action, either in the background or foreground of an experience. A design can show more than one button in a layout at a time. A high-emphasis button can be accompanied by medium- or low-emphasis buttons that perform less important actions.

### General guideline on what to use

Start off with a text button in the first version of your design. If you think a certain button needs more emphasis, go one level up. It’s good practice to give the option of moving forward in a journey more emphasis.

## Disabled buttons

While disabled buttons are supported, in most contexts - especially within forms - buttons are enabled by default.

For more background, see:

* [axesslab: Disabled buttons suck](https://axesslab.com/disabled-buttons-suck/?utm_source=dlvr.it&)
* [uxdesign: Why you shouldn't include disabled interaction elements in your design system](https://uxdesign.cc/why-you-shouldnt-include-disabled-interaction-elements-in-your-design-system-76a2d4307faf)
* [uxdesign: Why heuristics are only rules of thumb: "The case of the disabled button"](https://uxdesign.cc/why-heuristics-are-only-rules-of-thumb-the-case-of-the-disabled-button-4824958627e9)
* [medium: James Bond and the design of disabled buttons](https://medium.com/@vedranio/james-bond-and-the-design-of-disabled-buttons-6c6bc51ee4cf)

If you have the need of using a disabled button in your context, then at least inform the user why it is disabled.

## Button position

### Small viewports

Unless the button is small (ie. 'OK'), it spans the full width of the content container and is located at the bottom of that content.

### Large viewports

The button can be aligned either left or right edge of the content container depending on the context. Default is left.

![button position](../_assets/button-position.png)

## Button groups

### Small viewports

Important action go on top. Destructive actions require additional spacing to differentiate them from the other regular buttons.

### Large viewports

In a group of buttons the most important action goes to the right. A destructive action is aligned to the left.

![button group position](../_assets/button-groups.png)

### Sticky button groups

A sticky button acts on its own or in a group of 2.

### Small viewports

A sticky button group shares the width of the content container evenly across both buttons, up to full width.

### Large viewports

A sticky button group gets the width of both the sticky buttons in that group, including spacing.

![sticky button group position](../_assets/sticky-button-groups.png)

## Keyboard interactions

| Key combination | Action |
| --- | --- |
| `Space` | When in focus, activate the Button |
| `Enter` | When in focus, activate the Button |

## Accessibility

Buttons should always have an accessible name. For most buttons, this name will be the same as the text inside the button, but for icon buttons a label should not be forgotten.
