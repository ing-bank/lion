/* eslint-disable */

// a direct named import
import { RefClass } from 'exporting-ref-project/ref-src/core.js';

// a direct default import
import refConst from 'exporting-ref-project/ref-src/core.js';

// should not be found
import { nonMatched } from 'unknown-project/xyz.js';

/**
 * Examples below should be resolved to the proper filepath (filename + extension)
 * (direct or indirect is not relevant in this case, it is about the source and not the
 * specifier)
 */

// Two things:
// - a file with side effects
// - should resolve "as file", to 'exporting-ref-project/ref-component.js'
import 'exporting-ref-project/ref-component';

// - should resolve "as folder", to 'exporting-ref-project/ref-src/folder/index.js'
import { resolvePathCorrect } from 'exporting-ref-project/ref-src/folder';

// should match all exportSpecifiers from 'exporting-ref-project/ref-src/core.js'
import * as all from 'exporting-ref-project/ref-src/core.js';
