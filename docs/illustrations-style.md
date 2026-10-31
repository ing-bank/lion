# Lion illustration style

The house style for the drawings that head the blog posts, and the recipe for landing a logo or a
mascot in one of them without it reading as a sticker. Use this file as the prompt source when an
illustration is needed anywhere else on the portal, so a new drawing lands in the same visual
language.

The covers ship as **rasters** in `public/blog/images/<slug>.png` (1536x768, 2:1). An earlier round
shipped them as traced SVG; the tracer flattened the hatching that carries this style, so the raster
route won - sharper, and cheaper than the tooling it needed.

They ship as **palette PNGs, not JPEG**, and that is a hard requirement rather than a size choice:
JPEG re-shifts the accent on the way out (measured: the yellow plateau came back `#ffd300` on one
cover, 18 points off on green), so a JPEG cover cannot carry the house yellow exactly. Quantise to 32
colours and overwrite the palette entry nearest the accent with `#FFC107` itself; the modal yellow in
every shipped file then measures `#ffc107`. Quoting to 16 colours saves little (the print grain
dominates the entropy: measured 16c 535 KB against 32c 687 KB) and risks re-cutting the palette onto a
neighbour instead.

## Current direction: a generated scene, cut out and printed

The set on the blog is now built from **one generation per post**, not from a collage of assembled
parts: the model draws the whole scene - the lion-headed figure at work together with the machinery
around them - and the treatment prints it.

| layer    | what it is                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| scene    | one generation (`alibaba:qwen-image@3.0-pro`, $0.04) on **one flat single-tone backdrop**, nothing else in frame |
| cut      | background removal on that scene: the figure and the machine as **one group**, never assembled by hand          |
| print    | high-contrast black and white, a **6px** white edge tracing the group's silhouette                             |
| plate    | a second generation per post: the abstract background, light grey dominant, its own system                      |
| accent   | recoloured from the model's own warm pixels, then snapped bit-exact to `#FFC107`                                |
| motif    | one drawn geometry per post in the accent, different on every cover                                             |
| filter   | dot screen over everything, paper grain                                                                         |

Rules that make it work, each learned from a rejected round:

- **Lettering is never applied in post.** A badge, a monogram or a numeral has to exist in the
  generation; the pipeline may only recolour it to the accent. Pasting text on top afterwards was
  ruled out outright - and a star with a "7" or a badge with "TS" produced by the model reads as part
  of the machine, which pasted type never does.
- **One base colour in the backdrop, or the cut fails.** A scene rendered on a two-tone studio floor
  (grey wall, off-white ground) made the background removal cut along the join: tyres and feet came
  out flat where the tone changed. Ask for a single flat surface, no horizon and no ground plane.
- **The model draws the contact, not the pipeline.** Assembling a photographed rider onto a drawn
  machine by hand got the anatomy and the contact wrong in every round: the hip floated, the hands
  missed the bars, the feet hovered. One generation of the whole scene has all of that correct by
  construction. Where a two-point fit is unavoidable, solve it as a similarity transform and **print the
  residual** - a fit that is not verified is a guess.
- **Grey the plate, keep the accent.** Converting the group to black and white *after* recolouring the
  badge threw the accent away silently (measured: yellow coverage dropped to 0.09%). The greyscale pass
  has to re-apply the accent where the warm mask was.
- **The white edge is 6px, not 12.** At 12 the subject reads as a sticker with a glow.
- **Motion is generated and drawn.** Speed lives in the generation (blurred wheels, a crouch, a mane
  blown back) and in the drawn dynamics on top: slipstream lines that grow towards the rear, a forward
  vector off the front wheel, and hub arcs drawn as **jittered, broken polylines** - clean concentric
  arcs read as a digital overlay on a hand-drawn plate.
- **Every cover gets its own background system and its own accent motif.** One recipe with a different
  seed reads as the same image eight times. Each post carries a different construction (ledger bars,
  radial burst, converging lines, stamp grid, waveform rows, smoothed zigzag, arc fan) and a different
  way of spending the yellow.
- **Pin the accent last.** The screen, the grain and the misregistered ink all sit over the yellow, so
  the snap to `#FFC107` has to happen after the filter pass.
- **Subjects stand clear of everything.** The learned background removal reads anything crossing the
  body as background: a lathe in front of a figure's legs cost it a leg and half a torso. Keep props
  behind and beside the figure, not in front of it.
