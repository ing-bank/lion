# Definition List
Below you will find a list of definitions and terms that will be used throughout our code
documentation.

- `Application Developer`:
Developers consuming our webcomponents inside an application (not extending them).
Application Developers are only allowed to interact with `public` properties and methods.
Can be abbreviated as `AD`. Sometimes also called `Consuming Developer`.

- `Subclasser`:
Developers extending our webcomponents. For instance: `MaterialInput extends LionInput`.
Subclassers have access to protected methods (prefixed with an underscore or marked as protected),
but not to private methods.

- `Component Author`:
People working on the core elements. They have access to private (double underscored) methods and
methods, present on the class they are currently working on.

<!-- TODO: extend these docs with those written before -->
- `public`:
Methods and properties are public when they are not prefixed by an underscore.
They can be used by Application Developers.
<!-- TODO: remove underscores where needed in our code --->
- `protected`:
Methods and properties are protected when they contain one underscore or are explicitly marked as
protected in the code.
They can be used by Subclassers.

- `private`:
Methods and properties are protected when they contain two underscores  or are explicitly marked as
private in the code.
They can be used within the class where they are defined (developers of Lion components).
