import { expect } from 'chai';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { screenreaderPlugin } from '../src/screenreaderPlugin.js';
import { patchVirtualReaderBundle, VIRTUAL_READER_FIXES } from '../src/virtualReaderBundle.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '../../..');
const BUNDLE_URL_PATH = '/node_modules/@guidepup/virtual-screen-reader/lib/esm/index.browser.js';

describe('patchVirtualReaderBundle', () => {
  it('applies every fix to the source it was written against', () => {
    const source = VIRTUAL_READER_FIXES.map((fix, index) => `${fix.before} /*${index}*/`).join(' ');
    const patched = patchVirtualReaderBundle(source);
    for (const fix of VIRTUAL_READER_FIXES) {
      expect(patched).to.include(fix.after);
      expect(patched).to.not.include(fix.before);
    }
  });

  it('leaves an already patched source alone', () => {
    const source = VIRTUAL_READER_FIXES.map(fix => fix.after).join(' ');
    expect(patchVirtualReaderBundle(source)).to.equal(source);
  });

  it('fails loudly when the source does not match the version the fixes were written for', () => {
    const [first] = VIRTUAL_READER_FIXES;
    const source = VIRTUAL_READER_FIXES.map(fix => fix.before)
      .join(' ')
      .replace(first.before, 'something else');
    expect(() => patchVirtualReaderBundle(source)).to.throw(/does not match the version/);
  });

  it('refuses an anchor that is not unique, instead of patching the wrong one', () => {
    const [first] = VIRTUAL_READER_FIXES;
    const source = `${first.before} ${first.before}`;
    expect(() => patchVirtualReaderBundle(source)).to.throw(/appears 2 times instead of once/);
  });

  it('patches the installed virtual screen reader bundle', function installedBundle() {
    const bundleFile = path.join(REPO_ROOT, BUNDLE_URL_PATH);
    if (!fs.existsSync(bundleFile)) {
      this.skip();
    }
    const source = fs.readFileSync(bundleFile, 'utf8');
    const patched = patchVirtualReaderBundle(source);
    // The bundle on disk may be either state - `patch-package` applies the same edits when a
    // checkout still has the old patch file - so what is verified is the patched output.
    for (const fix of VIRTUAL_READER_FIXES) {
      expect(patched).to.include(fix.after);
      expect(patched).to.not.include(fix.before);
    }
  });
});

describe('screenreaderPlugin serve hook', () => {
  /** @type {string} */
  let cwd;

  before(() => {
    // The hook resolves the bundle relative to the runner root, which is the repo root in a run.
    cwd = process.cwd();
    process.chdir(REPO_ROOT);
  });

  after(() => {
    process.chdir(cwd);
  });

  it('serves the virtual screen reader bundle with the fixes applied', async () => {
    const plugin = screenreaderPlugin({ screenReader: 'virtual' });
    const served = await /** @type {any} */ (plugin).serve({ path: BUNDLE_URL_PATH });
    expect(served?.type).to.equal('text/javascript');
    for (const fix of VIRTUAL_READER_FIXES) {
      expect(served.body).to.include(fix.after);
      expect(served.body).to.not.include(fix.before);
    }
  });

  it('does not answer for any other request', async () => {
    const plugin = screenreaderPlugin({ screenReader: 'virtual' });
    expect(await /** @type {any} */ (plugin).serve({ path: '/index.html' })).to.equal(undefined);
  });

  it('does not answer for a real reader, which never loads the bundle', async () => {
    const plugin = screenreaderPlugin({ screenReader: 'nvda' });
    expect(await /** @type {any} */ (plugin).serve({ path: BUNDLE_URL_PATH })).to.equal(undefined);
  });
});
