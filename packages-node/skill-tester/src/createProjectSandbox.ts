import path from 'node:path';
import fs from 'node:fs';

export type ProjectMock = { [path: string]: string };
type CreateProjectSandboxOptions = {
  outputPath?: string;
  fileSystem?: typeof fs;
};

function stringifyObjKeyValues(projectMock: ProjectMock) {
  const res: ProjectMock = {};
  for (const [k, v] of Object.entries(projectMock)) {
    res[k] = typeof v === 'object' ? JSON.stringify(v, null, 2) : v;
  }
  return res;
}

let sandboxCounter = 0;

/**
 *
 * @example
 * ```js
 * const projectSandbox = {
 *   "src/index.js": "console.log('Hello, world!');",
 *   "README.md": "# My Project\nThis is a sample project.",
 *   "config": {
 *     "setting1": true,
 *     "setting2": "value"
 *   }
 * };
 *
 * const sandboxRoot = await createProjectSandbox(projectSandbox);
 * console.log(fs.readFileSync(path.join(sandboxRoot, 'src/index.js'), 'utf-8')); // Outputs: console.log('Hello, world!');
 * ```
 */
export async function createProjectSandbox(
  projectSandbox: ProjectMock,
  {
    outputPath = path.join(process.cwd(), '.tmp', 'projectSandbox', `${sandboxCounter++}`),
    fileSystem = fs,
  }: CreateProjectSandboxOptions = {}
) {
  const pendingWrites = [];
  for (const [finalPath, content] of Object.entries(stringifyObjKeyValues(projectSandbox))) {
    const fullPath = path.join(outputPath, finalPath);
    if (!fileSystem.existsSync(path.dirname(fullPath))) {
      await fileSystem.promises.mkdir(path.dirname(fullPath), {
        recursive: true,
      });
    }
    pendingWrites.push(fileSystem.promises.writeFile(fullPath, content));
  }

  await Promise.all(pendingWrites);

  // In most scenarios, this is not provided in the options.
  // Let the consumer catch the generated path
  return outputPath;
}
