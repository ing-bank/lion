---
parts:
  - Accessibility
  - Rationales
title: 'Rationales: Accessibility'
eleventyNavigation:
  key: Rationales >> Accessibility
  title: Accessibility
  order: 5
  parent: Rationales
---

# Rationales: Accessibility

In Lion accessibility is a first class citizen. That means accessibility is never an afterthought.

Whenever we create a component, we do some thorough research first. Experience from past web component libraries learned us that when accessibility was dealt with in hindsight, a lot of concessions needed to be made. It made us want to go back to the drawing board. Lion was started with this 'fresh drawing board'.
In general, we try to leverage out of the box accessible platform solutions as much as possible. When no platform solutions are available, we try to map our components to [aria patterns and widgets as defined by W3C](https://www.w3.org/WAI/ARIA/apg/) where possible.
Building accessible components takes a lot of time, practice and knowledge about screen reader and browser implementations. Then, it takes many testing iterations to finetune a component.

More on this topic can be found in the online panel discussion [Web Components, Design Systems and Accessibility](https://www.youtube.com/watch?v=xz8yRVJMP2k&t=1190s). The discussion also contains a [dedicated section about accessible form components](https://www.youtube.com/watch?v=xz8yRVJMP2k&t=1917s)

## Shadow roots and accessibility

Since our components and applications consist of multiple shadow roots that need to be able to reference each other, architecting accessible components takes extra strategy and planning.
A practical example: all form controls inside a fieldset need to be able to lay accessible id relations to their parent (the fieldset). In other words, id relations should be cross component (which usually means cross shadow root). Scenarios like these require consistent architecture, allowing all form components to be interoperable. In general, light dom needs to be leveraged until a solution for cross root aria is available. For a deeper understanding of the topic, be sure to view these [slides about cross root aria](/_merged_assets/_static/crossRootAriaLion.pdf).

## Some details about the form system

A huge part of Lion consists of its form system and components.

This [presentation about accessible form components](/_merged_assets/_static/theoryOfFormsLion.pdf) explains how accesibility is built-in in all form components.

## SlotMixin

Internally, we delegate all intricacies involved in managing light dom to SlotMixin.
SlotMixin automatically mediates between light dom provided by the user ('public slots') and light dom provided by the component author ('private slots').
Also, SlotMixin allows to hook into the reactive update loop of LitElement (automatically rerendering on property changes) and it automatically respects
the scoped registry belonging to the shadow root.
More details about SlotMixin can be found in the [SlotMixin documentation](../systems/core/SlotMixin.md)
