import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Symlinks every skill under `packages/ui/skills/*` (the committed source of truth) into
 * `~/.copilot/skills` so the GitHub Copilot CLI discovers them as personal skills without
 * needing a separate copy.
 *
 * This is opt-in (never run automatically from `postinstall`): writing into a developer's home
 * directory as an install side effect would be surprising. Run it manually:
 *
 *   npm run skills:link
 *
 * Safe to re-run: if a target is already the correct symlink, it's a no-op. If something else
 * (a stale directory/file from before this tooling existed, or a symlink pointing elsewhere)
 * occupies that path, it is replaced.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

const skillsSourceDir = path.join(repoRoot, 'packages/ui/skills');
const copilotSkillsDir = path.join(os.homedir(), '.copilot/skills');

function linkSkill(name) {
  const skillSourceDir = path.join(skillsSourceDir, name);
  const skillLinkPath = path.join(copilotSkillsDir, name);

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

function main() {
  if (!fs.existsSync(skillsSourceDir)) {
    throw new Error(
      `${path.relative(repoRoot, skillsSourceDir)} does not exist. Run "npm run skills:generate" first.`,
    );
  }

  const skillNames = fs
    .readdirSync(skillsSourceDir, { withFileTypes: true })
    .filter(
      entry =>
        entry.isDirectory() && fs.existsSync(path.join(skillsSourceDir, entry.name, 'SKILL.md')),
    )
    .map(entry => entry.name);

  if (skillNames.length === 0) {
    throw new Error(
      `No skills with a SKILL.md found under ${path.relative(repoRoot, skillsSourceDir)}.`,
    );
  }

  fs.mkdirSync(copilotSkillsDir, { recursive: true });
  skillNames.forEach(linkSkill);
}

main();
