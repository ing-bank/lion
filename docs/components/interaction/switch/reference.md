# Interaction >> Switch >> Reference ||30

<p class="paragraph--emphasis">Everything you need to re-use the switch.</p>

## WAI-ARIA roles

### Landmarks

1. element: "button"<br>
   role: "switch"

### Screen reader

1. name: “Label”<br>
   role: switch<br>
   state: aria-checked=“true”<br>
   SR: “Label, on, switch"
2. name: “Label”<br>
   role: switch<br>
   state: aria-checked=“false”<br>
   SR: “Label, off, switch”

## Keyboard interactions

| <kbd>Key</kbd>      | Action                                                                                            |
| :------------------ | :------------------------------------------------------------------------------------------------ |
| <kbd>Enter</kbd>    | On keyboard focus, pressing <kbd>Enter</kbd> changes the state of the switch to “On” or “Off”.    |
| <kbd>Spacebar</kbd> | On keyboard focus, pressing <kbd>Spacebar</kbd> changes the state of the switch to “On” or “Off”. |

## Requirements

This component fulfils the following requirements:

1. The component clearly communicates what is it for.
2. The component supports helper text.
3. The component supports smart defaults.
4. The component supports the following states: on, off, hover (Web only), focused, disabled, pressed and processing
5. The transformation between ON and OFF states are enhanced by an animation.
6. Toggling the switch (on <-> off) will execute the underlying action immediately.
