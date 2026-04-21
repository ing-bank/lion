import { createProjectSandbox, type ProjectMock } from './createProjectSandbox.ts';
import { parseMarkdownFile } from './parseFrontmatter.ts';
import { gray, green, red } from 'nanocolors';
import * as diff from 'diff';
import { CopilotClient, approveAll } from '@github/copilot-sdk';
import fs from 'fs';
import fsGlob from './fsGlob.ts';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Filter out CLI subprocess warning messages
function shouldFilterMessage(message: string): boolean {
  if (typeof message !== 'string') return false;
  return message.includes('[CLI subprocess]') || message.includes('ExperimentalWarning');
}

// Override process.stderr.write and process.stdout.write to filter warnings
const originalStderrWrite = process.stderr.write;
const originalStdoutWrite = process.stdout.write;

process.stderr.write = function (chunk: any, ...args: any[]) {
  const message = chunk?.toString() || '';
  if (!shouldFilterMessage(message)) {
    return originalStderrWrite.call(process.stderr, chunk, ...args);
  }
  return true;
};

process.stdout.write = function (chunk: any, ...args: any[]) {
  const message = chunk?.toString() || '';
  if (!shouldFilterMessage(message)) {
    return originalStdoutWrite.call(process.stdout, chunk, ...args);
  }
  return true;
};

type SkillConfig = {
  /* This is the skill or agent that we want to test */
  skillOrAgent: {
    name: string;
    location: string; // e.g., "@lion/ui" or "./skills/my-skill"
    type: 'agent' | 'skill';
    extraFiles?: ProjectMock; // Optional extra files to add to the sandbox, on top of the ones defined in the project
  };
  /* This is the prompt we want to test our agent or skill with */
  prompt: string;
  /* A virtual file system structure to which a code transformation is applied. This can be one or more projects. */
  projects: TestProject[];
  /* Optionally, we can run extra skills. For instance, we test the public api of a component library (@lion/ui) and we want to accompany this with best practices wrt tech stack (lit + scoped elements). Provide the directory to these skills */
  skills?: string[];
  /* A list of models like "gpt-4.1", "claude-sonnet-4.5" */
  models: string[];
  /* How many times we run the same prompt */
  sampleSize?: number;
};

type TestProject = {
  name: string;
  description?: string;
  files: ProjectMock; // virtual file system structure before transformation
  expectedTransformedFiles: ProjectMock;
};

function reportDiffMismatch(actualContent: string, expectedContent: string): string {
  function cleanUp(line: string) {
    if (line[0] === '+') {
      return green(line);
    }
    if (line[0] === '-') {
      return red(line);
    }
    if (line.match(/@@/)) {
      return null;
    }
    if (line.match(/\\ No newline/)) {
      return null;
    }
    return line;
  }

  const diffMsg = diff
    .createPatch('string', actualContent, expectedContent)
    .split('\n')
    .splice(4)
    .map(cleanUp)
    .filter(l => !!l)
    .join('\n');

  return `${green('+ expected')} ${red('- actual')}\n\n${diffMsg}`;
}

