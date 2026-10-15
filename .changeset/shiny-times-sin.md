---
'@lion/ui': patch
---

Fix npm installation failures by rebuilding the temporary phone-number fork from
pinned sources and shipping the generated library inside Lion, without a phone
runtime or bundled dependency. Preserve libphonenumber v9.0.41 metadata, including
French Guiana premium-rate numbers. Internal imports need no consumer configuration.
