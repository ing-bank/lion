## Menu

### Assumptions
1. Menus are not always overlays (same holds for selects and comboboxes).Although often an overlay, a menu can be defined in the document flow as well: - a menu inside a left dialog sheet/ sidebar - a combobox like: https://lion-web-components.netlify.app/?path=/docs/forms-combobox-extensions--whatsappConcretely, this means that the disclosure

2. The api for a menu should follow platform and community standards as closely as possible- for instance: dialog / details / new popup spec (invoker is sibling of collapsible menu)

3. It should be possible to add ‘lightweight’ menu items (like a div with [role=menuitemradio] or [role=separator])


4. We want to reuse existing interaction patterns for all ‘’interactive lists’ (horizontal and vertical): listbox/select/combobox/menu/toolbar/tree
    - Deprecated menu spec (with the exception that menu items should always allow html (avoid label and icon attrs)

