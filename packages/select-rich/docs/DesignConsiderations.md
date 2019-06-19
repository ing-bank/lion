# Design considerations for new Custom Fields (draft)

Whenever a new type of Form component is made, a list of questions needs to be addressed:
- How can we build an accessible form component?
- How can we build a flexible fundament layer that can be extended in multiple ways?
- How can we deliver a predictable/consistent Developer Experience?

This document is meant to illustrate how all of the above mentioned factors are taken
into account and prioritized.
It does so by going through the design process of the concept 'listbox',
step by step.

The listbox concept will end up in several web components:
- lion-listbox: a listbox implementation agnostic of Lion form system
- lion-field-listbox: a Field wrapping lion-listbox
- lion-field-listbox-collapsible(current working name lion-select-rich): extension of Lion-field
listbox with collapsible dropdown
- lion-field-combobox: a Field wrapping lion-listbox, but with a text field as the input element.

## The need for a listbox
The reason we need a non platform, custom built version of a listbox component,
is very well explained on MDN:

> The `<select>` element is notoriously difficult to style productively with CSS. You can affect
 certain aspects like any element — for example, manipulating the box model, the displayed
 font, etc., and you can use the appearance property to remove the default system appearance.

On top of this, a listbox is allows us to create advanced user experiences that are not or hardly
possible with `<select>`/`<datalist>` :
- create an autocomplete/autosuggest combobox
- create advanced user interaction like explained here: https://www.w3.org/TR/wai-aria-practices/#Listbox

