export = Resolver;
declare class Resolver {
	/**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @param {StackEntry=} parent previous tip of the stack
	 * @param {Set<string>=} preSeeded entries pre-seeded via the legacy `Set<string>` API
	 * @returns {StackEntry} stack entry
	 */
	static createStackEntry(
		hook: ResolveStepHook,
		request: ResolveRequest,
		parent?: StackEntry | undefined,
		preSeeded?: Set<string> | undefined,
	): StackEntry;
	/**
	 * @param {FileSystem} fileSystem a filesystem
	 * @param {ResolveOptions} options options
	 */
	constructor(fileSystem: FileSystem, options: ResolveOptions);
	/** @type {FileSystem} */
	fileSystem: FileSystem;
	/** @type {ResolveOptions} */
	options: ResolveOptions;
	/** @type {PathCacheFunctions} */
	pathCache: PathCacheFunctions;
	/** @type {KnownHooks} */
	hooks: KnownHooks;
	/**
	 * @param {string | ResolveStepHook} name hook name or hook itself
	 * @returns {ResolveStepHook} the hook
	 */
	ensureHook(name: string | ResolveStepHook): ResolveStepHook;
	/**
	 * @param {string | ResolveStepHook} name hook name or hook itself
	 * @returns {ResolveStepHook} the hook
	 */
	getHook(name: string | ResolveStepHook): ResolveStepHook;
	/**
	 * @overload
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {string | false} result
	 */
	resolveSync(
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext | undefined,
	): string | false;
	/**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {string | false} result
	 */
	resolveSync(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext | undefined,
	): string | false;
	/**
	 * @overload
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {Promise<string | false>} result
	 */
	resolvePromise(
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext | undefined,
	): Promise<string | false>;
	/**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveContext=} resolveContext resolve context
	 * @returns {Promise<string | false>} result
	 */
	resolvePromise(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		resolveContext?: ResolveContext | undefined,
	): Promise<string | false>;
	/**
	 * @overload
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */
	resolve(
		parent: string | URL,
		specifier: string | URL,
		callback: ResolveCallback,
	): void;
	/**
	 * @overload
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveContext} resolveContext resolve context
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */
	resolve(
		parent: string | URL,
		specifier: string | URL,
		resolveContext: ResolveContext,
		callback: ResolveCallback,
	): void;
	/**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */
	resolve(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		callback: ResolveCallback,
	): void;
	/**
	 * @overload
	 * @param {Context} context context information object
	 * @param {string | URL} parent context path or a `file:` URL
	 * @param {string | URL} specifier request string or a `file:` URL
	 * @param {ResolveContext} resolveContext resolve context
	 * @param {ResolveCallback} callback callback function
	 * @returns {void}
	 */
	resolve(
		context: Context,
		parent: string | URL,
		specifier: string | URL,
		resolveContext: ResolveContext,
		callback: ResolveCallback,
	): void;
	/**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @param {null | string} message string
	 * @param {ResolveContext} resolveContext resolver context
	 * @param {(err?: null | Error, result?: ResolveRequest) => void} callback callback
	 * @returns {void}
	 */
	doResolve(
		hook: ResolveStepHook,
		request: ResolveRequest,
		message: null | string,
		resolveContext: ResolveContext,
		callback: (err?: null | Error, result?: ResolveRequest) => void,
	): void;
	/**
	 * @param {string} identifier identifier
	 * @returns {ParsedIdentifier} parsed identifier
	 */
	parse(identifier: string): ParsedIdentifier;
	/**
	 * @param {string} path path
	 * @returns {boolean} true, if the path is a module
	 */
	isModule(path: string): boolean;
	/**
	 * @param {string} path path
	 * @returns {boolean} true, if the path is private
	 */
	isPrivate(path: string): boolean;
	/**
	 * @param {string} path a path
	 * @returns {boolean} true, if the path is a directory path
	 */
	isDirectory(path: string): boolean;
	/**
	 * @param {string} path path
	 * @returns {string} normalized path
	 */
	normalize(path: string): string;
	/**
	 * @param {string} path path
	 * @param {string} request request
	 * @returns {string} joined path
	 */
	join(path: string, request: string): string;
	/**
	 * @param {string} path path
	 * @returns {string} parent directory
	 */
	dirname(path: string): string;
	/**
	 * @param {string} path the path to evaluate
	 * @param {string=} suffix an extension to remove from the result
	 * @returns {string} the last portion of a path
	 */
	basename(path: string, suffix?: string | undefined): string;
}
declare namespace Resolver {
	export {
		ResolveContext,
		ResolveStepHook,
		KnownHooks,
		EnsuredHooks,
		AliasOption,
		CachedJoin,
		CachedDirname,
		CachedBasename,
		JoinCacheEntry,
		DirnameCacheEntry,
		BasenameCacheEntry,
		PathCacheFunctions,
		ResolveOptions,
		KnownContext,
		Context,
		ErrorWithDetail,
		ResolveCallback,
		PossibleFileSystemError,
		FileSystemCallback,
		PathLike,
		PathOrFileDescriptor,
		ObjectEncodingOptions,
		EncodingOption,
		StringCallback,
		BufferCallback,
		StringOrBufferCallback,
		StatsCallback,
		BigIntStatsCallback,
		StatsOrBigIntStatsCallback,
		ReadJsonCallback,
		IStatsBase,
		IStats,
		IBigIntStats,
		Dirent,
		StatOptions,
		StatSyncOptions,
		ReadFile,
		BufferEncodingOption,
		ReadFileSync,
		Readdir,
		ReaddirSync,
		ReadJson,
		ReadJsonSync,
		Readlink,
		ReadlinkSync,
		LStat,
		LStatSync,
		Stat,
		StatSync,
		RealPath,
		RealPathSync,
		FileSystem,
		SyncFileSystem,
		ParsedIdentifier,
		JsonPrimitive,
		JsonArray,
		JsonValue,
		JsonObject,
		TsconfigPathsMap,
		TsconfigPathsData,
		BaseResolveRequest,
		ResolveRequest,
		WriteOnlySet,
		ResolveContextYield,
	};
}
/** @typedef {import("./ResolverFactory").ResolveOptions} ResolveOptions */
/**
 * @typedef {object} KnownContext
 * @property {string[]=} environments environments
 * @property {string=} packageId package id of the importing file in the package map, propagated from a previous result to disambiguate package entries that share a location (`@experimental`, see the `packageMap` option)
 */
