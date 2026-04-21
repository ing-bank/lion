

# Blob: Overview

The Blob is a way to highlight information, such as a promotion, CTA or simple URL.

The copy within the Blob should always be short and encourage action, rather than be long and descriptive.
If more space is needed for longer copy, consider using subtitles, body copy, or the Mini-Blob.

> N.B. this component is in beta. We aim to consolidate its api and further enhance internals (focus state, stretching of the shape) in the future.
> These visual upgrades will come for free in future releases.

```
import { LitElement, html, ScopedElementsMixin } from "@lion/ui/core.js";
import { LionBlob } from "@lion/ui/blob.js";
class BlobDemo extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'lion-blob': LionBlob
  };
  render() {
    return html` <lion-blob><button>Call to action</button></lion-blob> `;
  }
}
customElements.define('blob-demo', BlobDemo);
export const overview = () => previewHtml`<blob-demo></blob-demo>`;
```

## Features

* Can be used with buttons, anchors and regular text
* Shows an arrow icon when interactive element (anchor or button) supplied
* Responds to expressive contexts

## Installation

```
npm i --save @lion/ui
```

```
import { LionBlob } from '@lion/ui/blob.js';
```

