Confession: recent additions for the portal layouts (for the new visual design) have been "vibe coded" a few months ago at the tme of writing.

Although the outcome is visually ok, the code underneath is not maintainable:

- lots of duplications in layout files: we need to re-use MainLayout as much as possible again
- rebuilding of components in Astro
  - bypassing the accessible primitives that have been built as web components before like UIPortalMainNav etc. etc.
- styles are scattered / fragmented. They need to be centralized

In order to leverage the provider system (separating logic from presentation, allowing to switch designs w/o rebuilding layouts/pages), reuse all the work from Pavlik. And later enhcance with [provider system](https://github.com/ing-bank/lion/tree/astro-poc-reference/src/design-providers).
This is planned for the future when time allows. One step at a time :)
