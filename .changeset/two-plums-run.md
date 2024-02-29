---
'@lion/ajax': major
---

BREAKING: Only add XSRF token on mutable requests and on same origin or whitelisted origins

Previously the XSRF token was added to any call to any origin.  
This is changed to only attach the token to requests that are POST/PUT/PATCH/DELETE.  
And another change is that it will validate if the request origin is the same as current origin or when the origin is in the xsrfTrustedOrigins.

This is a fix for a vulnerability found, as we inadvertently revealed the confidential XSRF-TOKEN stored in cookies by including it in the HTTP header X-XSRF-TOKEN for every request made to any host allowing attackers to view sensitive information.
