---
'@lion/ajax': patch
---

fetchJSON will try to parse Response body as JSON if the content-type headers are missing, in this case it will assume JSON.
