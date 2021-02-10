import chai from 'chai';
import { execute } from './test-helpers.js';

const { expect } = chai;

describe('PublishDocs', () => {
  it('reads all md files and replaces their content if reference is found', async () => {
    const { readOutput } = await execute('fixtures/imports-md/packages/my-pkg', {
      gitHubUrl: 'https://github.com/ing-bank/lion/',
      gitRootDir: 'fixtures/imports-md',
    });

    const readme = await readOutput('README.md');
    expect(readme).to.equal('# overview.md');
  });

  it('can copy asset files via copyPattern', async () => {
    const { readOutput } = await execute('fixtures/copies-assets/packages/my-pkg', {
      gitHubUrl: 'https://github.com/ing-bank/lion/',
      gitRootDir: 'fixtures/copies-assets',
      copyPattern: 'docs/red/*.json',
    });

    const data = await readOutput('docs/assets/red-data.json');
    expect(data).to.equal('{}');
  });

  it('adjust links to full absolute urls', async () => {
    const { readOutput } = await execute('fixtures/adjust-links/packages/my-pkg', {
      gitHubUrl: 'https://github.com/ing-bank/lion/',
      gitRootDir: 'fixtures/adjust-links',
    });

    const readme = await readOutput('README.md');
    expect(readme).to.equal(
      [
        '# overview.md',
        '',
        'See more [details](https://github.com/ing-bank/lion/blob/master/docs/red/details.md).',
        '',
        'There is more in [green](https://github.com/ing-bank/lion/blob/master/docs/green/overview.md).',
        '',
        'Dos not touch [external](https://google.com) links.',
      ].join('\n'),
    );

    const overview = await readOutput('docs/overview.md');
    expect(overview).to.equal(
      [
        '# overview.md',
        '',
        'See more [details](https://github.com/ing-bank/lion/blob/master/docs/red/details.md).',
        '',
        'There is more in [green](https://github.com/ing-bank/lion/blob/master/docs/green/overview.md).',
        '',
        'Dos not touch [external](https://google.com) links.',
      ].join('\n'),
    );
  });

  it('adjust links to use commit sha if available as environment "GITHUB_SHA" variable', async () => {
    process.env.GITHUB_SHA = '1234';
    const { readOutput } = await execute('fixtures/uses-commit-sha/packages/my-pkg', {
      gitHubUrl: 'https://github.com/ing-bank/lion/',
      gitRootDir: 'fixtures/uses-commit-sha',
    });

    const readme = await readOutput('README.md');
    expect(readme).to.equal(
      [
        '# overview.md',
        '',
        'See more [details](https://github.com/ing-bank/lion/blob/1234/docs/details.md).',
      ].join('\n'),
    );
    delete process.env.GITHUB_SHA;
  });
});
