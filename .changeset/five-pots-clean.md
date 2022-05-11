---
'@lion/input-tel': patch
'@lion/validate-messages': patch
---

Add replace Min/MaxLength validator messages with Pattern validator message in PhoneNumber validator, since wrong info (param) was shown. And removed default Validator message for PhoneNumber validator.
