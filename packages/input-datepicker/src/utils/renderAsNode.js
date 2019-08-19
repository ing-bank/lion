import { render } from '@lion/core';

/**
 *
 * @param {TemplateResult} templateResult
 */
export function renderAsNode(templateResult) {
  const renderParent = document.createElement('div');
  render(templateResult, renderParent);
  return renderParent.firstElementChild;
}