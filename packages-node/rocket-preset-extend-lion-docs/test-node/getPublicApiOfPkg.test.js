/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { fileURLToPath } from 'url';
import chai from 'chai';

import { getPublicApiOfPkg } from '../src/getPublicApiOfPkg.js';

const { expect } = chai;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} input
 * @returns
 */
async function execute(input) {
  const pkgJsonPath = path.join(__dirname, input.split('/').join(path.sep));
  const result = await getPublicApiOfPkg(pkgJsonPath);
  return {
    ...result,
    entryPoints: result.entryPoints.map(ep => ({
      ...ep,
      path: ep.path.replace(__dirname, 'abs::').replace(/\\/g, '/'),
    })),
  };
}

describe('getPublicApiOfPkg', () => {
  it('01: works for star exports', async () => {
    const result = await execute('fixtures/01-public-api/01-star-export/@lion/ui/package.json');
    expect(result).to.deep.equal({
      name: '@lion/ui',
      entryPoints: [
        {
          entry: './*',
          name: '@lion/ui/accordion.js',
          namePath: 'accordion.js',
          path: 'abs::/fixtures/01-public-api/01-star-export/@lion/ui/exports/accordion.js',
          exports: ['LionAccordion'],
        },
        {
          entry: './*',
          name: '@lion/ui/define/lion-accordion.js',
          namePath: 'define/lion-accordion.js',
          path: 'abs::/fixtures/01-public-api/01-star-export/@lion/ui/exports/define/lion-accordion.js',
          exports: [],
        },
      ],
    });
  });

  it('03: works for file exports', async () => {
    const result = await execute('fixtures/01-public-api/02-file-export/@lion/ui/package.json');
    expect(result).to.deep.equal({
      name: '@lion/ui',
      entryPoints: [
        {
          entry: '.',
          name: '@lion/ui',
          namePath: '',
          path: 'abs::/fixtures/01-public-api/02-file-export/@lion/ui/src/LionAccordion.js',
          exports: ['LionAccordion'],
        },
      ],
    });
  });

  it('04: ignores none js files', async () => {
    const result = await execute(
      'fixtures/01-public-api/04-none-js-entrypoints/@lion/ui/package.json',
    );
    expect(result).to.deep.equal({
      name: '@lion/ui',
      entryPoints: [],
    });
  });
});
