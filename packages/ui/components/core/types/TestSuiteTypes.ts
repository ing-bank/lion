/**
 * One value in a suite's `classes` map: the constructor to run the guarantees against, or the tag to
 * render for that role. Native elements (`h2`, `div`) are a platform tag and have no class of their
 * own, so those roles take a string.
 */
export type SuiteElement = CustomElementConstructor | string;

/**
 * The roles a suite understands, keyed by Lion's tag name without the `lion-` prefix
 * (`{ host: MyAccordion, invoker: 'h3', content: 'section' }`).
 */
export type SuiteRoles = Record<string, SuiteElement>;

/**
 * Keys every suite still accepts from callers written before `classes` existed: they keep compiling
 * and keep working, new code passes `classes`.
 */
export type SuiteLegacyKeys = {
  /** @deprecated pass `classes` instead. */
  tagString?: string;
  /** @deprecated pass `classes` instead. */
  klass?: CustomElementConstructor;
} & {
  /**
   * @deprecated the role-level tag keys callers used before `classes` (`childTagString`,
   * `optionTagString`, `tabsTagString`, …): pass that role through `classes` instead.
   */
  [legacyRoleTag: `${string}TagString` | `tag${string}String`]: string | undefined;
};

/**
 * Configuration every suite runner accepts - one shared type for all of them. Both parameters are
 * narrowed per suite: `Roles` lists the roles that suite resolves, `Options` carries the options that
 * are unique to it, so a wrong key is a type error at the call site.
 *
 * Every key is optional at the call site, including the options: a suite prefills Lion's own element
 * for every role, and derives or defaults what it can for the rest. An option a suite cannot default
 * is documented as required in that suite and enforced by the suite itself.
 */
export type SuiteConfig<
  Roles extends SuiteRoles = SuiteRoles,
  Options extends object = object,
> = SuiteLegacyKeys & { classes?: Partial<Roles> } & Partial<Options>;
