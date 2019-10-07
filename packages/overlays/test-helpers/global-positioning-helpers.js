import { render } from '@lion/core';
import { overlays } from '../src/overlays.js';

export function getRootNode() {
  return document.querySelector('.global-overlays');
}

export function getRenderedContainers() {
  const rootNode = getRootNode();
  return rootNode ? Array.from(rootNode.children) : [];
}

export function isEqualOrHasParent(element, parentElement) {
  if (!parentElement) {
    return false;
  }

  if (element === parentElement) {
    return true;
  }

  return isEqualOrHasParent(element, parentElement.parentElement);
}

export function getTopContainer() {
  return getRenderedContainers().find(container => {
    const rect = container.getBoundingClientRect();
    const topElement = document.elementFromPoint(Math.ceil(rect.left), Math.ceil(rect.top));
    return isEqualOrHasParent(container, topElement);
  });
}

export function getTopOverlay() {
  const topContainer = getTopContainer();
  return topContainer ? topContainer.children[0] : null;
}

export function getRenderedContainer(index) {
  return getRenderedContainers()[index];
}

export function getRenderedOverlay(index) {
  const container = getRenderedContainer(index);
  return container ? container.children[0] : null;
}

export function cleanup() {
  document.body.removeAttribute('style');
  overlays.teardown();
}

// TODO: move to core helpers
export function renderToNode(litHtmlTemplate) {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
}
