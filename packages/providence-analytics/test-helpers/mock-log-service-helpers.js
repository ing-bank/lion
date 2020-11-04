const { LogService } = require('../src/program/services/LogService.js');

const originalWarn = LogService.warn;
function suppressWarningLogs() {
  LogService.warn = () => {};
}
function restoreSuppressWarningLogs() {
  LogService.warn = originalWarn;
}

const originalInfo = LogService.info;
function suppressInfoLogs() {
  LogService.info = () => {};
}
function restoreSuppressInfoLogs() {
  LogService.info = originalInfo;
}

const originalDebug = LogService.debug;
function suppressDebugLogs() {
  LogService.debug = () => {};
}
function restoreSuppressDebugLogs() {
  LogService.debug = originalDebug;
}

const originalSuccess = LogService.success;
function suppressSuccessLogs() {
  LogService.success = () => {};
}
function restoreSuppressSuccessLogs() {
  LogService.success = originalSuccess;
}

function suppressNonCriticalLogs() {
  suppressInfoLogs();
  suppressWarningLogs();
  suppressDebugLogs();
  suppressSuccessLogs();
}

function restoreSuppressNonCriticalLogs() {
  restoreSuppressInfoLogs();
  restoreSuppressWarningLogs();
  restoreSuppressDebugLogs();
  restoreSuppressSuccessLogs();
}

module.exports = {
  suppressWarningLogs,
  restoreSuppressWarningLogs,
  suppressInfoLogs,
  restoreSuppressInfoLogs,

  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
};
