# Code Coventions
Code conventions as described in this document will help the [Component Author](./Definitions.md) and the [Subclasser](./Definitions.md) write consistent, maintainable and predictable components.

Disclaimer: this document currently only contains a small setup. In the future, this document can
be expanded on multiple areas, describing best practices for API design, data flow, single source
of truth etc.

## Naming conventions

### Internal node references
Internal node references are used by Subclassers to access elements inside the shadow dom or light
dom of a webcomponent. They abstract away the implementation details of the dom structure and can
be accessed imperatively in the component logic. This allows Subclassers to change of a template,
while still keeping a reference to a node (like `_inputNode`) with a certain role.
An example of this: `_inputNode` contains `<input>` inside LionInput, `<textarea>` inside LionTextarea,
`<select>` inside LionSelect and `this` inside LionFieldset.

Since they are not publicly exposed, they follow the naming convention like `._inputNode`, `._labelNode`,
`._feedbackNode` etc. etc.
