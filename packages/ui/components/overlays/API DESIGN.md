# Api design lion (and ing-web)

C.q. golden component rules

- All logic should be in controllers (not mixins)
  - Controllers are designed to be framework agnostic
    - They hook into a reactive update cycle
    - The reactive cycle is usually driven by a library or framework (for us this is Lit, It could be other frameworks as well)s
  - Aforementioned reactive cycle is the “tick” that drives all communication and synchronisation in our libraries
    - We need to avoid orchestration logic as much as possible
    - We need to avoid race conditions at all costs
    - Therefore, whenever possible, we hook into this asynchronous update cycle
      - The async cycle is more performant
      - We align event dispatches that are aligned with internal cycle ()
      - We avoid sync updates (only for exceptional cases)
  - Controllers are consumed by web components and directives
  - Controllers can depend on other controllers
  - Controllers can inject functional styles (adopts stylesheets in closest (shadow)rootNode if not yet present)
- A directive is used inside lit templates (internally, for Subclassers)
  - They are a thin layer on top of controllers
  - Once Attribute proposal arrives, we will be fully platform compliant: [Attribte Proposal](https://github.com/WICG/webcomponents/issues/1029)
    - so be sure to design config objects in a “serializable way”
      - Think of focusgroup, that makes sure that all boolean names and enum values are unique.
  - It allows for more flexibility than a web component
    - In many cases, we want to update behaviour based on context (responsive behaviour)
      - think of accordions on mobile, sections with headings on desktop
      - Think of menubar on desktop, a stacked menu on desktop
        - Or basically every appearance of menus thinkable
    - Shadow dom is not always desirable
      - Css is easily shareable
      - Css power can be leveraged (we can elegantly use `>`, :has etc. selectors instead of wiring things together with a lot of orchestration javascript)
      - For a11y, we need to render to light dom quite often
    - Being able to not bother with scopedElements can be a blessing
      - especially when SSR is required
      - bc/o the overhead of tag names
        - Especially when components are extended and those scopedElements should be redefined
    - Web components force more levels of markup
      - We need a n extra layer for a host element (we do not have replace: true like we had in angular days)
      - We often need a wrapper element for a slot
    - Web components have a performance overhead
      - LionOption for instance is really have when we want to render a set of (it has a heavy prototype)
      - Even div[role=listitem] is more lightweight than LionMenuItem extends HTMLElement {},
- A web component should be used as a public api
  - They are a thin layer on top of controllers
    - Most often they map a system to a public api that is exposed via html tags
    - They map controller props to host props and attributes
    - A web component can have multiple controllers
    - They provide a default markup
    - They connect markup with controller
  - They are the only ones that contain html
    - Although markup concerns semantics and therefore a11y, controllers should be responsible for guaranteeing a11y (making sure the right elements and roles are applied)
  - They are designed to be extended
    - It should be easy to provide custom designs (markup) without breaking functionality or a11y (see astrology portal elements)
  - They are easy to understand
    - Just html markup
  - They should work without a framework/library (in a plain index.html with the web-component imported)
    - See [gold standard elix](https://github.com/webcomponents/gold-standard/wiki)
    -

## How to create a controller
- have one config object for constructor
  - reactiveHost can be provided
  - preferrably serializable
- can expose functional styling (that should be attached to reactiveHost when provided) 

## How to connect a controller to a web component

- naming
  - naming should be aligned with controller prop names where possible
    - this creates uniformity/predictable apis across all web components in our lib
  - avoid too generic names like 'config'
  - align names with platform

- properties
  - do not waste computation and/or create potential race conditions syncing state to host
    - instead, make host getters that reference controller state
  - use exposed mapping from controller 

- attributes
  - leverage lit (possibly get inspiration from decorator impl.?)
- events 
  - align with update cycle controller
  - TODO: should controller send events (extend EventTarget?)
  - make predictable default event
    - composable false, bubbles false, as we dispatch on host
  - extend Event, no customEvent (details obj. can be kept though)
- types
  = get inspiration from Zod
  - TODO: make poc
- keep it simple and small
- avoid custom logic that is not in controller
- add html 

## How to connect a controller to a directive
- use the controller constructor args (object) as api
- keep it simple and small
- avoid custom logic that is not in controller
- make it SSR compatible

## The art of rendering (creating templates inside web components)

    - remember our philosophy is still “we embrace the platform”, for:
    	- performance (the more code is outsourced to browser vendors, the less code we transfer over the network and the less code needs to be JIT-compiled (nothing beats the C++ code of the browser))
    	- sustainability (the platform is backwards compatible. What is built today, won’t be outdated (or dependent on heavy framework dependencies) in a few years)
    	- maintainability (the more code is outsourced to browser vendors, the less we maintain ourselves)
    	- applicability (“context-agnosticness”)
    		- not bound to framework, but usable everywhere
    		- essentially in SPAs, MPAs, client-rendered, server rendered (SSG + SSR)

    - use display: none (hidden attributes) instead of conditional rendering
    	- this opens the way for truly SSR-solutions (that work without js or work with just minimal hydration logic)
    	- this avoids timing issues (querySelectors used in init logic will work and we don’t have to setup callbacks, mutation observers and reinitializion systems for content we own ourselves (N.B. for user provided content, we do provi))
    	- potential performance drawbacks are negligible
    		- browser does not compute
    		- the conditional render logic does not need to be re-evaluted on rerender (this is an argument of being actually more performant)
