export function explainSubpathsInConditions(
	field: ExportsField | ImportsField | null | undefined,
	isExports: boolean,
): string | null;
export function processExportsField(exportsField: ExportsField): FieldProcessor;
export function processImportsField(importsField: ImportsField): FieldProcessor;
export type DirectMapping = string | (string | ConditionalMapping)[];
export type ConditionalMapping = {
	[k: string]: MappingValue;
};
export type MappingValue = ConditionalMapping | DirectMapping | null;
export type ExportsField =
	Record<string, MappingValue> | ConditionalMapping | DirectMapping;
export type ImportsField = Record<string, MappingValue>;
/**
 * Processing exports/imports field
 */
export type FieldProcessor = (
	request: string,
	conditionNames: Set<string>,
) => [string[], string | null];
export type RecordMapping = Record<string, MappingValue>;
/**
 * Per-key precomputed info used by `findMatch`. Equivalent to what the
 * previous implementation recomputed inline on every resolve.
 */
export type FieldKeyInfo = {
	/**
	 * the original key
	 */
	key: string;
	/**
	 * position of the single "*" in the key, or -1 when absent
	 */
	patternIndex: number;
	/**
	 * substring before "*" (empty when patternIndex === -1)
	 */
	wildcardPrefix: string;
	/**
	 * substring after "*" (empty when patternIndex === -1)
	 */
	wildcardSuffix: string;
	/**
	 * true when key is a legacy `./foo/`-style folder key with no "*"
	 */
	isLegacySubpath: boolean;
	/**
	 * true when key contains "*"
	 */
	isPattern: boolean;
	/**
	 * true when key ends with "/"
	 */
	isSubpathMapping: boolean;
	/**
	 * true when key has at most one "*"
	 */
	isValidPattern: boolean;
};
export type MatchTuple =
	[MappingValue, string, boolean, boolean, string] | null;
