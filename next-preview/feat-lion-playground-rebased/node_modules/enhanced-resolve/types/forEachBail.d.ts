declare namespace _exports {
	export { ResolveRequest, Iterator };
}
declare function _exports<T, Z>(
	array: T[],
	iterator: Iterator<T, Z>,
	callback: (err?: null | Error, result?: null | Z, i?: number) => void,
): void;
export = _exports;
type ResolveRequest = import("./Resolver").ResolveRequest;
type Iterator<T, Z> = (
	item: T,
	callback: (err?: null | Error, result?: null | Z) => void,
	i: number,
) => void;
