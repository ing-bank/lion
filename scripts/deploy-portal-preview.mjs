#!/usr/bin/env node
/**
 * Publish a test version of the astro portal under a folder that carries the branch name.
 *
 *   npm run portal:preview                       # build HEAD, publish to gh-pages, print the url
 *   npm run portal:preview -- --no-push          # build and stage, but do not push
 *   npm run portal:preview -- --no-build         # reuse the dist/ that is already there
 *   npm run portal:preview -- --branch=feat/x    # preview a branch other than HEAD
 *   npm run portal:preview -- --target=local     # stage in ~/portal-previews, no push
 *   npm run portal:preview -- --target=local --serve
 *                                                # ... and expose it on the tailnet (private url)
 *
 * The portal reads its prefix from import.meta.env.BASE_URL, so a preview is the normal build
 * with a different ASTRO_BASE_URL (see astro.config.mjs). Every preview gets its own folder:
 *
 *   pages target (default)  https://lion.js.org/next-preview/<branch-slug>/
 *   local target            http://<machine>.<tailnet>.ts.net:8446/<branch-slug>/
 *
 * The pages target is the shared GitHub Pages site: the url is unlisted (nothing links to it)
 * but not access controlled. Use the local target when the content may not be public.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PREVIEW_DIR = 'next-preview'; // folder on the published site that groups all previews
const PAGES_HOST = 'https://lion.js.org';
const AUTHOR = { name: 'Thijs Louisse', email: 'Thijs.Louisse@ing.com' };

const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const hit = args.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

const git = (gitArgs, options = {}) =>
  execFileSync('git', gitArgs, { cwd: ROOT, encoding: 'utf8', ...options }).trim();

const run = (cmd, cmdArgs, env = {}) => {
  const res = spawnSync(cmd, cmdArgs, {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ASTRO_BASE_URL: env.ASTRO_BASE_URL },
  });
  if (res.status !== 0) throw new Error(`${cmd} ${cmdArgs.join(' ')} failed with ${res.status}`);
};

const slugify = ref =>
  ref
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

async function main() {
  const branch = opt('branch', git(['rev-parse', '--abbrev-ref', 'HEAD']));
  const commit = git(['rev-parse', '--short', 'HEAD']);
  const slug = slugify(branch);
  const base = `/${PREVIEW_DIR}/${slug}`;
  const target = opt('target', 'pages');

  console.log(`portal preview: branch=${branch} commit=${commit} slug=${slug} base=${base} target=${target}`);

  if (!flag('no-build')) {
    // astro build only: the branch preview is the portal, not the legacy rocket site.
    run('npx', ['astro', 'build', '--force'], { ASTRO_BASE_URL: base });
    run('node', ['src/utils/rewrite-links.mjs'], { ASTRO_BASE_URL: base });
  }

  const dist = path.join(ROOT, 'dist');
  if (!fs.existsSync(dist)) throw new Error(`${dist} does not exist - run without --no-build`);

  const meta = { branch, commit, base, builtAt: new Date().toISOString() };

  if (target === 'local') {
    const previewRoot = opt('local-root', path.join(os.homedir(), 'portal-previews'));
    await publishLocal(previewRoot, slug, dist, meta);
    if (flag('serve')) serveLocal(previewRoot);
    return;
  }

  await publishPages(slug, dist, meta);
}

async function publishPages(slug, dist, meta) {
  const worktree = opt('worktree', findGhPagesWorktree() ?? createGhPagesWorktree());
  const folder = path.join(worktree, PREVIEW_DIR, slug);

  await fsp.rm(folder, { recursive: true, force: true });
  await fsp.mkdir(folder, { recursive: true });
  await fsp.cp(dist, folder, { recursive: true });
  await fsp.writeFile(path.join(folder, 'preview.json'), `${JSON.stringify(meta, null, 2)}\n`);
  await writeIndex(path.join(worktree, PREVIEW_DIR));

  const url = `${PAGES_HOST}/next-preview/${slug}/`;
  if (flag('no-push')) {
    console.log(`staged in ${folder}\nnot pushed (--no-push)\nwould be live at ${url}`);
    return;
  }

  const rel = path.relative(worktree, folder);
  git(['-C', worktree, 'add', '-A', rel, `${PREVIEW_DIR}/index.html`]);
  git([
    '-C', worktree,
    '-c', `user.name=${AUTHOR.name}`, '-c', `user.email=${AUTHOR.email}`,
    'commit', '-q', '-m', `chore(portal): preview ${meta.branch} (${meta.commit})`,
  ]);
  git(['-C', worktree, 'push', 'origin', 'HEAD:gh-pages']);
  console.log(`preview live at ${url}`);
}

async function publishLocal(previewRoot, slug, dist, meta) {
  // Same layout as the pages target: <root>/<PREVIEW_DIR>/<slug>/. The local root is a stand-in
  // for the published site root, so one build serves both targets.
  const previewDir = path.join(previewRoot, PREVIEW_DIR);
  const folder = path.join(previewDir, slug);
  await fsp.rm(folder, { recursive: true, force: true });
  await fsp.mkdir(folder, { recursive: true });
  await fsp.cp(dist, folder, { recursive: true });
  await fsp.writeFile(path.join(folder, 'preview.json'), `${JSON.stringify(meta, null, 2)}\n`);
  await writeIndex(previewDir);
  console.log(`staged in ${folder}`);
  console.log(`serve it:  python3 -m http.server ${opt('port', '8099')} --bind 0.0.0.0 --directory ${previewRoot}`);
  console.log(`private url: http://${tailnetName()}:${opt('http-port', '8446')}/${PREVIEW_DIR}/${slug}/`);
}

function tailnetName() {
  try {
    const status = JSON.parse(execFileSync('tailscale', ['status', '--json'], { encoding: 'utf8' }));
    return (status.Self?.DNSName ?? '').replace(/\.$/, '') || os.hostname();
  } catch {
    return os.hostname();
  }
}

function serveLocal(previewRoot) {
  const port = Number(opt('port', '8099'));
  const httpPort = opt('http-port', '8446');
  spawnSync('tailscale', ['serve', '--bg', `--http=${httpPort}`, `http://127.0.0.1:${port}`], {
    stdio: 'inherit',
  });
  console.log(`tailscale serve: :${httpPort} -> 127.0.0.1:${port} (tailnet only, nobody else)`);
  console.log('start the static server (keep it running while the preview is shared):');
  console.log(`  python3 -m http.server ${port} --bind 0.0.0.0 --directory ${previewRoot}`);
}

function findGhPagesWorktree() {
  const entries = git(['worktree', 'list', '--porcelain']).split('\n\n');
  const hit = entries.find(entry => /branch refs\/heads\/gh-pages/.test(entry));
  return hit ? hit.match(/^worktree (.+)$/m)[1] : undefined;
}

function createGhPagesWorktree() {
  const dir = path.join(os.homedir(), 'tmp', 'lion-gh-pages-worktree');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.dirname(dir), { recursive: true });
    git(['worktree', 'add', '--detach', dir, 'origin/gh-pages']);
  }
  // Pin the local gh-pages branch to the published tip, so the preview lands on top of it.
  execFileSync('git', ['checkout', '-B', 'gh-pages', 'origin/gh-pages'], { cwd: dir, stdio: 'inherit' });
  return dir;
}

async function writeIndex(dir) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  const previews = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const metaFile = path.join(dir, entry.name, 'preview.json');
    const meta = fs.existsSync(metaFile) ? JSON.parse(await fsp.readFile(metaFile, 'utf8')) : {};
    previews.push({ slug: entry.name, ...meta });
  }
  previews.sort((a, b) => (b.builtAt ?? '').localeCompare(a.builtAt ?? ''));

  const rows = previews
    .map(
      p =>
        `      <li><a href="./${p.slug}/">${p.slug}</a> <small>${p.branch ?? ''} ${p.commit ?? ''} ${
          p.builtAt ? new Date(p.builtAt).toISOString().slice(0, 16).replace('T', ' ') : ''
        }</small></li>`,
    )
    .join('\n');

  await fsp.writeFile(
    path.join(dir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Lion portal previews</title>
  </head>
  <body>
    <h1>Lion portal previews</h1>
    <p>Test versions of the portal, one folder per branch.</p>
    <ul>
${rows}
    </ul>
  </body>
</html>
`,
  );
}

await main();
