import { LogService } from '../src/program/core/LogService.js';

const originalWarn = LogService.warn;
export function suppressWarningLogs() {
  LogService.warn = () => {};
}
export function restoreSuppressWarningLogs() {
  LogService.warn = originalWarn;
}

const originalInfo = LogService.info;
export function suppressInfoLogs() {
  LogService.info = () => {};
}
export function restoreSuppressInfoLogs() {
  LogService.info = originalInfo;
}

const originalDebug = LogService.debug;
export function suppressDebugLogs() {
  LogService.debug = () => {};
}
export function restoreSuppressDebugLogs() {
  LogService.debug = originalDebug;
}

const originalSuccess = LogService.success;
export function suppressSuccessLogs() {
  LogService.success = () => {};
}
export function restoreSuppressSuccessLogs() {
  LogService.success = originalSuccess;
}

export function suppressNonCriticalLogs() {
  suppressInfoLogs();
  suppressWarningLogs();
  suppressDebugLogs();
  suppressSuccessLogs();
}

export function restoreSuppressNonCriticalLogs() {
  restoreSuppressInfoLogs();
  restoreSuppressWarningLogs();
  restoreSuppressDebugLogs();
  restoreSuppressSuccessLogs();
}
