---
title: The Accessibility of Lion
published: true
description: What does the term Accessibility mean within the context of Lion?
date: 2021-12-07
tags: [ux, accessibility]
cover_image: /blog/images/accessibility.png
---

## Accessibility within Design Systems

When I ([Erik Kroes](https://www.twitter.com/erikKroes)) worked together with developers all through ING, many of them pointed to the design system when it came to accessibility. It's easy to say something like: "we're doing it right, but it's the design system where the issues are!"

### Design systems scale!

To avoid such issues, it felt good to focus on the design system. It's a crucial point in the workflow of many developers and designers. No, an accessible design system does not warrant an accessible outcome. But yes, an inaccessible design system is pretty much assured to produce inaccessible products. It's hard to build something stable (a product) with an unstable foundation (an inaccessible design system). It's also a great way to improve for many by solving an issue once.
Whatever you do well in a design system, will spread. But whatever you do wrong, also spreads. The sword is double-edged.

### Quality, quality and quality

If the previous point isn't a good reason to focus on quality by itself, there's another. Design systems receive the scrutiny of all the people that work with them. When person Y thinks the performance of component Z could be improved, it might mean the entire team won't use your design system. Then comes person X who sees improvements for component N. And with every negative impression, people will trust the entire system less. A chain is no stronger than its weakest link, and the impression of a design system is based on its worst component.
The challenge is to let quality be a strength instead of a weakness. The challenge is to include the people that work with your design system. Include and have them contribute their expertise. Imagine person Y applied their expertise on performance to help improve. That would be a benefit for person X, who could contribute their expertise.
A shared system of quality becomes a shared system that benefits everybody, and the tool people want (not have to) use.

### Focus on the fun part

Design systems have a strong focus on UI and UX. They deal with "the front of the frontend". This focus is not just on the side of the product, but also on the people who build and use it. When you're a developer who likes to consider UX; the design system would like your help! When you're a developer who doesn't care about UX; the design system has your back!
A design system helps people focus on what they like (and less on what they don't like).

### Design systems and accessibility

To summarize, these are three reasons to focus on accessibility in your design system:

- **Scale**: Fix once and improve for many
- **Quality**: Create trust and community
- **Focus**: Dive deep so others don't have to
  Each of these could easily be a blog on their own, and there are many more reasons.

## The accessibility of Lion

Using Lion does not ensure an accessible outcome. Sorry, it doesn't work like that. What it does provide is a solid base for you to build your own design systems and/or components with. It covers things like keyboard accessibility, UX design and semantics but a bad visual design can still ruin a lot. You have the freedom to use Lion for a white-on-yellow set of components (but it probably won't be very usable for many). It's your responsibility to use what's provided, and build something that includes people.

### Implementation

As Lion is white label, the visual design is not accessible. To put it differently, the visual is not designed. Everything else is though. It's thoroughly design, built and tested for you to meet (and exceed) [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/). Components are based on the theoretic [ARIA Design Pattern Examples](https://www.w3.org/TR/wai-aria-practices/examples/) but made practical by automated testing, extended manual testing, heavy scrutiny and testing across platforms with screen readers like VoiceOver, NVDA and JAWS. Feel free to look at the [GitHub-issues labelled "a11y"](https://github.com/ing-bank/lion/issues?q=label%3Aa11y) to see what kind issues have been found (and fixed).
