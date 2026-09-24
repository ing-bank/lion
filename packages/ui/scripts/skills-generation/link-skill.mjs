import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Symlinks `packages/ui/skills/lion-ui` (the committed source of truth) into `~/.copilot/skills`
 * so the GitHub Copilot CLI discovers it as a personal skill without needing a separate copy.
 *
 * This is opt-in (never run automatically from `postinstall`): writing into a developer's home
 * directory as an install side effect would be surprising. Run it manually:
 *
 *   npm run skills:link
 *
 * Safe to re-run: if the target is already the correct symlink, it's a no-op. If something else
 * (a stale directory/file from before this tooling existed, or a symlink pointing elsewhere)
 * occupies that path, it is replaced.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

const skillSourceDir = path.join(repoRoot, 'packages/ui/skills/lion-ui');
const copilotSkillsDir = path.join(os.homedir(), '.copilot/skills');
const skillLinkPath = path.join(copilotSkillsDir, 'lion-ui');

function main() {
  if (!fs.existsSync(skillSourceDir)) {
    throw new Error(
      `${path.relative(repoRoot, skillSourceDir)} does not exist. Run "npm run skills:generate" first.`,
    );
  }

  fs.mkdirSync(copilotSkillsDir, { recursive: true });

  const existingStat = fs.lstatSync(skillLinkPath, { throwIfNoEntry: false });
  if (existingStat) {
    if (existingStat.isSymbolicLink()) {
      const currentTarget = path.resolve(
        path.dirname(skillLinkPath),
        fs.readlinkSync(skillLinkPath),
      );
      if (currentTarget === skillSourceDir) {
        console.log(`${skillLinkPath} already links to ${skillSourceDir}. Nothing to do.`);
        return;
      }
      console.log(`Replacing existing symlink at ${skillLinkPath} (pointed at ${currentTarget}).`);
      fs.rmSync(skillLinkPath, { force: true });
    } else {
      console.log(`Replacing existing non-symlink entry at ${skillLinkPath}.`);
      fs.rmSync(skillLinkPath, { recursive: true, force: true });
    }
  }

  fs.symlinkSync(skillSourceDir, skillLinkPath, 'dir');
  console.log(`Linked ${skillLinkPath} -> ${skillSourceDir}`);
}

main();
