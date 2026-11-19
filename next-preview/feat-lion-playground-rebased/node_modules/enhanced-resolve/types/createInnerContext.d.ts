declare namespace _exports {
	export { ResolveContext };
}
declare function _exports(
	parent: ResolveContext,
	stack: ResolveContext["stack"],
	message: null | string,
): ResolveContext;
export = _exports;
type ResolveContext = import("./Resolver").ResolveContext;
