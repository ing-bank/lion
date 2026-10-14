/**
 * Generic reference tree over declaration nodes (e.g. CSS custom properties).
 *
 * A graph is `Map<property, node[]>` where a node is `{ selector, property, value, source }`.
 * Which values reference other properties is supplied via `getReferences`, and which nodes
 * apply to a given scope (theme, surface, ...) via `accept`.
 *
 * @typedef {{ selector: string; property: string; value: string; source: string }} DeclarationNode
 * @typedef {Map<string, DeclarationNode[]>} DeclarationGraph
 */

/**
 * Node for (selector, property) plus everything it transitively references.
 * @param {DeclarationGraph} graph
 * @param {string} property
 * @param {string} selector
 * @param {{ getReferences: (value: string) => string[] }} options
 * @param {Set<string>} [visited]
 * @returns {DeclarationNode[]}
 */
export function resolveReferenceTrace(graph, property, selector, options, visited = new Set()) {
  const key = `${selector}\n${property}`;
  if (visited.has(key)) return [];
  visited.add(key);
  const node = (graph.get(property) ?? []).find(candidate => candidate.selector === selector);
  if (!node) return [];
  const output = [node];
  for (const reference of options.getReferences(node.value)) {
    for (const target of graph.get(reference) ?? []) {
      output.push(...resolveReferenceTrace(graph, reference, target.selector, options, visited));
    }
  }
  return output;
}

/**
 * Whether any property reachable from the seeds satisfies `predicate`.
 * @param {DeclarationGraph} graph
 * @param {string[]} seeds
 * @param {{ getReferences: (value: string) => string[]; predicate: (property: string) => boolean }} options
 */
export function reachesProperty(graph, seeds, { getReferences, predicate }) {
  const pending = [...seeds];
  const visited = new Set();
  while (pending.length) {
    const property = pending.pop();
    if (!visited.has(property)) {
      visited.add(property);
      if (predicate(property)) return true;
      for (const node of graph.get(property) ?? []) pending.push(...getReferences(node.value));
    }
  }
  return false;
}

/**
 * Every declaration (with its resolved value) in the reference tree of the seeds, per scope.
 * Output is sorted and key-stable so it can be hashed.
 *
 * @param {{
 *   graph: DeclarationGraph;
 *   seeds: { property: string; scope: Record<string, string> }[];
 *   getReferences: (value: string) => string[];
 *   accept: (node: DeclarationNode, scope: Record<string, string>) => boolean;
 * }} options
 */
export function collectReferenceInputs({ graph, seeds, getReferences, accept }) {
  const selected = new Map();
  const pending = [...seeds];
  while (pending.length) {
    const { property, scope } = pending.pop();
    for (const node of graph.get(property) ?? []) {
      if (accept(node, scope)) {
        const key = `${Object.values(scope).join('\n')}\n${node.source}\n${node.selector}\n${
          node.property
        }`;
        if (!selected.has(key)) {
          selected.set(key, {
            ...scope,
            source: node.source,
            selector: node.selector,
            property,
            value: node.value,
          });
          for (const reference of getReferences(node.value)) {
            pending.push({ property: reference, scope });
          }
        }
      }
    }
  }
  const sortKey = input => {
    const { source, selector, property, value, ...scope } = input;
    return `${Object.values(scope).join('\n')}\n${selector}\n${property}\n${source}`;
  };
  return [...selected.values()].sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}
