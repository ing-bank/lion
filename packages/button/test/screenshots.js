/* globals capture getStoryPage */
// eslint-disable-next-line import/no-extraneous-dependencies
const test = require('ava');

const selector = 'lion-button';

test('buttons-button--main', async t => {
  const id = 'buttons-button--main';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('buttons-button--main-hovered', async t => {
  const id = 'buttons-button--main';
  const page = await getStoryPage(id);
  await page.hover(selector);
  await capture({ selector, id: `${id}-hovered`, page });
  t.pass();
});

test('buttons-button--main-focused', async t => {
  const id = 'buttons-button--main';
  const page = await getStoryPage(id);
  await page.keyboard.press('Enter', selector);
  await page.focus(selector);
  await capture({ selector, id: `${id}-focused`, page });
  t.pass();
});

test('buttons-button--handler', async t => {
  const id = 'buttons-button--handler';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('buttons-button--icon-button', async t => {
  const id = 'buttons-button--icon-button';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('buttons-button--icon-only', async t => {
  const id = 'buttons-button--icon-only';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('buttons-button--icon-only-hovered', async t => {
  const id = 'buttons-button--icon-only';
  const page = await getStoryPage(id);
  await page.hover(selector);
  await capture({ selector, id: `${id}-hovered`, page });
  t.pass();
});

test('buttons-button--icon-only-focused', async t => {
  const id = 'buttons-button--icon-only';
  const page = await getStoryPage(id);
  await page.keyboard.press('Enter', selector);
  await page.focus(selector);
  await capture({ selector, id: `${id}-focused`, page });
  t.pass();
});

test('buttons-button--disabled', async t => {
  const id = 'buttons-button--disabled';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});

test('buttons-button--within-form', async t => {
  const id = 'buttons-button--within-form';
  const page = await getStoryPage(id);
  await capture({ selector, id, page });
  t.pass();
});