/** @typedef {KnownContext & Record<any, any>} Context */
/** @typedef {Error & { details?: string }} ErrorWithDetail */
/** @typedef {(err: ErrorWithDetail | null, res?: string | false, req?: ResolveRequest) => void} ResolveCallback */
/**
 * @typedef {object} PossibleFileSystemError
 * @property {string=} code code
 * @property {number=} errno number
 * @property {string=} path path
 * @property {string=} syscall syscall
 */
/**
 * @template T
 * @callback FileSystemCallback
 * @param {PossibleFileSystemError & Error | null} err
 * @param {T=} result
 */
/**
 * @typedef {string | Buffer | URL} PathLike
 */
/**
 * @typedef {PathLike | number} PathOrFileDescriptor
 */
/**
 * @typedef {object} ObjectEncodingOptions
 * @property {BufferEncoding | null | undefined=} encoding encoding
 */
/**
 * @typedef {ObjectEncodingOptions | BufferEncoding | undefined | null} EncodingOption
 */
/** @typedef {(err: NodeJS.ErrnoException | null, result?: string) => void} StringCallback */
/** @typedef {(err: NodeJS.ErrnoException | null, result?: Buffer) => void} BufferCallback */
/** @typedef {(err: NodeJS.ErrnoException | null, result?: (string | Buffer)) => void} StringOrBufferCallback */
/** @typedef {(err: NodeJS.ErrnoException | null, result?: IStats) => void} StatsCallback */
/** @typedef {(err: NodeJS.ErrnoException | null, result?: IBigIntStats) => void} BigIntStatsCallback */
/** @typedef {(err: NodeJS.ErrnoException | null, result?: (IStats | IBigIntStats)) => void} StatsOrBigIntStatsCallback */
/** @typedef {(err: NodeJS.ErrnoException | Error | null, result?: JsonObject) => void} ReadJsonCallback */
/**
 * @template T
 * @typedef {object} IStatsBase
 * @property {() => boolean} isFile is file
 * @property {() => boolean} isDirectory is directory
 * @property {() => boolean} isBlockDevice is block device
 * @property {() => boolean} isCharacterDevice is character device
 * @property {() => boolean} isSymbolicLink is symbolic link
 * @property {() => boolean} isFIFO is FIFO
 * @property {() => boolean} isSocket is socket
 * @property {T} dev dev
 * @property {T} ino ino
 * @property {T} mode mode
 * @property {T} nlink nlink
 * @property {T} uid uid
 * @property {T} gid gid
 * @property {T} rdev rdev
 * @property {T} size size
 * @property {T} blksize blksize
 * @property {T} blocks blocks
 * @property {T} atimeMs atime ms
 * @property {T} mtimeMs mtime ms
 * @property {T} ctimeMs ctime ms
 * @property {T} birthtimeMs birthtime ms
 * @property {Date} atime atime
 * @property {Date} mtime mtime
 * @property {Date} ctime ctime
 * @property {Date} birthtime birthtime
 */
/**
 * @typedef {IStatsBase<number>} IStats
 */
/**
 * @typedef {IStatsBase<bigint> & { atimeNs: bigint, mtimeNs: bigint, ctimeNs: bigint, birthtimeNs: bigint }} IBigIntStats
 */
/**
 * @template {string | Buffer} [T=string]
 * @typedef {object} Dirent
 * @property {() => boolean} isFile true when is file, otherwise false
 * @property {() => boolean} isDirectory true when is directory, otherwise false
 * @property {() => boolean} isBlockDevice true when is block device, otherwise false
 * @property {() => boolean} isCharacterDevice true when is character device, otherwise false
 * @property {() => boolean} isSymbolicLink true when is symbolic link, otherwise false
 * @property {() => boolean} isFIFO true when is FIFO, otherwise false
 * @property {() => boolean} isSocket true when is socket, otherwise false
 * @property {T} name name
 * @property {string} parentPath path
 * @property {string=} path path
 */
/**
 * @typedef {object} StatOptions
 * @property {(boolean | undefined)=} bigint need bigint values
 */
/**
 * @typedef {object} StatSyncOptions
 * @property {(boolean | undefined)=} bigint need bigint values
 * @property {(boolean | undefined)=} throwIfNoEntry throw if no entry
 */
/**
 * @typedef {{
 * (path: PathOrFileDescriptor, options: ({ encoding?: null | undefined, flag?: string | undefined } & import("events").Abortable) | undefined | null, callback: BufferCallback): void,
 * (path: PathOrFileDescriptor, options: ({ encoding: BufferEncoding, flag?: string | undefined } & import("events").Abortable) | BufferEncoding, callback: StringCallback): void,
 * (path: PathOrFileDescriptor, options: (ObjectEncodingOptions & { flag?: string | undefined } & import("events").Abortable) | BufferEncoding | undefined | null, callback: StringOrBufferCallback): void,
 * (path: PathOrFileDescriptor, callback: BufferCallback): void,
 * }} ReadFile
 */
/**
 * @typedef {"buffer" | { encoding: "buffer" }} BufferEncodingOption
 */
