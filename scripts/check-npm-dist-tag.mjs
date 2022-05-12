/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { readFile } from 'fs/promises';
import { readdirSync } from 'fs';

const exec = promisify(execCallback);

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(pathMeta => pathMeta.isDirectory())
    .map(pathMeta => pathMeta.name);

async function checkNpmDistTag(folder) {
  const actions = [];
  console.log('| Name                     | Local Version | NPM dist tag latest | Check |');
  console.log('| ------------------------ | ------------- | ------------------- | ----- |');
  for (const subPackage of getDirectories(`./${folder}`)) {
    const filePath = `./${folder}/${subPackage}/package.json`;
    const packageJsonRaw = await readFile(filePath, 'utf-8');
    const packageJson = JSON.parse(packageJsonRaw.toString());
    const { version, name } = packageJson;

    const { stdout } = await exec(`npm info ${name}@latest dist-tags.latest`);
    const latestVersion = stdout.trim();

    console.log(
      `| ${name.padEnd(24, ' ')} | ${version.padEnd(13, ' ')} | ${latestVersion.padEnd(19, ' ')} | ${version !== latestVersion ? '  ❌  ' : '  ✓  '} |`,
    );

    if (version !== latestVersion) {
      actions.push(`npm dist-tag add ${name}@${version} latest`);
    }
  }

  if (actions.length) {
    console.log();
    console.log('FIX IT by running the following commands:');
    console.log(actions.join('\n'));
  }
}

checkNpmDistTag('packages');
