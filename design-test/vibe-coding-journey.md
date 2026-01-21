# Vibe Coding Journey: Building Lion UI Design System

*How 60+ AI prompts transformed a blank canvas into a modern design system*

---

## Introduction

This is the story of how the Lion UI design system website was built entirely through "vibe coding" — a conversational, iterative approach to development using AI assistance. Over the course of two weeks, approximately 60 prompts shaped everything from the initial landing page to interactive 3D blueprint animations.

---

## Phase 1: Initial Landing Page Design
*December 23, 2025*

The journey began with a simple request:

> "design a landing page for https://lion.js.org/next"

From there, the design evolved rapidly through iteration:

| Prompt | Result |
|--------|--------|
| *"replace the graphic with a custom logo. Redo the whole design"* | Generated first lion logo concept |
| *"come up with a complete new design from scratch. Keep the content, use yellow and black as colors"* | Established the yellow/black color scheme that would define the brand |
| *"start from scratch. Keep the content, ditch the graphics. Make it as modern and slick as possible"* | Pivoted to a minimalist modern approach |
| *"now replace the logo with something more modern"* | Updated logo to contemporary style |
| *"bring some warm yellow highlights"* | Added accent colors |
| *"provide a light/dark mode toggle"* | Implemented theme switching |
| *"use subtle gradients"* | Added visual depth |
| *"use subtle gradients in the title"* | Enhanced typography |
| *"change the logo text from 'Lion' to 'lion ui'"* | Rebranded to "lion ui" |
| *"make 'ui' part of 'lion ui' yellow"* | Styled brand identity with signature yellow accent |
| *"reduce the space between 'lion' and 'ui'"* | Typography refinement |

**Key insight**: The yellow and black color scheme emerged organically and became the foundation of the entire brand identity.

---

## Phase 2: Components Page
*December 23, 2025*

With the landing page established, focus shifted to building out the documentation:

| Prompt | Result |
|--------|--------|
| *"create a components overview page"* | Created components.html with grid layout |
| *"add an appealing graphic to every card in the components page"* | Visual cards for each component |
| *"now create an example page for the button"* | Created button.html detail page |
| *"restore the components page to the grid layout with the graphics for every component"* | Fixed layout after experimentation |
| *"please link the components page to the button page"* | Added navigation |
| *"use a page transition using css view transitions when clicking a card"* | Added smooth CSS View Transitions |
| *"fix the view transition"* | Debugged animations |

**Key insight**: Modern CSS features like View Transitions API were incorporated naturally through conversational prompts.

---

## Phase 3: Logo Refinements
*December 24, 2025*

The logo went through multiple iterations to find the perfect balance:

| Prompt | Result |
|--------|--------|
| *"resemble components in the logo. make it elegant and lightweight"* | Created logo_components.svg |
| *"make the logo simpler"* | Simplified design |
| *"change font to Inter"* | Typography update |
| *"change the graphic of the logo"* | Updated logo_new.svg |
| *"remove yellow from the logo"* | Created logo_white.svg variant |
| *"update the logo"* | Created logo_updated.svg |
| *"replace logo with something more lightweight and elegant"* | Created logo_elegant.svg |
| *"in button.html, lower the content so that the graphic is aligned with the text on the left column"* | Layout alignment |

**Key insight**: Creating multiple logo variants allowed for flexibility across different contexts (light mode, dark mode, blog headers, etc.).

---

## Phase 4: Logo Exploration
*January 3, 2026*

A dedicated exploration session to find the perfect logo:

| Prompt | Result |
|--------|--------|
| *"change the logo graphic to something more aesthetic and more original"* | Created logo_aesthetic.svg |
| *"create a set of logos to choose from"* | Generated 8 logo variants (logo-1.svg through logo-8.svg) with a preview page |

**Key insight**: Generating multiple options at once provided a design review experience similar to working with a human designer.

---

## Phase 5: Scroll Animations & Hero Section
*January 3, 2026*

This phase focused on adding interactivity and visual polish:

| Prompt | Result |
|--------|--------|
| *"use css scroll animations throughout the site"* | Created scroll-animations.css |
| *"vectorize the text 'lion ui' and remove the dots on the 'i's'"* | Created lionui-text.svg for precise control |
| *"make sure both 'i's' have dots removed and size of the text aligns with the graphic"* | Typography refinement |
| *"increase text height to 32px and bring 'ui' close to 'lion'"* | Fine-tuning spacing |
| *"increase font size of the logo"* | Scaling adjustments |
| *"create an appealing hero section that's interactive on viewport scroll (via css)"* | Scroll-based hero section |
| *"restore previous page"* | Reverted when direction wasn't right |
| *"add a blueprint graphic to the background, resembling ui"* | Created blueprint.svg |
| *"blend it nicely with the hero text"* | Visual integration |
| *"add the hero text on top of the ui wireframe"* | Layer ordering |
| *"redesign the hero section. Keep the text and keep a blueprint graphic"* | Hero redesign |
| *"bring back the glass effect to the top bar"* | Frosted glass navbar effect |
| *"add a more visible 3d blueprint graphic on the right of the hero section that responds to page scroll via css animations"* | 3D scroll effect |
| *"rethink the graphic. Make it multi layered, with each layer responding differently to scroll"* | Parallax layers |

