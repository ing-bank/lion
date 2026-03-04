---
'providence-analytics': patch
---

Fixed memory leaks in AST traversal that prevented garbage collection when processing large codebases. The traversal graph will now be properly released after each file analysis, preventing unbounded memory growth during batch operations.
