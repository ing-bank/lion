# Guidelines definitions and terms

```js script
export default {
  title: 'Guidelines/Definitions',
};
```

Below you will find a list of definitions and terms that will be used throughout our code
documentation.

## Application Developer

Developers consuming our web components inside an application (not extending them).
Application Developers are only allowed to interact with `public` properties and methods.
Can be abbreviated as `AD`. Sometimes also called `Consuming Developer`.

## Subclasser

Developers extending our web components. For instance: `class MaterialInput extends LionInput`.
Subclassers have access to protected methods (prefixed with an underscore or marked as protected),
but not to private methods.

## public

Methods and properties are public when they are not prefixed by an underscore.
They can be used by Application Developers.

```js
class SoccerPlayer {
  kickBall() {
    // Soccer player can kick a ball
  }
}
```

## protected

Methods and properties are protected when they contain one underscore or are explicitly marked as
protected in the code.
They can be used by Subclassers.

```js
class SoccerPlayer {
  _catchBall() {
    // Soccer player usually do not need to catch a ball (with it's hands)
  }
}
```

## private

Methods and properties are protected when they contain two underscores or are explicitly marked as
private in the code.
They can be only used within the class where they are defined (developers of Lion components).

```js
class SoccerPlayer {
  __score() {
    // internally save how many goals have been made
  }
}
```
