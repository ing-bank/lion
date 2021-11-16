// @ts-ignore
const { LogService } = require('../../src/program/services/LogService.js');

LogService.warn(
  'Running via "dashboard/src/server.js" is deprecated. Please run "providence dashboard" instead.',
);

// @ts-ignore
import('./server.mjs');
