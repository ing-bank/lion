import { singletonManager } from 'singleton-manager';
import { OverlaysManager } from 'overlays';
import { OverlaysManager as OverlaysManager2 } from './node_modules/page-b/node_modules/overlays/index.js';

let compatibleManager1;
let compatibleManager2;

const blocker = document.createElement('div');
blocker.setAttribute(
  'style',
  'border: 2px solid #8d0606; margin: 10px; padding: 10px; width: 140px; text-align: center;',
);
blocker.innerText = `Shared Blocker for App`;
document.body.appendChild(blocker);

class CompatibleManager1 extends OverlaysManager {
  name = 'Compatible1 from App';

  block(sync = true) {
    super.block();
    if (sync) {
      compatibleManager2.blockBody(false);
    }
  }

  unBlock(sync = true) {
    super.unBlock();
    if (sync) {
      compatibleManager2.unBlockBody(false);
    }
  }

  _setupBlocker() {
    this.blocker = blocker;
  }
}

class CompatibleManager2 extends OverlaysManager2 {
  name = 'Compatible2 from App';

  blockBody(sync = true) {
    super.blockBody();
    if (sync) {
      compatibleManager1.block();
    }
  }

  unBlockBody(sync = true) {
    super.unBlockBody();
    if (sync) {
      compatibleManager1.unBlock();
    }
  }

  _setupBlocker() {
    this.blocker = blocker;
  }
}

compatibleManager1 = new CompatibleManager1();
compatibleManager2 = new CompatibleManager2();

singletonManager.set('overlays::index.js::1.x', compatibleManager1);
singletonManager.set('overlays::index.js::2.x', compatibleManager2);