**Key insight**: The "blueprint" concept emerged naturally and became a defining visual theme for the project.

---

## Phase 6: Interactive Blueprint Designs
*January 4, 2026*

The blueprint theme evolved into its own exploration:

| Prompt | Result |
|--------|--------|
| *"make an overview of blueprint hero images that could fit in the current design"* | Created blueprint-overview.html |
| *"create a new one that's minimal and interactive, let the shape of the logo graphic come back"* | Created blueprint-interactive.html |
| *"elaborate on this design by making it resemble a user interface. on scroll, it should fall apart in 3d layers"* | Created blueprint-ui-3d.html with 3D exploding layers |
| *"go back to the previous design and make the 'code shape' resemble the ui component"* | Design iteration |
| *"let it resemble the logo graphic better"* | Brand consistency |
| *"when page is scrolled, subtly add a layered 3d effect"* | Added depth on scroll |
| *"now place this graphic in index.html"* | Integrated to main page |
| *"bring the hover interactions (measurements) back to the hero graphic"* | Interactive measurement overlays |

**Key insight**: Experimental pages (like blueprint-interactive.html) served as a sandbox before integrating features into the main site.

---

## Phase 7: Blog Page
*January 4, 2026*

The final phase added a distinct blog section:

| Prompt | Result |
|--------|--------|
| *"design a blog page that looks distinct from the rest of the site"* | Created blog.html & blog.css |
| *"keep the yellow theme colors"* | Maintained brand colors |
| *"also in the logo"* | Created logo_yellow.svg variant |
| *"keep the same font for headings"* | Typography consistency |
| *"keep the yellow in the 'ui' part of 'lion ui'. Put a dark gray box behind the text"* | Header styling |
| *"Make sure the text is as big as before"* | Size adjustment |
| *"bring the logo graphic inside the box as well"* | Layout refinement |
| *"now make the graphic white"* | Color adjustment |
| *"inside the box just added, remove the trailing space on the end. Also, make sure the space between 'lion' and 'ui' is smaller"* | Final typography tweaks |
| *"based on https://web.dev/articles/baseline-in-action-color-theme, make a theme menu inside the top bar"* | Added theme selector inspired by web.dev |

**Key insight**: Referencing external articles (like web.dev) helped communicate specific implementation patterns.

---

## Files Created

By the end of this journey, the project contained:

### HTML Pages
- `index.html` - Main landing page
- `components.html` - Component overview
- `button.html` - Button component detail page
- `blog.html` - Blog page
- `blueprint-interactive.html` - Interactive blueprint demo
- `blueprint-ui-3d.html` - 3D exploding UI demo

### Stylesheets
- `styles.css` - Main styles
- `components.css` - Component page styles
- `blog.css` - Blog-specific styles
- `transitions.css` - View transition animations
- `scroll-animations.css` - Scroll-based animations

### Graphics
- `logo.svg` - Main logo
- `logo_white.svg` - White variant
- `logo_yellow.svg` - Yellow variant
- `logo_aesthetic.svg` - Aesthetic variant
- `logo_elegant.svg` - Elegant variant
- `logo_components.svg` - Components-inspired variant
- `logo_new.svg`, `logo_updated.svg` - Iterations
- `logo-1.svg` through `logo-8.svg` - Logo exploration set
- `blueprint.svg` - Blueprint background graphic
- `lionui-text.svg` - Vectorized logo text

---

## Key Takeaways

### 1. Iteration is Everything
The project evolved through 60+ prompts. No single prompt created the final result — it was the accumulation of small refinements.

### 2. Direction Over Destination
Prompts like *"make it more modern"* or *"keep it elegant"* worked better than overly specific instructions. The AI understood aesthetic direction.

### 3. Embrace Happy Accidents
The blueprint theme wasn't planned — it emerged from a prompt about background graphics and became central to the design identity.

### 4. Revert Without Fear
Several prompts included *"restore previous"* or *"go back to"* — knowing you can always step back encourages experimentation.

### 5. Reference Real Examples
Pointing to articles like web.dev helped communicate complex implementation patterns more effectively than describing them.

### 6. Create Variants
Generating multiple logo options, multiple hero designs, and multiple approaches provided choices rather than forcing acceptance of a single output.

---

## Conclusion

Vibe coding isn't about giving up control — it's about having a conversation with your tools. Each prompt builds on the last, creating a design that's both intentional and emergent. The Lion UI design system is the result of that conversation: a modern, interactive website built entirely through natural language.

*Total prompts: ~60 | Total time: ~2 weeks | Files created: 20+*

---

*This blog post was itself generated by analyzing the VS Code local history of the project.*
