// unified works my modifying the original passed node
/* eslint-disable no-param-reassign */
const visit = require('unist-util-visit');
const { select } = require('unist-util-select');
const unified = require('unified');
const markdown = require('remark-parse');
const is = require('unist-util-is');

function addTask(file, newAction) {
  if (!file.data.remarkExtend) {
    file.data.remarkExtend = [];
  }
  file.data.remarkExtend.push(newAction);
}

function evaluateAsReplacementTask(node, file) {
  if (
    node.type === 'code' &&
    node.lang === 'js' &&
    node.meta &&
    node.meta.startsWith('::replaceFrom')
  ) {
    const startSelector = node.meta.substring(node.meta.indexOf("('") + 2, node.meta.indexOf("')"));
    addTask(file, {
      action: 'replaceFrom',
      startSelector,
      jsCode: node.value,
    });
  }
  if (
    node.type === 'code' &&
    node.lang === 'js' &&
    node.meta &&
    node.meta.startsWith('::replaceBetween')
  ) {
    const startSelector = node.meta.substring(node.meta.indexOf("('") + 2, node.meta.indexOf("',"));
    const endSelector = node.meta
      .substring(node.meta.indexOf("',") + 4, node.meta.indexOf("')"))
      .trim();
    addTask(file, {
      action: 'replaceBetween',
      startSelector,
      endSelector,
      jsCode: node.value,
    });
  }
}

function evaluateAsRemoveTask(node, file) {
  if (node.type === 'code' && node.value && node.value.startsWith('::removeFrom')) {
    const startSelector = node.value.substring(
      node.value.indexOf("('") + 2,
      node.value.indexOf("')"),
    );
    addTask(file, {
      action: 'removeFrom',
      startSelector,
    });
  }
  if (node.type === 'code' && node.value && node.value.startsWith('::removeBetween')) {
    const startSelector = node.value.substring(
      node.value.indexOf("('") + 2,
      node.value.indexOf("',"),
    );
    const endSelector = node.value
      .substring(node.value.indexOf("',") + 4, node.value.indexOf("')"))
      .trim();
    addTask(file, {
      action: 'removeBetween',
      startSelector,
      endSelector,
    });
  }
}

function shouldFinishGathering(node) {
  if (node.type === 'code' && node.lang === 'js' && node.meta && node.meta.startsWith('::')) {
    return true;
  }
  if (node.value && node.value.startsWith('::')) {
    return true;
  }
  return false;
}

let mdAdditionAddNodes = [];
let mdAdditionGathering = false;
let mdAdditionStartSelector;
let mdAdditionAction = '';
function evaluateAsMdAdditionTask(node, file, parent) {
  if (mdAdditionGathering === true && shouldFinishGathering(node)) {
    mdAdditionGathering = false;
    addTask(file, {
      action: mdAdditionAction,
      startSelector: mdAdditionStartSelector,
      addNodes: mdAdditionAddNodes,
    });
    mdAdditionAddNodes = [];
  }

  if (mdAdditionGathering === true) {
    if (parent.type === 'root') {
      mdAdditionAddNodes.push(node);
    }
  }

  if (node.type === 'code' && node.value && node.value.startsWith('::addMdAfter')) {
    mdAdditionStartSelector = node.value.substring(
      node.value.indexOf("('") + 2,
      node.value.indexOf("')"),
    );
    mdAdditionGathering = true;
    mdAdditionAction = 'addMdAfter';
  }
  if (node.type === 'code' && node.value && node.value.startsWith('::addMdBefore')) {
    mdAdditionStartSelector = node.value.substring(
      node.value.indexOf("('") + 2,
      node.value.indexOf("')"),
    );
    mdAdditionGathering = true;
    mdAdditionAction = 'addMdBefore';
  }
}

function findExtendTasks() {
  return (tree, file) => {
    visit(tree, (node, index, parent) => {
      evaluateAsReplacementTask(node, file);
      evaluateAsMdAdditionTask(node, file, parent);
      evaluateAsRemoveTask(node, file);
    });

    // for evaluateAsMdAdditionTask
    if (mdAdditionGathering === true) {
      mdAdditionGathering = false;
      addTask(file, {
        action: mdAdditionAction,
        startSelector: mdAdditionStartSelector,
        addNodes: mdAdditionAddNodes,
      });
      mdAdditionAddNodes = [];
    }
  };
}

/**
 * Allows to execute an actual node module code block.
 * Supports imports (via require) within those code blocks.
 *
 * @example
 *   const virtualMod = requireFromString('module.export = { a: "a value", fn: () => {} }');
 *   console.log(virtualMod.a); // a value
 *   // execute function
 *   virtualMod.fn();
 *
 * @param {*} src
 * @param {*} filename
 */
