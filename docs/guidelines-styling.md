# Guidlines for Styling

## Markup and styling

All Lion webcomponents have white label styling: this means theming is not applied,
but functional styling is.

### Functional styling

Functional styling can be divided into defaults for 'basic layout' and 'accessibility'.
Examples for both categories can be found below:

- Basic layout examples:

  - A dropdown menu has 'position: absolute'
  - A lion-button might behave as an 'display: inline-block' element
  - A suffix attached to an input is horizontally positioned (instead of vertically stacked)

- Accessibility examples:
  - content (for instance a caption in a table) can be 'visually hidden': it will be
    readable by screen readers, but invisible for end users
  - when an html table is used, we allow [subclassers](./definitions.md) to override the display
    property ('table-cell') to 'flex'. By putting the proper accessible roles ('role="cell"') in the
    markup, we guaruantee our markup stays accessible

Although Lion components try to stay as unbiased as possible with regard to styling, defaults will
be needed. In these cases we try to follow the platform as much as possible. If the platform
doesn't provide defaults, the largest common denominator across exisiting UI frameworks is taken as
a lead.

## Style components

A style component consists of a set of css classes mapping to a certain html structure. Although css
components are often implemented by webcomponents, they should be considered modules on their own,
reusable in different contexts: they should be considered the lowest abstraction layer of a
webcomponent.

A webcomponent usually implements a css module (mapped at host level), but the opposite is not
necessarily true: a css module doesn't have to be used inside a webcomponent or at the root level
of a webcomponent.

Advantages of developing style components isolated from webcomponents are:

- They can be reused in non shadow dom contexts.
- Not everything has to be a webcomponent: anchor or card styling inside a webcomponent would be a
  matter of importing a style component into a shadowroot.

### Requirements

Style components are written with the following assumptions in mind:

- **Environment agnostic**: Lion webcomponents are unopinionated about their environment: they
  should be usable in every context/framework/technology thinkable, regardless of whether shadow dom
  is used.
