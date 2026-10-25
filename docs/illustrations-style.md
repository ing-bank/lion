# Lion illustration style

The house style for the abstract drawings that head the blog posts, and the contract that keeps
them theme-able. Use this file as the prompt source when an illustration is needed anywhere else on
the portal, so a new drawing lands in the same visual language as the existing set.

The first set ships in `public/blog/images/*.svg`; the palette they are painted with lives in
`public/styles/blog.css` under `.lion-illo`.

## The style in one line

> Classical engraving plate: fine hatching and stipple line work in white on a black page, huge
> geometric construction circles and squares behind the scene, an abstract repeating background
> pattern, several overlapping silhouette figure studies, and exactly one yellow accent.

In three words: **engraved, technical, anatomical**. The drawing is a metaphor for the post, never a
literal screenshot, a mascot (except where a content mark is called for, below) or a scene with
faces. The Vitruvian Man is the reference: a proportional study where the diagram - circle, square,
radii, measure lines - is as much the subject as the figure.

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

- **2:1 landscape** (1536x768 at the source, 1024x512 as the traced file). Cards fit it exactly; the
  detail-page cover uses the same ratio, so a drawing is never letterboxed or cropped.
- **The scene spans the canvas.** The drawing is a wide horizontal band that reaches the left and
  right edge (measured on the shipped set: content spans 95-96% of the width) with the content
  occupying the middle 40-75% of the height - a horizon with things standing on it and reaching up,
  not a small object parked in the middle of an empty plate. A render that comes back as a lonely
  centred cluster is cropped to its content bounding box before tracing, which is what removes the
  outer margins.
- **Human figures carry the metaphor.** Several plain silhouettes per drawing, spread across the
  width, doing the work the post describes - pushing, carrying, stacking, measuring, pulling one
  layer out. They are what makes the drawing about people and teams rather than about objects, and
  they are never detailed: no faces, no skin tone.
- **Line work, not flat blobs.** Fine parallel hatching, cross-hatching and stipple for every shaded
  mass, thin white contour lines for every edge, and visible construction geometry: huge
  overlapping circles and squares, radii, chords, proportional guides and dashed measure lines that
  cut through the scene like an anatomy plate.
- **A pattern in the background, different per post.** The abstract pattern is part of the brief,
  not decoration: concentric circles with radii, diagonal hatch bands, a dotted grid, a radial
  sunburst, a blueprint grid with corner ticks, horizontal rules, speed chevrons, an isometric cube
  grid, contour lines. One pattern per drawing keeps the set varied while the style stays one
  language.
- **Vary the composition.** Nine drawings in a row read as a template if they are all built the same
  way. Give each one a different archetype - great-circle diagram, wall with one door, long table,
  flying arc, grid being arranged, tower being dismantled, assembly line, funnel, bench - and rotate
  where the accent lands.
- **Figures carry the metaphor, in overlapping poses.** Several white silhouette studies spread
  across the width, each drawn with limbs extended at more than one angle the way an anatomy plate
  shows a body in two positions at once.
- **One accent idea.** Yellow marks the one thing the metaphor turns on - the open door, the
  keystone link, the stopwatch, the box everything funnels into. A drawing with five yellow things
  has no accent.
- **No text.** Not the post title, not a label, not a digit on a ruler or a clock face: an image
  model garbles lettering and invents stray numerals (`120` and `97` turned up on a ruler, `1-12` on
  a stopwatch). Words belong in the headline, and the only lettering allowed in a cover is a
  content mark composited from an official logo (below).
- Rules of thumb: three or four shape families per drawing (blocks, discs, sheets, figures), a
  foreground object for the eye to land on, a clear left-to-right direction of work, no frame and
  no border.

Vocabulary that already reads as "Lion": flat blocks and slabs, disc towers, sheets of paper with
cut slots, crates and open boxes, low picket fences, chains and padlock outlines, tiny cursor
arrows, stacks of thin sheets, rulers and tick marks, and rows of silhouetted figures at work.

Avoid: light bulbs, rockets, gears alone, handshakes, hands with visible skin, briefcases, target
darts, generic stock composition, any logo or brand mark, any lettering.

## Content marks: the official logo, composited not generated

When a post is about a named technology, the cover gets one mark so the reference is unambiguous -
the TypeScript 7 cover carries the TypeScript badge and the Go gopher. Both are **composited into
the traced SVG**, never drawn by the model: a diffusion pass renders an approximate glyph and
garbles short lettering, and a traced mascot came back as one solid white blob.

