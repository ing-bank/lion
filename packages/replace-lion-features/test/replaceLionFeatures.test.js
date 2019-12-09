const { expect } = require('chai');

const { replaceLionFeatures } = require('../src/replaceLionFeatures.js');

describe('replaceLionFeatures', () => {
  const defaultConfig = { outPrefix: 'ing', currentPackage: 'calendar' };

  it('replaces all known tags and classes appropriately', () => {
    const input = `
      import { LionCalendar } from '../src/LionCalendar.js';
      import { LionCalendar } from '../index.js';
      import { LionInputEmail } from '@lion/input-email';

      import '../lion-calendar.js';
      import '@lion/input/lion-input.js';
    `;
    const output = `
      import { IngCalendar } from '../../../../packages/calendar/src/IngCalendar.js';
      import { IngCalendar } from '../../../../packages/calendar/index.js';
      import { IngInputEmail } from '../../../../packages/input-email/index.js';

      import '../../../../packages/calendar/ing-calendar.js';
      import '../../../../packages/input/ing-input.js';
    `;
    expect(replaceLionFeatures(input, defaultConfig)).to.equal(output);
  });

  it('allows to define own logic on where to import from', async () => {
    const input = `
      import { LionCalendar } from '../src/LionCalendar.js';
      import { LionCalendar } from '../index.js';
      import { LionInputEmail } from '@lion/input-email';

      import '../lion-calendar.js';
      import '@lion/input/lion-input.js';
    `;
    const output = `
      import { IngCalendar } from '../../../../packages/calendar/src/IngCalendar.js';
      import { IngCalendar } from '../../../../packages/calendar/index.js';
      import { IngInputEmail } from '../../../../forms.js';

      import '../../../../ing-calendar.js';
      import '../../../../ing-input.js';
    `;
    const config = {
      ...defaultConfig,
      getIndexClassImportPath: ({ outPackageName }) => {
        if (outPackageName === 'input-email') {
          return '../../../../forms.js';
        }
        return `../../../../packages/${outPackageName}/index.js`;
      },
      getTagImportPath: ({ outTagName }) => `../../../../${outTagName}.js`,
    };
    expect(replaceLionFeatures(input, config)).to.equal(output);
  });
});
