const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { transformSync } = require('@babel/core');

// Once bundlephobia & unpkg support optional chaining we can stop transpiling this out
glob('packages/*/src/**/*.js', {}, (err, files) => {
  files.forEach(file => {
    const code = fs.readFileSync(path.resolve(file), 'utf8');
    const newCode = transformSync(code, {
      plugins: ['@babel/plugin-proposal-optional-chaining'],
    }).code;

    fs.writeFileSync(path.resolve(file), newCode);
  });
});
