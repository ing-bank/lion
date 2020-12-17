import { expect } from '@open-wc/testing';
import { convertPopperConfig } from '../src/convertPopperConfig.js';

const onCreate = () => {};
const onUpdate = () => {};
const otherProp = () => {};
const scheduleUpdate = () => {};
const update = () => {};

const popper1Cfg = {
  placement: 'bottom-start',
  positionFixed: true,
  modifiers: {
    keepTogether: {
      enabled: true,
    },
    preventOverflow: {
      enabled: false,
      boundariesElement: 'viewport',
      padding: 16,
    },
    flip: {
      enabled: true,
      boundariesElement: 'viewport',
      padding: 4,
    },
    offset: {
      enabled: true,
      offset: `0, 4px`,
    },
  },
  onCreate,
  onUpdate,
  scheduleUpdate,

  otherProp,
};

// Output
const popper2Cfg = {
  placement: 'bottom-start',
  strategy: 'fixed',
  modifiers: [
    {
      name: 'keepTogether',
      options: {},
      enabled: true,
    },
    {
      name: 'preventOverflow',
      options: {
        boundariesElement: 'viewport',
        padding: 16,
      },
      enabled: false,
    },
    {
      name: 'flip',
      options: {
        boundariesElement: 'viewport',
        padding: 4,
      },
      enabled: true,
    },
    {
      name: 'offset',
      options: {
        // Note the different offset notation
        offset: [0, 4],
      },
      enabled: true,
    },
  ],
  onFirstUpdate: onCreate,
  afterWrite: onUpdate,
  update: async () => scheduleUpdate(),
  forceUpdate: update,
  otherProp,
};

describe('convertPopperConfig', () => {
  it('converts positionFixed, modifiers, and lifecyle methods', async () => {
    expect(convertPopperConfig(popper1Cfg)).to.eql(popper2Cfg);
  });

  it('leaves popper 2 config untouched', async () => {
    // @ts-ignore convertPopperConfig expects Popper1 cfg
    expect(convertPopperConfig(popper2Cfg)).to.eql(popper2Cfg);
  });
});
