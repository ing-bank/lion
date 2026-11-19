export = PnpPlugin;
declare class PnpPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {PnpApiImpl} pnpApi pnpApi
	 * @param {string | ResolveStepHook} target target
	 * @param {string | ResolveStepHook} alternateTarget alternateTarget
	 */
	constructor(
		source: string | ResolveStepHook,
		pnpApi: PnpApiImpl,
		target: string | ResolveStepHook,
		alternateTarget: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	pnpApi: PnpApiImpl;
	target: string | import("./Resolver").ResolveStepHook;
	alternateTarget: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace PnpPlugin {
	export { Resolver, ResolveStepHook, ResolveRequest, PnpApiImpl };
}
type Resolver = import("./Resolver");
type ResolveStepHook = import("./Resolver").ResolveStepHook;
type ResolveRequest = import("./Resolver").ResolveRequest;
type PnpApiImpl = {
	/**
	 * resolve to unqualified
	 */
	resolveToUnqualified: (
		packageName: string,
		issuer: string,
		options: {
			considerBuiltins: boolean;
		},
	) => string | null;
};
