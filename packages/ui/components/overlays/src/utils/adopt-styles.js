/**
 * N.B. this helper now lives in the disclosure-system (the new home of the overlay machinery).
 * This entrypoint stays for backwards compatibility and re-exports the very same module, so the
 * shared `_adoptStyleUtils` object keeps its identity for consumers that spy on it here.
 */
export * from '../../../disclosure-system/src/utils/adopt-styles.js';
