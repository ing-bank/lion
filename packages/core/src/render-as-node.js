import { render } from 'lit-html';

/**
 * @param {TemplateResult} templateResult
 * @returns {Node}
 */
export function renderAsNode(templateResult) {
  const renderParent = document.createElement('div');
  render(templateResult, renderParent);
  return renderParent.firstElementChild;
}
