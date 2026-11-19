export = SyncAsyncFileSystemDecorator;
/**
 * @param {SyncFileSystem} fs file system implementation
 * @constructor
 */
declare function SyncAsyncFileSystemDecorator(fs: SyncFileSystem): void;
declare class SyncAsyncFileSystemDecorator {
	/**
	 * @param {SyncFileSystem} fs file system implementation
	 * @constructor
	 */
	constructor(fs: SyncFileSystem);
	fs: import("./Resolver").SyncFileSystem;
	lstat: import("./Resolver").LStat | undefined;
	lstatSync: import("./Resolver").LStatSync | undefined;
	stat: import("./Resolver").Stat;
	statSync: import("./Resolver").StatSync;
	readdir: import("./Resolver").Readdir;
	readdirSync: import("./Resolver").ReaddirSync;
	readFile: import("./Resolver").ReadFile;
	readFileSync: import("./Resolver").ReadFileSync;
	readlink: import("./Resolver").Readlink;
	readlinkSync: import("./Resolver").ReadlinkSync;
	readJson: import("./Resolver").ReadJson | undefined;
	readJsonSync: import("./Resolver").ReadJsonSync | undefined;
	realpath: import("./Resolver").RealPath | undefined;
	realpathSync: import("./Resolver").RealPathSync | undefined;
}
declare namespace SyncAsyncFileSystemDecorator {
	export {
		FileSystem,
		StringCallback,
		SyncFileSystem,
		SyncOrAsyncFunction,
		ResultOfSyncOrAsyncFunction,
		ObjectEncodingOptions,
		PathOrFileDescriptor,
		ReadFileSyncOptions,
	};
}
type FileSystem = import("./Resolver").FileSystem;
type StringCallback = import("./Resolver").StringCallback;
type SyncFileSystem = import("./Resolver").SyncFileSystem;
type SyncOrAsyncFunction = Function;
type ResultOfSyncOrAsyncFunction = any;
type ObjectEncodingOptions = import("./Resolver").ObjectEncodingOptions;
type PathOrFileDescriptor = import("./Resolver").PathOrFileDescriptor;
/**
 * Every option `readFileSync` accepts, as `readFile` passes it through.
 */
type ReadFileSyncOptions =
	| (ObjectEncodingOptions & {
			flag?: string | undefined;
	  })
	| BufferEncoding
	| null;