- **TypeScript badge** (`svgv/typescript-7.svg`): the rounded square and the "TS" glyph are lifted
  from the official 2020 mark's own geometry (Wikimedia `Typescript_logo_2020.svg`), recoloured to
  `.illo-accent` for the square and `.illo-accent-ink` for the glyph. The glyph is deliberately NOT
  `.illo-ink`: that class turns dark in the light theme and the letters would vanish into the yellow.
  `--illo-accent-ink` is `var(--accent-ink)`, i.e. `#111111` in both themes.
- **Go gopher**: hand-authored vector (`refs/gopher-hand.svg`, ~15 shapes) rather than traced -
  round body, two ears, eyes and buck teeth as knock-outs, mitten arms, feet. Traced at 150px it
  collapsed into a blob; at the cover's scale a drawn mark is both cleaner and smaller.
- **Licensing is on the page, not on the drawing.** The TypeScript logo is a Microsoft trademark and
  the Go gopher is Renée French's, licensed CC BY 3.0. Nominative use in an article about migrating
  to TypeScript 7 / the Go compiler is the ordinary case, but if these covers are reused elsewhere,
  credit both (a caption or a credit line in the post footer) or swap the mark for a house-drawn
  stand-in. Never ship the marks in a context that implies endorsement.

## Prompt template

Paste as-is and put the scene in the first sentence. `{scene}` is the metaphor; delete nothing else

- the style and negative clauses are what hold the palette.

```
{scene} The page is solid black (hex 111111) from edge to edge. Everything is drawn on it in white,
light grey and saturated Lion yellow hex FFC107, as a classical engraving plate: fine parallel hatch
lines, dense stipple shading, thin white contour outlines, and visible geometric CONSTRUCTION LINES -
huge overlapping circles and squares, radii, chords and proportional guide lines drawn in thin white
strokes behind and through the scene, like a Renaissance anatomy study diagram. An abstract repeating
background pattern covers the whole frame (name it in the scene). The scene spans the frame edge to
edge: objects and figures are distributed left, centre and right, the tallest shapes reach the top
edge, a ground line runs along the bottom edge, no small lonely object in the middle, no large empty
margins. Human figures: white silhouette studies with simple rounded heads and limbs, each figure
shown in several OVERLAPPING POSES with arms and legs extended at different angles, like the limbs
of an anatomy plate, spread across the whole width and doing the work the scene describes. No facial
features, no skin tone. No text, no letters, no digits, no numbers, no numerals, no logos, no signage
anywhere.
```

Negative prompt:

```
white background, white paper, light background, black ink on white, text, letters, words, digits,
numbers, numerals, measurements, typography, logo, watermark, skin tone, flesh colour, peach, pink,
brown, tan, beige, cream, cardboard, orange, amber, red, green, blue, purple, gradient, glow,
photorealistic, photograph, 3D CGI render, rounded cartoon, centered single object, lonely object in
the middle, large empty space, empty background, minimalist poster, border, frame, drop shadow
```

Measured settings for the shipped set: `runware:400@4` (FLUX.2 klein 4B), 1536x768, seed chosen per
post, includeCost, ~$0.001 per frame - cheap enough that the constraint is the composition, not the
budget. Draft at 512-768 first when the metaphor itself is still in question.

## From a render to a theme-able SVG

A render is the reference, not the asset: a raster cover freezes its own colours and cannot follow
the theme. The conversion is four steps and is scripted, not hand-drawn:

1. Snap every pixel to the five palette colours (nearest-colour mapping; use int32 arithmetic - the
   squared distance overflows int16 and every pixel silently collapses onto one grey).
2. Crop to the content bounding box, expanded symmetrically back to 2:1, so the drawing reaches the
   frame edges whatever the render did. Then downscale (1024 wide for a line-work set, 768 for a
   shape-only one) and smooth (median, then a light blur) before tracing. Tracing at the source
   resolution emits a path per antialiased cluster (measured: 356 paths against 22).
3. Trace with VTracer (`mode: spline`, `hierarchical: stacked`, `filter_speckle: 6`,
   `layer_difference: 20`, `path_precision: 0`), then rewrite every `fill` into the matching
   `.illo-*` class and give the root a real `viewBox` - VTracer writes `width`/`height` only, and
   without a viewBox the drawing renders at natural size, cropped. Then prune: a hatch-heavy
   drawing traces to 100-360 paths, and dropping every non-plate path whose bounding box is under
   ~90 px² takes the specks out without touching the strokes (measured: 7-28 paths per cover).
   Composited content marks go in after the prune, so they are never touched by it.
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
