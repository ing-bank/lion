---
'@lion/form-core': patch
---

Make sure form elements are added in the correct order even when non-form elements are in between.

```html
<lion-form>
  <lion-input></lion-input>
  <some-separator></some-separator>
  <!-- inserting something here should result in the correct formElements order -->
  <div role="group">
    <lion-input></lion-input>
    <!-- inserting something here should result in the correct formElements order -->
  </div>
</lion-form>
```