async function skillTester({
  sampleSize = 5,
  skillOrAgent,
  projects,
  prompt,
  models,
  skills,
}: SkillConfig) {
  const results = [];

  let mainSkillDir;
  let agentFile;
  if (skillOrAgent.type === 'agent') {
    const fileContent = await fs.promises.readFile(skillOrAgent.location, 'utf-8');
    // Extract prompt content (everything after the frontmatter)
    agentFile = parseMarkdownFile(fileContent);

    // read extra content and add to project sandbox. (N.B. do we need to add the ?)
  }

  for (const project of projects) {
    for (const model of models) {
      const resultsForSample = [];

      for (let i = 0; i < sampleSize; i++) {
        console.log(
          `Testing ${skillOrAgent.type} "${
            skillOrAgent.name
          }" with prompt "${prompt}" and model "${model}" (sample ${i + 1} of ${sampleSize})`,
        );

        // Create a sandbox for the project files
        const sandboxRoot = await createProjectSandbox({
          ...project.files,
          ...(skillOrAgent.extraFiles || {}),
        });

        // Create and start client
        const client = new CopilotClient({ cwd: sandboxRoot });
        await client.start();

        // Create a session (onPermissionRequest is required)
        const session = await client.createSession({
          model,
          onPermissionRequest: approveAll,
          customAgents: [
            {
              name: '@lion/ui',
              displayName: '@lion/ui',
              prompt: agentFile.body,
              tools: agentFile.frontmatter.tools as string[],
            },
          ],
          hooks: {
            // onSessionStart: async (input, invocation) => {
            //   /* ... */
            // },
            onPreToolUse: async (input, invocation) => {
              console.log(gray(`- tool "${input.toolName}", ${input.toolArgs}`));
            },
            // onPostToolUse: async (input, invocation) => {
            //   /* ... */
            // },
          },
          agent: skillOrAgent.name,
          // TODO: skills
        });

        // Wait for response using typed event handlers
        const done = new Promise<void>(resolve => {
          session.on('assistant.message', event => {
            console.log(event.data.content);
          });
          session.on('session.idle', () => {
            resolve();
          });
        });

        // Send a message and wait for completion
        await session.send({
          prompt,
          // attachments: [{ type: 'file', path: '../test-input/test-input-1.js' }],
        });
        await done;

        const amountOfFiles = new Set([
          ...Object.keys(project.files),
          ...Object.keys(project.expectedTransformedFiles),
        ]).size;
        let amountOfSuccessfulTransformations = 0;

        // TODO: take deleted files into account as well
        for (const [filePath, expectedContent] of Object.entries(
          project.expectedTransformedFiles,
        )) {
          const fullPath = join(sandboxRoot, filePath);
          const actualContent = await fs.promises.readFile(fullPath, 'utf-8');
          if (actualContent.trim() === expectedContent.trim()) {
            // console.log(`✅ ${filePath} transformed as expected.`);
            amountOfSuccessfulTransformations++;
          } else {
            reportDiffMismatch(actualContent, expectedContent);
          }
        }

        resultsForSample.push({
          successRate: amountOfSuccessfulTransformations / amountOfFiles,
          project: project.name,
          sample: i + 1,
          model,
        });

        // Clean up
        await session.disconnect();
        await client.stop();
      }

      results.push({
        model,
        project: project.name,
        averageSuccessRate:
          resultsForSample.reduce((acc, r) => acc + r.successRate, 0) / resultsForSample.length,
      });
    }
  }

  console.log('\nFinal results:', results);

  // return results;
  process.exit(0);
}

// N.B. we keep the examples clean and small.
// Later we add extra options to generate 'noise', larger repos etc.

async function createAgentConfig({
  name,
  projectRoot,
  relativePathToAgentFile,
  globsToExtraFiles,
}: {
  name: string;
  projectRoot: string;
  relativePathToAgentFile: string;
  globsToExtraFiles: string[];
}) {
  const files = await fsGlob(globsToExtraFiles, {
    cwd: projectRoot,
    absolute: true,
    onlyFiles: true,
  });
  // console.debug(`Found ${files.length} extra files for agent config:`, files);

  const extraFiles: ProjectMock = {};
  for (const filePath of files) {
    const relativePath = filePath.replace(projectRoot, '').replace(/\\/g, '/');
    extraFiles[relativePath] = await fs.promises.readFile(filePath, 'utf-8');
  }

  return {
    name,
    location: join(projectRoot, relativePathToAgentFile),
    type: 'agent' as 'agent' | 'skill',
    extraFiles,
  };
}

const testProjectsIncludingExpectedTransforms: TestProject[] = [
  {
    name: 'example-project-with-a-button',
    files: {
      'src/MyButtonApp.js': `
      import { LionButton } from '@lion/ui/button.js';
      import { LitElement, ScopedElementsMixin } from '@lion/ui/core.js';

      export class MyButtonApp extends ScopedElementsMixin(LitElement) {
        scopedElements = {
          'lion-button': LionButton,
        };

        render() {
          return html\`
            <lion-button variation="primary-medium">Click me</lion-button>
          \`;
        }
          
        handleClick() {
          console.log('Button clicked!');
        }
      }
      `,
    },
    expectedTransformedFiles: {
      'src/MyButtonApp.js': `
      import { LionBlob } from '@lion/ui/blob.js';
      import { LitElement, ScopedElementsMixin } from '@lion/ui/core.js';

      export class MyButtonApp extends ScopedElementsMixin(LitElement) {
        scopedElements = {
          'lion-blob': LionBlob,
        };

        render() {
          return html\`
            <lion-blob><button>Click me</button></lion-blob>
          \`;
        }
          
        handleClick() {
          console.log('Button clicked!');
        }
      }
      `,
    },
  },
];

skillTester({
  skillOrAgent: await createAgentConfig({
    name: '@lion/ui',
    projectRoot: join(__dirname, '../mock-repo'),
    relativePathToAgentFile: '.github/agents/lion.agent.md',
    globsToExtraFiles: ['.github/agents/docs/**/*'],
  }),
  prompt: 'Convert button component to blob component',
  models: [
    // 'gpt-4.1',
    // 'claude-haiku-4.5',
    'claude-sonnet-4.5',
  ],
  sampleSize: 5,
  projects: testProjectsIncludingExpectedTransforms,
});
