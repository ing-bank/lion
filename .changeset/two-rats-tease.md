---
"@lion/button": minor
---

Several button improvements

- remove click-area --> move styles to host::before
- reduce css so that extending styles makes sense. Merge .btn with host.
- reduce the template and remove the if else construction inside the template.
- hide focus styles if they're not needed, for example, when an element receives focus via the mouse.
- improve __clickDelegationHandler. Use current slotted native button instead of create new one.
- fix vertical alignment when 2 buttons are inline and one has icon. Example included.
