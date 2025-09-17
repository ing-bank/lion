// TODO: testing is done now indirectly via @lion/ui tests. Aditionally, add dedicated tests for this package

/**
 * Lazifies the instantiation of singletons. It does so by wrapping the singleton in a Proxy, which delays
 * instantiation until one of its members gets called/set for the first time.
 * This is important in cases where a singleton needs to be overridden on an app level:
 * let's say there are two versions of @lion/ui in an app that need to synchronize their locale.
 * We want to make sure that the latest LocalizeManager instance (localize) of the latest lion version (that has the latest features and is backwards compatible with earlier versions) is registered before others.
 * We see often that this complicates setup/index files (the need of extra files to make sure logic gets executed before side-effectful imports. Also, build processes like Rollup tend to merge files and therefore hoist imports and change execution order.
 * This method aims to solve above problems.
 * @type {<T>(func: () => T) => T}
 */
const lazifyInstantiation = registerSingleton => {
  let /** @type any */ singletonInstance = null;

  const getSingletonInstance = () => {
    if (singletonInstance === null) {
      singletonInstance = registerSingleton();
    }

    return singletonInstance;
  };

  /** @type {any} */ const proxy = new Proxy(
    {},
    {
      get(_target, prop) {
        const instance = getSingletonInstance();
        // Somehow addEventListener and removeEventListner throws Illegal Invocation error without binding
        if (prop === 'addEventListener' || prop === 'removeEventListener') {
          return Reflect.get(instance, prop).bind(instance);
        }

        if (prop === '__instance_for_testing') {
          return instance;
        }

        return Reflect.get(instance, prop, instance);
      },
      set(_target, prop, value) {
        return Reflect.set(getSingletonInstance(), prop, value);
      },
      // Used for sinon.spy
      getOwnPropertyDescriptor(_target, prop) {
        return Reflect.getOwnPropertyDescriptor(getSingletonInstance(), prop);
      },
      // Used for sinon.spy
      getPrototypeOf() {
        return Reflect.getPrototypeOf(getSingletonInstance());
      },
    },
  );

  return proxy;
};

export { lazifyInstantiation };
