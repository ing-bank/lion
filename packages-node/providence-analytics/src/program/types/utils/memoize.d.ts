export type MemoizeFunction<T> = (fn: T, storage?: object) => T;
