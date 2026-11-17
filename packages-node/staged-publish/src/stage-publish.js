import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import util from 'node:util';
import url from 'node:url';

const execFile = util.promisify(childProcess.execFile);
const packageDir = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const rootDir = path.resolve(packageDir, '../..');
const npmRegistry = 'https://registry.npmjs.org/';
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

/**
 * @typedef {{
 *   registry?: string;
 *   access?: string;
 * }} PublishConfig
 *
 * @typedef {{
 *   name: string;
 *   version: string;
 *   private?: boolean;
 *   publishConfig?: PublishConfig;
 * }} PackageManifest
 *
 * @typedef {{
 *   manifestPath: string;
 *   manifest: PackageManifest;
 * }} WorkspacePackage
 *
 * @typedef {{
 *   versions: { [version: string]: { name?: string; version?: string } };
 *   distTags: { [tag: string]: string };
 * }} RegistryPackageInfo
 *
 * @typedef {{
 *   id: string;
 *   packageName: string;
 *   version: string;
 *   tag: string;
 * }} StagedVersion
 *
 * @typedef {{
 *   workspaces: WorkspacePackage[];
 *   changedManifestPaths: string[];
 *   previousManifests: Map<string, PackageManifest | undefined>;
 * }} VersionSelectionOptions
 *
 * @typedef {{
 *   access: string;
 *   preState?: { tag: string };
 *   fetchPackageInfo: (name: string, registry: string) => Promise<RegistryPackageInfo | null>;
 *   listStageRecords: (name: string, registry: string) => Promise<StagedVersion[]>;
 *   stagePackageVersion: (
 *     pkg: WorkspacePackage,
 *     tag: string,
 *     access: string,
 *     registry: string,
 *   ) => Promise<void>;
 *   log?: (message: string) => void;
 * }} StagePackagesOptions
 */

/**
 * Select public workspace packages whose versions changed in this push.
 *
 * @param {VersionSelectionOptions} options
 * @returns {WorkspacePackage[]}
 */
export function selectVersionBumps({ workspaces, changedManifestPaths, previousManifests }) {
  const changedPaths = new Set(changedManifestPaths);

  return workspaces.filter(({ manifestPath, manifest }) => {
    if (!changedPaths.has(manifestPath) || manifest.private) {
      return false;
    }

    if (typeof manifest.name !== 'string' || typeof manifest.version !== 'string') {
      throw new Error(`Invalid publishable package manifest: ${manifestPath}`);
    }

    if (!semverPattern.test(manifest.version)) {
      throw new Error(`Invalid package version "${manifest.version}" in ${manifestPath}`);
    }

    const previousManifest = previousManifests.get(manifestPath);
    return Boolean(previousManifest && previousManifest.version !== manifest.version);
  });
}

/**
 * Parse npm's JSON output for staged versions and validate the response shape.
 *
 * @param {string} output
 * @returns {StagedVersion[]}
 */
export function parseStagedVersions(output) {
  let entries;
  try {
    entries = JSON.parse(output);
  } catch (error) {
    throw new Error('npm stage list returned invalid JSON', { cause: error });
  }

  if (!Array.isArray(entries)) {
    throw new Error('npm stage list returned an unexpected response (expected an array)');
  }

  return entries.map((entry, index) => {
    if (
      !entry ||
      typeof entry.id !== 'string' ||
      typeof entry.packageName !== 'string' ||
      typeof entry.version !== 'string' ||
      typeof entry.tag !== 'string'
    ) {
      throw new Error(`npm stage list returned an invalid entry at index ${index}`);
    }
    return {
      id: entry.id,
      packageName: entry.packageName,
      version: entry.version,
      tag: entry.tag,
    };
  });
}

/**
 * Build an npm command that targets exactly one workspace directory.
 *
 * @param {string} packageDirectory
 * @param {string} tag
 * @param {string} access
 * @param {string} registry
 * @returns {string[]}
 */
export function getStagePublishArgs(packageDirectory, tag, access, registry) {
  return [
    'stage',
    'publish',
    packageDirectory,
    '--tag',
    tag,
    '--access',
    access,
    '--registry',
    registry,
  ];
}

/**
 * Determine the release tag used by Changesets for this package.
 *
 * @param {RegistryPackageInfo | null} packageInfo
 * @param {{ tag: string } | undefined} preState
 * @returns {string}
 */
export function getReleaseTag(packageInfo, preState) {
  if (!preState) {
    return 'latest';
  }

  const versions = packageInfo ? Object.keys(packageInfo.versions) : [];
  const onlyHasThisPrerelease =
    Boolean(packageInfo?.distTags.latest) &&
    versions.length > 0 &&
    versions.every(version => {
      const match = version.match(semverPattern);
      return match?.[4]?.split('.')[0] === preState.tag;
    });

  return onlyHasThisPrerelease ? 'latest' : preState.tag;
}

/**
 * Stage version bumps, skipping versions already published or staged.
 *
 * @param {WorkspacePackage[]} packages
 * @param {StagePackagesOptions} options
 * @returns {Promise<void>}
 */
