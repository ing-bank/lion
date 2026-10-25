/**
 * @template T
 * @param {Map<T, Iterable<T>>} graph
 * @param {T} entry
 * @returns {Set<T>}
 */
export function collectReachable(graph, entry) {
  /** @type {Set<T>} */
  const reached = new Set();
  /** @type {T[]} */
  const pending = [entry];
  while (pending.length) {
    const current = /** @type {T} */ (pending.pop());
    if (!reached.has(current)) {
      reached.add(current);
      pending.push(...(graph.get(current) ?? []));
    }
  }
  return reached;
}

/**
 * Inverts a dependency graph: for every file, which files depend on it (directly).
 * @template T
 * @param {Map<T, Iterable<T>>} graph
 */
export function invertGraph(graph) {
  const inverted = new Map();
  for (const [file, dependencies] of graph) {
    if (!inverted.has(file)) inverted.set(file, new Set());
    for (const dependency of dependencies) {
      const dependents = inverted.get(dependency) ?? new Set();
      dependents.add(file);
      inverted.set(dependency, dependents);
    }
  }
  return inverted;
}

/**
 * Maps every unit (e.g. component) to the files it can reach.
 * @param {Map<string, Iterable<string>>} graph
 * @param {(filePath: string) => string | null} unitOf returns the unit a file belongs to
 * @returns {Map<string, Set<string>>}
 */
export function collectUnitFiles(graph, unitOf) {
  const units = new Map();
  for (const filePath of graph.keys()) {
    const unit = unitOf(filePath);
    if (unit) {
      const files = units.get(unit) ?? new Set();
      for (const reachable of collectReachable(graph, filePath)) files.add(reachable);
      units.set(unit, files);
    }
  }
  return units;
}

/**
 * Units that can reach any of the changed files.
 * @param {Map<string, Set<string>>} unitFiles
 * @param {Iterable<string>} changedFiles
 */
export function findAffectedUnits(unitFiles, changedFiles) {
  const changed = new Set(changedFiles);
  return [...unitFiles]
    .filter(([, files]) => [...files].some(file => changed.has(file)))
    .map(([unit]) => unit);
}
