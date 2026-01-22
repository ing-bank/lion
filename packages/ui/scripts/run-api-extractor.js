// Node 18+
// Usage: node packages/ui/scripts/api-extractor/run-api-extractor.js

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';

// ---------- Constants (adjust as needed) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of your package that has package.json & api-extractor.base.json
const PROJECT_ROOT = path.resolve(__dirname, '..'); // -> packages/ui

// REQUIRED: the folder where your entry .d.ts files are located
// Set this to your actual build output folder
const DTS_ROOT = path.join(PROJECT_ROOT, 'dist-types/exports'); // <-- change if needed

const DIRECTORIES_TO_IGNORE_IN_DTS_ROOT = ['define', 'define-helpers'];

// API report destination is controlled by base config via <projectFolder>/etc
const BASE_CONFIG_PATH = path.join(PROJECT_ROOT, 'api-extractor.base.json');

// Include only .d.ts files; customize if you need to ignore internals
const FILTER = (absPath, relPath, dir) => {
  return !DIRECTORIES_TO_IGNORE_IN_DTS_ROOT.includes(dir) && relPath.endsWith('.d.ts');
};
// ---------------------------------------------------

function collectDtsFiles(root) {
  const results = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
      } else if (entry.isFile()) {
        const rel = path.relative(root, abs);
        if (FILTER(abs, rel, dir)) results.push({ abs, rel });
      }
    }
  }
  walk(root);
  return results;
}

// e.g., "sub/feature/index.d.ts" -> "<pkg>-sub-feature-index.api.md"
function reportFileNameFromRel(relPath, packageName = 'pkg') {
  const noExt = relPath.replace(/\.d\.ts$/i, '');
  const normalized = noExt
    .replace(/[\\/]+/g, '-') // path separators to '-'
    .replace(/[^a-z0-9\-_.]/gi, '-'); // sanitize
  return `${packageName}-${normalized}.api.md`;
}

async function readJson(file) {
  const buf = await fsp.readFile(file, 'utf8');
  return JSON.parse(buf);
}

async function main() {
  // Guards
  if (!fs.existsSync(DTS_ROOT)) {
    console.error(`DTS root not found: ${DTS_ROOT}`);
    process.exit(1);
  }
  if (!fs.existsSync(BASE_CONFIG_PATH)) {
    console.error(`Base config not found: ${BASE_CONFIG_PATH}`);
    process.exit(1);
  }

  const pkgJsonPath = path.join(PROJECT_ROOT, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.error(`package.json not found at ${pkgJsonPath}`);
    process.exit(1);
  }

  const pkg = await readJson(pkgJsonPath);
  const packageName = String(pkg.name || 'pkg')
    .replace(/^@/, '')
    .replace(/[\/]/g, '-');

  // ❗ Load the base JSON as a plain object (do NOT validate yet)
  const baseConfigObject = await readJson(BASE_CONFIG_PATH);

  const entries = collectDtsFiles(DTS_ROOT);
  if (entries.length === 0) {
    console.warn(`No .d.ts entries found under: ${DTS_ROOT}`);
    return;
  }

  console.log(`Found ${entries.length} entry .d.ts files under ${DTS_ROOT}`);

  let hadFailure = false;

  for (const { abs, rel } of entries) {
    const reportFileName = reportFileNameFromRel(rel, packageName);

    // Prepare a per-entry config in memory by overriding the base
    const preparedConfig = ExtractorConfig.prepare({
      configObjectFullPath: BASE_CONFIG_PATH,
      configObject: {
        ...baseConfigObject,
        projectFolder: PROJECT_ROOT,
        mainEntryPointFilePath: abs.replace(PROJECT_ROOT, '<projectFolder>'),
        apiReport: {
          ...baseConfigObject.apiReport,
          enabled: true,
          reportFileName,
        },
      },
      packageJsonFullPath: pkgJsonPath,
    });

    console.log(`\n=== API Extractor: ${rel} -> etc/${reportFileName} ===`);
    const result = Extractor.invoke(preparedConfig, {
      // Tip: you can switch localBuild based on CI if you want stricter behavior:
      // localBuild: process.env.CI ? false : true,
      localBuild: true,
      showVerboseMessages: false,
    });

    if (result.succeeded) {
      console.log('✓ OK');
    } else {
      console.error(`✗ FAILED for ${rel}`);
      hadFailure = true;
    }
  }

  if (hadFailure) process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
