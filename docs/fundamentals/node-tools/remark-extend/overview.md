# Node Tools >> Remark Extend >> Overview ||10

A plugin for remark to extend markdown by importing from source files.

`remark-extend` is build to be integrated within the [unifiedjs](https://unifiedjs.com/) system.

## Installation

```bash
npm i -D remark-extend
```

````js
const unified = require('unified');
const markdown = require('remark-parse');
const mdStringify = require('remark-html');

const { remarkExtend } = require('remark-extend');

const sourceMd = [
  //
  '# Headline',
  "```js ::import('@name/pkg/README.md')",
  '```',
].join('\n');

const parser = unified().use(markdown).use(remarkExtend).use(mdStringify);
const result = await parser.process(sourceMd);
````

## Importing a block

In many cases, the full file might be too much so you want to import a "block".
A block starts with a headline and ends when the next headline of an equal level starts.

```md
## Block one

Content of block one

## Block two

Content of block two

### Sub headline in block two

Still content of block two

## Block three

Content of block three
```

Now if you wish to import only block two you can write.

````md
# Blew you will find Block two

```js ::importBlock('./path/to/file.md', '## Block two')

```
````

### Result after import

```md
# Blew you will find Block two

## Block two

Content of block two

### Sub headline in block two

Still content of block two
```

PS: importBlock is a faster way of writing imports for headlines

```md
::importBlock('./path/to/file.md', '## red')
// is the same as
::import('./path/to/file.md', 'heading[depth=2]:has([value=red])', 'heading[depth=2]:has([value=red]) ~heading[depth=2]')
```

## Block Variations

Besides block there are is also `::importBlockContent`, `::importSmallBlock` and `::importSmallBlockContent`.

- `::importBlockContent` will take the same block (headline to next headline of equal level) but excludes the headline.
- `::importSmallBlock` will import a small block (headline to any next headline)

Given the following content let's compare what the content would be.

```md
# My Package

Intro to my Package

## Installation

How to install my package
```

### `::importBlock('./path/to/file.md', '# My Package')`

```md
# My Package

Intro to my Package

## Installation

How to install my package
```

### `::importBlockContent('./path/to/file.md', '# My Package')`

```md
Intro to my Package

## Installation

How to install my package
```

### `::importSmallBlock('./path/to/file.md', '# My Package')`

```md
# My Package

Intro to my Package
```

### `::importSmallBlockContent('./path/to/file.md', '# My Package')`

```md
Intro to my Package
```

---

## Adjusting imported content

If a function gets placed in the import code block then it does get called for every node from the starting point (including the starting point).

Note: does work for `::import` and `::importBlock`

### Adjustment Input File

👉 `file.md`

```md
### Red

red is the fire
```

#### Adjustment Extending File

The goal is to replace all red with green.

````md
# Below you will not find any read

```js ::import('./path/to/file.md')
module.exports.replaceSection = node => {
  if (node.value) {
    node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');
  }
  return node;
};
```
````

This function gets called with these nodes in order.

1. root
2. heading
3. text
4. paragraph
5. text

#### Adjustment Result

```md
# Below you will not find any 'red'

### Green

green is the fire
```

---

It's also possible to globally define a replace function.
The example below shows the config object that is provided to the `remarkExtend` function.
Note that local replacements are run after global replacements.

```js
{ globalReplaceFunction: node => {
  if (node.type === 'link') {
    // All internal links to '/systems/' (like '(../../fundamentals/systems/overlays/configuration.md)'),
    // will be changed into '/web-systems/' ('(../../fundamentals/web-systems/overlays/configuration.md)').
    node.url = node.url.replace(/\systems\/g, '/web-systems/');
  }
  return node;
}};
```

## Import selection

For `::import` you can provide a start and end selector based on [unist-util-select](https://github.com/syntax-tree/unist-util-select#support).

Some examples are:

- `:root` for the top of the markdown file
- `:scope:last-child` for the end of the markdown file
- `heading:has([value=Red])` first heading with a text value of Red (e.g. ### Red)
- `heading[depth=2]` first second level heading (e.g. ## Something)
- `heading[depth=2]:has([value=Red]) ~ heading[depth=2]` following h2 after h2 with "Red" (e.g. ## Red ... ## Something)

### Markdown AST

All adjustments to the markdown file happen via the markdown AST (Abstract Syntax Tree).

You can explore it via the [ASTExplorer](https://astexplorer.net/). (> Markdown > remark)

```md
### Red

red is the fire
```

Resulting AST.

```json
{
  "type": "root",
  "children": [
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Red"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "red is the fire"
        }
      ]
    }
  ]
}
```

### Usage in import

If you full control of what the start and end selector should be then you can use `::import`.

To for example import everything that is between `## Red` and `## More Red` you can use something like this.

````md
```::import('./path/to/file.md', 'heading[depth=2]:has([value=Red])', 'heading[depth=2]:has([value=More Red])')

```
````
