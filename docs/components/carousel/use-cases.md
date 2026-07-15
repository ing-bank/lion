# Carousel >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-carousel.js';
```

## Pre-select the first active slide

You can preselect the active slide using the `current` attribute.

```html preview-story
<lion-carousel current="2">
  <div slot="slide">slide 1</div>
  <div slot="slide">slide 2</div>
  <div slot="slide">slide 3</div>
  <div slot="slide">Any HTML content</div>
  <p slot="slide">More content here</p>
</lion-carousel>
```

## Autoplay Carousel

You can define an autoplay carousel using the `slideshow` atribute and set the delay duration using the `duration` attribute, also adds the "play" and "stop" buttons for users to control it.

```html preview-story
<lion-carousel slideshow duration="4000">
  <div slot="slide">slide 1</div>
  <div slot="slide">slide 2</div>
  <div slot="slide">slide 3</div>
  <div slot="slide">Any HTML content</div>
  <p slot="slide">More content here</p>
</lion-carousel>
```

## Carousel with Pagination

You can compose the carousel component to work with LionPagination component

```html preview-story
<lion-carousel pagination>
  <div slot="slide">slide 1</div>
  <div slot="slide">slide 2</div>
  <div slot="slide">slide 3</div>
  <div slot="slide">Any HTML content</div>
  <p slot="slide">More content here</p>
</lion-carousel>
```

## Carousel with all options

```html preview-story
<lion-carousel pagination slideshow>
  <img slot="slide" src="https://picsum.photos/800/400?random=1" alt="random image for demo" />
  <img slot="slide" src="https://picsum.photos/800/400?random=2" alt="random image for demo" />
  <img slot="slide" src="https://picsum.photos/800/400?random=3" alt="random image for demo" />
  <img slot="slide" src="https://picsum.photos/800/400?random=4" alt="random image for demo" />
</lion-carousel>
```
