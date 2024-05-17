---
'@lion/nodejs-helpers': minor
---

Update underlying code-formatter prettier to major version 3 and updated the prettify API accordingly.

Consumers of this package need to make sure to await any calls to `prettify` as the function now returns a promise.
