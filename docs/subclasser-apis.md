# Subclasser apis

In order to make it easy for Subclassers to extend our components, we follow a certain set
of best practices naming conventions to make our code predictable.

## Templates

### Template naming conventions

For template, we have the naming convention that every overridable template starts with an
underscore and ends with

### Seperation of concerns

Our components should make it possible to override markup and styling, without having to redefine
functionality.
By using the spread directive, we can achieve this. For more info, see:
[https://github.com/ing-bank/lion/issues/591](explanation).

## Node references

As a Subclasser, you sometimes need access to a protected node inside the shadow dom.
Most functional nodes have their own getters. A Subclasser can acces those in his extension and
in some cases, override these getters.

### Node naming conventions

A node reference will have an underscore prefix and always ends with `Node`.
Examples are `_inputNode` and `_formNode`.
