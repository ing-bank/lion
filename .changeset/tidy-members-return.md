---
'@lion/ui': minor
---

Restore the visibility of private and protected members in the published declarations.

TypeScript 7 no longer emits the JSDoc `@private`/`@protected` modifier for a member that is declared
only by an assignment inside the constructor. Where TS 4.9.5 emitted `private __data;`, TS 7 emitted
`__data;` - so private members became public and untyped ones, and any consumer that does not set
`skipLibCheck` reported `TS7008: Member '...' implicitly has an 'any' type` (74 such errors in a
representative consumer, 0 before).

The affected members are restored by `scripts/types-restore-visibility.js`, which is wired into
`wireit.types` right after `tsc` and re-attaches the modifier from the emitted JSDoc: 64 members in 18
files, byte-for-byte the TS 4.9.5 output (`private x;`, `protected y: T;`). It touches no source and
therefore has no runtime impact - which is what makes it the only route for the members that are Lit
reactive properties, where a class-body field would shadow the accessor Lit installs on the prototype.
The script is a temporary workaround for the TS 7 declaration emit (upstream issue linked in its
header) and can be deleted once that is fixed.

Consumers that type-check the published declarations with `skipLibCheck: false`: 25 errors with the
TS 4.9.5 emit (0 x TS7008) -> 18 errors with TS 7 plus the script (0 x TS7008).

Also: the `*-translations/*` export subpaths now expose `types`, so consumers no longer get TS7016 for
`@lion/ui/<component>-translations/<locale>.js`.
