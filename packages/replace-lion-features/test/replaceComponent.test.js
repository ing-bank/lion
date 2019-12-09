const { expect } = require('chai');

const { replaceComponent } = require('../src/replaceComponent.js');

describe('replaceComponent', () => {
  const defaultConfig = {
    inTagName: 'lion-component',
    outTagName: 'ing-component',
    currentPackage: 'component',
  };

  it('1. replaces local class import paths with user provided path', () => {
    const input = `import { LionComponent, foo } from '../LionComponent.js';`;
    const output = `import { IngComponent, foo } from '../../forms.js';`;
    const config = {
      ...defaultConfig,
      getClassImportPath: () => '../../forms.js',
    };
    expect(replaceComponent(input, config)).to.equal(output);
  });

  it('2. replaces local src class imports', async () => {
    const input = `import { LionComponent } from '../src/LionComponent.js';`;
    const output = `import { IngComponent } from '../../../../packages/component/src/IngComponent.js';`;
    expect(replaceComponent(input, defaultConfig)).to.equal(output);
  });

  it('3. replaces local tag imports', async () => {
    const input = `import '../lion-component.js';`;
    const output = `import '../../../../packages/component/ing-component.js';`;
    expect(replaceComponent(input, defaultConfig)).to.equal(output);
  });

  it('4. replaces local index.js class imports', async () => {
    const input = `import { LionComponent, foo } from '../index.js';`;
    const output = `import { IngComponent, foo } from '../../../../packages/component/index.js';`;
    expect(replaceComponent(input, defaultConfig)).to.equal(output);
  });

  it('5. replaces `@lion` imports', async () => {
    const input = `
      import { LionComponent, foo } from '@lion/component';
      import '@lion/component/lion-component.js';
    `;
    const output = `
      import { IngComponent, foo } from '../../../../packages/component/index.js';
      import '../../../../packages/component/ing-component.js';
    `;
    expect(replaceComponent(input, defaultConfig)).to.equal(output);
  });

  it('6. replaces all remaining tag occurrences', async () => {
    const input = `
      import '../lion-component.js';

      <lion-component some-attribute>
        <p>light dom</p>
        <lion-component></lion-component>
      </lion-component>
    `;
    const output = `
      import '../../../../packages/component/ing-component.js';

      <ing-component some-attribute>
        <p>light dom</p>
        <ing-component></ing-component>
      </ing-component>
    `;
    expect(replaceComponent(input, defaultConfig)).to.equal(output);
  });
});
