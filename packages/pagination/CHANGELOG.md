# Change Log

## 0.2.11

### Patch Changes

- 8fb7e7a1: Fix type issues where base constructors would not have the same return type. This allows us to remove a LOT of @ts-expect-errors/@ts-ignores across lion.
- 9112d243: Fix missing types and update to latest scoped elements to fix constructor type.
- Updated dependencies [8fb7e7a1]
- Updated dependencies [9112d243]
  - @lion/core@0.13.8
  - @lion/localize@0.15.5

## 0.2.10

### Patch Changes

- 98f1bb7e: Ensure all lit imports are imported from @lion/core. Remove devDependencies in all subpackages and move to root package.json. Add demo dependencies as real dependencies for users that extend our docs/demos.
- Updated dependencies [a8cf4215]
- Updated dependencies [98f1bb7e]
  - @lion/localize@0.15.4
  - @lion/core@0.13.7

## 0.2.9

### Patch Changes

- Updated dependencies [9fba9007]
  - @lion/core@0.13.6
  - @lion/localize@0.15.3

## 0.2.8

### Patch Changes

- Updated dependencies [41edf033]
  - @lion/core@0.13.5
  - @lion/localize@0.15.2

## 0.2.7

### Patch Changes

- @lion/localize@0.15.1

## 0.2.6

### Patch Changes

- Updated dependencies [3ada1aef]
  - @lion/localize@0.15.0

## 0.2.5

### Patch Changes

- b222fd78: Always use CSSResultArray for styles getters and be consistent. This makes typing for subclassers significantly easier. Also added some fixes for missing types in mixins where the superclass was not typed properly. This highlighted some issues with incomplete mixin contracts

## 0.2.4

### Patch Changes

- cfbcccb5: Fix type imports to reuse lion where possible, in case Lit updates with new types that may break us.
- Updated dependencies [cfbcccb5]
  - @lion/core@0.13.4
  - @lion/localize@0.14.9

## 0.2.3

### Patch Changes

- Updated dependencies [e2e4deec]
- Updated dependencies [8ca71b8f]
  - @lion/core@0.13.3
  - @lion/localize@0.14.8

## 0.2.2

### Patch Changes

- Updated dependencies [20ba0ca8]
- Updated dependencies [618f2698]
  - @lion/core@0.13.2
  - @lion/localize@0.14.7

## 0.2.1

### Patch Changes

- Updated dependencies [7682e520]
- Updated dependencies [e92b98a4]
  - @lion/localize@0.14.6
  - @lion/core@0.13.1

## 0.2.0

### Minor Changes

- 0ed995ad: Add types for pagination package.

### Patch Changes

- bcc809b6: fix(pagination): extract nav list template to reuse in derived component
- Updated dependencies [01a798e5]
- Updated dependencies [b9327627]
  - @lion/core@0.13.0
  - @lion/localize@0.14.5

## 0.1.2

### Patch Changes

- Updated dependencies [75107a4b]
  - @lion/core@0.12.0
  - @lion/localize@0.14.4

## 0.1.1

### Patch Changes

- Updated dependencies [874ff483]
  - @lion/core@0.11.0
  - @lion/localize@0.14.3

## 0.1.0

### Minor Changes

- 65f9f26f: Initial version of @lion/pagination
