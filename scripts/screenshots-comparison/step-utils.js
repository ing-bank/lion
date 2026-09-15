import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const repoRoot = path.resolve(__dirname, '..', '..');
export const TMP_SCREENSHOTS_DIR = '.tmp/screenshots';
export const SCREENSHOTS_FOR_REVIEW_DIR = 'screenshots-for-review';

export function now() {
  return new Date().toISOString();
}

export function printAndLog(message) {
  process.stdout.write(`${message}\n`);
}

/**
 * Runs one shell command and mirrors all output to console.
 */
export function runStep({ name, command, cwd = repoRoot, continueOnFail = false }) {
  return new Promise((resolve, reject) => {
    printAndLog(`\n[${now()}] START ${name}`);
    printAndLog(`[${now()}] CMD   ${command}`);

    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: process.env,
    });

    child.stdout.on('data', chunk => {
      process.stdout.write(chunk);
    });

    child.stderr.on('data', chunk => {
      process.stderr.write(chunk);
    });

    child.on('error', error => {
      const msg = `[${now()}] ERROR ${name}: ${error.message}\n`;
      process.stderr.write(msg);
      reject(error);
    });

    child.on('close', code => {
      const exitCode = code ?? 1;
      const msg = `[${now()}] END   ${name} (exit ${exitCode})\n`;
      if (exitCode === 0) {
        process.stdout.write(msg);
        resolve({ exitCode, continued: false });
        return;
      }

      process.stderr.write(msg);

      if (continueOnFail) {
        printAndLog(`[${now()}] WARNING ${name} failed but continueOnFail=true. Continuing.`);
        resolve({ exitCode, continued: true });
        return;
      }

      reject(new Error(`${name} failed with exit code ${exitCode}`));
    });
  });
}
