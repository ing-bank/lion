Added functionality on top of platform input[type=file]:

- validation for selected files mismatching accept criteria
- max file size
- customizable selection button
- liveUpload
- advanced drag and drop support
  - When multiple is true, dragged files will be added to the existing list. (This is different from native behavior. TDOO: is this a conscious UX)choice?
  - customizable drag and drop zone

TODO:

- drag and drop zone can also be achieved by making native input invisible with opacity 0 => would require 0 js
- accept should be delegated to \_inputNode, so that disallowed cannot be selected via dialog

BUGS:

- error messages not read when button is selected
- "Drag & Drop your files here or" + "Select file" does not feel like accessible text, bc:
  - SR doesn't read it in one go
  - multiple labels can form one text more or less, but a regular text completed by a button doesn't seem like a regular a11y pattern
- undefined sr-only name (in VO, screen jumps to top)
- maxsize validator shows when it shouldn't
