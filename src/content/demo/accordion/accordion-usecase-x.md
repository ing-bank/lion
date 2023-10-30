---
component: accordion
title: Default Accordion collapsed
description: All accordion panels are collapsed by default.
---

```js script
import '@lion/ui/define/lion-accordion.js';
import { html } from 'lit';
```

```html preview-story
<lion-accordion expanded="[0]">
  <h3 slot="invoker">
    <button>Sensory Factors</button>
  </h3>
  <div slot="content" class="lion-paragraph-container">
    <p>
      The taste of oranges is determined mainly by the relative ratios of sugars and acids, whereas
      orange aroma derives from volatile organic compounds, including alcohols, aldehydes, ketones,
      terpenes, and esters. Bitter limonoid compounds, such as limonin, decrease gradually during
      development, whereas volatile aroma compounds tend to peak in mid– to late–season development.
      Taste quality tends to improve later in harvests when there is a higher sugar/acid ratio with
      less bitterness. As a citrus fruit, the orange is acidic, with pH levels ranging from 2.9 to
      4.0.
    </p>

    <p>
      Sensory qualities vary according to genetic background, environmental conditions during
      development, ripeness at harvest, postharvest conditions, and storage duration.
    </p>
  </div>
  <h3 slot="invoker">
    <button>Nutritional value</button>
  </h3>
  <div slot="content">
    Orange flesh is 87% water, 12% carbohydrates, 1% protein, and contains negligible fat (table).
    In a 100 gram reference amount, orange flesh provides 47 calories, and is a rich source of
    vitamin C, providing 64% of the Daily Value. No other micronutrients are present in significant
    amounts (table).
  </div>
</lion-accordion>
```