export async function stagePackages(
  packages,
  {
    access,
    preState,
    fetchPackageInfo,
    listStageRecords,
    stagePackageVersion,
    log = message => process.stdout.write(`${message}\n`),
  },
) {
  for (const pkg of packages) {
    const { manifest } = pkg;
    const registry = manifest.publishConfig?.registry || npmRegistry;
    const packageInfo = await fetchPackageInfo(manifest.name, registry);

    if (packageInfo?.versions[manifest.version]) {
      log(`Already published: ${manifest.name}@${manifest.version}`);
    } else {
      const tag = getReleaseTag(packageInfo, preState);
      if (manifest.version.match(semverPattern)?.[4] && !preState) {
        throw new Error(
          `${manifest.name}@${manifest.version} is a prerelease but Changesets has no prerelease state`,
        );
      }

      const stagedVersions = await listStageRecords(manifest.name, registry);
      const matchingStages = stagedVersions.filter(
        stage => stage.packageName === manifest.name && stage.version === manifest.version,
      );

      if (matchingStages.length > 1) {
        throw new Error(`Found multiple staged records for ${manifest.name}@${manifest.version}`);
      }

      if (matchingStages.length === 1) {
        const [stage] = matchingStages;
        if (stage.tag !== tag) {
          throw new Error(
            `${manifest.name}@${manifest.version} is staged with tag "${stage.tag}", expected "${tag}". Reject stage ${stage.id} before retrying.`,
          );
        }
        log(`Already staged: ${manifest.name}@${manifest.version} (stage ${stage.id})`);
      } else {
        const packageAccess = manifest.publishConfig?.access || access;
        if (packageAccess !== 'public' && packageAccess !== 'restricted') {
          throw new Error(
            `Unsupported npm access "${packageAccess}" for ${manifest.name}@${manifest.version}`,
          );
        }

        await stagePackageVersion(pkg, tag, packageAccess, registry);
        log(`Staged: ${manifest.name}@${manifest.version} (tag ${tag})`);
      }
    }
  }
}

/**
 * Read manifests from the supported direct and exact workspace patterns.
 *
 * @returns {Promise<WorkspacePackage[]>}
 */
