export = stripJsonComments;
/**
 * Strip comments from JSON string
 * @param {string} jsonString JSON string with potential comments
 * @param {StripJsonCommentsOptions} options Options
 * @returns {string} JSON string without comments
 */
declare function stripJsonComments(
	jsonString: string,
	{ whitespace, trailingCommas }?: StripJsonCommentsOptions,
): string;
declare namespace stripJsonComments {
	export { StripJsonCommentsOptions };
}
type StripJsonCommentsOptions = {
	/**
	 * Replace comments with whitespace
	 */
	whitespace?: boolean | undefined;
	/**
	 * Strip trailing commas
	 */
	trailingCommas?: boolean | undefined;
};