function requireFromString(src, filename = 'tmp.js') {
  const m = new module.constructor();
  m.paths = module.paths;
  m._compile(src, filename);
  return m.exports;
}

function handleAdditions(tree, action, startIsNode, addNodes) {
  visit(tree, (node, index, parent) => {
    if (is(node, startIsNode)) {
      if (action === 'addMdAfter') {
        if (node.type === 'root') {
          node.children.splice(0, 0, ...addNodes);
        } else {
          parent.children.splice(index + 1, 0, ...addNodes);
        }
      }
      if (action === 'addMdBefore') {
        if (node.remarkExtendedProcessed === undefined) {
          // preventing infinite loops as adding a node before means we visit the target node again and insert again
          node.remarkExtendedProcessed = true;
          if (node.type === 'root') {
            node.children.splice(0, 0, ...addNodes);
          } else {
            parent.children.splice(index, 0, ...addNodes);
          }
        }
      }
    }
  });
}

function handleReplacements(tree, action, startIsNode, endIsNode, jsCode) {
  let doReplacements = false;
  let resetAtEnd = false;
  let userFunction;
  if (action === 'replaceFrom' || action === 'replaceBetween') {
    const virtualMod = requireFromString(jsCode);
    const keys = Object.keys(virtualMod);
    userFunction = virtualMod[keys[0]];
  }
  visit(tree, (node, index, parent) => {
    if (is(node, startIsNode)) {
      doReplacements = true;
    }
    if (action === 'replaceBetween' && is(node, endIsNode)) {
      resetAtEnd = true;
    }
    if (doReplacements) {
      node = userFunction(node, { index, parent, tree });
    }
    if (resetAtEnd === true) {
      resetAtEnd = false;
      doReplacements = false;
    }
  });
}

/**
 * Needs 2 loops as
 * - First to mark nodes for removal
 * - Do actual removal in revers order (to not effect the index of the loop)
 *
 * @param {*} tree
 * @param {*} action
 * @param {*} startIsNode
 * @param {*} endIsNode
 */
function handleRemovals(tree, action, startIsNode, endIsNode) {
  let removeIt = false;
  visit(tree, (node, index, parent) => {
    if (is(node, startIsNode)) {
      removeIt = true;
    }
    if (action === 'removeBetween' && is(node, endIsNode)) {
      removeIt = false;
    }
    if (removeIt && parent.type === 'root') {
      // only mark for removal
      // removing directly messes with the index which prevents further removals down the line
      parent.children[index].__remarkExtendRemove = true;
    }
  });
  visit(
    tree,
    (node, index, parent) => {
      if (node.__remarkExtendRemove) {
        parent.children.splice(index, 1);
      }
    },
    true,
  );
}

// unified expect direct
// eslint-disable-next-line consistent-return
function remarkExtend(options) {
  if (options.extendMd) {
    const parser = unified()
      .use(markdown)
      .use(findExtendTasks)
      .use(function plugin() {
        this.Compiler = () => '';
      });

    const changes = parser.processSync(options.extendMd);

    const extensionTasks = changes.data.remarkExtend;

    if (!extensionTasks) {
      return tree => tree;
    }

    return tree => {
      for (const extensionTask of extensionTasks) {
        const { action, startSelector, endSelector, jsCode, addNodes } = extensionTask;
        const start = select(extensionTask.startSelector, tree);
        if (!start) {
          throw new Error(`The start selector "${startSelector}" could not find a matching node.`);
        }
        const startIsNode = { ...start };
        delete startIsNode.children; // unified is comparison does not support children

        let endIsNode;
        if (action === 'replaceBetween' || action === 'removeBetween') {
          const end = select(endSelector, tree);
          if (!end) {
            throw new Error(`The end selector "${endSelector}" could not find a matching node.`);
          }
          endIsNode = { ...end };
          delete endIsNode.children; // unified is comparison does not support children
        }

        switch (action) {
          case 'addMdAfter':
          case 'addMdBefore':
            handleAdditions(tree, action, startIsNode, addNodes);
            break;
          case 'replaceFrom':
          case 'replaceBetween':
            handleReplacements(tree, action, startIsNode, endIsNode, jsCode);
            break;
          case 'removeFrom':
          case 'removeBetween':
            handleRemovals(tree, action, startIsNode, endIsNode);
            break;
          /* no default */
        }
      }
    };
  }
}

module.exports = {
  remarkExtend,
};
