# @lion-labs/test-runner-screenreader

A Web Test Runner plugin for screen reader testing with [Guidepup](https://www.guidepup.dev/).

## Installation

```bash
npm install @lion-labs/test-runner-screenreader
```

## Usage

### Web Test Runner Config

```js
// web-test-runner.config.mjs
import { playwrightLauncher } from '@web/test-runner-playwright';
import { screenreaderPlugin } from '@lion-labs/test-runner-screenreader';

export default {
  files: ['test/**/*.test.js'],
  nodeResolve: true,
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [screenreaderPlugin({ screenReader: 'virtual' })],
};
```

### In Your Tests

```js
import { fixture, expect } from '@open-wc/testing';
import { executeServerCommand } from '@web/test-runner-commands';

describe('Screen Reader Tests', () => {
  before(async () => {
    await executeServerCommand('sr-initialize', { screenReader: 'virtual' });
  });

  after(async () => {
    await executeServerCommand('sr-stop');
  });

  it('announces button correctly', async () => {
    await fixture(`<button>Click me</button>`);

    await executeServerCommand('sr-next');
    const itemText = await executeServerCommand('sr-itemText');

    expect(itemText).to.include('Click me');
  });
});
```

## Available Commands

### Lifecycle

| Command         | Payload                                                 | Returns             | Description                  |
| --------------- | ------------------------------------------------------- | ------------------- | ---------------------------- |
| `sr-initialize` | `{ screenReader?: 'virtual' \| 'voiceover' \| 'nvda' }` | `{ success: true }` | Initialize the screen reader |
| `sr-stop`       | -                                                       | `{ success: true }` | Stop the screen reader       |

### Speech/Phrase Log

| Command                   | Payload | Returns             | Description                 |
| ------------------------- | ------- | ------------------- | --------------------------- |
| `sr-spokenPhraseLog`      | -       | `string[]`          | Get all spoken phrases      |
| `sr-clearSpokenPhraseLog` | -       | `{ success: true }` | Clear the spoken phrase log |
| `sr-lastSpokenPhrase`     | -       | `string`            | Get the last spoken phrase  |
| `sr-itemText`             | -       | `string`            | Get current item text       |
| `sr-itemTextLog`          | -       | `string[]`          | Get item text log           |
| `sr-clearItemTextLog`     | -       | `{ success: true }` | Clear item text log         |

### Navigation

| Command           | Payload | Returns             | Description                |
| ----------------- | ------- | ------------------- | -------------------------- |
| `sr-next`         | -       | `{ success: true }` | Move to next item          |
| `sr-previous`     | -       | `{ success: true }` | Move to previous item      |
| `sr-act`          | -       | `{ success: true }` | Activate current item      |
| `sr-moveToTop`    | -       | `{ success: true }` | Move to top of document    |
| `sr-moveToBottom` | -       | `{ success: true }` | Move to bottom of document |

### Interaction

| Command              | Payload             | Returns             | Description            |
| -------------------- | ------------------- | ------------------- | ---------------------- |
| `sr-click`           | `{ options?: any }` | `{ success: true }` | Click                  |
| `sr-press`           | `{ key: string }`   | `{ success: true }` | Press a key            |
| `sr-type`            | `{ text: string }`  | `{ success: true }` | Type text              |
| `sr-perform`         | `{ command: any }`  | `{ success: true }` | Perform a command      |
| `sr-interact`        | -                   | `{ success: true }` | Enter interaction mode |
| `sr-stopInteracting` | -                   | `{ success: true }` | Exit interaction mode  |

### Element Navigation

| Command                      | Returns             | Description                |
| ---------------------------- | ------------------- | -------------------------- |
| `sr-findNextButton`          | `{ success: true }` | Find next button           |
| `sr-findPreviousButton`      | `{ success: true }` | Find previous button       |
| `sr-findNextHeading`         | `{ success: true }` | Find next heading          |
| `sr-findPreviousHeading`     | `{ success: true }` | Find previous heading      |
| `sr-findNextLink`            | `{ success: true }` | Find next link             |
| `sr-findPreviousLink`        | `{ success: true }` | Find previous link         |
| `sr-findNextFormControl`     | `{ success: true }` | Find next form control     |
| `sr-findPreviousFormControl` | `{ success: true }` | Find previous form control |
| `sr-findNextLandmark`        | `{ success: true }` | Find next landmark         |
| `sr-findPreviousLandmark`    | `{ success: true }` | Find previous landmark     |
| `sr-findNextList`            | `{ success: true }` | Find next list             |
| `sr-findPreviousList`        | `{ success: true }` | Find previous list         |
| `sr-findNextTable`           | `{ success: true }` | Find next table            |
| `sr-findPreviousTable`       | `{ success: true }` | Find previous table        |

### Info

| Command                  | Returns                    | Description            |
| ------------------------ | -------------------------- | ---------------------- |
| `sr-getScreenreaderInfo` | `{ name, version, state }` | Get screen reader info |

## Screen Reader Options

- `virtual` - Uses [@guidepup/virtual-screen-reader](https://www.npmjs.com/package/@guidepup/virtual-screen-reader) for cross-platform testing
- `voiceover` - Uses VoiceOver on macOS (requires macOS)
- `nvda` - Uses NVDA on Windows (requires Windows + NVDA installed)

## License

MIT
