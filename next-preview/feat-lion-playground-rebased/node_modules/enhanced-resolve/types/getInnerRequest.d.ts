declare namespace _exports {
	export { Resolver, ResolveRequest };
}
declare function _exports(resolver: Resolver, request: ResolveRequest): string;
export = _exports;
type Resolver = import("./Resolver");
type ResolveRequest = import("./Resolver").ResolveRequest;
