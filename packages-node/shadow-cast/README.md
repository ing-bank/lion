# ShadowCast

Every traditional css component casts a shadow.
That is: when used in shadow dom, it needs a counterpart built from different selectors.
In a shadow dom context, it will be necessary to map ‘traditional selectors’ to concepts like ‘:host’ and ‘::slotted’.
Also, states exposed by a custom (usually via host attributes) should be mapped.What is a traditional css component actually?
What is meant by a traditional css component is a set of css rules that are designed to be mapped to a light dom structure.
Examples of these libraries are:

- Bootstrap
- Material Design css
- Tailwind css
- Every other BEM/SMACCS/ITCSS etc. library...

### Traditional css components in modern contexts

Let’s illustrate the problems with traditional css components with a practical example. Assume we have a css library called ‘ds’ (an abbreviation for design system). It can be thought of as a library similar to material-design-web.It contains the following ‘ds-formfield’ component:

```css
.ds-formfield {
  padding: 10px;
}
.ds-formfield .ds-formfield__input {
  border: 1px solid black;
}
.ds-formfield .ds-formfield__feedback.ds-formfield__feedback—invalid {
  color: red;
}
```

```html
<div class="“ds-formfield" ds-formfield—invalid”>
  <input class="“ds-formfield__input”" />
  <div class="“ds-formfield__feedback”">
    Error message
  </div>
</div>
```

This Design System consists of css only. It can be used in many contexts:

- cmses
- vanilla JS components
- web components
- framework(like Angular/React/Vue) components
  Some of these contexts contain shadow dom. Let’s say for example we want to map the css to a web component with the following template:

```html  <slot name=”input”></slot>
<div class="“ds-formfield__feedback”">Error message</div>
```

A consumer of the web component would use it like this:

```html
<wc-formfield><input slot="“input”"/></wc-formfield>
```

Note that the web component exposes styleable states via attributes ([selected] in this case)
If we want to consume the styles of ds-ds-formfield in a shadow root, we need to ‘fork’ them
Inside the web component:

```css
:host {
  padding: 10px;
}
:host ::slotted([slot='“input”']) {
  border: 1px solid black;
}
:host([invalid]) .ds-formfield__feedback {
  border-color: red;
}
```

This means that whenever the css library updates, we need to manually update the 'shadow styles' for our web components. For a huge library, this will mean a lot of manual, error prone and double maintenance.
Let's bring some darkness into the light
Let's cast some shadows. The above mentioned component can be transformed via this config:

```js
{
  name: ‘wcfield’,
  sourcepaths: [‘./dist/ds-formfield.css’],
  host: ‘.ds-formfield’,
  slots: {
    ‘input’: ‘.ds-formfield__input’;
  }
  ,
  states: {
    ‘[invalid]’: ‘.ds-formfield .ds-formfield__feedback.ds-formfield__feedback—invalid’;
  }
}
```
