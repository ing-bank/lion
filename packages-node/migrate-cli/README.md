# migrate-cli

## What?

The `migrate-cli` provides a more or less plug and play solution for running codemods / code transforms using (by default) JSCodeshift.

## For whom?

The CLI is aimed at platform developers that want to make migrations easy for their users. Using this CLI, they can focus on writing high quality code transforms, without worrying about the overhead that comes with managing a CLI.

## How?

```bash
npx migrate-cli
npx migrate-cli upgrade --help
npx migrate-cli upgrade -t lib-foo-1-to-2 -u /path/to/upgrades/dir
```

### Migration tasks

To use this CLI, you need one or more 'migration tasks'. These tasks are intended to perform a (part of a) migration on a certain codebase. A task can perform actions on single files (like updating a `package.json`), but are best used to perform actions on many files (rewriting of imports in all relevant `.js` files, change of API, etc.).

The CLI expects migration tasks to be in the following structure:

```bash
├── lib-foo-2-to-3
  ├── index.js
  └── jscodeshift
    ├── 01-some-api-transform.js
    ├── 01-some-api-transform*-\_cjs-export.cjs
    ├── 02-some-code-removal-transform.js
    ├── 02-some-code-removal-transform*-_cjs-export.cjs
    ├── 03-import-transform.js
    ├── 03-import-transform_-\_cjs-export.cjs
```

### `index.js`

Here `index.js` is the entry point to the migration task, and it must have a function with the following signature:

```javascript
export async function upgrade(options, workspaceMeta) {
  ...
}
```

`options` by default contains minimal information required for running the CLI. More options can be added by enriching the `jscsOpts` object in the CLI configuration.

`workspaceMeta` contains information that is relevant when running the CLI in a monorepo.

#### `executeJsCodeShiftTransforms`

The function `executeJsCodeShiftTransforms` is exported by this project. Its signature is as follows:

```javascript
export async function executeJsCodeShiftTransforms(
  inputDir,
  transformsFolder,
  jscsOptions = {},
)
```

This function can be called from `index.js` to perform the transformations in `transformsFolder` (`jscodeshift` in the example above) against a codebase found in `inputDir`.

### Basic usage

With this structure in mind, a minimal implementation of the CLI can be used by running the following command in the root of a codebase:

```bash
npx migrate-cli upgrade -t lib-foo-2-to-3 -u /path/or/url/to/parent-dir/
```

When this is run, the following things will happen:

- The CLI will look in the provided directory for a directory called `lib-foo-2-to-3`;
- If found, it will call the `upgrade` function in `index.js`;

#### Configuration

By default, the CLI will look for a `migrate-cli.config.(m)js` in the folder where it is run. You can also provide a config file using the `-c` option of the `upgrade` command.

The most common configurable properties are listed below:

| Property             | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `inputDir`           | Root directory of the project to be migrated                                     |
| `task`               | Upgrade task that should be performed                                            |
| `jscsOpts`           | Options object passed to `index.js` of the upgrade                               |
| `upgradesDir`        | URL or string providing the directory where one or more upgrades can be found    |
| `upgradesConfigHref` | Upgrade specific configuration (defaults to `${upgradesDir}/upgrades.config.js`) |
| `upgradeTaskUrl`     | Location of a specific upgrade task                                              |

The upgrade command always needs to resolve to a specific task. Therefore, it will always require either a `task` and an `upgradesDir`, or an `upgradesTaskUrl`.

### Advanced usage

A user can also implement the CLI in their own project, allowing for more advanced functionality. A user can enhance the CLI in the following ways:

1. By initializing the `MigrateCli` passing an `initOptions` object (allowing for additional commands, changing name and introduction text, etc.);
2. By extending the `UpgradeCommandBase` class to suit their specific needs.

#### Example of initializing with initial options

An example implementation of (1):

```javascript
import { MigrateCli } from './MigrateCli.js';
import path from 'path';

const initOptions = {
  cliOptions: {
    upgradesUrl: new URL('./upgrades', import.meta.url), // will look for potential upgrades in this directory
  },
  commandsUrls: [new URL('./commands', import.meta.url)], // allows for more (or more specific) commands to be loaded from this directory
  includeBaseCommands: false, // if true, UpgradeBaseCommand will be included as well as user specified commands
  cliIntroductionText: `Welcome to lib-foo-migrate CLI 👋\n`,
  pathToPkgJson: path.resolve(dirname(fileURLToPath(import.meta.url)), '../package.json'), // specify so version can be retrieved
};

const cli = new MigrateCli(initOptions);

cli.start();
```