- **Customisable**: They should provide an api for [subclassers](./definitions.md):
  - **white label**: components (just like webcomponents) are white label components. They provide
    a flexible html structure which should be mappable to any Design System.
    This approach is inspired by [Inuitcss](https://github.com/inuitcss/inuitcss) (an architectural
    foundation for white label style components) and [Bootstrap Material](https://fezvrasta.github.io/bootstrap-material-design/)
    (a Material Design system based on existing Bootstrap html/class names).
    This is also [a great example of a Design System](https://www.carbondesignsystem.com/components/checkbox/code)
    taking this(style components as lowest abstraction layer) approach.
  - **well structured**: for clear, readable and maintainable code we use [BEM](http://getbem.com/):
    it forces the
    developer to think about component structure in terms of 'block', 'element' and 'modifier'
    parts/roles. The classes defined in a BEM component form the api for a
    [subclasser](./definitions.md): he can 'fill in' the BEM selectors by overriding them in the
    `static get styles()` configuration property on the constructor of a webcomponent.
  - **flexible markup**: By making the HTML structure purposely 'loose', multiple Design Systems can
    be made compatible with the style component. When the default html/css structure is not flexible
    enough, it can be extended by creating new BEM element selectors.

## Why BEM?

For css class naming, we use [BEM](http://getbem.com/) naming conventions. This helps you identify
semantics of your markup at a quick glance, resulting in more readable and maintainable code.
BEM provides us the following advantages:

- **Clear namings** that convey meaning about semantics and structure at a quick glance
- **Prevent collisions** within shadow roots. Larger shadow roots using multiple style components
  would easily collide when css selectors would be scoped to the shadow dom in which they were
  created. For instance, calling the header of a card '.header' instead of '.c-card\_\_header'
  would make the card component not reusable in different contexts.
- **Maximum flexibility** we can write css regardless of context. When we create a style component
  for a card, we can offer it as a style component only and later decide to offer it as a webcomponent.
  Or offer the style component
  as a more lower level api for advanced use cases and the webcomponent (that has limiting markup and
  styling options) for the majority of cases.
  Also, when we already have a webcomponent for the card and people want to create a custom card
  component, it might make more sense to write a new webcomponent instead of extending the existing
  card webcomponent.
  Having style components as described above, allows for maximum flexibility in these scenarios.
  Future CSS updates can then be done from a central place, without having to rewrite forked webcomponents.
- **Performance** we aim for applications having a limited number of shadow roots and we consider
  shadow root creation a performance concern. Style components reduce the need for shadow roots.
  <!-- TODO: we definitely suffered here in the Polymer era. We might want to create some new perf
  tests for our lit-element based apps to verify this claim again. -->

### Challenges with BEM in shadow dom

Mapping BEM components to shadow root is not really straightforward:

1. host styles should be rewritten to `:host {}` instead of `.my-block {}`
2. slot styles be rewritten to `::slotted(.my-block__element)` instead of `.my-block__element`
3. we should not [self-apply classes](https://developers.google.com/web/fundamentals/web-components/best-practices)
  on host level. Apart from this being a bad practice, it will trigger linting errors in our setup.

### Mapping host and slot styles

The [CSS Module](https://github.com/w3c/webcomponents/issues/759) and [CSS Selector](https://github.com/w3c/csswg-drafts/issues/3714) proposals would allow us to reuse BEM components more easily within webcomponents.
We might also think about other ways of creating build steps that would allow us to map BEM
components to a shadow root, making it possible to map hosts and slots in an eay way.

<!-- TODO: quite important that we find a solution to this problem -->

### No self-application of classes

In order to adhere to this rule, notation of our BEM modifiers that live on the host (which are
ususally written like `.my-block--my-modifier`) will be rewritten to `.my-block[my-modifier]`
Although this would only be needed for the third challenge as described above, for consistency,
we apply it to all our modifiers within our style component.
So for instance `.my-block__element--my-other-modifier` becomes
`.my-block__element[my-other-modifier]`.

### Why mapping style components to the host matters

- **flexible host overrides**:
  Imagine we have a style component `.c-alert` and we want to map this to a webcomponent `<my-alert>`.
  In our Design system it might be a good practice to give all our block components a default bottom
  margin of 16px. An [Application Developer](./definitions.md) might need an instance of `<my-alert>` where he wants to
  set this bottom margin to 0.
  If the margin-bottom of 16px would not be defined on the host level but one level deeper (the first
  div element within the shadow root of `<my-alert>`), the Application Developer needs to apply a
  negative margin of -16px. The latter would be a bad practice.

- **easily map modifiers**:
  If we continue with our alert example and we have a flag 'is-closeable', we might need to adjust
  styling based on that. In this case we assume the attribute 'is-closeable' serves as a styling
  hook for the `.c-alert` component.

## Css variables

Css variables will not be added in our white label style components, but adding them in your own
extension layer would be a perfect fit.

## Parts and themes

The `::part` and `::theme` specs might currently not be widely adopted enough to be used inside
style components. When they are, we could be consider to add them later to our components as a means
to theme components (changing a whole Design System is not a good idea).

<!-- TODO: check if needed for story above, else delete
It would mainly be benificial when:

- styles need to be reused in a context where extending is not a solution/forking is needed (which
happened quite some times in our previous components lib, making our core styles less scalable).

- style components (and their corresponding html structure) are considered the core building
blocks of a Design System. Webcomponents provide a developer friendly abstraction that mainly
sees fit

### Naming Conventions

For css class naming, we use BEM naming conventions. This helps you identify semantics of
your markup at a quick glance, resulting in more readable and maintainable code.
BEM is an abbreviation for:
- Block
- Element
- Modifier

## webcomponents

### HTML Structure

Despite not having applied any styling by default, our components do have an html structure that
allows [subclassers](./definitions.md) to easily extend them.
Webcomponents can be

### BEM and shadow DOM

Although BEM naming conventions partly encapsulate

All CSS our components is written from a generic mindset, following BEM conventions:
https://en.bem.info/methodology/

Although the CSS and HTML are implemented by the component, they should be regarded as
totally decoupled.

Not only does this force us to write better structured css, it also allows for future
reusability in many different ways like:
 - disabling shadow DOM for a component (for water proof encapsulation can be combined with
  a build step)
 - easier translation to more flexible, WebComponents agnostic solutions like JSS
  (allowing extends, mixins, reasoning, IDE integration, tree shaking etc.)
 - export to a CSS module for reuse in an outer context

Please note that the HTML structure is purposely 'loose', allowing multiple design systems
to be compatible with the style component.
Note that every occurence of '::slotted(*)' can be rewritten to '> *' for use in an other
context
-->

<!-- TODO:
 - follow https://cssguidelin.es/ and/or inuitcss: by prefixing our components with 'c-', we mark
    our components as core components, ensuring they never conflict with css created by  -->
