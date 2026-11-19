export = CachedInputFileSystem;
declare class CachedInputFileSystem {
	/**
	 * @param {BaseFileSystem} fileSystem file system
	 * @param {number} duration duration in ms files are cached
	 */
	constructor(fileSystem: BaseFileSystem, duration: number);
	fileSystem: BaseFileSystem;
	_lstatBackend: OperationMergerBackend | CacheBackend;
	lstat: import("./Resolver").LStat | undefined;
	lstatSync: import("./Resolver").LStatSync | undefined;
	_statBackend: OperationMergerBackend | CacheBackend;
	stat: import("./Resolver").Stat;
	statSync: import("./Resolver").StatSync;
	_readdirBackend: OperationMergerBackend | CacheBackend;
	readdir: import("./Resolver").Readdir;
	readdirSync: import("./Resolver").ReaddirSync;
	_readFileBackend: OperationMergerBackend | CacheBackend;
	readFile: import("./Resolver").ReadFile;
	readFileSync: import("./Resolver").ReadFileSync;
	_readJsonBackend: OperationMergerBackend | CacheBackend;
	readJson: import("./Resolver").ReadJson | undefined;
	readJsonSync: import("./Resolver").ReadJsonSync | undefined;
	_readlinkBackend: OperationMergerBackend | CacheBackend;
	readlink: import("./Resolver").Readlink;
	readlinkSync: import("./Resolver").ReadlinkSync;
	_realpathBackend: OperationMergerBackend | CacheBackend;
	realpath: import("./Resolver").RealPath | undefined;
	realpathSync: import("./Resolver").RealPathSync | undefined;
	/**
	 * @param {(string | Buffer | URL | number | (string | URL | Buffer | number)[] | Set<string | URL | Buffer | number>)=} what what to purge
	 * @param {{ exact?: boolean }=} options options; `exact: true` removes only cache entries whose key matches `what` exactly instead of any entry whose key starts with `what`
	 */
	purge(
		what?:
			| (
					| string
					| Buffer
					| URL
					| number
					| (string | URL | Buffer | number)[]
					| Set<string | URL | Buffer | number>
			  )
			| undefined,
		options?:
			| {
					exact?: boolean;
			  }
			| undefined,
	): void;
}
declare namespace CachedInputFileSystem {
	export {
		FileSystem,
		PathLike,
		PathOrFileDescriptor,
		SyncFileSystem,
		BaseFileSystem,
		FileSystemCallback,
		EXPECTED_FUNCTION,
		EXPECTED_ANY,
		Provide,
	};
}
declare class OperationMergerBackend {
	/**
	 * @param {EXPECTED_FUNCTION | undefined} provider async method in filesystem
	 * @param {EXPECTED_FUNCTION | undefined} syncProvider sync method in filesystem
	 * @param {BaseFileSystem} providerContext call context for the provider methods
	 */
	constructor(
		provider: EXPECTED_FUNCTION | undefined,
		syncProvider: EXPECTED_FUNCTION | undefined,
		providerContext: BaseFileSystem,
	);
	_provider: Function | undefined;
	_syncProvider: Function | undefined;
	_providerContext: BaseFileSystem;
	_activeAsyncOperations: Map<any, any>;
	provide:
		| ((
				path: PathLike | PathOrFileDescriptor,
				options: object | FileSystemCallback<EXPECTED_ANY> | undefined,
				callback?: FileSystemCallback<EXPECTED_ANY> | undefined,
		  ) => EXPECTED_ANY)
		| null;
	provideSync:
		| ((
				path: PathLike | PathOrFileDescriptor,
				options?: object | undefined,
		  ) => EXPECTED_ANY)
		| null;
	purge(): void;
	purgeParent(): void;
}
/**
 * @callback Provide
 * @param {PathLike | PathOrFileDescriptor} path path
 * @param {EXPECTED_ANY} options options
 * @param {FileSystemCallback<EXPECTED_ANY>} callback callback
 * @returns {void}
 */
