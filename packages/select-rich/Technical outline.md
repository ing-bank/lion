- SelectionListBehavior
  - Design patterns:
    - https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
    - https://www.w3.org/TR/wai-aria-practices/examples/menu-button/menu-button-actions-active-descendant.html
  - Other inspiration:
    - https://github.com/PolymerElements/iron-selector (the concept, not the code)
  - Dependencies: none

- <lion-listbox>
  - Design pattern: https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-rearrangeable.html
  - Other inspiration:
    - https://component.kitchen/elix/ListBox
    - https://www.webcomponents.org/element/@polymer/paper-listbox
  - For building this, we can adopt https://www.w3.org/TR/wai-aria-practices/examples/listbox/js/listbox-rearrangeable.js and have a fully accessible listbox
  - API could be:
  ```html
      <lion-listbox selected=”1”>
          <lion-option value=”x”> Option X </lion-option>
          <lion-option value=”y”> Option Y </lion-option>
          <lion-optgroup>
              <lion-option value=”y”> Option Y </lion-option>
              <lion-separator></lion-separator>
              <lion-option value=”y”> Option Y </lion-option>
          </lion-optgroup>
      </lion-listbox>
 ```
  - Sub elements:
    - <lion-option>
    - <lion-optgroup>
    - <lion-separator>
  - Dependencies:
    - SelectionListBehavior

- DropdownController
  - Design pattern: The dropdown is not an official aria-widget and thus can’t be tied to a specific role. It exists in a lot of UI libraries and most of them share these properties:
  - Preferred position is ‘down’
  - When no space at bottom, they show ‘up’ (in which. Case it behaves a as a dropup)
  - Unlike popovers and tooltips, it will never be positioned horizontally

Aliases are ‘popdown’, ‘pulldown’ and many others. See [Overlay Overview](../overlays/docs/OverlayOverview.md)
for contexts in which a dropdown can be used.

- Could be wrapped in <lion-dropdown>
- Most functionality is already in LocalOverlayController. It needs to be extended, so that it can limit its placement to vertical positions. Also, it needs to provide an option to align itself to the invoker (left/ right/fullwidth) and control maxWidth/minWidth.
It can support pointers and the margin to invoker should be configurable.
- Dependencies:
  - LocalOverlayController
  - managePosition

- <lion-select>
  - Design pattern: https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html
  - API could be:
  ```html
  <lion-select>
      <lion-listbox slot=”input”>
          <lion-option value=”x”> Option X </lion-option>
          <lion-option value=”y”> Option Y </lion-option>
      </lion-listbox>
  </lion-select>
  ```
  - It al relies on the listbox component. A tricky part on top will be the
  cloning of the selected option, but we might only provide an api where the user provides the
  invoker button
  - See if we support both <select> and <lion-listbox> as slot=”input” or that we create component
  <liion-select-rich>
  - Dependencies:
    - Field
    -	<lion-listbox>, <lion-option> (maybe lion-optgroup, lion-separator)
  -	DropdownController
