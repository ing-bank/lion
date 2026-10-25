# Lion illustration style

The house style for the drawings that head the blog posts, and the recipe for landing a logo or a
mascot in one of them without it reading as a sticker. Use this file as the prompt source when an
illustration is needed anywhere else on the portal, so a new drawing lands in the same visual
language.

The covers ship as **rasters** in `public/blog/images/<slug>.png` (1536x768, 2:1), drawn on the
quality model id. An earlier round shipped them as traced SVG; the tracer flattened the hatching that
carries this style, so the raster route won - sharper, and cheaper than the tooling it needed.

## The style in one line

> Classical engraving plate: fine hatching and stipple in white on a black page, huge geometric
> construction circles and squares behind the scene, an abstract repeating background pattern,
> several overlapping silhouette figure studies, and exactly one yellow accent.

In three words: **engraved, technical, anatomical**. The Vitruvian Man is the reference - a
proportional study where the diagram (circle, square, radii, measure lines) is as much the subject as
the figure. The drawing is a metaphor for the post, never a screenshot and never a scene with faces.

## Palette

The colours are baked into the raster, so a cover is one fixed image in both themes. (A black plate
on a light page is intentional: the cover is a printed plate, not a surface that follows the theme.)

| role                                   | value                                     |
| -------------------------------------- | ----------------------------------------- |
| plate                                  | `#111111`, edge to edge                   |
| line work, figures, foreground objects | `#ffffff`                                 |
| secondary masses, pattern, hatching    | `#dcdcdc` and `#8a8a8a`                   |
| the accent, used once per drawing      | `#FFC107`, the portal's `--accent-yellow` |

Rules that follow from the table:

- **One accent.** The yellow marks the one thing the metaphor turns on - the keystone link, the open
  door, the pocket watch, the box everything funnels into. A drawing with five yellow things has no
  accent.
- **Yellow arrives as a line, never as a block.** A large flat yellow area next to hatch work reads
  as a sticker whatever the prompt says; where the accent is a shape it is filled with yellow hatch
  lines, so it is drawn by the same tool as everything else.
- **No other hue.** No skin tone (a hand or a face is a white silhouette), no cardboard brown, no
  gradient, no glow, no photograph. A render that comes back with a tan box or a peached hand is a
  prompt failure and is re-rolled.

## Composition

- **2:1 landscape** (1536x768), which is also the card's box, so a cover is never cropped or
  letterboxed.
- **The scene spans the canvas.** The drawing is a wide band that reaches the left and right edge,
  with the content in the middle 40-75% of the height - a horizon with things standing on it and
  reaching up, not a small object parked in the middle of an empty plate.
- **Human figures carry the metaphor.** Several white silhouette studies spread across the width,
  each drawn in more than one pose with limbs at different angles, the way an anatomy plate shows a
  body in two positions at once. They are why a drawing reads as being about people and teams.
- **Line work, not flat blobs.** Fine parallel hatching, cross-hatching and stipple for every shaded
  mass; thin white contours for every edge; and visible construction geometry - overlapping circles
  and squares, radii, chords, proportional guides, dashed measure lines - cutting through the scene.
- **A different background pattern per post**, named in the brief: concentric circles with radii,
  diagonal hatch bands under a square grid, a dotted ruled grid, a radial sunburst, a blueprint grid
  with corner ticks, horizontal rules over a ruler, speed chevrons under arcs, an isometric cube
  grid, contour lines.
- **Vary the archetype too** - great-circle diagram, wall with one door, long table, flying arc,
  wireframe being arranged, tower being dismantled, assembly line, funnel, bench. Nine drawings built
  the same way read as a template.
- **No text.** An image model garbles lettering and invents stray numerals (`120` and `97` turned up
  on a ruler, `1-12` on a stopwatch face). The only lettering ever allowed is a content mark, landed
  by the blend recipe below.
- Rules of thumb: three or four shape families per drawing (blocks, discs, sheets, figures), a
  foreground object for the eye to land on, a clear left-to-right direction of work, no frame and no
  border.

Vocabulary that already reads as "Lion": flat blocks and slabs, disc towers, sheets of paper with cut
slots, crates and open boxes, low picket fences, chains and padlock outlines, cursor arrows, stacks
of thin sheets, rulers and tick marks, gears, pocket watches, and rows of silhouetted figures at work.

Avoid: light bulbs, rockets, gears alone, handshakes, hands with visible skin, briefcases, target
darts, generic stock composition, flat unshaded fills.

