---
'@lion/ui': minor
---

Restore the visibility of private and protected members in the published declarations.

TypeScript 7 no longer emits the JSDoc `@private`/`@protected` modifier for a member that is declared
only by an assignment inside the constructor. Where TS 4.9.5 emitted `private __data;`, TS 7 emitted
`__data;` - so private members became public and untyped ones, and any consumer that does not set
`skipLibCheck` reported `TS7008: Member '...' implicitly has an 'any' type` (42 such errors in a
representative consumer, 0 before).

The affected members are restored by `scripts/types-restore-visibility.js`, which is wired into
`wireit.types` right after `tsc` and re-attaches the modifier from the emitted JSDoc: the six Lit reactive properties, which cannot take a field
without shadowing the accessor Lit installs (everything else is declared in the sources now), byte-for-byte the
TS 4.9.5 output (`private x;`, `protected y: T;`). It touches no source and
therefore has no runtime impact - which is what makes it the only route for the members that are Lit
reactive properties, where a class-body field would shadow the accessor Lit installs on the prototype.
The script is a temporary workaround for the TS 7 declaration emit (upstream issue linked in its
header) and can be deleted once that is fixed.

Consumers that type-check the published declarations with `skipLibCheck: false`:
**15 errors** with the TS 4.9.5 emit -> **49** with the TS 7 emit before these fixes -> **0** now
(0 x TS7008 in the last two, 42 x before), measured on TS 7 and on TS 4.7.4. Neither a consumer nor
Lion's own build needs the flag any more: it is removed from the root tsconfig, and the one third-party
declaration that required it (`@open-wc/semantic-dom-diff`, pinned to 0.21.0 through an override, which
replaces the patch its 0.20.1 needed) no longer does. The rest of the work was in the declarations: four
member kinds that disagreed across the hand-written Hosts, and a protected member named in a validator
declaration's signature. With that, the hand-written Hosts publish exactly the visibility they did under
TS 4.9.5 - all 21 emitted `types/*.d.ts` files match the 4.9.5 emit member for member.

Also: the `*-translations/*` export subpaths now expose `types`, so consumers no longer get TS7016 for
`@lion/ui/<component>-translations/<locale>.js`.
