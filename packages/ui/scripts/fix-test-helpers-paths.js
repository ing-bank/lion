#!/usr/bin/env node

/**
 * Fix test-helpers.js import paths based on file depth
 */

import { readFileSync, writeFileSync } from 'fs';
import { globby } from 'globby';

async function fixPaths() {
  const testFiles = await globby(
    ['components/**/test/**/*.test.js', 'components/**/test-suites/**/*.js'],
    { cwd: process.cwd(), absolute: true },
  );

  console.log(`Found ${testFiles.length} files to fix`);

  let fixedCount = 0;

  for (const file of testFiles) {
    let content = readFileSync(file, 'utf-8');

    // Skip if no test-helpers import
    if (!content.includes('test-helpers.js')) {
      continue;
    }

    // Calculate correct depth
    const relativeParts = file.split('/');
    const componentsIndex = relativeParts.findIndex(part => part === 'components');
    const depth = relativeParts.length - componentsIndex - 1;
    const correctPath = '../'.repeat(depth) + 'test-helpers.js';

    // Replace any existing test-helpers path with the correct one
    const newContent = content.replace(
      /from ['"]\.\.\/.*?test-helpers\.js['"]/g,
      `from '${correctPath}'`,
    );

    if (newContent !== content) {
      writeFileSync(file, newContent, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed ${file.split('/').slice(-4).join('/')}`);
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} files`);
}

fixPaths().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
