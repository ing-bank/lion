# Change Log

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
