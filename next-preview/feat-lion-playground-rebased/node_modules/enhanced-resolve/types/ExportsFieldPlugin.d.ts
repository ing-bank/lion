export = ExportsFieldPlugin;
declare class ExportsFieldPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Set<string>} conditionNames condition names
	 * @param {string | string[]} fieldNamePath name path
	 * @param {string | ResolveStepHook} target target
	 * @param {boolean=} restrictions whether `restrictions` are configured (enables exports-target fallback when a target is filtered out)
	 */
	constructor(
		source: string | ResolveStepHook,
		conditionNames: Set<string>,
		fieldNamePath: string | string[],
		target: string | ResolveStepHook,
		restrictions?: boolean | undefined,
	);
	source: string | import("./Resolver").ResolveStepHook;
	target: string | import("./Resolver").ResolveStepHook;
	conditionNames: Set<string>;
	fieldName: string | string[];
	restrictions: boolean;
	/** @type {WeakMap<JsonObject, FieldProcessor | null>} */
	_fieldProcessorCache: WeakMap<JsonObject, FieldProcessor | null>;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace ExportsFieldPlugin {
	export {
		Resolver,
		JsonObject,
		ResolveRequest,
		ResolveStepHook,
		ExportsField,
		FieldProcessor,
	};
}
type Resolver = import("./Resolver");
type JsonObject = import("./Resolver").JsonObject;
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type ExportsField = import("./util/entrypoints").ExportsField;
type FieldProcessor = import("./util/entrypoints").FieldProcessor;