/**
 * @typedef {{
 * (path: PathOrFileDescriptor, options?: { encoding?: null | undefined, flag?: string | undefined } | null): Buffer,
 * (path: PathOrFileDescriptor, options: { encoding: BufferEncoding, flag?: string | undefined } | BufferEncoding): string,
 * (path: PathOrFileDescriptor, options: ObjectEncodingOptions & { flag?: string | undefined }): string | Buffer,
 * }} ReadFileSync
 */
/**
 * @typedef {{
 * (path: PathLike, options: { encoding: BufferEncoding | null, withFileTypes?: false | undefined, recursive?: boolean | undefined } | BufferEncoding | undefined | null, callback: (err: NodeJS.ErrnoException | null, files?: string[]) => void): void,
 * (path: PathLike, options: { encoding: "buffer", withFileTypes?: false | undefined, recursive?: boolean | undefined } | "buffer", callback: (err: NodeJS.ErrnoException | null, files?: Buffer[]) => void): void,
 * (path: PathLike, options: (ObjectEncodingOptions & { withFileTypes?: false | undefined, recursive?: boolean | undefined }) | BufferEncoding | undefined | null, callback: (err: NodeJS.ErrnoException | null, files?: string[] | Buffer[]) => void): void,
 * (path: PathLike, callback: (err: NodeJS.ErrnoException | null, files?: string[]) => void): void,
 * (path: PathLike, options: ObjectEncodingOptions & { withFileTypes: true, recursive?: boolean | undefined }, callback: (err: NodeJS.ErrnoException | null, files?: Dirent<string>[]) => void): void,
 * (path: PathLike, options: { encoding: "buffer", withFileTypes: true, recursive?: boolean | undefined }, callback: (err: NodeJS.ErrnoException | null, files: Dirent<Buffer>[]) => void): void,
 * }} Readdir
 */
/**
 * @typedef {{
 * (path: PathLike, options?: { encoding: BufferEncoding | null, withFileTypes?: false | undefined, recursive?: boolean | undefined } | BufferEncoding | null): string[],
 * (path: PathLike, options: { encoding: "buffer", withFileTypes?: false | undefined, recursive?: boolean | undefined } | "buffer"): Buffer[],
 * (path: PathLike, options?: (ObjectEncodingOptions & { withFileTypes?: false | undefined, recursive?: boolean | undefined }) | BufferEncoding | null): string[] | Buffer[],
 * (path: PathLike, options: ObjectEncodingOptions & { withFileTypes: true, recursive?: boolean | undefined }): Dirent[],
 * (path: PathLike, options: { encoding: "buffer", withFileTypes: true, recursive?: boolean | undefined }): Dirent<Buffer>[],
 * }} ReaddirSync
 */
/**
 * @typedef {(pathOrFileDescription: PathOrFileDescriptor, callback: ReadJsonCallback) => void} ReadJson
 */
/**
 * @typedef {(pathOrFileDescription: PathOrFileDescriptor) => JsonObject} ReadJsonSync
 */
/**
 * @typedef {{
 * (path: PathLike, options: EncodingOption, callback: StringCallback): void,
 * (path: PathLike, options: BufferEncodingOption, callback: BufferCallback): void,
 * (path: PathLike, options: EncodingOption, callback: StringOrBufferCallback): void,
 * (path: PathLike, callback: StringCallback): void,
 * }} Readlink
 */
/**
 * @typedef {{
 * (path: PathLike, options?: EncodingOption): string,
 * (path: PathLike, options: BufferEncodingOption): Buffer,
 * (path: PathLike, options?: EncodingOption): string | Buffer,
 * }} ReadlinkSync
 */
/**
 * @typedef {{
 * (path: PathLike, callback: StatsCallback): void,
 * (path: PathLike, options: (StatOptions & { bigint?: false | undefined }) | undefined, callback: StatsCallback): void,
 * (path: PathLike, options: StatOptions & { bigint: true }, callback: BigIntStatsCallback): void,
 * (path: PathLike, options: StatOptions | undefined, callback: StatsOrBigIntStatsCallback): void,
 * }} LStat
 */
/**
 * @typedef {{
 * (path: PathLike, options?: undefined): IStats,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined, throwIfNoEntry: false }): IStats | undefined,
 * (path: PathLike, options: StatSyncOptions & { bigint: true, throwIfNoEntry: false }): IBigIntStats | undefined,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined, throwIfNoEntry?: true | undefined }): IStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: true, throwIfNoEntry?: true | undefined }): IBigIntStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: boolean, throwIfNoEntry?: undefined }): IStats | IBigIntStats,
 * (path: PathLike, options?: StatSyncOptions): IStats | IBigIntStats | undefined,
 * }} LStatSync
 */
/**
 * @typedef {{
 * (path: PathLike, callback: StatsCallback): void,
 * (path: PathLike, options: (StatOptions & { bigint?: false | undefined }) | undefined, callback: StatsCallback): void,
 * (path: PathLike, options: StatOptions & { bigint: true }, callback: BigIntStatsCallback): void,
 * (path: PathLike, options: StatOptions | undefined, callback: StatsOrBigIntStatsCallback): void,
 * }} Stat
 */
/**
 * @typedef {{
 * (path: PathLike, options?: undefined): IStats,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined, throwIfNoEntry: false }): IStats | undefined,
 * (path: PathLike, options: StatSyncOptions & { bigint: true, throwIfNoEntry: false }): IBigIntStats | undefined,
 * (path: PathLike, options?: StatSyncOptions & { bigint?: false | undefined, throwIfNoEntry?: true | undefined }): IStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: true, throwIfNoEntry?: true | undefined }): IBigIntStats,
 * (path: PathLike, options: StatSyncOptions & { bigint: boolean, throwIfNoEntry?: undefined }): IStats | IBigIntStats,
 * (path: PathLike, options?: StatSyncOptions): IStats | IBigIntStats | undefined,
 * }} StatSync
 */
