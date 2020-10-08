/* globals capture getStoryPage */

const selector = 'lion-select-rich';

describe('forms-select-rich', () => {
  it('main', async () => {
    const id = `forms-select-rich--main`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('main-opened', async () => {
    const id = `forms-select-rich--main`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      // @ts-expect-error
      el.opened = true;
    });
    // @ts-expect-error
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('options-with-html', async () => {
    const id = `forms-select-rich--options-with-html`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('options-with-html-opened', async () => {
    const id = `forms-select-rich--options-with-html`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      // @ts-expect-error
      el.opened = true;
    });
    // @ts-expect-error
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('many-options-with-scrolling-opened', async () => {
    const id = `forms-select-rich--many-options-with-scrolling`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      // @ts-expect-error
      el.opened = true;
    });
    // @ts-expect-error
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('read-only-prefilled', async () => {
    const id = `forms-select-rich--read-only-prefilled`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('disabled-select', async () => {
    const id = `forms-select-rich--disabled-select`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('disabled-option-opened', async () => {
    const id = `forms-select-rich--disabled-option`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      // @ts-expect-error
      el.opened = true;
    });
    // @ts-expect-error
    await capture({
      selector,
      id: `${id}-opened`,
      page,
      endClipSelector: 'lion-options',
    });
  });
  it('validation', async () => {
    const id = `forms-select-rich--validation`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.evaluate(() => {
      const el = document.querySelector('lion-select-rich');
      // @ts-expect-error
      el.updateComplete.then(() => {
        // @ts-expect-error
        el.touched = true;
        // @ts-expect-error
        el.dirty = true;
      });
    });
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('render-options', async () => {
    const id = `forms-select-rich--render-options`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('interaction-mode-mac', async () => {
    const id = `forms-select-rich--interaction-mode`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.click('lion-select-rich');
    await page.keyboard.press('ArrowDown');
    // @ts-expect-error
    await capture({
      selector,
      id: `${id}-mac`,
      page,
    });
  });
  it('interaction-mode-windows-linux', async () => {
    const id = `forms-select-rich--interaction-mode`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    await page.click('lion-select-rich:last-of-type');
    await page.keyboard.press('ArrowDown');
    // @ts-expect-error
    await capture({
      selector: 'lion-select-rich:last-of-type',
      id: `${id}-windows-linux`,
      page,
    });
  });
  it('no-default-selection', async () => {
    const id = `forms-select-rich--no-default-selection`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
  it('single-option', async () => {
    const id = `forms-select-rich--single-option`;
    // @ts-expect-error
    const page = await getStoryPage(id);
    // @ts-expect-error
    await capture({ selector, id, page });
  });
});
