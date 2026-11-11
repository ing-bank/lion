import { lazifyInstantiation } from 'singleton-manager';

/**
 * @param {{expect: function}} config
 */
export function runLazifyInstantiationSuite({ expect }) {
  describe('lazifyInstantiation', () => {
    /** @typedef {Manager & { __instance_for_testing?: Manager, ownFn?: Function }} TestableManager */

    class Manager extends EventTarget {
      #secret = 'private';

      constructor() {
        super();
        this.value = 1;
      }

      getSecret() {
        return this.#secret;
      }

      getValue() {
        return this.value;
      }
    }

    /**
     * @returns {{ factory: () => Manager, calls: () => number }}
     */
    function createCountingFactory() {
      let count = 0;
      return {
        factory: () => {
          count += 1;
          return new Manager();
        },
        calls: () => count,
      };
    }

    it('does not call the factory before a member is accessed', () => {
      const { factory, calls } = createCountingFactory();
      lazifyInstantiation(factory);
      expect(calls()).to.equal(0);
    });

    it('calls the factory only once, on first access', () => {
      const { factory, calls } = createCountingFactory();
      const proxy = lazifyInstantiation(factory);
      expect(proxy.value).to.equal(1);
      expect(calls()).to.equal(1);
      expect(proxy.getValue()).to.equal(1);
      proxy.value = 2;
      expect(calls()).to.equal(1);
    });

    it('forwards get and set to the instance', () => {
      const proxy = /** @type {TestableManager} */ (lazifyInstantiation(() => new Manager()));
      proxy.value = 5;
      expect(proxy.__instance_for_testing?.value).to.equal(5);
      expect(proxy.getValue()).to.equal(5);
    });

    it('exposes the instance via __instance_for_testing', () => {
      const instance = new Manager();
      const proxy = /** @type {TestableManager} */ (lazifyInstantiation(() => instance));
      expect(proxy.__instance_for_testing).to.equal(instance);
    });

    it('binds prototype methods to the instance (private fields)', () => {
      const proxy = lazifyInstantiation(() => new Manager());
      expect(proxy.getSecret()).to.equal('private');
    });

    it('binds native EventTarget methods, including dispatchEvent', () => {
      const proxy = lazifyInstantiation(() => new Manager());
      let received = 0;
      const listener = () => {
        received += 1;
      };
      proxy.addEventListener('ping', listener);
      proxy.dispatchEvent(new Event('ping'));
      proxy.removeEventListener('ping', listener);
      proxy.dispatchEvent(new Event('ping'));
      expect(received).to.equal(1);
    });

    it('returns the same bound function on every access', () => {
      const proxy = lazifyInstantiation(() => new Manager());
      expect(proxy.dispatchEvent).to.equal(proxy.dispatchEvent);
      expect(proxy.getValue).to.equal(proxy.getValue);
    });

    it('returns own function properties of the instance as is', () => {
      const instance = /** @type {TestableManager} */ (new Manager());
      const ownFn = () => 'own';
      instance.ownFn = ownFn;
      const proxy = lazifyInstantiation(() => instance);
      expect(proxy.ownFn).to.equal(ownFn);
    });

    it('supports the "in" operator for own and inherited members', () => {
      const proxy = lazifyInstantiation(() => new Manager());
      expect('value' in proxy).to.be.true;
      expect('getValue' in proxy).to.be.true;
      expect('addEventListener' in proxy).to.be.true;
      expect('dispatchEvent' in proxy).to.be.true;
      expect('nonExisting' in proxy).to.be.false;
    });
  });
}
