import fs from 'node:fs';
import path from 'node:path';

export type ReadCounts = {
  /** Files read from the skill under test, keyed by normalised path. */
  skillReads: Map<string, number>;
  /** Files read from a dependency (node_modules), keyed by normalised path. */
  dependencyReads: Map<string, number>;
};

/**
 * Count what a run read, splitting skill reads from dependency reads.
 *
 * A read of a dependency (`node_modules/**`) is a failure signal, not a neutral act: it means the skill
 * did not answer the question, so the model went to the library source. It costs tokens and turns, and
 * it is evidence of a documentation gap that the skill should carry instead.
 *
 * The skill is read from its sandbox copy (`.skill/<name>/...`), not from the repo path, so the filter
 * matches that marker; resolving the requested path against the process cwd silently counted zero.
 */
export function countReads(
  transcript: unknown[] | undefined,
  { skillName, sandboxRoot }: { skillName: string; sandboxRoot: string },
): ReadCounts {
  const skillReads = new Map<string, number>();
  const dependencyReads = new Map<string, number>();

  for (const entry of transcript ?? []) {
    const toolCalls =
      (entry as { tool_calls?: { function?: { name?: string; arguments?: string } }[] })
        .tool_calls ?? [];
    for (const call of toolCalls) {
      if (call.function?.name !== 'read_file') continue;
      let requestedPath = '';
      try {
        requestedPath =
          (JSON.parse(call.function?.arguments ?? '{}') as { path?: string }).path ?? '';
      } catch {
        continue;
      }
      if (!requestedPath) continue;

      const normalised = requestedPath.split('\\').join('/');
      const sandboxSkillDir = `.skill/${skillName}/`;
      const realSkillMarker = `skills/${skillName}/`;
      const isSkill =
        normalised.startsWith(sandboxSkillDir) || normalised.includes(realSkillMarker);
      const isDependency = normalised.includes('node_modules/');
      if (!isSkill && !isDependency) continue;

      let bytes = 0;
      try {
        bytes = fs.statSync(path.resolve(sandboxRoot, requestedPath)).size;
      } catch {
        // A read of a file that no longer exists still happened; count it as zero bytes.
      }
      (isSkill ? skillReads : dependencyReads).set(normalised, bytes);
    }
  }

  return { skillReads, dependencyReads };
}
