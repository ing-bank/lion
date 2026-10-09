/**
 * QA gate: a consumer must be able to compile the *published* declarations of `@lion/ui` with
 * `skipLibCheck: false`.
 *
 * The flag is where declaration defects hide: with `skipLibCheck: true` (the default in most
 * setups) the compiler never reads our `.d.ts` files, so a member that lost its `private` /
 * `protected` modifier, a missing export or a class type that cannot be named only shows up for
 * the consumer. This script compiles every entry point of the `exports` map as a consumer would:
 *
 *  - the package under test is *copied* into a temp fixture (not symlinked: symlinking makes the
 *    consumer see the source-tree module identity and hides resolution problems),
 *  - the fixture's other dependencies are linked from the repo's `node_modules`,
 *  - the fixture is type-checked with `skipLibCheck: false` and `moduleResolution: nodenext`.
 *
 * It runs as the last step of the `types` wireit task (`packages/ui/package.json`), so
 * `npm run lint` -> `lint:types` -> `npm run types` covers it in CI. Run it directly with
 * `npm run types-check-consumer --workspace @lion/ui` after a build.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const pkgDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(pkgDir, '..', '..');
const rootModules = path.join(repoRoot, 'node_modules');
const exportsDir = path.join(pkgDir, 'exports');
const distTypesDir = path.join(pkgDir, 'dist-types');
const pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));

if (!fs.existsSync(distTypesDir)) {
  console.error(
    `[consumer-types] no ${path.relative(repoRoot, distTypesDir)} yet - build the declarations first (npm run types)`,
  );
  process.exit(1);
}

/** Every `*.js` under `exports/` is reachable through the `"./*"` exports pattern. */
function walk(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(abs, base);
    return [path.relative(base, abs)];
  });
}

const specifiers = walk(exportsDir)
  .filter(file => file.endsWith('.js'))
  .map(file => `@lion/ui/${file}`)
  .sort();

/** module shape of the exports map still has to be a wildcard we understand */
const wildcard = pkgJson.exports?.['./*'];
if (!wildcard || !/^\.\/dist-types\/exports\/\*$/.test(wildcard.types || '')) {
  console.error(
    `[consumer-types] unexpected exports map - this gate assumes "./*" -> "./dist-types/exports/*"`,
  );
  process.exit(1);
}

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'lion-consumer-types-'));
try {
  const fixtureModules = path.join(fixture, 'node_modules');
  fs.mkdirSync(path.join(fixtureModules, '@lion'), { recursive: true });

  // copy the package under test: package.json + the emitted declarations + the entry points
  const copyRecursive = (from, to) => {
    fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
      if (entry.name !== 'node_modules') {
        const src = path.join(from, entry.name);
        const dst = path.join(to, entry.name);
        if (entry.isDirectory()) copyRecursive(src, dst);
        else fs.copyFileSync(src, dst);
      }
    }
  };
  copyRecursive(pkgDir, path.join(fixtureModules, '@lion', 'ui'));

  // every dependency the declarations import, resolved the way the consumer resolves it
  const link = (name, target) => {
    const dst = path.join(fixtureModules, name);
    if (fs.existsSync(dst)) return;
    fs.symlinkSync(target, dst, 'dir');
  };
  for (const entry of fs.readdirSync(rootModules, { withFileTypes: true })) {
    const abs = path.join(rootModules, entry.name);
    if (entry.name === '.bin' || entry.name === '@lion') {
      // nothing to link: the bin shims and the package under test
    } else if (entry.name.startsWith('@')) {
      fs.mkdirSync(path.join(fixtureModules, entry.name), { recursive: true });
      for (const scoped of fs.readdirSync(abs)) {
        link(`${entry.name}/${scoped}`, path.join(abs, scoped));
      }
    } else if (entry.isDirectory() || entry.isSymbolicLink()) {
      link(entry.name, abs);
    }
  }

  fs.writeFileSync(
    path.join(fixture, 'index.ts'),
    `${specifiers.map(spec => `import '${spec}';`).join('\n')}\n`,
  );
  fs.writeFileSync(
    path.join(fixture, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ESNext',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          lib: ['es2022', 'dom'],
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          types: [],
        },
        include: ['index.ts'],
      },
      null,
      2,
    )}\n`,
  );

  const tsc = path.join(rootModules, 'typescript', 'bin', 'tsc');
  console.log(
    `[consumer-types] compiling ${specifiers.length} entry points with skipLibCheck: false`,
  );
  execFileSync(process.execPath, [tsc, '-p', fixture], { stdio: 'inherit' });
  console.log('[consumer-types] 0 errors - the published declarations are consumer-clean');
} catch (error) {
  console.error(
    `[consumer-types] a consumer with \`skipLibCheck: false\` cannot compile these declarations (${error.status ?? 1})`,
  );
  process.exit(1);
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
