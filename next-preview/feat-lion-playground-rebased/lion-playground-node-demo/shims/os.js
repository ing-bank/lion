/**
 * `os` — the answers a tool needs, from the browser. Memory and CPU numbers are approximations: a
 * tool that sizes a buffer from `totalmem()` gets a plausible number, not the machine's.
 */
export const EOL = '\n';
export const platform = () => 'linux';
export const type = () => 'Linux';
export const arch = () => 'x64';
export const release = () => '5.15.0';
export const hostname = () => 'browser';
export const tmpdir = () => '/tmp';
export const homedir = () => '/home/node';
export const endianness = () => 'LE';
export const devNull = '/dev/null';

/** @returns {{model: string, speed: number, times: {user: number, nice: number, sys: number, idle: number, irq: number}}[]} */
export function cpus() {
  const count = globalThis.navigator?.hardwareConcurrency ?? 1;
  return Array.from({ length: count }, () => ({
    model: 'browser',
    speed: 0,
    times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
  }));
}

export const totalmem = () => (globalThis.performance?.memory?.jsHeapSizeLimit ?? 2 ** 31) * 2;
export const freemem = () => totalmem() / 2;
export const loadavg = () => [0, 0, 0];
export const uptime = () => globalThis.performance?.now?.() / 1000 ?? 0;

/** @returns {{uid: number, gid: number, username: string, homedir: string, shell: null}} */
export function userInfo() {
  return { uid: 1000, gid: 1000, username: 'node', homedir: homedir(), shell: null };
}

/** @returns {{networkInterfaces: () => {}}} */
export function networkInterfaces() {
  return {};
}

export default {
  EOL,
  platform,
  type,
  arch,
  release,
  hostname,
  tmpdir,
  homedir,
  endianness,
  devNull,
  cpus,
  totalmem,
  freemem,
  loadavg,
  uptime,
  userInfo,
  networkInterfaces,
};