- **The photographs are searched, not generated** - only where a searched photograph is needed at all.
  Elements sourced from Wikimedia Commons record licence and source page per file, and the attribution
  renders on the article page, because CC BY requires it where the work is shown. CC BY-SA is a problem
  for this site; where that was the only candidate, the element is generated instead.

## The earlier direction: the engraving plate

Kept because some drawings on the portal still use it, and because it documents why the collage took
over.

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

## Which mark each cover carries

Every cover gets one recognizable element, found with an image search and engraved into the plate the
way the recipe above describes. The post and its mark:

| post                           | recognizable element                                           | source                         |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------ |
| The Accessibility of Lion      | International Symbol of Access                                 | Wikimedia Commons              |
| Controlling exports            | npm mark, as a sign on the wall of boxes                       | Wikimedia Commons              |
| Extending Lion Documentation   | Storybook wordmark                                             | storybookjs/brand              |
| ING open sources Lion          | Lit flame                                                      | lit/lit                        |
| Introducing lions website      | Eleventy opossum                                               | 11ty/11ty-logo                 |
| Lion without polyfills         | Chromium mark (browsers are why the polyfill existed)          | Wikimedia Commons              |
| Introducing Lion UI            | the Lion mark itself                                           | this repo, `public/logo.svg`   |
| Migrating Lion to TypeScript 7 | TypeScript badge (letters cut into the gear) and the Go gopher | Wikimedia, plus a drawn gopher |

Licences to keep in mind if the covers are reused outside these posts: the npm logo is npm, Inc.'s,
Storybook's brand assets are covered by their own brand terms, Lit is Google's, Eleventy's opossum is
Zach Leatherman's, the Chromium mark is CC BY, and the access symbol is a public-domain-standard
mark. Keep the credit line in the post footer when a cover is reused, and never drop one of these
marks into a context that implies the project endorses something.

## Engineering approaches (the current direction)

The first rounds drew people carrying blocks; the set now draws _machines and drawings_. The
engraving technique stays, the allegorical subject matter is gone: no gods, no statues, no winged
helmets, no robes, no caduceus, none of the classical dressing, even though the line work is
classical. Six approaches are in rotation so the feed does not read as one template:

| approach                | subject                             | what carries it                                                                                                  |
| ----------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **engineering drawing** | the subject in orthographic section | 45-degree section hatching, dimension lines with plain tick marks, exploded callout circles, a construction grid |
| **isometric cutaway**   | the housing opened up               | interior cavities in cross-hatch, shafts and bearings, flow arrows through passages, bolted flanges              |
| **instruments macro**   | precision tools at full frame       | calipers, micrometer, slide rule, a dial gauge with a blank face, stipple on polished steel                      |
| **flow schematic**      | ducts, valves, vessels              | arrowheads, gate valves, blank dials, rows of identical modules feeding one vessel                               |
| **kinetic**             | machinery in motion                 | concentric arcs, hatched waveform bands, dotted trajectories, a flywheel and a cam, speed lines, no housings     |
| **industrial poster**   | the plant as a composition          | stacked blocks and gantries receding, hatched sky bands, diagonal walkways, one big unlettered dial              |

Small silhouetted engineers in overalls and hard hats keep the human scale; they are still the only
figures allowed. Every prompt names its approach, its subject, and the exclusions (mythology, text,
digits) at the end.

## The accent is measured, not requested

Asking for `#FFC107` in the prompt is not what makes the cover carry it: the model comes back a few
points off (measured around `#f5c33a`). So the accent is corrected after the render - mask the yellow
family (`R-B > 60`, `G > 120`, `R > 140`), measure its mean, and shift the whole family so the mean
lands on `#FFC107` exactly. Shifting rather than filling keeps the highlights and the shadows the
engraving put around the accent, and the step prints the before/after mean per cover so the claim is
checkable in the log rather than asserted.

## Checklist before shipping a drawing

- [ ] Plate is one black field; the scene spans the canvas with no large empty margins.
- [ ] Fine hatching and stipple carry every shaded mass; construction geometry is visible.
- [ ] Exactly one yellow accent, arriving as line work rather than a filled block, and its mean
      measured back at `#FFC107` rather than assumed from the prompt.
- [ ] The subject is engineering (section, cutaway, instrument, schematic, kinetics, plant), with no
      classical or mythological dressing even though the line work is an old engraving.
- [ ] No text, no digits, no numerals, no skin tone, no second hue.
- [ ] Several overlapping figure studies, spread across the width.
- [ ] Any logo or mascot went through the blend recipe and reads correctly letter for letter.
- [ ] Looked at the frame at card size (and at 390px) before it ships.
