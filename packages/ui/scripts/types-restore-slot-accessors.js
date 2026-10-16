import fs from 'fs';

// TS 4 omitted this redundant override; TS 7 emits it. Intersecting the resulting
// class with SlotHost in a consumer mixin makes TS 4 collapse the two getters into
// a property (TS2611 in subclasses). Inherit the identical SlotHost signature.
const declaration = new URL(
  '../dist-types/components/select-rich/src/LionSelectRich.d.ts',
  import.meta.url,
);
const contents = await fs.promises.readFile(declaration, 'utf8');
const redundantOverride = '    /** @type {SlotsMap} */\n    get slots(): SlotsMap;';
if (contents.includes('get slots()') && !contents.includes(redundantOverride)) {
  throw new Error('Unexpected LionSelectRich slots declaration; review accessor normalization');
}
await fs.promises.writeFile(declaration, contents.replace(redundantOverride, '\n'), 'utf8');
