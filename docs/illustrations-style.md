# Lion illustration style

The house style for the abstract drawings that head the blog posts, and the contract that keeps
them theme-able. Use this file as the prompt source when an illustration is needed anywhere else on
the portal, so a new drawing lands in the same visual language as the existing set.

The first set ships in `public/blog/images/*.svg`; the palette they are painted with lives in
`public/styles/blog.css` under `.lion-illo`.

## The style in one line

> Flat abstract vector editorial illustration in a casual hand-drawn business style: minimal
> geometric shapes, slightly wobbly ink outlines, flat solid fills, one yellow accent, a mostly
> black plate, and a lot of empty space around a small centred subject.

In three words: **abstract, casual, business**. The drawing is a metaphor for the post, never a
literal screenshot, a mascot or a scene with faces.

## Palette

Yellow is the portal's accent, `#FFC107` - the exact value `public/styles/styles.css` declares as
`--accent-yellow`. Nothing else in the palette is a colour: the rest is ink and greys.

| role                                               | class          | dark theme | light theme | CSS token       |
| -------------------------------------------------- | -------------- | ---------- | ----------- | --------------- |
| plate (the field behind the drawing)               | `.illo-field`  | `#111111`  | `#e8e8e8`   | `--illo-field`  |
| line work, figures, hands                          | `.illo-ink`    | `#ffffff`  | `#111111`   | `--illo-ink`    |
| secondary shapes                                   | `.illo-light`  | `#dcdcdc`  | `#8a8a8a`   | `--illo-light`  |
| quiet masses                                       | `.illo-mute`   | `#808080`  | `#808080`   | `--illo-mute`   |
| the accent (one per drawing, at most a few shapes) | `.illo-accent` | `#FFC107`  | `#FFC107`   | `--illo-accent` |

Rules that follow from the table:

- **One accent.** The yellow marks the one thing the metaphor is about - the keystone, the open
  door, the ticket out, the timer. A drawing with three yellow things has no accent.
- **The plate is the theme.** Dark theme draws on ink, light theme inverts to a light plate with
  dark line work, and the yellow is identical in both. Never bake a hex into the file.
- **No other hue.** No skin tone on a hand or a face (a hand is a white mitten silhouette), no
  cardboard brown, no gradient, no glow, no photo. Renders that come back with a tan box or a
  peached hand are failures of the prompt, not of the model, and are re-rolled.

## Composition

- **2:1 landscape** (1536x768 at the source, 768x384 as the traced file). Cards fit it exactly; the
  detail-page cover uses the same ratio, so a drawing is never letterboxed or cropped.
- **Small subject, big plate.** Roughly 40% or more of the frame stays empty. The drawing is the
  quiet part of a page that carries a headline, a date and a tag next to it.
- **No text.** Not the post title, not a label, not a number: an image model garbles lettering, and
  the title is already in the markup. Words belong in the headline, never in the artwork.
- **Figures are silhouettes,** never detailed people. They carry scale and plurality - "many
  contributors", "one team" - not identity.
- **One metaphor per drawing,** readable from the shapes alone: a stack holding, a door open, a
  fence with one gap, a hand pulling one layer out, tiles being arranged, one box swallowing forty.
- Rules of thumb: three or four shape families per drawing (blocks, discs, sheets, figures),
  foreground object for the eye to land on, symmetry or a clear left-to-right direction, no frame
  and no border.

Vocabulary that already reads as "Lion": flat blocks and slabs, disc towers, sheets of paper with
cut slots, crates and open boxes, low picket fences, chains and padlock outlines, tiny cursor
arrows, stacks of thin sheets, and rows of silhouetted figures.

Avoid: light bulbs, rockets, gears-alone, handshakes, hands with visible skin, briefcases, target
darts, generic stock composition, any logo or brand mark, any lettering.

## Prompt template

Paste as-is and put the scene in the first sentence. `{scene}` is the metaphor; delete nothing else

- the style and negative clauses are what hold the palette.

```
{scene} Flat abstract vector illustration, casual hand-drawn editorial business style, thin pale
grey outlines, flat solid fills, no gradients, no shading. The background is one solid black ink
field (hex 111111) that dominates the whole frame; every object is drawn in only three colours:
saturated Lion yellow hex FFC107, white hex FFFFFF, and light grey hex DCDCDC. Wide landscape
composition, the subject centred and small in the frame with lots of empty black negative space
around it. Every human figure is a plain solid white silhouette; every hand is a solid white mitten
shape with no skin tone. No text, no letters, no numbers, no logos, no signage anywhere.
```

Negative prompt:

```
text, letters, words, numbers, typography, logo, watermark, skin tone, flesh colour, peach, pink,
brown, tan, beige, cream, orange, amber, red, green, blue, purple, gradient, glow, photorealistic,
photograph, 3D CGI render, clutter, border, frame, white background, light background
```

Measured settings for the shipped set: `runware:400@4` (FLUX.2 klein 4B), 1536x768, seed chosen per
post, includeCost, ~$0.001 per frame - cheap enough that the constraint is the composition, not the
budget. Draft at 512-768 first when the metaphor itself is still in question.

## From a render to a theme-able SVG

A render is the reference, not the asset: a raster cover freezes its own colours and cannot follow
the theme. The conversion is four steps and is scripted, not hand-drawn:

1. Snap every pixel to the five palette colours (nearest-colour mapping; use int32 arithmetic - the
   squared distance overflows int16 and every pixel silently collapses onto one grey).
2. Downscale to 768 wide and smooth (median, then a light blur) before tracing. Tracing at the
   source resolution emits a path per antialiased cluster (measured: 356 paths against 22).
3. Trace with VTracer (`mode: spline`, `hierarchical: stacked`, `filter_speckle: 8`,
   `layer_difference: 24`), then rewrite every `fill` into the matching `.illo-*` class and give the
   root a real `viewBox` - VTracer writes `width`/`height` only, and without a viewBox the drawing
   renders at natural size, cropped.
4. Prove it: render the file in the browser in both themes and check the computed fills
   (`--illo-accent` must resolve to `rgb(255, 193, 7)`) plus a look at the sheet at card size.

Render it **inline**, never through `<img>` or a CSS background: an SVG loaded as an image is a
separate document, so the page's custom properties and the theme never reach it. The blog does this
in `src/utils/blog-covers.js`.

## Checklist before shipping a drawing

- [ ] Plate is one field, subject small and centred, ~40%+ empty space.
- [ ] Exactly one yellow idea; nothing else in the palette besides ink and greys.
- [ ] No text, no skin tone, no brand mark, no gradient.
- [ ] `viewBox` present; fills are `.illo-*` classes, not hexes.
- [ ] Verified in both themes at card size, and the accent measured as `rgb(255, 193, 7)`.
- [ ] Metaphor explained in one line so the next illustrator can tell whether it fits the post.
