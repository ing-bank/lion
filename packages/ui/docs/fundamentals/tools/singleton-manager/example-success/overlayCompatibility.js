import { OverlaysManager } from 'overlays';
import { singletonManager } from 'singleton-manager';

class CompatibleManager extends OverlaysManager {
  constructor() {
    super();
    this.name = 'Compatible from App';
    this.blocker.innerText = `Blocker for ${this.name}`;
  }

  blockingBody() {
    this.block();
  }

  unBlockingBody() {
    this.unBlock();
  }
}

const compatibleManager = new CompatibleManager();

singletonManager.set('overlays::overlays::1.x', compatibleManager);
singletonManager.set('overlays::overlays::2.x', compatibleManager);
