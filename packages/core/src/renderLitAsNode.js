import { render } from 'lit-html';

export const renderLitAsNode = litHtmlTemplate => {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
};
