---
'@lion/overlays': minor
---

⚠️ BREAKING CHANGE:

Fixed a few problems with the backdropNode and contentNode where they were not torn down properly.
Simplified the handleBackdrop code to work for both local and global.
Local overlay backdrop can now be animated.
Added more demos and docs for backdrop.

The breaking changes lie in the fact that the backdrop style classes are now prefixed 'local'/'global' respectively, instead of always 'global' and the class name suffixes for the `backdropNode` have changed from `fade-in`/`fade-out` to `animation-in`/`animation-out`, as not all animations are fades.
