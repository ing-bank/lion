// Script that checks how many unwanted lit-versions are found in node_modules
// Desired situation: 1 version of lit2, that is deduped.

import { exec } from 'child_process';

const execPromise = cmd =>
  new Promise(resolve => exec(cmd, { maxBuffer: 200000000 }, (err, stdout) => resolve(stdout)));

/**
 * @param {string} pkgName
 * @param {number} desiredMajorVersion
 */
async function checkDuplicate(pkgName, desiredMajorVersion) {
  const listOutput = await execPromise(`npm list ${pkgName}`);
  const rawEntries = listOutput.split('\n').filter(e => e.includes(pkgName));
  const entries = rawEntries.map(e => {
    const deduped = e.endsWith('deduped');
    const versionRaw = e.replace(new RegExp(`^.*${pkgName}@(.*) ?.*$`), '$2');
    const version = Number(versionRaw.split('.')[0]);
    return { deduped, version };
  });

  if (entries.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(`🚫 package "${pkgName}" not found in node_modules. Run "npm i" and try again`);
  } else if (entries.length === 1) {
    if (entries[0].version === desiredMajorVersion) {
      // eslint-disable-next-line no-console
      console.log(`✅ package "${pkgName}" v${desiredMajorVersion} is only found once`);
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `🚫 package "${pkgName}" found once in node_modules, but not with desired major version "${desiredMajorVersion}" (found version "${entries[0].version}")`,
      );
    }
  } else {
    const nonDeduped = entries.filter(e => !e.deduped);
    const listOutputParseable = await execPromise(`npm list ${pkgName} --parseable`);

    // eslint-disable-next-line no-console
    console.warn(
      `🚫 non-deduped package "${pkgName}" found ${nonDeduped.length} times (of ${
        entries.length
      } in total) in node_modules:\n${listOutputParseable
        .split('\n')
        .filter(e => e.trim())
        .map(e => `  - ${e}`)
        .join('\n')}\n`,
    );
  }
}

checkDuplicate('lit-html', 2);
checkDuplicate('lit-element', 3);
