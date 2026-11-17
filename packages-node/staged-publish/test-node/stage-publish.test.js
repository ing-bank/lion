import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
  getStagePublishArgs,
  getReleaseTag,
  parseStagedVersions,
  selectVersionBumps,
  stagePackages,
} from '../src/stage-publish.js';

/**
 * @typedef {{
 *   name: string;
 *   version: string;
 *   private?: boolean;
 *   publishConfig?: { access?: string; registry?: string };
 * }} TestManifest
 *
 * @typedef {{
 *   manifestPath: string;
 *   manifest: TestManifest;
 * }} TestWorkspace
 */

/**
 * @param {string} name
 * @param {string} version
 * @param {Pick<TestManifest, 'private' | 'publishConfig'>} [options]
 * @returns {TestWorkspace}
 */
const packageAt = (name, version, options = {}) => ({
  manifestPath: `${name}/package.json`,
  manifest: { name, version, ...options },
});

/**
 * @param {() => Promise<void>} method
 * @param {RegExp} expectedMessage
 * @returns {Promise<void>}
 */
async function expectThrowsAsync(method, expectedMessage) {
  let caughtError;
  try {
    await method();
  } catch (error) {
    caughtError = error;
  }

  expect(caughtError).to.be.instanceOf(Error);
  expect(caughtError.message).to.match(expectedMessage);
}

