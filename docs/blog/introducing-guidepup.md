---
title: "Introducing Guidepup: Real Screen Reader Testing in @lion/ui"
date: 2026-01-06
author: Lion Team
---

## Raising the Bar for Accessibility Testing in Lion

@lion/ui has always been committed to accessibility. With a large and diverse user base, and the need to comply with the European Accessibility Act (EEA), our components have undergone countless (often indirect) accessibility audits. This has made Lion one of the most accessible UI libraries available today.

Until now, our regression testing for accessibility relied primarily on static analysis tools like axe-core. While these tools are invaluable for catching many issues early, they cannot fully replicate the experience of real users who rely on assistive technologies.

## Today: Real Screen Reader Output with Guidepup

We are excited to announce the integration of [Guidepup](https://guidepup.dev/) into our quality assurance process. Guidepup enables automated, real screen reader output testing—going beyond static analysis to validate the actual spoken feedback users receive.

This is a major step forward in safeguarding the accessibility and usability of Lion components. By programmatically verifying screen reader output, we can:

- Catch regressions that static tools miss
- Ensure our components are truly usable for everyone
- Provide even greater confidence to teams relying on Lion for accessible products

## Why This Matters

Accessibility is not a checkbox—it's a continuous commitment. With Guidepup, we are closing the gap between automated checks and real-world user experience. This extra layer of testing means Lion users and their customers can trust that accessibility is not just promised, but proven.

We look forward to your feedback and to seeing the positive impact this brings to the Lion community and beyond.

— The Lion Team
