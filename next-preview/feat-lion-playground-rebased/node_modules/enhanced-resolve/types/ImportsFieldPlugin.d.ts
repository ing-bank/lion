export = ImportsFieldPlugin;
declare class ImportsFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string>} conditionNames condition names
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} targetFile target file
	 * @param {string | ResolveStepHook} targetPackage target package
	 */
	constructor(
		source: string | ResolveStepHook,
		conditionNames: Set<string>,
		fieldNamePath: string | string[],
		targetFile: string | ResolveStepHook,
		targetPackage: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	targetFile: string | import("./Resolver").ResolveStepHook;
	targetPackage: string | import("./Resolver").ResolveStepHook;
	conditionNames: Set<string>;
	fieldName: string | string[];
	/** @type {WeakMap<JsonObject, FieldProcessor | null>} */
	_fieldProcessorCache: WeakMap<JsonObject, FieldProcessor | null>;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace ImportsFieldPlugin {
	export {
		Resolver,
		JsonObject,
		ResolveRequest,
		ResolveStepHook,
		FieldProcessor,
		ImportsField,
	};
}
type Resolver = import("./Resolver");
type JsonObject = import("./Resolver").JsonObject;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type FieldProcessor = import("./util/entrypoints").FieldProcessor;
type ImportsField = import("./util/entrypoints").ImportsField;
