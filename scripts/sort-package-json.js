/* eslint-disable import/no-extraneous-dependencies */
const { exec } = require('child_process');
const defaults = require('prettier-package-json/src/defaultOptions');

const currOrder = defaults.keyOrder;

// move version from position 11 to position 3
currOrder.splice(3, 0, currOrder.splice(11, 1)[0]);

exec(`prettier-package-json --key-order ${currOrder.join(',')} --write ${process.argv[2]}`);
