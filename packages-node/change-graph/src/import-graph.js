import { promises as fs } from 'fs';
import path from 'path';
import { parseSync } from 'oxc-parser';
import { ResolverFactory } from 'oxc-resolver';

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.mjs', '.cjs', '.json'];

async function walkFiles(directory, predicate) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const nested = await Promise.all(
    entries.map(async entry => {
      const filePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return walkFiles(filePath, predicate);
      return predicate(filePath) ? [filePath] : [];
    }),
  );
  return nested.flat();
}

/**
 * Static and string-literal dynamic module requests of a JS/TS source (parsed with oxc).
 * @param {string} filename
 * @param {string} source
 * @returns {string[]}
 */
export function getModuleRequests(filename, source) {
  const { module } = parseSync(filename, source);
  const requests = new Set();
  for (const item of module.staticImports) requests.add(item.moduleRequest.value);
  for (const item of module.staticExports) {
    for (const entry of item.entries)
      if (entry.moduleRequest) requests.add(entry.moduleRequest.value);
  }
  for (const item of module.dynamicImports) {
    const { start, end } = item.moduleRequest;
    const literal = /^(['"`])([^'"`$\\]*)\1$/.exec(source.slice(start, end).trim());
    if (literal) requests.add(literal[2]);
  }
  return [...requests];
}

/**
 * Creates a specifier resolver. `package.json` `imports` aliases, `exports` and package
 * self-references are handled by the resolver itself, so no per-repo alias list is needed.
 * @param {{ extensions?: string[]; conditionNames?: string[]; alias?: Record<string, string[]> }} [options]
 * @returns {(specifier: string, importer: string) => string | null}
 */
export function createResolver({
  extensions = DEFAULT_EXTENSIONS,
  conditionNames = ['import', 'default'],
  alias,
} = {}) {
  const resolver = new ResolverFactory({
    extensions,
    conditionNames,
    mainFields: ['module', 'main'],
    ...(alias ? { alias } : {}),
  });
  return (specifier, importer) => {
    const result = resolver.sync(path.dirname(importer), specifier);
    return result.path ?? null;
  };
}

/**
 * Builds a file -> direct dependencies graph for the files below `root`. Resolution results
 * outside `root` (external packages) or rejected by `includeResolved` are not followed.
 * @param {{
 *   root: string;
 *   include?: (filePath: string) => boolean;
 *   includeResolved?: (filePath: string) => boolean;
 *   resolve?: (specifier: string, importer: string) => string | null;
 *   resolverOptions?: Parameters<typeof createResolver>[0];
 * }} options
 * @returns {Promise<Map<string, Set<string>>>}
 */
export async function buildImportGraph({
  root,
  include = filePath => /\.(?:js|ts)$/.test(filePath),
  includeResolved = include,
  resolve = createResolver(),
  resolverOptions,
}) {
  const resolveSpecifier = resolverOptions ? createResolver(resolverOptions) : resolve;
  const graph = new Map();
  const pending = await walkFiles(root, include);
  while (pending.length) {
    const filePath = pending.pop();
    if (!graph.has(filePath)) {
      const dependencies = new Set();
      graph.set(filePath, dependencies);
      const source = await fs.readFile(filePath, 'utf8');
      for (const request of getModuleRequests(filePath, source)) {
        const resolved = resolveSpecifier(request, filePath);
        if (
          resolved &&
          resolved.startsWith(`${root}${path.sep}`) &&
          !resolved.includes(`${path.sep}node_modules${path.sep}`) &&
          includeResolved(resolved)
        ) {
          dependencies.add(resolved);
          pending.push(resolved);
        }
      }
    }
  }
  return graph;
}
