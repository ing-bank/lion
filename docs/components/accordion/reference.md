# Accordion >> Reference ||30

<p class="lion-paragraph--emphasis">Everything you need to re-use the accordion.</p>

## Requirements

This component fulfils the following requirements:

1. An Accordion lets you toggle the visibility of content for a specific section
2. An Accordion contains a visual indicator/icon as an affordance to toggle the visibility of the content
3. Every section consists of a section title (always visible) and section content (visible when expanded)
4. The individual sections (title + content) are clearly grouped
5. Multiple sections can be expanded at the same time
6. The section heading (title + visual indicator) is used as the interaction trigger
7. An Accordion does not reposition the page when content drops out of the viewport when expanding a section (no auto scrolling)

## Rationale

### Contents are not focusable

Focusable elements should be interactive. Contents themselves do not offer any interactivity.
If there is a button or a form inside the tab panel then these elements get focused directly.

## Keyboard interactions

| <kbd>Key</kbd>               | Action                                                                                                                                                                                                                |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <kbd>Enter or Spacebar</kbd> | When focus is on the accordion header for a collapsed panel, expands the associated panel. When focus is on the accordion header for an expanded panel, collapses the panel if the implementation supports collapsing |
| <kbd>Tab</kbd>               | Moves focus to the next focusable element; all focusable elements in the accordion are included in the page Tab sequence.                                                                                             |
| <kbd>Shift+Tab</kbd>         | Moves focus to the previous focusable element; all focusable elements in the accordion are included in the page Tab sequence.                                                                                         |
| <kbd>Down arrow </kbd>       | If focus is on an accordion header, moves focus to the next accordion header. If focus is on the last accordion header, either does nothing or moves focus to the first accordion header.                             |
| <kbd>Up arrow</kbd>          | If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.                         |
| <kbd>Home</kbd>              | When focus is on an accordion header, moves focus to the first accordion header.                                                                                                                                      |
| <kbd>End</kbd>               | When focus is on an accordion header, moves focus to the last accordion header.                                                                                                                                       |

## WAI-ARIA roles

- The title of each accordion header is contained in an element with role button.
- Each accordion header button is wrapped in an element with role heading that has a value set for aria-level that is appropriate for the information architecture of the page.
  - If the native host language has an element with an implicit heading and aria-level, such as an HTML heading tag, a native host language element may be used.
  - The button element is the only element inside the heading element. That is, if there are other visually persistent elements, they are not included inside the heading element.
- If the accordion panel associated with an accordion header is visible, the header button element has aria-expanded set to true. If the panel is not visible, aria-expanded is set to false.
- The accordion header button element has aria-controls set to the ID element containing the accordion panel content.
- If the accordion panel associated with an accordion header is visible, and if the accordion does not permit the panel to be collapsed, the header button element has aria-disabled set to true.
- Optionally, each element that serves as a container for panel content has role region and aria-labelledby with a value that refers to the button that controls display of the panel.
  - Avoid using the region role in circumstances that create landmark region proliferation, e.g. in an accordion that contains more than approximately 6 panels that can be expanded at the same time.
  - Role region is especially helpful to the perception of structure by screen reader users when panels contain heading elements or a nested accordion.