/**
 * @typedef {{
 * (path: PathLike, options: EncodingOption, callback: StringCallback): void,
 * (path: PathLike, options: BufferEncodingOption, callback: BufferCallback): void,
 * (path: PathLike, options: EncodingOption, callback: StringOrBufferCallback): void,
 * (path: PathLike, callback: StringCallback): void,
 * }} RealPath
 */
/**
 * @typedef {{
 * (path: PathLike, options?: EncodingOption): string,
 * (path: PathLike, options: BufferEncodingOption): Buffer,
 * (path: PathLike, options?: EncodingOption): string | Buffer,
 * }} RealPathSync
 */
/**
 * @typedef {object} FileSystem
 * @property {ReadFile} readFile read file method
 * @property {Readdir} readdir readdir method
 * @property {ReadJson=} readJson read json method
 * @property {Readlink} readlink read link method
 * @property {LStat=} lstat lstat method
 * @property {Stat} stat stat method
 * @property {RealPath=} realpath realpath method
 */
/**
 * @typedef {object} SyncFileSystem
 * @property {ReadFileSync} readFileSync read file sync method
 * @property {ReaddirSync} readdirSync read dir sync method
 * @property {ReadJsonSync=} readJsonSync read json sync method
 * @property {ReadlinkSync} readlinkSync read link sync method
 * @property {LStatSync=} lstatSync lstat sync method
 * @property {StatSync} statSync stat sync method
 * @property {RealPathSync=} realpathSync real path sync method
 */
/**
 * @typedef {object} ParsedIdentifier
 * @property {string} request request
 * @property {string} query query
 * @property {string} fragment fragment
 * @property {boolean} directory is directory
 * @property {boolean} module is module
 * @property {boolean} file is file
 * @property {boolean} internal is internal
 */
/** @typedef {string | number | boolean | null} JsonPrimitive */
/** @typedef {JsonValue[]} JsonArray */
/** @typedef {JsonPrimitive | JsonObject | JsonArray} JsonValue */
/** @typedef {{ [Key in string]?: JsonValue | undefined }} JsonObject */
/**
 * @typedef {object} TsconfigPathsMap
 * @property {TsconfigPathsData} main main tsconfig paths data
 * @property {string} mainContext main tsconfig base URL (absolute path)
 * @property {{ [baseUrl: string]: TsconfigPathsData }} refs referenced tsconfig paths data mapped by baseUrl
 * @property {{ [context: string]: TsconfigPathsData }} allContexts all contexts (main + refs) for quick lookup
 * @property {string[]} contextList precomputed `Object.keys(allContexts)` — read-only; used on the `_selectPathsDataForContext` hot path
 * @property {Set<string>} fileDependencies file dependencies
 */
/**
 * @typedef {object} TsconfigPathsData
 * @property {import("./AliasUtils").CompiledAliasOptions} alias tsconfig file data
 * @property {string[]} modules tsconfig file data
 */
/**
 * @typedef {object} BaseResolveRequest
 * @property {string | false} path path
 * @property {Context=} context content
 * @property {string=} descriptionFilePath description file path
 * @property {string=} descriptionFileRoot description file root
 * @property {JsonObject=} descriptionFileData description file data
 * @property {TsconfigPathsMap | null | undefined=} tsconfigPathsMap tsconfig paths map
 * @property {string=} relativePath relative path
 * @property {boolean=} ignoreSymlinks true when need to ignore symlinks, otherwise false
 * @property {boolean=} fullySpecified true when full specified, otherwise false
 * @property {string=} packageId package id the request was resolved to in the package map, to be propagated to resolutions made from the resulting file (`@experimental`, see the `packageMap` option)
 * @property {string=} __innerRequest inner request for internal usage
 * @property {string=} __innerRequest_request inner request for internal usage
 * @property {string=} __innerRequest_relativePath inner relative path for internal usage
 * @property {{ blocked: boolean }=} __restrictionsMarker internal: shared marker `RestrictionsPlugin` flips when it filters out an existing target, letting `ExportsFieldPlugin` fall back instead of erroring
 */
/** @typedef {BaseResolveRequest & Partial<ParsedIdentifier>} ResolveRequest */
/**
 * @template T
 * @typedef {{ add: (item: T) => void }} WriteOnlySet
 */
/** @typedef {(request: ResolveRequest) => void} ResolveContextYield */
/**
 * Singly-linked stack entry that also exposes a Set-like API
 * (`has`, `size`, iteration). Each `doResolve` call prepends a new
 * `StackEntry` that points at the previous tip via `.parent`, so pushing
 * is O(1) in time and memory. Recursion detection walks the linked list
 * (O(n)) but the stack is typically shallow, so this is cheaper overall
 * than cloning a `Set` per call.
 */
