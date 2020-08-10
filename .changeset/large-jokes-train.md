---
'@lion/form-core': patch
---

Add index.d.ts file so that its types can be used across lion. Add package root index.js to TSC build config exclude filter to prevent TSC from erroring on already existing type definition files.
