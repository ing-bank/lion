export = ConditionalPlugin;
declare class ConditionalPlugin {
	/**
	 * @param {string | ResolveStepHook} source source
	 * @param {Partial<ResolveRequest>} test compare object
	 * @param {string | null} message log message
	 * @param {boolean} allowAlternatives when false, do not continue with the current step when "test" matches
	 * @param {string | ResolveStepHook} target target
	 */
	constructor(
		source: string | ResolveStepHook,
		test: Partial<ResolveRequest>,
		message: string | null,
		allowAlternatives: boolean,
		target: string | ResolveStepHook,
	);
	source: string | import("./Resolver").ResolveStepHook;
	test: Partial<import("./Resolver").ResolveRequest>;
	message: string | null;
	allowAlternatives: boolean;
	target: string | import("./Resolver").ResolveStepHook;
	/**
	 * @param {Resolver} resolver the resolver
	 * @returns {void}
	 */
	apply(resolver: Resolver): void;
}
declare namespace ConditionalPlugin {
	export { Resolver, ResolveRequest, ResolveStepHook };
}
type Resolver = import("./Resolver");
type ResolveRequest = import("./Resolver").ResolveRequest;
type ResolveStepHook = import("./Resolver").ResolveStepHook;
