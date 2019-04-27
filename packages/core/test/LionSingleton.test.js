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
    singletonOne.one = true;
    expect(singletonOne.myMixin).to.be.true;
    expect(singletonOne.one).to.be.true;

    const singletonTwo = MySingleton.getNewInstance();
    expect(singletonTwo.myMixin).to.be.true;
    expect(singletonTwo.one).to.be.undefined;
    expect(singletonOne.one).to.be.true; // to be sure
  });
});
