---
'@lion/select-rich': patch
---

Fix select rich to manually request update for the invoker selected element when it synchronizes, as the modelValue could be changed but would not trigger a change since the old and new value are both referenced from the updated node reference, meaning they will always be the same and never pass the dirty check.
