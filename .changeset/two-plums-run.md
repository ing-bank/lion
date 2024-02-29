---
'@lion/ajax': major
---

BREAKING: Only add XSRF token on mutable requests and on same origin or whitelisted origins

Previously the XSRF token was added to any call to any origin.
This is changed in two ways.  
(1) The token is now only attached to requests that are POST/PUT/PATCH/DELETE.
(2) It will validate if the request origin is the same as current origin or when the origin is in the xsrfTrustedOrigins.

This is a fix for a vulnerability: we inadvertently revealed the confidential XSRF-TOKEN stored in cookies by including it in the HTTP header X-XSRF-TOKEN for every request made to any host. This allowed attackers to view sensitive information.