describe('staged-publish', () => {
  it('selects only changed, publishable package versions', () => {
    const workspaces = [
      packageAt('@lion/changed', '1.1.0'),
      packageAt('@lion/same', '2.0.0'),
      packageAt('@lion/private', '1.1.0', { private: true }),
      packageAt('@lion/unchanged', '1.1.0'),
    ];

    const selected = selectVersionBumps({
      workspaces,
      changedManifestPaths: [
        '@lion/changed/package.json',
        '@lion/same/package.json',
        '@lion/private/package.json',
      ],
      previousManifests: new Map([
        ['@lion/changed/package.json', { name: '@lion/changed', version: '1.0.0' }],
        ['@lion/same/package.json', { name: '@lion/same', version: '2.0.0' }],
        ['@lion/private/package.json', { name: '@lion/private', version: '1.0.0' }],
      ]),
    });

    expect(selected).to.deep.equal([workspaces[0]]);
  });

  it('ignores packages added in the same push without a previous version', () => {
    const workspace = packageAt('@lion/new', '1.0.0');
    const selected = selectVersionBumps({
      workspaces: [workspace],
      changedManifestPaths: ['@lion/new/package.json'],
      previousManifests: new Map([['@lion/new/package.json', undefined]]),
    });

    expect(selected).to.deep.equal([]);
  });

  it('uses Changesets release tags for stable and prerelease packages', () => {
    const prereleaseState = { tag: 'next' };
    const packageInfo = {
      versions: {
        '1.0.0-next.0': {},
        '1.0.0-next.1': {},
      },
      distTags: { latest: '1.0.0-next.1' },
    };

    expect(getReleaseTag(null, undefined)).to.equal('latest');
    expect(getReleaseTag(null, prereleaseState)).to.equal('next');
    expect(getReleaseTag(packageInfo, prereleaseState)).to.equal('latest');
    expect(
      getReleaseTag(
        {
          versions: { '1.0.0': {}, '1.1.0-next.0': {} },
          distTags: { latest: '1.0.0' },
        },
        prereleaseState,
      ),
    ).to.equal('next');
  });

  it('parses npm stage list and rejects unexpected responses', () => {
    const staged = [{ id: 'stage-123', packageName: '@lion/ui', version: '1.0.0', tag: 'latest' }];
    expect(parseStagedVersions(JSON.stringify(staged))).to.deep.equal(staged);
    expect(() => parseStagedVersions('{invalid')).to.throw(/invalid JSON/);
    expect(() => parseStagedVersions('{}')).to.throw(/expected an array/);
    expect(() => parseStagedVersions('[{}]')).to.throw(/invalid entry/);
  });

  it('targets one workspace directory rather than implicitly staging all workspaces', () => {
    expect(
      getStagePublishArgs('/repo/packages/ui', 'latest', 'public', 'https://registry.npmjs.org/'),
    ).to.deep.equal([
      'stage',
      'publish',
      '/repo/packages/ui',
      '--tag',
      'latest',
      '--access',
      'public',
      '--registry',
      'https://registry.npmjs.org/',
    ]);
  });

  it('skips published and already-staged versions', async () => {
    const logs = [];
    const published = packageAt('@lion/published', '1.0.0');
    const staged = packageAt('@lion/staged', '1.0.0');
    const publishedInfo = {
      versions: { '1.0.0': {} },
      distTags: { latest: '1.0.0' },
    };
    const stages = [
      { id: 'stage-123', packageName: '@lion/staged', version: '1.0.0', tag: 'latest' },
    ];
    let listCalls = 0;
    let publishCalls = 0;

    await stagePackages([published, staged], {
      access: 'public',
      fetchPackageInfo: async name => (name === published.manifest.name ? publishedInfo : null),
      listStageRecords: async () => {
        listCalls += 1;
        return stages;
      },
      stagePackageVersion: async () => {
        publishCalls += 1;
      },
      log: message => logs.push(message),
    });

    expect(listCalls).to.equal(1);
    expect(publishCalls).to.equal(0);
    expect(logs[0]).to.match(/Already published/);
    expect(logs[1]).to.match(/Already staged/);
  });

  it('fails when an existing staged version has a different immutable tag', async () => {
    const pkg = packageAt('@lion/ui', '1.1.0');

    await expectThrowsAsync(
      () =>
        stagePackages([pkg], {
          access: 'public',
          fetchPackageInfo: async () => null,
          listStageRecords: async () => [
            { id: 'stage-123', packageName: '@lion/ui', version: '1.1.0', tag: 'next' },
          ],
          stagePackageVersion: async () => {
            throw new Error('must not stage a mismatched tag');
          },
          log: () => {},
        }),
      /expected "latest".*Reject stage stage-123/,
    );
  });

  it('resumes after a partial failure without restaging successful versions', async () => {
    const packages = [packageAt('@lion/first', '1.0.0'), packageAt('@lion/second', '1.0.0')];
    const stages = new Map();
    let failSecond = true;
    let firstPublishCalls = 0;
    let secondPublishCalls = 0;
    const options = {
      access: 'public',
      fetchPackageInfo: async () => null,
      listStageRecords: async name => stages.get(name) || [],
      stagePackageVersion: async pkg => {
        if (pkg.manifest.name === '@lion/second' && failSecond) {
          throw new Error('temporary registry failure');
        }
        if (pkg.manifest.name === '@lion/first') {
          firstPublishCalls += 1;
        } else {
          secondPublishCalls += 1;
        }
        stages.set(pkg.manifest.name, [
          {
            id: `stage-${pkg.manifest.name}`,
            packageName: pkg.manifest.name,
            version: pkg.manifest.version,
            tag: 'latest',
          },
        ]);
      },
      log: () => {},
    };

    await expectThrowsAsync(() => stagePackages(packages, options), /temporary registry failure/);
    failSecond = false;
    await stagePackages(packages, options);

    expect(firstPublishCalls).to.equal(1);
    expect(secondPublishCalls).to.equal(1);
  });

  it('does not convert registry, stage-list, or publish failures into success', async () => {
    const pkg = packageAt('@lion/ui', '1.0.0');

    await expectThrowsAsync(
      () =>
        stagePackages([pkg], {
          access: 'public',
          fetchPackageInfo: async () => {
            throw new Error('registry unavailable');
          },
          listStageRecords: async () => [],
          stagePackageVersion: async () => {},
          log: () => {},
        }),
      /registry unavailable/,
    );

    await expectThrowsAsync(
      () =>
        stagePackages([pkg], {
          access: 'public',
          fetchPackageInfo: async () => null,
          listStageRecords: async () => {
            throw new Error('stage list unauthorized');
          },
          stagePackageVersion: async () => {},
          log: () => {},
        }),
      /stage list unauthorized/,
    );

    await expectThrowsAsync(
      () =>
        stagePackages([pkg], {
          access: 'public',
          fetchPackageInfo: async () => null,
          listStageRecords: async () => [],
          stagePackageVersion: async () => {
            throw new Error('stage request failed');
          },
          log: () => {},
        }),
      /stage request failed/,
    );
  });
});
