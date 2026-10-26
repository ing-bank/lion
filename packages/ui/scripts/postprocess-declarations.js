/**
 * TypeScript 7 drops the JSDoc `@private` / `@protected` modifier on a class member that is
 * declared only by an assignment inside the constructor:
 *
 *   class C { constructor() { /** @private *\/ this.__x = 0; } }
 *
 * TS 4.9.5 emitted `private __x;` for that member, TS 7 emits `__x;`. The member therefore
 * becomes public in the published declarations and - because the type is dropped along with the
 * modifier - every consumer that does not set `skipLibCheck` reports
 * `TS7008: Member '__x' implicitly has an 'any' type`.
 *
 * This build-only script normalizes emitted declarations before the consumer checks and packing.
 * The emitted JSDoc keeps the intent, so restoreVisibility re-attaches the modifier TS 7 left off.
 * That workaround is needed until the emit is fixed upstream; see
 * https://github.com/microsoft/TypeScript/issues/64628 (report filed with a minimal repro and
 * the 4.7.4/4.9.5/5.9.3/6.0.3 vs 7.0.2 comparison). Remove only that transform once fixed;
 * the legacy slot-accessor normalization below has a separate purpose.
 *
 * Two guards, both of them found by measurement rather than by reading:
 *  - a single-line `/** @private *\/` block counts too (a multi-line-only matcher silently
 *    skipped 33 of the 65 members);
 *  - only members of a `declare class` are touched. Type members cannot carry a visibility
 *    modifier, and TS 4 did not emit one for them (`FormatMixinTypes.d.ts`'s `formatOn` would
 *    otherwise gain a `protected` that never existed).
 *
 * The script is idempotent.
 */

import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fsGlob } from 'providence-analytics/utils.js';
import url from 'url';

const packageRoot = url.fileURLToPath(new URL('../', import.meta.url));

