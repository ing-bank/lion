import { defineCE } from '@open-wc/testing';

/**
 * The tag `klass` is registered under, or `null` when it is not registered at all.
 *
 * `customElements.getName` is not available under the scoped-custom-element-registry polyfill that
 * Lion's test setup loads, so as a second attempt candidate names are derived from the class name
 * (`LionCheckboxIndeterminate` -> `lion-checkbox-indeterminate`, `MyInputDatepicker` ->
 * `my-input-datepicker`) and checked against the registry.
 *
 * @param {CustomElementConstructor} klass
 * @returns {string|null}
 */
function registeredTagFor(klass) {
  if (typeof customElements.getName === 'function') {
    const name = customElements.getName(klass);
    if (name) {
      return name;
    }
  }
  const kebab = klass.name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  for (const candidate of [kebab, `lion-${kebab}`]) {
    if (customElements.get(candidate) === klass) {
      return candidate;
    }
  }
  return null;
}

/**
 * Defines a subclass element, retrying when the test framework's generated tag name is taken.
 *
 * A consumer repository can end up with two module instances of the test framework (its own and the
 * one @lion/ui resolved), and both start their counter at `test-0`: the second one then throws
 * "the name test-0 has already been used". Retrying takes the next name.
 *
 * @param {CustomElementConstructor} klass
 * @returns {string}
 */
function defineUniqueTag(klass) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      return defineCE(class extends klass {});
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (!/already been used/.test(message)) {
        throw error;
      }
    }
  }
  throw new Error(`Could not define a unique tag for ${klass.name}`);
}

/**
 * Resolves the element a test suite should render for one role.
 *
 * A caller passes `classes`: a map whose keys are Lion's tag names without the `lion-` prefix and
 * whose values are constructors, e.g.
 *
 *     runComboboxSuite({ classes: { combobox: MyCombobox, option: MyOption } });
 *
 * The class's registered tag is used when it has one (so a subclasser's scoped children keep
 * working), otherwise a subclass element is defined on the fly. Everything the caller omits keeps
 * Lion's own element, which is the implicit default.
 *
 * `tagString` (and the older role-level keys such as `optionTagString`) stay supported as the
 * deprecated fallback for callers that already registered a tag but have no class to hand.
 *
 * A role may also be given as a tag: native elements are a platform tag (`h2`, `div`) and have no
 * class of their own, so a caller hands the tag it wants rendered for that role.
 *
 * A suite declares Lion's own element for a role as the default on the role itself
 * (`classes: { host = LionAccordion, invoker = 'h2' } = {}`), so it can call this with the role and
 * the deprecated key only; `lionDefault` stays for suites whose default is only known further down.
 *
 * @param {CustomElementConstructor|string|undefined} customKlassOrTag the class or tag for this role, if the caller gave one
 * @param {string|null} [deprecatedTagString] a tag the caller registered itself (deprecated)
 * @param {string|CustomElementConstructor} [lionDefault] Lion's own tag name or class
 * @returns {string}
 */
export function resolveSuiteTag(customKlassOrTag, deprecatedTagString, lionDefault) {
  if (typeof customKlassOrTag === 'string') {
    return customKlassOrTag;
  }
  const customKlass = customKlassOrTag;
  if (customKlass) {
    // A class that maps to a registered tag wins; a class that does not still gives the caller's
    // element a chance to be named by the deprecated tag key, and only then is a subclass defined.
    return registeredTagFor(customKlass) || deprecatedTagString || defineUniqueTag(customKlass);
  }
  if (deprecatedTagString) {
    return deprecatedTagString;
  }
  return typeof lionDefault === 'string'
    ? lionDefault
    : defineUniqueTag(/** @type {CustomElementConstructor} */ (lionDefault));
}
