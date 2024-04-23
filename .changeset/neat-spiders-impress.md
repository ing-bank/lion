---
'@lion/ui': patch
---

[localize] make use of formatDate locale option to parse the date correctly, which prevents day and month jumping in the input-amount when e.g. en-GB is used on the html tag and en-US is used to format the date.
