---
'@lion/form-core': patch
---

Add a separate protected method for the filter function when filtering out fields for serialized|model|formattedValue in form groups. This makes it easier to specify when you to filter out fields, e.g. disabled fields for serializedValue of a parent form group.