// class body member: indentation, optional existing modifiers, a name, then the rest of the line
const MEMBER =
  /^( {4})((?:(?:static|readonly|abstract|override|declare) )*)([A-Za-z_$#][\w$]*)( ?(?:[?:;(=].*)?)$/;
const CLASS_OPEN = /^(export )?declare (abstract )?class\b/;
const NON_CLASS_BLOCK =
  /^(export )?(declare )?(interface|type|namespace|module|function|const|let)\b/;

/**
 * The JSDoc block directly above `lines[index]`, single-line blocks included.
 * @param {string[]} lines
 * @param {number} index
 * @returns {string | null}
 */
function jsdocAbove(lines, index) {
  const above = lines[index - 1];
  if (above === undefined) return null;
  const stripped = above.trim();
  if (stripped.startsWith('/**') && stripped.endsWith('*/')) return above;
  if (stripped !== '*/') return null;
  let start = index - 1;
  while (start >= 0 && !lines[start].trim().startsWith('/**')) start -= 1;
  return start < 0 ? null : lines.slice(start, index).join('\n');
}

/**
 * @param {string} contents
 * @returns {{ result: string, restored: number }}
 */
function restoreVisibility(contents) {
  const lines = contents.split('\n');
  /** @type {boolean[]} one flag per nesting level: true while inside a `declare class` body */
  const classDepth = [];
  let inComment = false;
  let restored = 0;

  const result = lines.map((line, index) => {
    // track, per brace level, whether that level is a `declare class` body.
    // Braces inside JSDoc (`@type {{months: Month[]}}`, `/** @type {Date} */`) must not count:
    // they used to corrupt the depth stack and silently skip two thirds of the members.
    /** @type {string} */
    let code = line;
    if (inComment) {
      code = '';
      if (line.includes('*/')) inComment = false;
    } else if (line.includes('/**')) {
      code = '';
      if (!line.includes('*/')) inComment = true;
    }

    const net = (code.match(/{/g) || []).length - (code.match(/}/g) || []).length;
    const level = classDepth.length;
    const isClassBody = level > 0 && classDepth[level - 1] === true;

    let replaced = line;
    if (isClassBody && !/^\s+\*/.test(line)) {
      const match = MEMBER.exec(line);
      const mods = match ? match[2] : '';
      const alreadyHasVisibility = mods.includes('private') || mods.includes('protected');
      if (match && !alreadyHasVisibility) {
        const doc = jsdocAbove(lines, index);
        let visibility = null;
        if (doc && /@private\b/.test(doc)) {
          visibility = 'private';
        } else if (doc && /@protected\b/.test(doc)) {
          visibility = 'protected';
        }
        if (visibility) {
          replaced = `${match[1]}${visibility} ${mods}${match[3]}${match[4]}`;
          restored += 1;
        }
      }
    }

    for (let i = 0; i < -net; i += 1) classDepth.pop();
    for (let i = 0; i < net; i += 1) {
      const opener = line.replace(/{[^{]*$/, '{');
      // only the outermost brace of a `declare class` line marks a class body
      classDepth.push(i === 0 && CLASS_OPEN.test(line) && !NON_CLASS_BLOCK.test(opener));
    }
    return replaced;
  });

  return { result: result.join('\n'), restored };
}

// TS 4 omitted this redundant override; TS 7 emits it. Intersecting the resulting
// class with SlotHost in a consumer mixin makes TS 4 collapse the two getters into
// a property (TS2611 in subclasses). Inherit the identical SlotHost signature.
function restoreSlotAccessor(contents) {
  const redundantOverride = '    /** @type {SlotsMap} */\n    get slots(): SlotsMap;';
  if (contents.includes('get slots()') && !contents.includes(redundantOverride)) {
    throw new Error('Unexpected LionSelectRich slots declaration; review accessor normalization');
  }
  return contents.replace(redundantOverride, '\n');
}

async function main() {
  const fileNames = await fsGlob('dist-types/**/*.d.ts', { cwd: packageRoot });
  let restored = 0;
  let touched = 0;

  // `@private`/`@protected` are .js-only constructs: in a .ts source they are just doc tags and
  // TS 4 never emitted a modifier for them (see FormatMixinTypes.d.ts -> FormatMixinTypes.ts),
  // so declarations coming from TypeScript sources are left alone.
  const hasJsSource = await Promise.all(
    fileNames.map(async fileName => {
      const source = `${packageRoot}${fileName.replace(/^dist-types\//, '').replace(/\.d\.ts$/, '.js')}`;
      try {
        await fs.promises.access(source);
        return true;
      } catch (error) {
        if (error.code === 'ENOENT') return false;
        throw error;
      }
    }),
  );
  const jsSourced = fileNames.filter((fileName, index) => hasJsSource[index]);

  for (const fileName of jsSourced) {
    // eslint-disable-next-line no-await-in-loop
    const contents = await fs.promises.readFile(`${packageRoot}${fileName}`, 'utf-8');
    const { result, restored: n } = restoreVisibility(contents);
    if (n > 0) {
      restored += n;
      touched += 1;
      // eslint-disable-next-line no-await-in-loop
      await fs.promises.writeFile(`${packageRoot}${fileName}`, result, 'utf-8');
      // eslint-disable-next-line no-await-in-loop
      const written = await fs.promises.readFile(`${packageRoot}${fileName}`, 'utf-8');
      if (restoreVisibility(written).restored !== 0) {
        throw new Error(`${fileName} is not idempotent`);
      }
    }
  }

  const declaration = `${packageRoot}dist-types/components/select-rich/src/LionSelectRich.d.ts`;
  const contents = await fs.promises.readFile(declaration, 'utf8');
  const normalized = restoreSlotAccessor(contents);
  if (restoreSlotAccessor(normalized) !== normalized) {
    throw new Error('Slot accessor normalization is not idempotent');
  }
  if (normalized !== contents) {
    await fs.promises.writeFile(declaration, normalized, 'utf8');
  }

  // eslint-disable-next-line no-console
  console.log(`postprocess-declarations: restored ${restored} modifiers in ${touched} files`);
}

await main();
