export type InnerCallback = (
	err?: null | Error,
	result?: null | ResolveRequest,
) => void;
export type Resolver = import("./Resolver");
export type ResolveRequest = import("./Resolver").ResolveRequest;
export type ResolveContext = import("./Resolver").ResolveContext;
export type ResolveStepHook = import("./Resolver").ResolveStepHook;
export type ResolveCallback = import("./Resolver").ResolveCallback;
export type Alias = string | string[] | false;
export type AliasOption = {
	alias: Alias;
	name: string;
	onlyModule?: boolean;
};
export type CompiledAliasOption = {
	/**
	 * original alias name
	 */
	name: string;
	/**
	 * name + "/" — precomputed to avoid per-resolve concat
	 */
	nameWithSlash: string;
	/**
	 * alias target(s)
	 */
	alias: Alias;
	/**
	 * normalized onlyModule flag
	 */
	onlyModule: boolean;
	/**
	 * absolute form of `name` (with slash ending), null when not absolute
	 */
	absolutePath: string | null;
	/**
	 * substring before the single "*" in `name`, null when no wildcard
	 */
	wildcardPrefix: string | null;
	/**
	 * substring after the single "*" in `name`, null when no wildcard
	 */
	wildcardSuffix: string | null;
	/**
	 * first character code of `name` — used as a cheap screen on the hot path. `-1` indicates "matches any first char" (empty wildcard prefix).
	 */
	firstCharCode: number;
	/**
	 * true when `alias` is an array — precomputed so the hot path skips `Array.isArray`
	 */
	arrayAlias: boolean;
};
/**
 * Bucketed view of compiled options used by `aliasResolveHandler` to avoid
 * walking the full option list on every resolve. The `all` array preserves
 * the legacy linear order (declaration order) for the fallback path. The
 * `byFirstChar` map buckets options by the first char code of their `name`
 * — each bucket preserves declaration order among its members. The
 * `hasAnyFirstChar` flag is true when at least one option matches any
 * first char (`firstCharCode === -1`), in which case resolve-time scans
 * fall back to `all` to keep declaration-order semantics across buckets.
 * The `useBuckets` flag is true only when bucketing would actually help —
 * i.e. there are at least 2 distinct first chars AND no empty-prefix
 * wildcard. When false, the resolve hot path skips the `Map.get` and
 * iterates `all` directly with the per-option first-char-code screen
 * (matching the pre-bucketing behavior). This avoids paying for `Map.get`
 * on degenerate single-bucket lists like a long chain of aliases that
 * all share one first char — the bucket lookup adds overhead without
 * narrowing the candidate set, which showed up as a transient-memory
 * regression on `pathological-deep-stack`.
 */
export type CompiledAliasOptions = {
	/**
	 * declaration-ordered list
	 */
	all: CompiledAliasOption[];
	/**
	 * bucketed by first char code
	 */
	byFirstChar: Map<number, CompiledAliasOption[]>;
	/**
	 * true when an empty-prefix wildcard is present
	 */
	hasAnyFirstChar: boolean;
	/**
	 * true when the bucket fast-path should be used at resolve time
	 */
	useBuckets: boolean;
};
/** @typedef {(err?: null | Error, result?: null | ResolveRequest) => void} InnerCallback */
/**
 * @param {Resolver} resolver resolver
 * @param {CompiledAliasOptions} options compiled options
 * @param {ResolveStepHook} target target
 * @param {ResolveRequest} request request
 * @param {ResolveContext} resolveContext resolve context
 * @param {InnerCallback} callback callback
 * @returns {void}
 */
export function aliasResolveHandler(
	resolver: Resolver,
	options: CompiledAliasOptions,
	target: ResolveStepHook,
	request: ResolveRequest,
	resolveContext: ResolveContext,
	callback: InnerCallback,
): void;
/**
 * Precompute per-option strings used on every resolve so the hot path in
 * `aliasResolveHandler` does no string concatenation / split work per entry.
 * Called once per plugin apply — the returned structure is stable for the
 * lifetime of the resolver.
 *
 * Beyond the per-option precompute step, this also partitions the list into
 * a `byFirstChar` map so that, when no "empty-prefix" wildcards are
 * present, the resolve-time scan only walks options whose `name` starts
 * with the same char as the current request. For large alias lists (300+
 * entries) this turns an O(N) screen into O(K) where K is the bucket size
 * for the request's first char.
 * @param {Resolver} resolver resolver
 * @param {AliasOption[]} options options
 * @returns {CompiledAliasOptions} compiled options
 */
export function compileAliasOptions(
	resolver: Resolver,
	options: AliasOption[],
): CompiledAliasOptions;
