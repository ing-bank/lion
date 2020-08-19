/* globals capture getStoryPage */

const selector = 'lion-calendar';

describe('others-calendar', () => {
  it('main', async () => {
    const id = 'others-calendar--main';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('selected-date', async () => {
    const id = 'others-calendar--selected-date';
    const page = await getStoryPage(id);
    await capture({ selector, id, page });
  });
  it('central-date', async () => {
    const id = 'others-calendar--central-date';
    const page = await getStoryPage(id, {
      command: 'Emulation.setVirtualTimePolicy',
      parameters: {
        policy: 'advance',
        initialVirtualTime: new Date('2000/12/15').getTime() / 1000,
      },
    });
    await capture({ selector, id, page });
  });
  it('controlling-focus', async () => {
    const id = 'others-calendar--controlling-focus';
    const page = await getStoryPage(id, {
      command: 'Emulation.setVirtualTimePolicy',
      parameters: {
        policy: 'advance',
        initialVirtualTime: new Date('2000/12/15').getTime() / 1000,
      },
    });
    await page.evaluate(() => {
      document.querySelector('button').click();
    });
    await capture({ selector, id, page });
  });
  it('providing-lower-limit', async () => {
    const id = 'others-calendar--providing-lower-limit';
    const page = await getStoryPage(id, {
      command: 'Emulation.setVirtualTimePolicy',
      parameters: {
        policy: 'advance',
        initialVirtualTime: new Date('2000/12/15').getTime() / 1000,
      },
    });
    await capture({ selector, id, page });
  });
  it('providing-higher-limit', async () => {
    const id = 'others-calendar--providing-higher-limit';
    const page = await getStoryPage(id, {
      command: 'Emulation.setVirtualTimePolicy',
      parameters: {
        policy: 'advance',
        initialVirtualTime: new Date('2000/12/15').getTime() / 1000,
      },
    });
    await capture({ selector, id, page });
  });
  it('disabled-dates', async () => {
    const id = 'others-calendar--disabled-dates';
    const page = await getStoryPage(id, {
      command: 'Emulation.setVirtualTimePolicy',
      parameters: {
        policy: 'advance',
        initialVirtualTime: new Date('2000/12/15').getTime() / 1000,
      },
    });
    await capture({ selector, id, page });
  });
  it('combined-disabled-datess', async () => {
    const id = 'others-calendar--combined-disabled-dates';
    const page = await getStoryPage(id, {
      command: 'Emulation.setVirtualTimePolicy',
      parameters: {
        policy: 'advance',
        initialVirtualTime: new Date('2000/12/15').getTime() / 1000,
      },
    });
    await capture({ selector, id, page });
  });
});
