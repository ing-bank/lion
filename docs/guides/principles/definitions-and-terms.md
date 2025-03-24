# Principles >> Definitions and Terms ||20

Below you will find a list of definitions and terms that will be used throughout our code
documentation.

## Public

Methods and properties are public when they are not prefixed by an underscore.
They can be used by Application Developers.

```js
class SoccerPlayer {
  kickBall() {
    // Soccer player can kick a ball
  }
}
```

## Protected

Methods and properties are protected when they contain one underscore or are explicitly marked as protected in the code. They can be used by Subclassers.

```js
class SoccerPlayer {
  _catchBall() {
    // Soccer player usually does not need to catch a ball (with their hands)
  }
}
```

## Private

Methods and properties are private when they contain two underscores or are explicitly marked as private in the code. They can be only used within the class where they are defined (developers of Lion components).

```js
class SoccerPlayer {
  __score() {
    // internally save how many goals have been made
  }
}
```
