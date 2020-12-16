/* eslint-disable no-console */
const { readdirSync, existsSync, readFileSync } = require('fs');

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(pathMeta => pathMeta.isDirectory())
    .map(pathMeta => pathMeta.name);

function readPackageJsonDeps(filePath) {
  if (existsSync(filePath)) {
    const jsonData = JSON.parse(readFileSync(filePath, 'utf-8'));
    const merged = { ...jsonData.dependencies, ...jsonData.devDependencies };
    const result = {};
    Object.keys(merged).forEach(dep => {
      if (merged[dep] && !merged[dep].includes('file:')) {
        result[dep] = merged[dep];
      }
    });
    // Note: we IGNORE singleton manager here as we NEED it to be a broad range of version
    // the singleton-manager should never have a breaking change
    delete result['singleton-manager'];
    return result;
  }
  return {};
}

function readPackageJsonNameVersion(filePath) {
  if (existsSync(filePath)) {
    const jsonData = JSON.parse(readFileSync(filePath, 'utf-8'));
    const result = {};
    result[jsonData.name] = `${jsonData.version}`;
    return result;
  }
  return {};
}

function compareVersions(versionsA, versionsB) {
  let output = '';
  const newVersions = { ...versionsA };
  Object.keys(versionsB).forEach(dep => {
    if (versionsA[dep] && versionsB[dep] && versionsA[dep] !== versionsB[dep]) {
      output += `  - "${dep}" should be "${versionsA[dep]}" but is "${versionsB[dep]}"\n`;
    }
    if (!newVersions[dep]) {
      newVersions[dep] = versionsB[dep];
    }
  });

  return {
    output,
    newVersions,
  };
}

let endReturn = 0;
function lintVersions(folder) {
  let currentVersions = readPackageJsonDeps('./package.json');

  // find all versions in the monorepo
  getDirectories(`./${folder}`).forEach(subPackage => {
    const filePath = `./${folder}/${subPackage}/package.json`;
    currentVersions = { ...currentVersions, ...readPackageJsonNameVersion(filePath) };
  });

  // lint all versions in folder
  getDirectories(`./${folder}`).forEach(subPackage => {
    const filePath = `./${folder}/${subPackage}/package.json`;
    const subPackageVersions = readPackageJsonDeps(filePath);
    const { output, newVersions } = compareVersions(currentVersions, subPackageVersions);
    currentVersions = { ...newVersions };
    if (output) {
      console.log(`Version mismatches found in "${filePath}":`);
      console.log(output);
      console.log();
      endReturn = 1;
    }
  });
}
lintVersions('packages');
lintVersions('packages-node');
if (endReturn === 0) {
  console.log('All versions are aligned 💪');
}
process.exit(endReturn);
