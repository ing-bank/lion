# remark-extend

A plugin for remark to extend one markdown file with another.

`remark-extend` is build to be integrated within the [unifiedjs](https://unifiedjs.com/) system.

## Installation

```bash
npm i -D remark-extend
```

```js
const unified = require('unified');
const markdown = require('remark-parse');
const mdStringify = require('remark-html');

const { remarkExtend } = require('remark-extend');

const sourceMd = '# Headline';
const extendMd = 'extending instructions';

const parser = unified()
  .use(markdown)
  .use(remarkExtend, { extendMd })
  .use(mdStringify);
const result = await parser.process(sourceMd);
```

## Extending Instructions

### Selection

For modifications you will need to provide a starting node.
In order to get this node css like selectors from [unist-util-select](https://github.com/syntax-tree/unist-util-select#support) are supported.

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

---

### Replacement

Does adjustments from a start point downwards.
The provided function does get called for every node from the starting point (including the starting point).

#### Replacement Input File

```md
### Red

red is the fire
```

#### Replacement Extending File

Goal is to replace all red with green.

````md
```js ::replaceFrom(':root')
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

#### Replacement Result

```md
### Green

green is the fire
```

### Replacement Range

Whenever a section or part of the original markdown needs to be adjusted.
The function does get every node from the starting point (including the starting point) till the end point (excluding the end point).

#### Replacement Range Input File

```md
### Red <-- starting point (including)

red is the fire

### More Red <-- end point (excluding)

the sun can get red
```

#### Replacement Range Extending File

````md
```js ::replaceBetween('heading:has([value=Red])', 'heading:has([value=More Red])')
module.exports.replaceSection = node => {
  if (node.value) {
    node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');
  }
  return node;
};
```
````

#### Replacement Range Result

```md
### Green <-- starting point (including)

green is the fire

### More Red <-- end point (excluding)

the sun can get red
```

---

### Add More Markdown Content After

If additional markdown content should be inserted after at a specific location.

#### Add After Input File

```md
### Red

red is the fire
```

#### Add After Extending File

````md
```
::addMdAfter('heading:has([value=Red])')
```

the ocean is blue
````

#### Add After Result

```md
### Red

the ocean is blue
red is the fire
```

More example use cases:

- Add more markdown at the top `::addMdAfter(':root')`
- Add more markdown at the bottom `::addMdAfter(':scope:last-child')`

### Add More Markdown Content Before

If additional markdown content should be inserted before at a specific location.
Useful for adding disclaimers above a headline.

#### Add Before Input File

```md
### Red

red is the fire

### Green <-- staring point
```

#### Add Before Extending File

````md
```
::addMdBefore('heading:has([value=Red])')
```

the ocean is blue
````

#### Add Before Result

```md
### Red

red is the fire

the ocean is blue

### Green <-- staring point
```

More example use cases:

- Add something at the end of a "section": `::addMdBefore('heading:has([value=Red]) ~ heading[depth=3]')`
  It works by selecting the headline of your section and add before the next sibling headline with the same depth.

---

### Removal

Does adjustments from a start point downwards.
The provided function does get called for every node from the starting point (including the starting point).

#### Removal Input File

```md
### Red

red is the fire

### More Red // <-- start

the sun can get red
```

#### Removal Extending File

Goal is to remove everything after `### More Red`

````md
```
::removeFrom('heading:has([value=More Red])')
```
````

#### Removal Result

```md
### Red

red is the fire
```

### Removal Range

Whenever a section or part of the original markdown needs to be removed.

#### Removal Range Input File

```md
### Red <-- starting point (including)

red is the fire

### More Red <-- end point (excluding)

the sun can get red
```

#### Removal Range Extending File

Starting from `### Red` until the next headline with depth of 3.

````md
```
::removeBetween('heading:has([value=Red])', 'heading:has([value=Red]) ~ heading[depth=3]')
```
````

#### Removal Range Result

```md
### More Red <-- end point (excluding)

the sun can get red
```
