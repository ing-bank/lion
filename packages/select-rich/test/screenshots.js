/* globals capture getStoryPage */
// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');

const selector = 'lion-select-rich';

test('forms-select-rich--main', async t => {
  const id = 'forms-select-rich--main';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--main-opened', async t => {
  const id = 'forms-select-rich--main';
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
  t.pass();
});

test('forms-select-rich--options-with-html', async t => {
  const id = 'forms-select-rich--options-with-html';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--options-with-html-opened', async t => {
  const id = 'forms-select-rich--options-with-html';
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
  t.pass();
});

test('forms-select-rich--many-options-with-scrolling-opened', async t => {
  const id = 'forms-select-rich--many-options-with-scrolling';
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
  t.pass();
});

test('forms-select-rich--read-only-prefilled', async t => {
  const id = 'forms-select-rich--read-only-prefilled';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--disabled-select', async t => {
  const id = 'forms-select-rich--disabled-select';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--disabled-option-opened', async t => {
  const id = 'forms-select-rich--disabled-option';
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
  t.pass();
});

test('forms-select-rich--validation', async t => {
  const id = 'forms-select-rich--validation';
  const page = await getStoryPage(id);
  await page.evaluate(() => {
    const el = document.querySelector('lion-select-rich');
    el.updateComplete.then(() => {
      el.touched = true;
      el.dirty = true;
    });
  });
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--render-options', async t => {
  const id = 'forms-select-rich--render-options';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--interaction-mode-mac', async t => {
  const id = 'forms-select-rich--interaction-mode';
  const page = await getStoryPage(id);
  await page.click('lion-select-rich');
  await page.keyboard.press('ArrowDown');
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--interaction-mode-windows-linux', async t => {
  const id = 'forms-select-rich--interaction-mode';
  const page = await getStoryPage(id);
  await page.click('lion-select-rich:last-of-type');
  await page.keyboard.press('ArrowDown');
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--no-default-selection', async t => {
  const id = 'forms-select-rich--no-default-selection';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('forms-select-rich--single-option', async t => {
  const id = 'forms-select-rich--single-option';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});
