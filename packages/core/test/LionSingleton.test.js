import { expect } from '@open-wc/testing';

import { LionSingleton } from '../src/LionSingleton.js';

describe('LionSingleton', () => {
  it('provides an instance of the given class via .getInstance()', async () => {
    class MySingleton extends LionSingleton {}
    const mySingleton = MySingleton.getInstance();
    expect(mySingleton).to.be.an.instanceOf(MySingleton);
  });

  it('supports parameters for .getInstance(foo, bar)', async () => {
    class MySingleton extends LionSingleton {
      /**
       *
       * @param {string} foo
       * @param {string} bar
       */
      constructor(foo, bar) {
        super();
        this.foo = foo;
        this.bar = bar;
      }
    }
    const mySingleton = MySingleton.getInstance('isFoo', 'isBar');
    expect(mySingleton).to.deep.equal({
      foo: 'isFoo',
      bar: 'isBar',
    });
  });

  it('will return the same instance if already created', async () => {
    let counter = 0;
    class MySingleton extends LionSingleton {
      constructor() {
        super();
        counter += 1;
      }
    }
    const mySingleton = MySingleton.getInstance();
    mySingleton.foo = 'bar';
    expect(mySingleton).to.deep.equal(MySingleton.getInstance());
    expect(counter).to.equal(1);
    expect(new MySingleton()).to.not.deep.equal(MySingleton.getInstance());
  });

  it('can reset its instance so a new one will be created via .resetInstance()', async () => {
    let counter = 0;
    class MySingleton extends LionSingleton {
      constructor() {
        super();
        counter += 1;
      }
    }
    const mySingleton = MySingleton.getInstance();
    mySingleton.foo = 'bar';
    expect(mySingleton.foo).to.equal('bar');
    expect(counter).to.equal(1);

    MySingleton.resetInstance();
    const updatedSingleton = MySingleton.getInstance();
    expect(updatedSingleton.foo).to.be.undefined;
    expect(counter).to.equal(2);
  });

  it('can at any time add mixins via .addInstanceMixin()', () => {
    // @ts-ignore because we're getting rid of LionSingleton altogether
    const MyMixin = superclass =>
      class extends superclass {
        constructor() {
          super();
          this.myMixin = true;
        }
      };
    class MySingleton extends LionSingleton {}

    MySingleton.addInstanceMixin(MyMixin);
    const mySingleton = MySingleton.getInstance();
    expect(mySingleton.myMixin).to.be.true;

    // @ts-ignore because we're getting rid of LionSingleton altogether
    const OtherMixin = superclass =>
      class extends superclass {
        constructor() {
          super();
          this.otherMixin = true;
        }
      };
    MySingleton.addInstanceMixin(OtherMixin);
    expect(mySingleton.otherMixin).to.be.undefined;

    MySingleton.resetInstance();
    const updatedSingleton = MySingleton.getInstance();
    expect(updatedSingleton.myMixin).to.be.true;
    expect(updatedSingleton.otherMixin).to.be.true;
  });

  it('can provide new instances (with applied Mixins) via .getNewInstance()', async () => {
    // @ts-ignore because we're getting rid of LionSingleton altogether
    const MyMixin = superclass =>
      class extends superclass {
        constructor() {
          super();
          this.myMixin = true;
        }
      };
    class MySingleton extends LionSingleton {}

    MySingleton.addInstanceMixin(MyMixin);
    const singletonOne = MySingleton.getNewInstance();
    // @ts-ignore because we're getting rid of LionSingleton altogether
    singletonOne.one = true;
    // @ts-ignore because we're getting rid of LionSingleton altogether
    expect(singletonOne.myMixin).to.be.true;
    // @ts-ignore because we're getting rid of LionSingleton altogether
    expect(singletonOne.one).to.be.true;

    const singletonTwo = MySingleton.getNewInstance();
    // @ts-ignore because we're getting rid of LionSingleton altogether
    expect(singletonTwo.myMixin).to.be.true;
    // @ts-ignore because we're getting rid of LionSingleton altogether
    expect(singletonTwo.one).to.be.undefined;
    // @ts-ignore because we're getting rid of LionSingleton altogether
    expect(singletonOne.one).to.be.true; // to be sure
  });
});
