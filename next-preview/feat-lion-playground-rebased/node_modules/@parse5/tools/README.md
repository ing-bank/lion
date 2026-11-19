# @parse5/tools

A set of tools for interacting with and manipulating a parse5 AST.

## Why?

The parse5 tree adapter architecture can make AST types, traversal and
manipulation difficult due to its customisability.

This package introduces some assumptions (i.e. removes some customisability)
in order to provide a more trivial interface to the parse5 AST for the common
use case.

Due to this, the types in various places are also simplified and improved.

## Tools

### Node creation

The default parse5 adapter is usually enough to create the nodes you need.

To make some use cases a little easier, the following do exist, though:

* `createElement(tagName[, attrs[, namespaceURI]])`
  * The attributes can be an array (e.g. `[{name: 'foo', value: 'bar'}]`) or
an object (e.g. `{foo: 'bar'}`)
* `createTextNode(value)`
* `createCommentNode(value)`
* `createDocument()`
* `createDocumentFragment()`
* `createTemplateNode([content])`
  * The `content` must be a `DocumentFragment` if it is set

### Node removal

The default parse5 adapter can already remove nodes. For ease of use, we also
expose a function here:

* `removeNode(node)`

### Node type guards

A full set of node type guard functions are availabile:

* `isDocument`
* `isDocumentFragment`
* `isTemplateNode`
* `isElementNode`
* `isCommentNode`
* `isDocumentTypeNode`
* `isTextNode`

Each of these consumes a `Node` and acts as a TypeScript type guard:

```ts
if (isDocument(node)) {
  // access document-specific properties
}
```

### Parent/child type guards

These help with determining if a given node can have children, or can be
a child.

* `isChildNode`
* `isParentNode`

These too are TypeScript type guards:

```ts
if (isChildNode(node)) {
  // interact with node.parentNode
}

if (isParentNode(node)) {
  // interact with node.childNodes
}
```

### Child manipulation

If you need to mutate a child:

* `replaceWith(node, ...replacements)` - replaces a given node with one or more
nodes
* `spliceChildren(node, start, deleteCount[, ...children])` - splices the
children of a node just the same as `Array#splice`

### Attributes

For interacting with and mutating attributes of an element:

* `setAttribute(node, name, value)`
* `getAttribute(node, name)`
* `hasAttribute(node, name)`
* `removeAttribute(node, name)`
* `getAttributeIndex(node, name)`

### Text manipulation

For dealing with text content of nodes:

* `getTextContent(node)`
* `setTextContent(node, str)`

### Traversal

Unless otherwise specified, all traversal functions are _depth first_.

Additionally, all capable of returning multiple nodes are iterators.

#### `query(node, condition)`

From a given node, this queries for a child at any depth which matches the
condition.

For example, to find the first document fragment:

```ts
query(
  node,
  (node) => isDocumentFragment(node)
);
```

#### `queryAll(node[, condition])`

From a given node, this queries for all children at any depth which match
the condition.

For example, to find all elements:

```ts
const elements = query(
  node,
  (node) => isElementNode(node)
);

for (const element of elements) {
  // do something
}
```

#### `ancestors(node)`

Discovers all parents of the specified node until the root document.

#### `walkChildren(node)`

Discovers all children of the specified node, depth-first.

#### `previousSiblings(node)`

Discovers all previous siblings of the specified node.

#### `nextSiblings(node)`

Discovers all next siblings of the specified node.

#### `traverse`

The traverse function allows you to specify a visitor which will be called
for each matching type encountered while traversing the tree depth-first.

For example:

```ts
traverse(node, {
  text: (textNode) => {
    // do something with a text node
  }
});
```

Each node type can have a visitor (e.g. you could have an `element` function).

##### `pre:node`

There is one special visit function: `pre:node`.

This is called before visiting any node and will prevent traversing into
the current node's children if it returns false.

For example:

```ts
traverse(node, {
  'pre:node': (node) => {
    return isElement(node);
  }
});
```

This example would traverse into the children of only element nodes as all
others would have returned false.
