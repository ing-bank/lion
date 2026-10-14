/**
 * Merge freshly computed entries into the previous state. Only `components` are updated
 * (all when omitted); others keep their previous entry.
 */
export function selectRecordedEntries(next, previous, components, verifiedAt) {
  if (!components) {
    return Object.fromEntries(
      Object.entries(next).map(([name, entry]) => [name, { ...entry, verifiedAt }]),
    );
  }
  const selected = new Set(components);
  for (const name of selected) {
    if (!next[name]) throw new Error(`Unknown mapping: ${name}`);
  }
  return Object.fromEntries(
    Object.entries(next).flatMap(([name, entry]) => {
      if (selected.has(name)) return [[name, { ...entry, verifiedAt }]];
      return previous[name] ? [[name, previous[name]]] : [];
    }),
  );
}

/** 0 when clean (or recording), 1 when anything is stale. */
export function getExitCode({ stale, record = false }) {
  return record || stale.length === 0 ? 0 : 1;
}