async function readWorkspaceManifests() {
  const rootManifest = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf8'));
  const workspacePatterns = Array.isArray(rootManifest.workspaces)
    ? rootManifest.workspaces
    : rootManifest.workspaces?.packages;

  if (!Array.isArray(workspacePatterns)) {
    throw new Error('Root package.json does not define npm workspaces');
  }

  const manifests = [];
  for (const pattern of workspacePatterns) {
    let directories;
    if (pattern.endsWith('/*')) {
      const parent = pattern.slice(0, -2);
      const entries = await fs.readdir(path.join(rootDir, parent), {
        withFileTypes: true,
      });
      directories = entries
        .filter(entry => entry.isDirectory())
        .map(entry => path.posix.join(parent, entry.name));
    } else if (!pattern.includes('*')) {
      directories = [pattern];
    } else {
      throw new Error(`Unsupported npm workspace pattern: ${pattern}`);
    }

    for (const directory of directories) {
      const manifestPath = path.posix.join(directory, 'package.json');
      let manifestContents;
      try {
        manifestContents = await fs.readFile(path.join(rootDir, manifestPath), 'utf8');
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
      if (manifestContents !== undefined) {
        const manifest = JSON.parse(manifestContents);
        manifests.push({ manifestPath, manifest });
      }
    }
  }

  return manifests;
}

/**
 * Read a package manifest at the previous push commit.
 *
 * @param {string} beforeSha
 * @param {string} manifestPath
 * @returns {Promise<PackageManifest | undefined>}
 */
async function readPreviousManifest(beforeSha, manifestPath) {
  try {
    const { stdout } = await execFile('git', ['show', `${beforeSha}:${manifestPath}`], {
      cwd: rootDir,
    });
    return JSON.parse(stdout);
  } catch (error) {
    if (error.stderr?.includes(`does not exist in '${beforeSha}'`)) {
      return undefined;
    }
    throw new Error(`Unable to read ${manifestPath} at ${beforeSha}`, {
      cause: error,
    });
  }
}

/**
 * Get changed paths from the previous push commit through HEAD.
 *
 * @param {string} beforeSha
 * @returns {Promise<string[]>}
 */
async function getChangedManifestPaths(beforeSha) {
  const { stdout } = await execFile('git', ['diff', '--name-only', '-z', beforeSha, 'HEAD', '--'], {
    cwd: rootDir,
    maxBuffer: 16 * 1024 * 1024,
  });
  return stdout.split('\0').filter(filePath => filePath.endsWith('/package.json'));
}

/**
 * Identify public workspaces whose package versions changed in this push.
 *
 * @param {string} beforeSha
 * @returns {Promise<WorkspacePackage[]>}
 */
async function getChangedVersionBumps(beforeSha) {
  if (!/^[0-9a-f]{40}$/.test(beforeSha)) {
    throw new Error(`Invalid previous commit SHA in GitHub push event: ${beforeSha}`);
  }

  const workspaces = await readWorkspaceManifests();
  const changedManifestPaths = await getChangedManifestPaths(beforeSha);
  const previousManifests = new Map();
  for (const { manifestPath } of workspaces) {
    if (changedManifestPaths.includes(manifestPath)) {
      previousManifests.set(manifestPath, await readPreviousManifest(beforeSha, manifestPath));
    }
  }

  return selectVersionBumps({
    workspaces,
    changedManifestPaths,
    previousManifests,
  });
}

/**
 * Read public package metadata from its configured registry.
 *
 * @param {string} name
 * @param {string} registry
 * @returns {Promise<RegistryPackageInfo | null>}
 */
async function getPackageInfo(name, registry) {
  const packagePath = encodeURIComponent(name).replace(/^%40/, '@').replace(/%2F/g, '%2f');
  const response = await fetch(new URL(packagePath, registry), {
    headers: { accept: 'application/vnd.npm.install-v1+json' },
  });

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(
      `Unable to query ${name} from ${registry}: registry returned ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  if (
    !data ||
    typeof data.versions !== 'object' ||
    Array.isArray(data.versions) ||
    !data.versions ||
    typeof data['dist-tags'] !== 'object' ||
    Array.isArray(data['dist-tags']) ||
    !data['dist-tags']
  ) {
    throw new Error(`Registry returned invalid package metadata for ${name}`);
  }

  return { versions: data.versions, distTags: data['dist-tags'] };
}

/**
 * Query staged versions for one package using the npm CLI.
 *
 * @param {string} name
 * @param {string} registry
 * @returns {Promise<StagedVersion[]>}
 */
async function listStagedVersions(name, registry) {
  const { stdout } = await execFile(
    'npm',
    ['stage', 'list', '--json', '--registry', registry, `${name}@*`],
    { cwd: rootDir, maxBuffer: 16 * 1024 * 1024 },
  );
  return parseStagedVersions(stdout);
}

/**
 * Stage one package directory using npm's publish lifecycle.
 *
 * @param {WorkspacePackage} pkg
 * @param {string} tag
 * @param {string} access
 * @param {string} registry
 * @returns {Promise<void>}
 */
async function publishPackage(pkg, tag, access, registry) {
  const { manifest } = pkg;
  const packageDirectory = path.join(rootDir, path.dirname(pkg.manifestPath));
  const args = getStagePublishArgs(packageDirectory, tag, access, registry);

  try {
    const { stdout, stderr } = await execFile('npm', args, {
      cwd: rootDir,
      maxBuffer: 64 * 1024 * 1024,
    });
    if (stdout) {
      process.stdout.write(stdout);
    }
    if (stderr) {
      process.stderr.write(stderr);
    }
  } catch (error) {
    if (error.stdout) {
      process.stdout.write(error.stdout);
    }
    if (error.stderr) {
      process.stderr.write(error.stderr);
    }
    throw new Error(`Failed to stage ${manifest.name}@${manifest.version}`, { cause: error });
  }
}

/**
 * Read the current Changesets prerelease state, if any.
 *
 * @returns {Promise<{ tag: string } | undefined>}
 */
async function readPreState() {
  let contents;
  try {
    contents = await fs.readFile(path.join(rootDir, '.changeset/pre.json'), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return undefined;
    }
    throw error;
  }

  const state = JSON.parse(contents);
  if (state.mode !== 'pre') {
    return undefined;
  }
  if (typeof state.tag !== 'string' || state.tag.length === 0) {
    throw new Error('Changesets prerelease state is missing its npm tag');
  }
  return { tag: state.tag };
}

/**
 * Create the empty action report so Changesets cannot infer published packages.
 *
 * @returns {Promise<void>}
 */
async function writeEmptyChangesetsOutput() {
  const outputPath = process.env.CHANGESETS_OUTPUT;
  if (outputPath) {
    await fs.writeFile(outputPath, '');
  }
}

/**
 * Run the release script from the GitHub Actions push event.
 *
 * @returns {Promise<void>}
 */
async function run() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH is required to identify this release push');
  }

  const event = JSON.parse(await fs.readFile(eventPath, 'utf8'));
  const packages = await getChangedVersionBumps(event.before);
  await writeEmptyChangesetsOutput();

  if (packages.length === 0) {
    process.stdout.write('No publishable workspace versions changed in this push.\n');
    return;
  }

  const changesetsConfig = JSON.parse(
    await fs.readFile(path.join(rootDir, '.changeset/config.json'), 'utf8'),
  );
  await stagePackages(packages, {
    access: changesetsConfig.access,
    preState: await readPreState(),
    fetchPackageInfo: getPackageInfo,
    listStageRecords: listStagedVersions,
    stagePackageVersion: publishPackage,
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === url.fileURLToPath(import.meta.url)) {
  run().catch(error => {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