declare class StackEntry {
	/**
	 * @param {ResolveStepHook} hook hook
	 * @param {ResolveRequest} request request
	 * @param {StackEntry=} parent previous tip
	 * @param {Set<string>=} preSeeded entries pre-seeded via the legacy `Set<string>` API
	 */
	constructor(
		hook: ResolveStepHook,
		request: ResolveRequest,
		parent?: StackEntry | undefined,
		preSeeded?: Set<string> | undefined,
	);
	name: string | undefined;
	path: string | false;
	request: string;
	query: string;
	fragment: string;
	directory: boolean;
	module: boolean;
	/** @type {StackEntry | undefined} */
	parent: StackEntry | undefined;
	/**
	 * Strings seeded by callers that still pass `stack: new Set([...])`.
	 * Propagated through the chain so deeper `doResolve` calls still see
	 * them during recursion checks. `undefined` in the common case so
	 * there is no extra work on the hot path.
	 * @type {Set<string> | undefined}
	 */
	preSeeded: Set<string> | undefined;
	/**
	 * Walk the linked list looking for an entry with the same request shape.
	 * Set-compatible: callers that used `stack.has(entry)` keep working.
	 *
	 * NOTE: kept monomorphic on purpose. An earlier draft accepted a string
	 * query too (so pre-5.21 plugins keeping their own `Set<string>` of
	 * seen entries could probe the live stack with the formatted form),
	 * but adding the second shape regressed `doResolve`'s heap profile by
	 * ~1 MiB / 200 resolves on stack-churn — V8 keeps a polymorphic
	 * call-site state for `parent.has(stackEntry)` once `has` has two
	 * argument shapes. Plugins that need string membership can reach for
	 * `[...stack].find(e => e.includes(formattedString))` via the
	 * `String`-method proxies on `StackEntry` instead.
	 * @param {StackEntry} query entry to look for
	 * @returns {boolean} whether the stack already contains an equivalent entry
	 */
	has(query: StackEntry): boolean;
	/**
	 * Number of entries on the stack (oldest-to-newest length).
	 * @returns {number} size
	 */
	get size(): number;
	/**
	 * Human-readable form used in recursion error messages, logs, and the
	 * iterator above. Not memoized: caching would require an extra slot on
	 * every `StackEntry`, which costs heap even on resolves that never look
	 * at the formatted form.
	 * @returns {string} formatted entry
	 */
	toString(): string;
	/**
	 * Iterate entries from oldest (root) to newest (tip), matching how a
	 * `Set` that was populated in insertion order would iterate. Pre-seeded
	 * legacy `Set<string>` entries come first so error-message output stays
	 * ordered oldest-to-newest.
	 *
	 * Yields each entry as its formatted `toString()` form. Plugins written
	 * against the pre-5.21 `Set<string>` shape — e.g.
	 * `[...resolveContext.stack].find(a => a.includes("module:"))` — keep
	 * working unchanged because each yielded value is a plain string with
	 * all of `String.prototype` available natively. Resolves that never
	 * iterate the stack pay nothing; iteration costs one `toString()`
	 * allocation per stack frame.
	 * @returns {IterableIterator<string>} iterator
	 */
	[Symbol.iterator](): IterableIterator<string>;
}
/**
 * Resolve context
 */
type ResolveContext = {
	/**
	 * directories that was found on file system
	 */
	contextDependencies?: WriteOnlySet<string> | undefined;
	/**
	 * files that was found on file system
	 */
	fileDependencies?: WriteOnlySet<string> | undefined;
	/**
	 * dependencies that was not found on file system
	 */
	missingDependencies?: WriteOnlySet<string> | undefined;
	/**
	 * tip of the resolver call stack (a singly-linked list with Set-like API). For instance, `resolve → parsedResolve → describedResolve`. Accepts a legacy `Set<string>` for back-compat with older callers; it is normalized internally without a hot-path branch.
	 */
	stack?: (StackEntry | Set<string>) | undefined;
	/**
	 * log function
	 */
	log?: ((str: string) => void) | undefined;
	/**
	 * yield result, if provided plugins can return several results
	 */
	yield?: ResolveContextYield | undefined;
};
type ResolveStepHook = AsyncSeriesBailHook<
	[ResolveRequest, ResolveContext],
	ResolveRequest | null
