import { render } from '@lion/core';

export const renderLitAsNode = litHtmlTemplate => {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
};
