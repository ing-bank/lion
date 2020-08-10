/* globals capture getStoryPage */

const selector = 'lion-button';

describe('buttons-button', () => {
  it('main', async () => {
    const id = 'buttons-button--main';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('main-hovered', async () => {
    const id = 'buttons-button--main';
    const page = await getStoryPage(id);
    await page.hover(selector);
    await capture({ selector, id: `${id}-hovered`, page });
  });
  it('main-focused', async () => {
    const id = 'buttons-button--main';
    const page = await getStoryPage(id);
    await page.focus(selector);
    await capture({ selector, id: `${id}-focused`, page });
  });
  it('handler', async () => {
    const id = 'buttons-button--handler';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('icon-button', async () => {
    const id = 'buttons-button--icon-button';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('icon-only', async () => {
    const id = 'buttons-button--icon-only';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('icon-only-hovered', async () => {
    const id = 'buttons-button--icon-only';
    const page = await getStoryPage(id);
    await page.hover(selector);
    await capture({ selector, id: `${id}-hovered`, page });
  });
  it('icon-only-focused', async () => {
    const id = 'buttons-button--icon-only';
    const page = await getStoryPage(id);
    await page.focus(selector);
    await capture({ selector, id: `${id}-focused`, page });
  });
  it('disabled', async () => {
    const id = 'buttons-button--disabled';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('within-form', async () => {
    const id = 'buttons-button--within-form';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
});
