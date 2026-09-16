import { parseArgs } from 'util';
import { getWorkTreeRelativePath, parseTargetBranch } from './util.mjs';
import {
  SCREENSHOTS_FOR_REVIEW_DIR,
  TMP_SCREENSHOTS_DIR,
  now,
  printAndLog,
  runStep,
} from './step-utils.js';

const { values } = parseArgs({
  options: {
    'target-branch': {
      type: 'string',
    },
  },
});

const targetBranch = parseTargetBranch(values['target-branch']);
const worktreeRelativePath = getWorkTreeRelativePath(targetBranch);

async function runAndLogStep({ name, command, continueOnFail = false }) {
  const result = await runStep({ name, command, continueOnFail });

  if (result.continued) {
    printAndLog(`[${now()}] ${name} finished with non-zero exit (${result.exitCode}); continued.`);
    return result;
  }

  printAndLog(`[${now()}] ${name} finished successfully (exit ${result.exitCode}).`);
  return result;
}

async function main() {
  printAndLog(`[${now()}] screenshots-comparison:update-baseline runner`);

  await runAndLogStep({
    name: 'screenshots-comparison:verify-target-branch',
    command: `git fetch origin --quiet && git ls-remote --exit-code --heads origin ${targetBranch}`,
  });

  await runAndLogStep({
    name: 'screenshots-comparison:cleanup-tmp-directories',
    command: `rm -rf ${worktreeRelativePath} .tmp/generated-visual-tests/*`,
  });

  printAndLog(`${worktreeRelativePath} does not exist, creating it now`);
  const initWorktreeCommand = `git worktree prune && git worktree add ${worktreeRelativePath} origin/${targetBranch}`;
  await runAndLogStep({
    name: 'screenshots-comparison:init-worktree',
    command: initWorktreeCommand,
  });

  const resetWorktreeCommand = `cd ${worktreeRelativePath} && git fetch origin && git reset --hard origin/${targetBranch} && git switch --detach origin/${targetBranch} && rm -rf ./${TMP_SCREENSHOTS_DIR} && rm -rf ./${SCREENSHOTS_FOR_REVIEW_DIR}`;
  await runAndLogStep({
    name: 'screenshots-comparison:reset-worktree',
    command: resetWorktreeCommand,
  });

  const npmInstallResult = await runAndLogStep({
    name: 'screenshots-comparison:npm-install',
    command: `cd ${worktreeRelativePath} && npm install`,
    continueOnFail: true,
  });

  if (npmInstallResult.continued) {
    printAndLog(
      `[${now()}] WARNING npm install failed (possibly from postinstall/npm run types). Continuing anyway.`,
    );
  }

  await runAndLogStep({
    name: 'screenshots-comparison:run-portal-once',
    command: 'npm run build:rocket',
    continueOnFail: true,
  });

  await runAndLogStep({
    name: 'screenshots-comparison:run-portal-once:worktree',
    command: `cd ${worktreeRelativePath} && npm run build:rocket`,
    continueOnFail: true,
  });

  await runAndLogStep({
    name: 'screenshots-comparison:sync-worktree-inputs',
    command: `node ./scripts/screenshots-comparison/sync-worktree-inputs.js --target-branch ${targetBranch}`,
  });

  const generateBaselineCommand = `web-test-runner --config web-test-runner.visual.config.mjs --target-branch=${targetBranch} --worktree --update-visual-baseline --chromium`;

  await runAndLogStep({
    name: 'screenshots-comparison:update-baseline',
    command: generateBaselineCommand,
    continueOnFail: true,
  });

  printAndLog(`[${now()}] All steps completed successfully.`);
}

main().catch(error => {
  printAndLog(`[${now()}] FAILED: ${error.message}`);
  process.exitCode = 1;
});
