export type Resolver = import("./Resolver");
export type ResolveRequest = import("./Resolver").ResolveRequest;
export type ResolveStepHook = import("./Resolver").ResolveStepHook;
export type ResolveContext = import("./Resolver").ResolveContext;
export type InnerCallback = (
	err?: null | Error,
	result?: null | ResolveRequest,
) => void;
/**
 * @param {Resolver} resolver resolver
 * @param {string[]} directories directories
 * @param {ResolveStepHook} target target
 * @param {ResolveRequest} request request
 * @param {ResolveContext} resolveContext resolve context
 * @param {InnerCallback} callback callback
 * @returns {void}
 */
export function modulesResolveHandler(
	resolver: Resolver,
	directories: string[],
	target: ResolveStepHook,
	request: ResolveRequest,
	resolveContext: ResolveContext,
	callback: InnerCallback,
): void;