>;
type KnownHooks = {
	/**
	 * resolve step hook
	 */
	resolveStep: SyncHook<[ResolveStepHook, ResolveRequest], void>;
	/**
	 * no resolve hook
	 */
	noResolve: SyncHook<[ResolveRequest, Error]>;
	/**
	 * resolve hook
	 */
	resolve: ResolveStepHook;
	/**
	 * result hook
	 */
	result: AsyncSeriesHook<[ResolveRequest, ResolveContext]>;
};
type EnsuredHooks = {
	[key: string]: ResolveStepHook;
};
type AliasOption = import("./AliasUtils").AliasOption;
type CachedJoin = import("./util/path").CachedJoin;
type CachedDirname = import("./util/path").CachedDirname;
type CachedBasename = import("./util/path").CachedBasename;
type JoinCacheEntry = {
	/**
	 * cached join function
	 */
	fn: CachedJoin["fn"];
	/**
	 * the underlying cache map
	 */
	cache: CachedJoin["cache"];
};
type DirnameCacheEntry = {
	/**
	 * cached dirname function
	 */
	fn: CachedDirname["fn"];
	/**
	 * the underlying cache map
	 */
	cache: CachedDirname["cache"];
};
type BasenameCacheEntry = {
	/**
	 * cached dirname function
	 */
	fn: CachedBasename["fn"];
	/**
	 * the underlying cache map
	 */
	cache: CachedBasename["cache"];
};
type PathCacheFunctions = {
	/**
	 * cached join
	 */
	join: JoinCacheEntry;
	/**
	 * cached dirname
	 */
	dirname: DirnameCacheEntry;
	/**
	 * cached basename
	 */
	basename: BasenameCacheEntry;
};
type ResolveOptions = import("./ResolverFactory").ResolveOptions;
type KnownContext = {
	/**
	 * environments
	 */
	environments?: string[] | undefined;
	/**
	 * package id of the importing file in the package map, propagated from a previous result to disambiguate package entries that share a location (`@experimental`, see the `packageMap` option)
	 */
	packageId?: string | undefined;
};
type Context = KnownContext & Record<any, any>;
type ErrorWithDetail = Error & {
	details?: string;
};
type ResolveCallback = (
	err: ErrorWithDetail | null,
	res?: string | false,
	req?: ResolveRequest,
) => void;
type PossibleFileSystemError = {
	/**
	 * code
	 */
	code?: string | undefined;
	/**
	 * number
	 */
	errno?: number | undefined;
	/**
	 * path
	 */
	path?: string | undefined;
	/**
	 * syscall
	 */
	syscall?: string | undefined;
};
type FileSystemCallback<T> = (
	err: (PossibleFileSystemError & Error) | null,
	result?: T | undefined,
) => any;
type PathLike = string | Buffer | URL;
type PathOrFileDescriptor = PathLike | number;
type ObjectEncodingOptions = {
	/**
	 * encoding
	 */
	encoding?: (BufferEncoding | null | undefined) | undefined;
};
type EncodingOption = ObjectEncodingOptions | BufferEncoding | undefined | null;
type StringCallback = (
	err: NodeJS.ErrnoException | null,
	result?: string,
) => void;
type BufferCallback = (
	err: NodeJS.ErrnoException | null,
	result?: Buffer,
) => void;
type StringOrBufferCallback = (
	err: NodeJS.ErrnoException | null,
	result?: string | Buffer,
) => void;
type StatsCallback = (
	err: NodeJS.ErrnoException | null,
	result?: IStats,
) => void;
type BigIntStatsCallback = (
	err: NodeJS.ErrnoException | null,
	result?: IBigIntStats,
) => void;
type StatsOrBigIntStatsCallback = (
	err: NodeJS.ErrnoException | null,
	result?: IStats | IBigIntStats,
) => void;
type ReadJsonCallback = (
	err: NodeJS.ErrnoException | Error | null,
	result?: JsonObject,
) => void;
type IStatsBase<T> = {
	/**
	 * is file
	 */
	isFile: () => boolean;
	/**
	 * is directory
	 */
	isDirectory: () => boolean;
	/**
	 * is block device
	 */
	isBlockDevice: () => boolean;
	/**
	 * is character device
	 */
	isCharacterDevice: () => boolean;
	/**
	 * is symbolic link
	 */
	isSymbolicLink: () => boolean;
	/**
	 * is FIFO
	 */
	isFIFO: () => boolean;
	/**
	 * is socket
	 */
	isSocket: () => boolean;
	/**
	 * dev
	 */
	dev: T;
	/**
	 * ino
	 */
	ino: T;
	/**
	 * mode
	 */
	mode: T;
	/**
	 * nlink
	 */
	nlink: T;
	/**
	 * uid
	 */
	uid: T;
	/**
	 * gid
	 */
	gid: T;
	/**
	 * rdev
	 */
	rdev: T;
	/**
	 * size
	 */
	size: T;
	/**
	 * blksize
	 */
	blksize: T;
	/**
	 * blocks
	 */
	blocks: T;
	/**
	 * atime ms
	 */
	atimeMs: T;
	/**
	 * mtime ms
	 */
	mtimeMs: T;
	/**
	 * ctime ms
	 */
	ctimeMs: T;
	/**
	 * birthtime ms
	 */
	birthtimeMs: T;
	/**
	 * atime
	 */
	atime: Date;
	/**
	 * mtime
	 */
	mtime: Date;
	/**
	 * ctime
	 */
	ctime: Date;
	/**
	 * birthtime
	 */
	birthtime: Date;
};
type IStats = IStatsBase<number>;
type IBigIntStats = IStatsBase<bigint> & {
	atimeNs: bigint;
	mtimeNs: bigint;
	ctimeNs: bigint;
	birthtimeNs: bigint;
};
type Dirent<T extends string | Buffer = string> = {
	/**
	 * true when is file, otherwise false
	 */
	isFile: () => boolean;
	/**
	 * true when is directory, otherwise false
	 */
	isDirectory: () => boolean;
	/**
	 * true when is block device, otherwise false
	 */
	isBlockDevice: () => boolean;
	/**
	 * true when is character device, otherwise false
	 */
	isCharacterDevice: () => boolean;
	/**
	 * true when is symbolic link, otherwise false
	 */
	isSymbolicLink: () => boolean;
	/**
	 * true when is FIFO, otherwise false
	 */
	isFIFO: () => boolean;
	/**
	 * true when is socket, otherwise false
	 */
	isSocket: () => boolean;
	/**
	 * name
	 */
	name: T;
	/**
	 * path
	 */
	parentPath: string;
	/**
	 * path
	 */
	path?: string | undefined;
};
type StatOptions = {
	/**
	 * need bigint values
	 */
	bigint?: (boolean | undefined) | undefined;
};
type StatSyncOptions = {
	/**
	 * need bigint values
	 */
	bigint?: (boolean | undefined) | undefined;
	/**
	 * throw if no entry
	 */
	throwIfNoEntry?: (boolean | undefined) | undefined;
};
type ReadFile = {
	(
		path: PathOrFileDescriptor,
		options:
			| ({
					encoding?: null | undefined;
					flag?: string | undefined;
			  } & import("events").Abortable)
			| undefined
			| null,
		callback: BufferCallback,
	): void;
	(
		path: PathOrFileDescriptor,
		options:
			| ({
					encoding: BufferEncoding;
					flag?: string | undefined;
			  } & import("events").Abortable)
			| BufferEncoding,
		callback: StringCallback,
	): void;
	(
		path: PathOrFileDescriptor,
		options:
			| (ObjectEncodingOptions & {
					flag?: string | undefined;
			  } & import("events").Abortable)
			| BufferEncoding
			| undefined
			| null,
		callback: StringOrBufferCallback,
	): void;
	(path: PathOrFileDescriptor, callback: BufferCallback): void;
};
type BufferEncodingOption =
	| "buffer"
	| {
			encoding: "buffer";
	  };