## Creating a Form Control
The goal of every form web component we build is to end up as a [FormControl]((https://github.com/ing-bank/lion/tree/master/packages/field)).
More specific: either as a Field or a Fieldset.
In short, a FormControl provides a normalized api, a modelValue, validation, formatting,
interaction states, an accessible html structure for labels, feedback, help texts and addons.
Please see the [Custom Fields tutorial](https://github.com/ing-bank/lion/blob/master/packages/field/docs/CustomFieldsTutorial.md)
to get an idea of how to build a custom FormControl (a range slider in this particular case).

A FormControl is meant to be the single point of interaction for Application Developers.
All relevant form data are specified on this layer by him/her.
Everything that is specified _within_ a field(being slotted content), has a _**presentational**_
purpose only.

> Reasons for this are outlined in a document written before(by Misha, Thomas and me) about
predictability, SSOT and data flow. TODO: add that document later.


## Getting the right api: accessibility
The ideal api for our rich select would be:

```html
<lion-select-rich>
  <lion-option></lion-option>
  <lion-option></lion-option>
</lion-select-rich>
```
The above api will pose some problems, though.
In order to transform the ideal api into an accessible solution, it needs to be transformed into
something like this:

```html
<div role=“button” aria-haspopup=“listbox” aria-expanded=“true/false”>
<div role=“listbox” aria-activedescendant=“two”>
  <div role=“option” id=“one” aria-posinset="1" aria-setsize="2"></div>
  <div role=“option” id=“two” aria-posinset="2" aria-setsize="2"></div>
</div>
```
The element with [role=listbox] and [aria-activedescendant] needs to be in the same dom as the
elements with [role=option].
The challenge our ‘ideal api’ poses:
since we would have two different doms (shadow and light), the aforementioned elements would not
find each other<sup>(1)</sup>.

A slight alteration of the api (moving [role=listbox] element to the light dom as well) solves
this problem:
```html
<lion-select-rich>
  <lion-listbox slot="input">
    <lion-option></lion-option>
    <lion-option></lion-option>
  </lion-listbox>
</lion-select-rich>
```

The api is conceptually identical to that of the already existing native select:

```html
<lion-select>
  <select slot=“input”>
    <option></option>
    <option></option>
  </select>
</lion-select>
```


## Getting the right api: presentational content

Let’s first revisit our main Fields: `lion-input`, `lion-textarea`, `lion-select`, `lion-radio` and
`lion-checkbox`.
For the sake of clarity and to get a good grasp of conceptual differences between different layers in
our system, the names of our LionField extensions will be changed to these within this document:
- field-text (instead of lion-input, wraps input[type=“text”])
- field-textarea (instead of lion-textarea, wraps textarea)
- field-select (instead of lion-select, wraps select)
- field-radio (instead of lion-radio, wraps input[type=“radio”])
- field-checkbox  (instead of lion-checkbox, wraps input[type=“checkbox”])

The field-text, field-textarea and field-radio/field-checkbox have an api roughly resembling this:
```html
<field-x name=“x” .label=“${labels.x}” .modelValue=“${model.x}”></field-x>
```
Whenever a _presentational_ component used within those fields needs to be changed, content
projection is the right approach for this. In the example below, the label can’t be provided as a
String:
```html
<field-x name=“x” .modelValue=“${model.x}”>
  <label slot=“label”>
    <lion-icon .svg=“${assets.x}”></lion-icon>
    ${labels.x}
  </label>
</field-x>
```

Similarly, the Field for native select provides a `[slot=input]` for presentational purposes.
The selected option is reflected in the `.modelValue`.
The presentational part<sup>(2)</sup>, the options, should be defined by the Application Developer.

Notice that contrary to the example above, an Application Developer has two places to get/set
his/her value:
- on the [slot=input] level as a 'value' property
- on the Field level as a '.modelValue' property

Using [slot=input] directly is not recommended and should be considered an anti
pattern: it doesn't have the normalized Field api and it creates an unpredictable data flow/DX
on top of this.
Again, [slot=input] should be considered as being presentational only...
```html
<field-select name=“x” .label=“${labels.x}” .modelValue=“${model.x}”>
  <select slot=“input”>
    <option value=“a”>${translations.optionALabel}</option>
    <option value=“b”>${translations.optionBLabel}</option>
  </select>
</field-select>
```

Summarized: what all of the different field types above have in common is this api for the
Application Developer:
```html
<field-x name="x" .modelValue=“${model.x}” @model-value-changed=“${() => this.xHandler.bind(this)}”>
  ...
</field-x>
```
All the relevant interaction with regard to form state happens (and should happen) on the Field layer.


## Field or Fieldset?
For most FormControls, the answer to this question is really simple: a LionField wraps just one
input, a LionFieldset wraps many.

For a listbox, the question arises: ‘is a sole option an autonomous input or not?’.
As always, the platform should provide us the answer: https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
Put in other words, a `listbox` equals `<select>` (with size attribute other than "1").

A listbox can semantically be seen as a select. A select on its turn can be seen as
a radiogroup and a select with option [multiple] can be seen as a checkbox group.
Although both of these currently are wrapped in LionFieldset (with [role=group]), the proper
semantics are now already communicated via [role=listbox].
Thus, the lion-listbox (which has [role=listbox]) will be wrapped in a Field (which has no role
set by default).

Now, considering the fact that our `<lion-listbox>` component is an equivalent of a `<select>`,
but with advanced styling possibilities, it follows that their apis should be similar as well.

So, we would end up with <sup>(3)</sup>:

```html
<lion-field-listbox .name=“{‘x’}” .modelValue=${model.x}>
  <lion-listbox slot=“input”>
    <lion-option value=“x”>x</lion-option>
  </lion-listbox>
</lion-field-listbox>
```

Although [role=lisbox] communicates to the screen reader that we deal with a group of options,
we still want to reuse the `Fieldset` functionality for an interface comparable to radio-group/
checkbox-group and child registration/orchestration. 
The [role="group"] that is applied by default, will the be omitted.

### ChoiceInput or not?
Options have a lot in common with radio inputs and checkboxes(multiselect). There main difference
seems to be [aria-selected] for option (having possible values of true and false) and
[aria-checked] for radio buttons and checkboxes (having a tristate, including indeterminate).
Another difference is the fact that input[type="radio/checkbox"] can be used on its own, whereas
an option can't.
Since Interaction and state are similar for checkboxes/radio inputs and options, we can reuse the
ChoiceInputMixin and override its template (we don't need a native input for role=option).
By inheriting from ChoiceInputMixin we also get automatically the `.choiceValue` api.


### Complex values on lion-listbox level?
As of now, we never needed our `<select>` options to have a `.modelValue`; our main assumption for
the listbox should be the same.
Adding a modelValue on option level (or lion-listbox/select level) is thus not needed.
It would also be confusing, because modelValues are a concept exclusive to FormControls (Fields or 
Fieldsets):
the lion-listbox and lion-option are none of those.
There might be a need for complex values, they can be added on Field level by writing a `parser`.


## Extrapolation to combobox
What the above brings to light, is that the `<lion-listbox>` is now a reusable construct (on the
level of `<select>`, `input`, `<textarea>` etc) that can be reused by different Fields.
One such field is the combobox, which has an input and a listbox as children.
As opposed to the `<field-listbox>/<field-select>`, the [slot=“input”] is the `<input>` element
here. Since in this constellation, it is the `input` element that synchronizes its `.value` with
its parent Field. The input element on its turn drives the dropdown listbox.

An api would come down to:
```html
<field-combobox has-autocomplete name=“x” .modelValue=“model.x”>
  <!-- the input + invoker button would be placed here in private slots -->
  <lion-listbox  slot=“list”>
    <!-- in theory, [slot=“list”] could also be a grid -->
    ${listOptions.map(opt => html`
    <lion-option value=“${opt.value}”>${opt.a}${opt.b}</lion-option>
    `)}
  </lion-listbox>
</field-combobox>
```

## Subclassers api enhancements
Keep in mind all Lion components are flexible layers, allowing the Application Developer to fully
control the presentational part.
A subclasser might alter the api by do something like this for a listbox Field:
```html
<my-field-listbox .options=“${optionArray}”></my-field-listbox>
```
Or, for a combobox Field:
```html
<my-field-combobox .options=“${optionArray}”></my-field-combobox>
```
Under the hood it uses a cloneable node as option template and generates the “input”/"list" slot.
How the provided data in `.options` and the generated `<my-option>` elements work together,
should be specified on this level.
See https://vaadin.com/components/vaadin-select/html-examples for a comparable api.




## Not perfect (yet...)
Since our current namings can lead to questions (why does a `<lion-listbox>` not have a
`modelValue`), I would opt for a rename to:
- All Field extensions as suggested above, but then prefixed with ‘lion’.
- The [slot=“input”] could be renamed to slot=“presentation-input”?
Would avoid mistakes and confusion for Application Developers. However, input (or
[interactive element](https://github.com/ing-bank/lion/blob/master/packages/field/docs/CustomFieldsTutorial.md))
would make more sense for Subclassers.

More public/api changes for forms in general:
- Rename modelValue/model-value-changed to “.model/model” for better DX
- Improve validators:
    - Make them class instances
    - Instances can respond to param changes
    - Instance can bridge to platform functionality -> required validator can set
    [aria-required=true] to [slot=input]
    - Allow to add translation to validator instance
    - Async validators
    - Better integration between platform validators and ours
    - ... many more small improvements possible for validator api

Most of these are breaking and should be done in our next milestone.



## Summarized

Summarized, most of the api choices are a compromise of:
- Accessibility
    - We have no access to https://github.com/WICG/aom/blob/gh-pages/explainer.md yet
- DX/Predictability
    - one ‘form state’ layer to interact with, one presentational layer to define advanced UI
    - when an Application Developer considers elements put in light dom his/her own, leads to unpredictable behaviour when moving them around<sup>(4)</sup>
- Performance
    - no trickery with moving around elements in light dom that are glued together with mutation observers etc.








<sub>
1. Transferring the `lion-option`s to a part of the light dom that already has the listbox, would be
a technically possible, but hacky solution.
Putting [role=“listbox”] on the host(like suggested before) is not a solution either: it causes the button to be a child of the listbox and this would confuse
screen reader users.
</sub>

<sub>
2. The part here that could be considered non presentational here is the “value” provided to option. It kind of reflects ‘potential form state’. In this api we’ve chosen alignment with the platform, but
One could argue that ‘the lack of selection’ is also part of form state, and should be covered in the modelValue.
Something worth discussing. We currently apply this to the ChoiceGroups (radioGroup, checkboxGroup),
Although my personal opinion, in retrospect is that it complicates DX and something like Vue(appreciated for its DX in general) does might be easier: https://vuejs.org/v2/guide/forms.html
</sub>

<sub>
3. What could be open for discussion is whether we can’t just say 'field-select .modelValue=${myArray}'.
The main reason not to do this, is because you would end up with a situation where you would have an intermangling
Between form state (this is what the .modelValue is supposed to be about) and presentation (you could end up with logic about
whether an icon needs to be displayed or not inside your modelValue)
</sub>

<sub>
4. An alternative can possibly be accomplished by creating some kind of DSL like the vaadin-grid does for instance: https://vaadin.com/components/vaadin-grid/html-examples
- It makes a distinction between presentation and values
- the api has no connection with actual dom created.
But, it has the same drawbacks as pointed out already
</sub>
