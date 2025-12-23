#!/usr/bin/env node

/**
 * This script updates test file imports from WTR to Vitest
 */

import { readFileSync, writeFileSync } from 'fs';
import { globby } from 'globby';

async function updateTestImports() {
  const testFiles = await globby(
    ['components/**/test/**/*.test.js', 'components/**/test-suites/**/*.js'],
    { cwd: process.cwd(), absolute: true },
  );

  console.log(`Found ${testFiles.length} test files to update`);

  let updatedCount = 0;

  for (const file of testFiles) {
    let content = readFileSync(file, 'utf-8');
    let updated = false;

    // Determine the correct relative path based on file depth
    const relativeParts = file.split('/');
    const componentsIndex = relativeParts.findIndex(part => part === 'components');
    const depth = relativeParts.length - componentsIndex - 1; // depth from components folder
    const relativePath = '../'.repeat(depth) + 'test-helpers.js';

    // Replace @open-wc/testing imports
    if (content.includes('@open-wc/testing')) {
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*['"]@open-wc\/testing['"]/g,
        (match, imports) => {
          // Keep the same imports but change the source
          return `import {${imports}} from '${relativePath}'`;
        },
      );
      updated = true;
    }

    // Replace @web/test-runner-commands imports
    if (content.includes('@web/test-runner-commands')) {
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*['"]@web\/test-runner-commands['"]/g,
        (match, imports) => {
          return `import {${imports}} from '${relativePath}'`;
        },
      );
      updated = true;
    }

    // Add describe and it imports from vitest if not already imported
    if (!content.includes("from 'vitest'") && !content.includes('from "vitest"')) {
      // Check if describe or it are used in the file
      if (content.includes('describe(') || content.includes('it(')) {
        // Add vitest import at the top
        const firstImport = content.indexOf('import');
        if (firstImport !== -1) {
          content = `import { describe, it } from 'vitest';\n${content}`;
          updated = true;
        }
      }
    }

    if (updated) {
      writeFileSync(file, content, 'utf-8');
      updatedCount++;
      console.log(`✓ Updated ${file.split('/').slice(-4).join('/')}`);
    }
  }

  console.log(`\n✅ Updated ${updatedCount} test files`);
}

updateTestImports().catch(console.error);
