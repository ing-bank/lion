import { html } from '@lion/core';
import { renderLitAsNode } from '@lion/helpers';

let isApplied = false;

export function applyMenuDemoStyles() {
  if (isApplied) {
    return;
  }

  const fontAwesome = html`<link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
    integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
    crossorigin="anonymous"
  />`;
  document.head.appendChild(renderLitAsNode(fontAwesome));

  const styles = html` <style>
    [role='menu']:focus {
      outline: none;
    }

    [role='toolbar'],
    [role='tree'],
    [role='menubar'],
    [role='menu'] {
      background: white;
      font-family: sans-serif;
      font-size: 12px;
    }

    [level='0'] > [role='menu'] {
      border: 1px solid black;
    }

    [role='treeitem']:not([aria-expanded]),
    [role='treeitem'][aria-expanded],
    [role^='menuitem']:not([aria-expanded]),
    [role^='menuitem'][aria-expanded] {
      padding: 4px 24px 4px 8px;
    }

    [role='treeitem']:not([aria-expanded]),
    [role='treeitem'][aria-expanded] {
      padding-left: 16px;
    }

    [role='treeitem'][active]:not([aria-expanded]),
    [role='treeitem'][active][aria-expanded],
    [role^='menuitem'][active]:not([aria-expanded]),
    [role^='menuitem'][active][aria-expanded] {
      background: lightgrey;
    }

    [role^='menuitem'][checked]:not([aria-expanded]),
    [role^='menuitem'][checked][aria-expanded] {
      background: #eee;
    }

    [role='treeitem'],
    [role^='menuitem'] {
      position: relative;
      cursor: default;
    }

    [role='treeitem']::after,
    [role^='menuitem']::after {
      position: absolute;
      top: 5px;
      font-size: 10px;
    }

    [role^='menuitem']::after {
      right: 4px;
    }

    [role^='treeitem']::after {
      left: 4px;
    }

    [role^='menuitem'][aria-expanded]::after {
      content: '▶';
    }

    [role^='menuitem'][aria-expanded='true']::after {
      content: '▼';
    }

    [orientation='horizontal'] [role^='menuitem'][aria-expanded]::after {
      content: '▼';
    }

    [role='menuitemcheckbox'][aria-checked='true']::after {
      content: '🗹';
    }

    [role='menuitemradio'][aria-checked='true']::after {
      content: '◉';
    }

    [role='separator'] {
      border-bottom: 1px solid gray;
    }

    [role='treeitem'][aria-expanded]::after {
      content: '+';
    }

    lion-tree[level='1'] [role='treeitem']:not([aria-expanded]),
    lion-tree[level='1'] [role='treeitem'][aria-expanded] {
      padding-left: 24px;
    }

    lion-menu[level='1'] [role^='menuitem']:not([aria-expanded]),
    lion-menu[level='1'] [role^='menuitem'][aria-expanded] {
      padding-left: 16px;
    }

    lion-tree[level='2'] [role='treeitem']:not([aria-expanded]),
    lion-tree[level='2'] [role='treeitem'][aria-expanded] {
      padding-left: 32px;
    }
    lion-menu[level='2'] [role^='menuitem']:not([aria-expanded]),
    lion-menu[level='2'] [role^='menuitem'][aria-expanded] {
      padding-left: 24px;
    }

    [role='toolbar'] {
      padding: 8px;
      background: #eee;
    }
    [role='toolbar'] button {
      background: none;
      padding: 4px 8px;
      border: 1px transparent;
    }
    [role='toolbar'] button[aria-pressed='true'],
    [role='toolbar'] button[aria-checked='true'] {
      background: white;
      border: 1px black;
    }

    [role='toolbar'] > div[role='separator'] {
      margin-left: 8px;
      margin-right: 8px;
      border-left: 1px solid lightgray;
    }

    button[slot='invoker'] {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      display: block;
      width: 100%;
      text-align: left;
    }
  </style>`;
  document.head.appendChild(renderLitAsNode(styles));
  isApplied = true;
}
