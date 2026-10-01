# Carousel >> Overview ||10

A carousel web component. The component allows users to navigate through a series of images using either UI controls or keyboard navigation.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-carousel.js';
```

```js preview-story
export const main = () =>
  html`
    <lion-carousel>
      <img slot="slide" src="https://picsum.photos/800/400?random=1" alt="random image for demo" />
      <img slot="slide" src="https://picsum.photos/800/400?random=2" alt="random image for demo" />
      <img slot="slide" src="https://picsum.photos/800/400?random=3" alt="random image for demo" />
      <img slot="slide" src="https://picsum.photos/800/400?random=4" alt="random image for demo" />
      <!-- Insert more elements as needed -->
    </lion-carousel>
  `;
```

## Features

- Flexible Content and Styling: LionCarousel accepts diverse content through `slot=slide` and offers styling options.
- Autoplay and Manual Navigation: It supports both automatic cycling of slides for showcases and manual navigation for user control.
- Accessibility-Focused: Built with accessibility in mind, featuring keyboard navigation, ARIA attributes, and motion preferences.

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionCarousel } from '@lion/ui/carousel.js';
// or
import '@lion/ui/define/lion-carousel.js';
```
