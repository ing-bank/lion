import { defineCE } from '@open-wc/testing';

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
 * @param {CustomElementConstructor|undefined} customKlass the class for this role, if the caller gave one
 * @param {string|null|undefined} deprecatedTagString a tag the caller registered itself (deprecated)
 * @param {string|CustomElementConstructor} lionDefault Lion's own tag name or class
 * @returns {string}
 */
export function resolveSuiteTag(customKlass, deprecatedTagString, lionDefault) {
  if (customKlass) {
    const registeredName =
      typeof customElements.getName === 'function' ? customElements.getName(customKlass) : null;
    return registeredName || defineCE(class extends customKlass {});
  }
  if (deprecatedTagString) {
    return deprecatedTagString;
  }
  return typeof lionDefault === 'string' ? lionDefault : defineCE(class extends lionDefault {});
}