type ReadFileSync = {
	(
		path: PathOrFileDescriptor,
		options?: {
			encoding?: null | undefined;
			flag?: string | undefined;
		} | null,
	): Buffer;
	(
		path: PathOrFileDescriptor,
		options:
			| {
					encoding: BufferEncoding;
					flag?: string | undefined;
			  }
			| BufferEncoding,
	): string;
	(
		path: PathOrFileDescriptor,
		options: ObjectEncodingOptions & {
			flag?: string | undefined;
		},
	): string | Buffer;
};
type Readdir = {
	(
		path: PathLike,
		options:
			| {
					encoding: BufferEncoding | null;
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  }
			| BufferEncoding
			| undefined
			| null,
		callback: (err: NodeJS.ErrnoException | null, files?: string[]) => void,
	): void;
	(
		path: PathLike,
		options:
			| {
					encoding: "buffer";
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  }
			| "buffer",
		callback: (err: NodeJS.ErrnoException | null, files?: Buffer[]) => void,
	): void;
	(
		path: PathLike,
		options:
			| (ObjectEncodingOptions & {
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  })
			| BufferEncoding
			| undefined
			| null,
		callback: (
			err: NodeJS.ErrnoException | null,
			files?: string[] | Buffer[],
		) => void,
	): void;
	(
		path: PathLike,
		callback: (err: NodeJS.ErrnoException | null, files?: string[]) => void,
	): void;
	(
		path: PathLike,
		options: ObjectEncodingOptions & {
			withFileTypes: true;
			recursive?: boolean | undefined;
		},
		callback: (
			err: NodeJS.ErrnoException | null,
			files?: Dirent<string>[],
		) => void,
	): void;
	(
		path: PathLike,
		options: {
			encoding: "buffer";
			withFileTypes: true;
			recursive?: boolean | undefined;
		},
		callback: (
			err: NodeJS.ErrnoException | null,
			files: Dirent<Buffer>[],
		) => void,
	): void;
};
type ReaddirSync = {
	(
		path: PathLike,
		options?:
			| {
					encoding: BufferEncoding | null;
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  }
			| BufferEncoding
			| null,
	): string[];
	(
		path: PathLike,
		options:
			| {
					encoding: "buffer";
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  }
			| "buffer",
	): Buffer[];
	(
		path: PathLike,
		options?:
			| (ObjectEncodingOptions & {
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  })
			| BufferEncoding
			| null,
	): string[] | Buffer[];
	(
		path: PathLike,
		options: ObjectEncodingOptions & {
			withFileTypes: true;
			recursive?: boolean | undefined;
		},
	): Dirent[];
	(
		path: PathLike,
		options: {
			encoding: "buffer";
			withFileTypes: true;
			recursive?: boolean | undefined;
		},
	): Dirent<Buffer>[];
};
type ReadJson = (
	pathOrFileDescription: PathOrFileDescriptor,
	callback: ReadJsonCallback,
) => void;
type ReadJsonSync = (pathOrFileDescription: PathOrFileDescriptor) => JsonObject;
type Readlink = {
	(path: PathLike, options: EncodingOption, callback: StringCallback): void;
	(
		path: PathLike,
		options: BufferEncodingOption,
		callback: BufferCallback,
	): void;
	(
		path: PathLike,
		options: EncodingOption,
		callback: StringOrBufferCallback,
	): void;
	(path: PathLike, callback: StringCallback): void;
};
type ReadlinkSync = {
	(path: PathLike, options?: EncodingOption): string;
	(path: PathLike, options: BufferEncodingOption): Buffer;
	(path: PathLike, options?: EncodingOption): string | Buffer;
};
type LStat = {
	(path: PathLike, callback: StatsCallback): void;
	(
		path: PathLike,
		options:
			| (StatOptions & {
					bigint?: false | undefined;
			  })
			| undefined,
		callback: StatsCallback,
	): void;
	(
		path: PathLike,
		options: StatOptions & {
			bigint: true;
		},
		callback: BigIntStatsCallback,
	): void;
	(
		path: PathLike,
		options: StatOptions | undefined,
		callback: StatsOrBigIntStatsCallback,
	): void;
};
type LStatSync = {
	(path: PathLike, options?: undefined): IStats;
	(
		path: PathLike,
		options?: StatSyncOptions & {
			bigint?: false | undefined;
			throwIfNoEntry: false;
		},
	): IStats | undefined;
	(
		path: PathLike,
		options: StatSyncOptions & {
			bigint: true;
			throwIfNoEntry: false;
		},
	): IBigIntStats | undefined;
	(
		path: PathLike,
		options?: StatSyncOptions & {
			bigint?: false | undefined;
			throwIfNoEntry?: true | undefined;
		},
	): IStats;
	(
		path: PathLike,
		options: StatSyncOptions & {
			bigint: true;
			throwIfNoEntry?: true | undefined;
		},
	): IBigIntStats;
	(
		path: PathLike,
		options: StatSyncOptions & {
			bigint: boolean;
			throwIfNoEntry?: undefined;
		},
	): IStats | IBigIntStats;
	(
		path: PathLike,
		options?: StatSyncOptions,
	): IStats | IBigIntStats | undefined;
};
type Stat = {
	(path: PathLike, callback: StatsCallback): void;
	(
		path: PathLike,
		options:
			| (StatOptions & {
					bigint?: false | undefined;
			  })
			| undefined,
		callback: StatsCallback,
	): void;
	(
		path: PathLike,
		options: StatOptions & {
			bigint: true;
		},
		callback: BigIntStatsCallback,
	): void;
	(
		path: PathLike,
		options: StatOptions | undefined,
		callback: StatsOrBigIntStatsCallback,
	): void;
};
type StatSync = {
	(path: PathLike, options?: undefined): IStats;
	(
		path: PathLike,
		options?: StatSyncOptions & {
			bigint?: false | undefined;
			throwIfNoEntry: false;
		},
	): IStats | undefined;
	(
		path: PathLike,
		options: StatSyncOptions & {
			bigint: true;
			throwIfNoEntry: false;
		},
	): IBigIntStats | undefined;
	(
		path: PathLike,
		options?: StatSyncOptions & {
			bigint?: false | undefined;
			throwIfNoEntry?: true | undefined;
		},
	): IStats;
	(
		path: PathLike,
		options: StatSyncOptions & {
			bigint: true;
			throwIfNoEntry?: true | undefined;
		},
	): IBigIntStats;
	(
		path: PathLike,
		options: StatSyncOptions & {
			bigint: boolean;
			throwIfNoEntry?: undefined;
		},
	): IStats | IBigIntStats;
	(
		path: PathLike,
		options?: StatSyncOptions,
	): IStats | IBigIntStats | undefined;
};
type RealPath = {
	(path: PathLike, options: EncodingOption, callback: StringCallback): void;
	(
		path: PathLike,
		options: BufferEncodingOption,
		callback: BufferCallback,
	): void;
	(
		path: PathLike,
		options: EncodingOption,
		callback: StringOrBufferCallback,
	): void;
	(path: PathLike, callback: StringCallback): void;
};
type RealPathSync = {
	(path: PathLike, options?: EncodingOption): string;
	(path: PathLike, options: BufferEncodingOption): Buffer;
	(path: PathLike, options?: EncodingOption): string | Buffer;
};
type FileSystem = {
	/**
	 * read file method
	 */
	readFile: ReadFile;
	/**
	 * readdir method
	 */
	readdir: Readdir;
	/**
	 * read json method
	 */
	readJson?: ReadJson | undefined;
	/**
	 * read link method
	 */
	readlink: Readlink;
	/**
	 * lstat method
	 */
	lstat?: LStat | undefined;
	/**
	 * stat method
	 */
	stat: Stat;
	/**
	 * realpath method
	 */
	realpath?: RealPath | undefined;
};
type SyncFileSystem = {
	/**
	 * read file sync method
	 */
	readFileSync: ReadFileSync;
	/**
	 * read dir sync method
	 */
	readdirSync: ReaddirSync;
	/**
	 * read json sync method
	 */
	readJsonSync?: ReadJsonSync | undefined;
	/**
	 * read link sync method
	 */
	readlinkSync: ReadlinkSync;
	/**
	 * lstat sync method
	 */
	lstatSync?: LStatSync | undefined;
	/**
	 * stat sync method
	 */
	statSync: StatSync;
	/**
	 * real path sync method
	 */
	realpathSync?: RealPathSync | undefined;
};
type ParsedIdentifier = {
	/**
	 * request
	 */
	request: string;
	/**
	 * query
	 */
	query: string;
	/**
	 * fragment
	 */
	fragment: string;
	/**
	 * is directory
	 */
	directory: boolean;
	/**
	 * is module
	 */
	module: boolean;
	/**
	 * is file
	 */
	file: boolean;
	/**
	 * is internal
	 */
	internal: boolean;
};
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
type JsonObject = { [Key in string]?: JsonValue | undefined };
type TsconfigPathsMap = {
	/**
	 * main tsconfig paths data
	 */
	main: TsconfigPathsData;
	/**
	 * main tsconfig base URL (absolute path)
	 */
	mainContext: string;
	/**
	 * referenced tsconfig paths data mapped by baseUrl
	 */
	refs: {
		[baseUrl: string]: TsconfigPathsData;
	};
	/**
	 * all contexts (main + refs) for quick lookup
	 */
	allContexts: {
		[context: string]: TsconfigPathsData;
	};
	/**
	 * precomputed `Object.keys(allContexts)` — read-only; used on the `_selectPathsDataForContext` hot path
	 */
	contextList: string[];
	/**
	 * file dependencies
	 */
	fileDependencies: Set<string>;
};
type TsconfigPathsData = {
	/**
	 * tsconfig file data
	 */
	alias: import("./AliasUtils").CompiledAliasOptions;
	/**
	 * tsconfig file data
	 */
	modules: string[];
};
type BaseResolveRequest = {
	/**
	 * path
	 */
	path: string | false;
	/**
	 * content
	 */
	context?: Context | undefined;
	/**
	 * description file path
	 */
	descriptionFilePath?: string | undefined;
	/**
	 * description file root
	 */
	descriptionFileRoot?: string | undefined;
	/**
	 * description file data
	 */
	descriptionFileData?: JsonObject | undefined;
	/**
	 * tsconfig paths map
	 */
	tsconfigPathsMap?: (TsconfigPathsMap | null | undefined) | undefined;
	/**
	 * relative path
	 */
	relativePath?: string | undefined;
	/**
	 * true when need to ignore symlinks, otherwise false
	 */
	ignoreSymlinks?: boolean | undefined;
	/**
	 * true when full specified, otherwise false
	 */
	fullySpecified?: boolean | undefined;
	/**
	 * package id the request was resolved to in the package map, to be propagated to resolutions made from the resulting file (`@experimental`, see the `packageMap` option)
	 */
	packageId?: string | undefined;
	/**
	 * inner request for internal usage
	 */
	__innerRequest?: string | undefined;
	/**
	 * inner request for internal usage
	 */
	__innerRequest_request?: string | undefined;
	/**
	 * inner relative path for internal usage
	 */
	__innerRequest_relativePath?: string | undefined;
	/**
	 * internal: shared marker `RestrictionsPlugin` flips when it filters out an existing target, letting `ExportsFieldPlugin` fall back instead of erroring
	 */
	__restrictionsMarker?:
		| {
				blocked: boolean;
		  }
		| undefined;
};
type ResolveRequest = BaseResolveRequest & Partial<ParsedIdentifier>;
type WriteOnlySet<T> = {
	add: (item: T) => void;
};
type ResolveContextYield = (request: ResolveRequest) => void;
import { AsyncSeriesBailHook } from "tapable";
import { SyncHook } from "tapable";
import { AsyncSeriesHook } from "tapable";