declare class CacheBackend {
	/**
	 * @param {number} duration max cache duration of items
	 * @param {EXPECTED_FUNCTION | undefined} provider async method
	 * @param {EXPECTED_FUNCTION | undefined} syncProvider sync method
	 * @param {BaseFileSystem} providerContext call context for the provider methods
	 */
	constructor(
		duration: number,
		provider: EXPECTED_FUNCTION | undefined,
		syncProvider: EXPECTED_FUNCTION | undefined,
		providerContext: BaseFileSystem,
	);
	_duration: number;
	_provider: Function | undefined;
	_syncProvider: Function | undefined;
	_providerContext: BaseFileSystem;
	/** @type {Map<string, FileSystemCallback<EXPECTED_ANY>[]>} */
	_activeAsyncOperations: Map<string, FileSystemCallback<EXPECTED_ANY>[]>;
	/** @type {Map<string, { err: Error | null, result?: EXPECTED_ANY, level: Set<string> }>} */
	_data: Map<
		string,
		{
			err: Error | null;
			result?: EXPECTED_ANY;
			level: Set<string>;
		}
	>;
	/** @type {Set<string>[]} */
	_levels: Set<string>[];
	_currentLevel: number;
	_tickInterval: number;
	/** @type {STORAGE_MODE_IDLE | STORAGE_MODE_SYNC | STORAGE_MODE_ASYNC} */
	_mode: 0 | 1 | 2;
	/** @type {NodeJS.Timeout | undefined} */
	_timeout: NodeJS.Timeout | undefined;
	/** @type {number | undefined} */
	_nextDecay: number | undefined;
	/**
	 * @param {PathLike | PathOrFileDescriptor} path path
	 * @param {EXPECTED_ANY} options options
	 * @param {FileSystemCallback<EXPECTED_ANY>} callback callback
	 * @returns {void}
	 */
	provide(
		path: PathLike | PathOrFileDescriptor,
		options: EXPECTED_ANY,
		callback: FileSystemCallback<EXPECTED_ANY>,
	): void;
	/**
	 * @param {PathLike | PathOrFileDescriptor} path path
	 * @param {EXPECTED_ANY} options options
	 * @returns {EXPECTED_ANY} result
	 */
	provideSync(
		path: PathLike | PathOrFileDescriptor,
		options: EXPECTED_ANY,
	): EXPECTED_ANY;
	/**
	 * @param {(string | Buffer | URL | number | (string | URL | Buffer | number)[] | Set<string | URL | Buffer | number>)=} what what to purge
	 * @param {{ exact?: boolean }=} options options; `exact: true` removes only entries whose key matches `what` exactly instead of any entry whose key starts with `what`
	 */
	purge(
		what?:
			| (
					| string
					| Buffer
					| URL
					| number
					| (string | URL | Buffer | number)[]
					| Set<string | URL | Buffer | number>
			  )
			| undefined,
		options?:
			| {
					exact?: boolean;
			  }
			| undefined,
	): void;
	/**
	 * @param {(string | Buffer | URL | number | (string | URL | Buffer | number)[] | Set<string | URL | Buffer | number>)=} what what to purge
	 */
	purgeParent(
		what?:
			| (
					| string
					| Buffer
					| URL
					| number
					| (string | URL | Buffer | number)[]
					| Set<string | URL | Buffer | number>
			  )
			| undefined,
	): void;
	/**
	 * @param {string} path path
	 * @param {Error | null} err error
	 * @param {EXPECTED_ANY} result result
	 */
	_storeResult(path: string, err: Error | null, result: EXPECTED_ANY): void;
	_decayLevel(): void;
	_runDecays(): void;
	_enterAsyncMode(): void;
	_enterSyncModeWhenIdle(): void;
	_enterIdleMode(): void;
}
type FileSystem = import("./Resolver").FileSystem;
type PathLike = import("./Resolver").PathLike;
type PathOrFileDescriptor = import("./Resolver").PathOrFileDescriptor;
type SyncFileSystem = import("./Resolver").SyncFileSystem;
type BaseFileSystem = FileSystem & SyncFileSystem;
/**
 * <T>
 */
type FileSystemCallback<T> = import("./Resolver").FileSystemCallback<T>;
type EXPECTED_FUNCTION = Function;
type EXPECTED_ANY = any;
type Provide = (
	path: PathLike | PathOrFileDescriptor,
	options: EXPECTED_ANY,
	callback: FileSystemCallback<EXPECTED_ANY>,
) => void;
