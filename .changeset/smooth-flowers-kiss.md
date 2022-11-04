---
'singleton-manager': minor
---

Update to use `package exports` with a dedicated `types` entry.
This means the package only supports node 16+ and TS 4.7+ with `moduleResolution: Node16` or `moduleResolution: NodeNext` as described in the [TS 4.7 Announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#package-json-exports-imports-and-self-referencing).
