/* globals capture getStoryPage */

const selector = 'lion-select-rich';

describe('forms-select-rich', () => {
  it('main', async () => {
    const id = `forms-select-rich--main`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('main-opened', async () => {
    const id = `forms-select-rich--main`;
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      el.opened = true;
    });
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('options-with-html', async () => {
    const id = `forms-select-rich--options-with-html`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('options-with-html-opened', async () => {
    const id = `forms-select-rich--options-with-html`;
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      el.opened = true;
    });
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('many-options-with-scrolling-opened', async () => {
    const id = `forms-select-rich--many-options-with-scrolling`;
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      el.opened = true;
    });
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('read-only-prefilled', async () => {
    const id = `forms-select-rich--read-only-prefilled`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('disabled-select', async () => {
    const id = `forms-select-rich--disabled-select`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('disabled-option-opened', async () => {
    const id = `forms-select-rich--disabled-option`;
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      el.opened = true;
    });
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('validation', async () => {
    const id = `forms-select-rich--validation`;
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      el.updateComplete.then(() => {
        el.touched = true;
        el.dirty = true;
      });
    });
    await capture({ selector, id, page });
  });
  it('render-options', async () => {
    const id = `forms-select-rich--render-options`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('interaction-mode-mac', async () => {
    const id = `forms-select-rich--interaction-mode`;
    const page = await getStoryPage(id);
    await page.click('lion-select-rich');
    await page.keyboard.press('ArrowDown');
    await capture({
      selector,
      id: `${id}-mac`,
      page,
    });
  });
  it('interaction-mode-windows-linux', async () => {
    const id = `forms-select-rich--interaction-mode`;
    const page = await getStoryPage(id);
    await page.click('lion-select-rich:last-of-type');
    await page.keyboard.press('ArrowDown');
    await capture({
      selector: 'lion-select-rich:last-of-type',
      id: `${id}-windows-linux`,
      page,
    });
  });
  it('no-default-selection', async () => {
    const id = `forms-select-rich--no-default-selection`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('single-option', async () => {
    const id = `forms-select-rich--single-option`;
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
});
