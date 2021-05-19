/* eslint-disable no-template-curly-in-string */
const { expect } = require('chai');
const { executeBabel, baseConfig } = require('./helpers.js');

const testConfig = {
  ...baseConfig,
  throwOnNonExistingPathToFiles: false,
  throwOnNonExistingRootPath: false,
  __filePath: '/node_module/@lion/input/README.md',
};

describe('babel-plugin-extend-docs', () => {
  it('replaces local src class imports (1)', () => {
    const code = `import { LionInput } from '@lion/input';`;
    const output = `import { WolfInput } from "wolf-web/input";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('renames classes everywhere', () => {
    const code = [
      `import { LionInput } from '@lion/input';`,
      `class Foo extends LionInput {}`,
    ].join('\n');
    const output = [
      `import { WolfInput } from "wolf-web/input";`,
      '',
      `class Foo extends WolfInput {}`,
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces local src class imports (2)', () => {
    const code = `import { LionInput } from '@lion/input';`;
    const output = `import { WolfInput } from "wolf-web/input";`;
    const config = {
      ...testConfig,
      __filePath: '/node_module/@lion/input/docs/README.md',
    };
    expect(executeBabel(code, config)).to.equal(output);
  });

  it('replaces local src class imports (3)', () => {
    const code = `import { LionInput as Foo } from '@lion/input';`;
    const output = `import { WolfInput as Foo } from "wolf-web/input";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces local src class imports (4)', () => {
    const code = [
      `import someDefaultHelper, { LionInput, someHelper } from '@lion/input';`,
      `import { LionButton } from '@lion/button';`,
    ].join('\n');
    const output = [
      `import someDefaultHelper, { someHelper } from "@lion/input";`,
      `import { WolfInput, WolfButton } from "wolf-web/input";`,
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces local src class imports (5)', () => {
    const code = `import { LionInput, LionFoo, LionBar, someHelper } from '@lion/input';`;
    const output = [
      `import { WolfInput, WolfFoo } from "wolf-web/input";`,
      `import { WolfBar } from "../../../somewhere-else.js";`,
      `import { someHelper } from "@lion/input";`,
    ].join('\n');
    const config = {
      ...testConfig,
      changes: [
        ...baseConfig.changes,
        {
          description: 'LionFoo',
          variable: {
            from: 'LionFoo',
            to: 'WolfFoo',
            paths: [
              {
                from: '@lion/input',
                to: './index.js',
              },
            ],
          },
        },
        {
          description: 'LionBar',
          variable: {
            from: 'LionBar',
            to: 'WolfBar',
            paths: [
              {
                from: '@lion/input',
                to: './somewhere-else.js',
              },
            ],
          },
        },
      ],
      __filePath: '/node_module/@lion/input/README.md',
    };
    expect(executeBabel(code, config)).to.equal(output);
  });

  it('replaces local src class imports (6)', () => {
    const code = `
      import { localize } from '@lion/localize';
      import { LionInput } from '@lion/input';
    `;
    const output = [
      `import { localize } from "wolf-web/localize";`,
      `import { WolfInput } from "wolf-web/input";`,
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('allows separate import paths of managed imports', () => {
    const code1 = `import { LionInput } from '@lion/input';`;
    const code2 = `import { LionInput } from '@lion/input';`;
    const output1 = `import { WolfInput } from "wolf-web/input";`;
    const output2 = `import { WolfInput } from "wolf-web/input";`;
    const config = {
      ...testConfig,
      changes: [
        {
          description: 'LionInput',
          variable: {
            from: 'LionInput',
            to: 'WolfInput',
            paths: [
              {
                from: '@lion/input',
                to: './index.js',
              },
              {
                from: '@lion/input',
                to: './packages/input/src/WolfInput.js',
              },
            ],
          },
        },
      ],
      __filePath: '/node_module/@lion/input/README.md',
    };
    expect(executeBabel(code1, config)).to.equal(output1);
    expect(executeBabel(code2, config)).to.equal(output2);
  });

  it('replaces local index.js class imports (1)', () => {
    const code = `import { LionInput } from '@lion/input';`;
    const output = `import { WolfInput } from "wolf-web/input";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces local index.js class imports (2)', () => {
    const code = `import { LionInput } from '@lion/input';`;
    const output = `import { WolfInput } from "wolf-web/input";`;
    const config = {
      ...testConfig,
      __filePath: '/node_module/@lion/input/docs/README.md',
    };
    expect(executeBabel(code, config)).to.equal(output);
  });

  it('works with local index.js class imports with an empty relative path', () => {
    const code = `import { LionInput } from '@lion/input';`;
    const output = `import { WolfInput } from "wolf-web/input";`;
    const config = {
      ...testConfig,
      __filePath: './README.md',
    };
    expect(executeBabel(code, config)).to.equal(output);
  });

  it('replaces `@lion` class imports', () => {
    const code = `import { LionInput } from '@lion/input';`;
    const output = `import { WolfInput } from "wolf-web/input";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('does NOT replace imports not in the config', () => {
    const code = `import { FooInput } from '@lion/input';`;
    const output = `import { FooInput } from "wolf-web/input";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces local tag imports', () => {
    const code = `import '@lion/input/define';`;
    const output = `import "#input/define";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces `@lion` tag imports', () => {
    const code = `import '@lion/input/define';`;
    const output = `import "#input/define";`;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces tags in function occurrences', () => {
    const code = [
      'export const main = () => html`',
      `  <lion-input \${'hi'} label="First Name"></lion-input>`,
      '`;',
    ].join('\n');
    const output = [
      'export const main = () => html`',
      `  <wolf-input \${'hi'} label="First Name"></wolf-input>`,
      '`;',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it("replaces tags also if using ${{key: 'value'}}", () => {
    const code = [
      'export const forceLocale = () => html`',
      '  <lion-input',
      "    .formatOptions=${{ locale: 'nl-NL' }}",
      '  ></lion-input>',
      '`;',
    ].join('\n');
    const output = [
      'export const forceLocale = () => html`',
      '  <wolf-input',
      '    .formatOptions=${{',
      "  locale: 'nl-NL'",
      '}}',
      '  ></wolf-input>',
      '`;',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('will not touch content of tags', () => {
    const code = [
      'export const main = () => html`',
      `  <lion-input \${'hi'} label="lion-input"></lion-input>`,
      '  <lion-input ',
      '    label="some label"',
      '  ></lion-input>',
      '`;',
    ].join('\n');
    const output = [
      'export const main = () => html`',
      `  <wolf-input \${'hi'} label="lion-input"></wolf-input>`,
      '  <wolf-input ',
      '    label="some label"',
      '  ></wolf-input>',
      '`;',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('will not replace opening tags that are not the exact same tag name', () => {
    const code = [
      'export const main = () => html`',
      `  <lion-checkbox-group \${'hi'} label="lion-checkbox-group"></lion-checkbox-group>`,
      '  <lion-checkbox ',
      '    label="some label"',
      '  ></lion-checkbox>',
      '  <lion-checkbox></lion-checkbox>',
      '`;',
    ].join('\n');
    const output = [
      'export const main = () => html`',
      `  <lion-checkbox-group \${'hi'} label="lion-checkbox-group"></lion-checkbox-group>`,
      '  <wolf-checkbox ',
      '    label="some label"',
      '  ></wolf-checkbox>',
      '  <wolf-checkbox></wolf-checkbox>',
      '`;',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('will not replace closing tags that are not the exact same tag name', () => {
    const code = [
      'export const main = () => html`',
      `  <group-lion-checkbox \${'hi'} label="group-lion-checkbox"></group-lion-checkbox>`,
      '  <lion-checkbox ',
      '    label="some label"',
      '  ></lion-checkbox>',
      '`;',
    ].join('\n');
    const output = [
      'export const main = () => html`',
      `  <group-lion-checkbox \${'hi'} label="group-lion-checkbox"></group-lion-checkbox>`,
      '  <wolf-checkbox ',
      '    label="some label"',
      '  ></wolf-checkbox>',
      '`;',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces nested tags in function occurrences', () => {
    const code = [
      'export const main = () => html`',
      '  <lion-input label="First Name">',
      '    ${html`',
      '      <lion-button></lion-button>',
      '    `}',
      '  </lion-input>',
      '`;',
    ].join('\n');
    const output = [
      'export const main = () => html`',
      '  <wolf-input label="First Name">',
      '    ${html`',
      '      <wolf-button></wolf-button>',
      '    `}',
      '  </wolf-input>',
      '`;',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  it('replaces tags in classes occurrences', () => {
    const code = [
      'class Foo extends LitElement {',
      '  render() {',
      '    return html`',
      '      <lion-input some-attribute>',
      '        <p>light dom</p>',
      '        <lion-input></lion-input>',
      '      </lion-input>',
      '    `;',
      '  }',
      '}',
    ].join('\n');
    const output = [
      'class Foo extends LitElement {',
      '  render() {',
      '    return html`',
      '      <wolf-input some-attribute>',
      '        <p>light dom</p>',
      '        <wolf-input></wolf-input>',
      '      </wolf-input>',
      '    `;',
      '  }',
      '', // babel puts an empty line here?
      '}',
    ].join('\n');
    expect(executeBabel(code, testConfig)).to.equal(output);
  });

  // nice to have
  it.skip("doesn't care about namespace imports", () => {
    const code = `import * as all from '@lion/input';`;
    const output = `
      import { notRenameHelper } from "@lion/input";
      import { WolfInput } from "wolf-web/input";
      const all = { LionInput: WolfInput, someHelper };
    `;
    expect(executeBabel(code, testConfig)).to.equal(output);
  });
});