## Prompt template

```
{scene} The page is solid black (hex 111111) from edge to edge. Everything is drawn on it in white,
light grey and saturated Lion yellow hex FFC107, as a classical engraving plate: fine parallel hatch
lines, dense stipple shading, thin white contour outlines, and visible geometric construction lines -
huge overlapping circles and squares, radii, chords and proportional guide lines in thin white
strokes behind and through the scene, like a Renaissance anatomy study diagram. An abstract repeating
background pattern covers the whole frame (name it in the scene). The scene spans the frame edge to
edge: the tallest shapes reach the top edge and a ground line runs along the bottom edge, no small
lonely object in the middle, no large empty margins. Human figures are white silhouette studies with
simple rounded heads and limbs, drawn in several overlapping poses with arms and legs at different
angles, spread across the width and doing the work the scene describes. No facial features, no skin
tone, no text, no letters, no digits, no numbers, no numerals, no logos, no signage, no watermark.
```

Measured settings for the shipped set: **`bfl:5@1` (FLUX.2 pro), 1536x768, $0.045 a frame.** No
`negativePrompt` - FLUX.2 rejects it (`invalidParameter`), which is why the exclusions are folded into
the end of the positive prompt and why "no text / no digits / no logos" is part of the template.
`runware:400@4` (FLUX.2 klein 4B, $0.0006) is worth using to explore a metaphor - it tops out around
8/10 on this style - but the frame that ships belongs on the quality id.

## Landing a logo or mascot in the drawing (the blend recipe)

Three passes. The first one decides whether it works at all:

1. **Restyle the mark into the hand first.** A flat vector mark handed to the placement pass comes
   back pasted - the reference is flat and the model preserves the reference. Send the mark _alone_
   to an edit pass: "keep the rounded square and the exact two letters; redraw the whole mark as a
   fine-line engraving: hatch lines across it, stipple, worn edges, flecks of the black showing
   through". Use that as the reference. Measured on one base frame: pasted **2/10** without this
   pass, **9/10** with it.
2. **Place it with the base plus the restyled mark as references** (`inputs.referenceImages`, base
   first), and say what it must not look like: "it is not a sticker, it must not look flat, glossy or
   photographic; it is cut into the same plate".
3. **Read the mark back from the finished frame, letter for letter**, and rerun a seed if a glyph
   drifted. Short lettering survives the placement pass; it does not survive being generated cold.

Placement strategies, in the order they read as integrated:

| strategy              | what it does                                                                      | measured         |
| --------------------- | --------------------------------------------------------------------------------- | ---------------- |
| **Watermark**         | the mark's letters engraved into the plate behind the scene, hatched, half-hidden | 10/10            |
| **Into the machine**  | the letters cut into the hub of the gear the scene is already about               | 9/10             |
| **As an object**      | a rounded square filled with yellow hatch lines, letters knocked out of the hatch | 9/10             |
| **As a plain object** | a solid yellow square with clean letters                                          | 2/10 (a sticker) |

Watermark and "into the machine" also keep the one-accent rule: the letters are line work, so the
yellow stays with the scene's own accent instead of competing with a second solid mass.

The Go gopher on the TypeScript 7 cover took the same route and came out 10/10. The engraver drew it
(the body, ears, eyes and buck teeth as knock-outs) rather than tracing the mascot drawing - a traced
mascot collapses into a white blob at cover scale.

**Licensing is on the page, not on the drawing.** The TypeScript logo is a Microsoft trademark and
the Go gopher is Renée French's, licensed CC BY 3.0. Nominative use in an article about migrating to
TypeScript 7 and the Go compiler is the ordinary case; if these covers are reused elsewhere, credit
both (a caption or a credit line in the post footer) or swap the mark for a house-drawn stand-in.
Never ship the marks in a context that implies endorsement.

## Checklist before shipping a drawing

- [ ] Plate is one black field; the scene spans the canvas with no large empty margins.
- [ ] Fine hatching and stipple carry every shaded mass; construction geometry is visible.
- [ ] Exactly one yellow accent, arriving as line work rather than a filled block.
- [ ] No text, no digits, no numerals, no skin tone, no second hue.
- [ ] Several overlapping figure studies, spread across the width.
- [ ] Any logo or mascot went through the blend recipe and reads correctly letter for letter.
- [ ] Looked at the frame at card size (and at 390px) before it ships.
