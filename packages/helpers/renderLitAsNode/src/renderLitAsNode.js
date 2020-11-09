import { render } from '@lion/core';

/**
 * Helper to render a lit TemplateResult as an offline-created DOM node
 * Make sure that the top-most element in the template has no siblings,
 * as they won't be taken into account. We only return firstElementChild.
 * @param {import('@lion/core').TemplateResult} litHtmlTemplate
 */
export const renderLitAsNode = litHtmlTemplate => {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
};
