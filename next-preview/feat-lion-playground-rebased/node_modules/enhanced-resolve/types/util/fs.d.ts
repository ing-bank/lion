export type FileSystem = import("../Resolver").FileSystem;
export type JsonObject = import("../Resolver").JsonObject;
export type ReadJsonOptions = {
	/**
	 * Whether to strip JSONC comments
	 */
	stripComments?: boolean | undefined;
};
/**
 * Decode a file's raw contents to text without assuming a Node runtime. A
 * `Buffer` (Node) uses its fast native `toString`; any other binary input
 * (`Uint8Array` from a browser/Deno/Bun file system) goes through
 * `TextDecoder`, and strings are returned as-is.
 * @param {string | Buffer | Uint8Array} data raw file contents
 * @returns {string} decoded text
 */
export function decodeText(data: string | Buffer | Uint8Array): string;
/**
 * Read and parse JSON file (supports JSONC with comments).
 * Callback-based so a synchronous `fileSystem` stays synchronous all the
 * way through — Promise wrapping would defer resolution by a Promise tick
 * and break `resolveSync` when `tsconfig` is used together with
 * `useSyncFileSystemCalls: true`.
 * @param {FileSystem} fileSystem the file system
 * @param {string} jsonFilePath absolute path to JSON file
 * @param {ReadJsonOptions} options Options
 * @param {(err: NodeJS.ErrnoException | Error | null, content?: JsonObject) => void} callback callback
 * @returns {void}
 */
export function readJson(
	fileSystem: FileSystem,
	jsonFilePath: string,
	options: ReadJsonOptions,
	callback: (
		err: NodeJS.ErrnoException | Error | null,
		content?: JsonObject,
	) => void,
): void;
