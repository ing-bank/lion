import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { SCREENSHOTS_FOR_REVIEW_DIR, now, printAndLog, repoRoot, runStep } from './step-utils.js';

function padNumber(value) {
  return String(value).padStart(2, '0');
}

function getTimestamp() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = padNumber(currentDate.getMonth() + 1);
  const day = padNumber(currentDate.getDate());
  const hours = padNumber(currentDate.getHours());
  const minutes = padNumber(currentDate.getMinutes());

  return `${year}-${month}-${day}T${hours}_${minutes}`;
}

function runStepWithOutput({ name, command, cwd }) {
  return new Promise((resolve, reject) => {
    printAndLog(`\n[${now()}] START ${name}`);
    printAndLog(`[${now()}] CMD   ${command}`);

    let stdout = '';

    const child = spawn(command, {
      cwd,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
      env: process.env,
    });

    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
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
        resolve({ stdout });
      } else {
        process.stderr.write(msg);
        reject(new Error(`${name} failed with exit code ${exitCode}`));
      }
    });
  });
}

export async function commitScreenshots(targetBranch, worktreeRelativePath) {
  printAndLog(`[${now()}] screenshots-comparison:commit-screenshots runner`);

  const worktreePath = path.join(repoRoot, worktreeRelativePath);
  if (!fs.existsSync(worktreePath)) {
    throw new Error(
      `${worktreeRelativePath} does not exist. Run screenshots-comparison:update-baseline first.`,
    );
  }

  const { stdout: statusOutput } = await runStepWithOutput({
    name: 'screenshots-comparison:check-working-tree-status',
    command: `git status --porcelain -- ${SCREENSHOTS_FOR_REVIEW_DIR}`,
    cwd: worktreePath,
  });

  const changedFiles = statusOutput
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  if (changedFiles.length === 0) {
    printAndLog(
      `No changes in ${SCREENSHOTS_FOR_REVIEW_DIR} under ${worktreeRelativePath}. Nothing to commit.`,
    );
    return;
  }

  printAndLog(
    `Detected ${changedFiles.length} changed file(s) in ${SCREENSHOTS_FOR_REVIEW_DIR} under ${worktreeRelativePath}. Preparing commit.`,
  );

  const { stdout: branchOutput } = await runStepWithOutput({
    name: 'screenshots-comparison:check-current-branch',
    command: 'git branch --show-current',
    cwd: worktreePath,
  });

  const currentBranch = branchOutput.trim();
  const timestamp = getTimestamp();
  let commitBranch = currentBranch;
  let createdBranch = false;

  if (!currentBranch) {
    commitBranch = `chore/screenshots-comparison-${timestamp}`;
    await runStep({
      name: 'screenshots-comparison:create-branch',
      command: `cd ${worktreeRelativePath} && git switch -c ${commitBranch}`,
    });
    createdBranch = true;
  }

  await runStep({
    name: 'screenshots-comparison:stage-changes',
    command: `cd ${worktreeRelativePath} && git add -A -- ${SCREENSHOTS_FOR_REVIEW_DIR}`,
  });

  await runStep({
    name: 'screenshots-comparison:commit-screenshots',
    command: `cd ${worktreeRelativePath} && git commit --quiet -m "screenshots made at ${timestamp}" -- ${SCREENSHOTS_FOR_REVIEW_DIR}`,
  });

  printAndLog(`
\n\n
============================

  `);
  if (createdBranch) {
    printAndLog(
      `The branch ${commitBranch} inside ${worktreeRelativePath} was created. The screenshots were committed to that branch.`,
    );
  } else {
    printAndLog(
      `Already on branch ${commitBranch} inside ${worktreeRelativePath}. The screenshots were committed to that branch.`,
    );
  }

  printAndLog(`
Navigate to ${worktreeRelativePath}, review changes in ${worktreeRelativePath}/${SCREENSHOTS_FOR_REVIEW_DIR}, and push ${commitBranch} when ready.
============================
    \n\n
  `);

  printAndLog(`[${now()}] All steps completed successfully.`);
}
