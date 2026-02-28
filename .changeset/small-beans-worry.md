---
'providence-analytics': patch
---

Fixed AST fragment extraction to support identifiers in nested scopes. The analyzer now properly traverses the full AST to find variable declarations not located in the root scope, improving type safety with proper `ParsedAst` type definitions and adding validation for AST generation failures.
