import { expect, html, fixture } from '@open-wc/testing';

import { DynamicOverlayController } from '../src/DynamicOverlayController.js';
import { GlobalOverlayController } from '../src/GlobalOverlayController.js';
import { LocalOverlayController } from '../src/LocalOverlayController.js';
import { overlays } from '../src/overlays.js';

function expectGlobalShown(ctrl) {
  const allOverlays = Array.from(document.body.querySelectorAll('.global-overlays__overlay'));
  expect(allOverlays).to.contain(ctrl.contentNode);
  expect(ctrl.contentNode).dom.to.equal('<p>Content</p>', { ignoreAttributes: ['class'] });
}
function expectDomHidden(ctrl) {
  const allOverlays = Array.from(document.body.querySelectorAll('.global-overlays__overlay'));
  expect(allOverlays).to.not.contain(ctrl.contentNode);
}

function expectLocalShown(ctrl) {
  expect(ctrl.contentNode).dom.to.equal('<p>Content</p>', {
    ignoreAttributes: ['x-placement', 'style'],
  });
  expect(ctrl.contentNode).to.be.displayed;
}
function expectCssHidden(ctrl) {
  expect(ctrl.contentNode).dom.to.equal('<p>Content</p>', {
    ignoreAttributes: ['style', 'x-placement'],
  });
  expect(ctrl.contentNode).to.not.be.displayed;
}

function expectToBeHidden(what) {
  if (what._showHideMode === 'css') {
    expectCssHidden(what);
  } else {
    expectDomHidden(what);
  }
}

function expectToBeShown(what) {
  if (what instanceof GlobalOverlayController) {
    expectGlobalShown(what);
  } else {
    expectLocalShown(what);
  }
}

async function canSwitchBetween(from, to) {
  const ctrl = new DynamicOverlayController();
  ctrl.add(from);
  ctrl.add(to);

  // setup: we show/hide to make sure everything is nicely rendered
  await from.show();
  await from.hide();
  await to.show();
  await to.hide();
  expect(from.isShown).to.be.false;
  expect(to.isShown).to.be.false;
  expectToBeHidden(from);
  expectToBeHidden(to);

  ctrl.switchTo(to);
  await ctrl.show();
  expect(from.isShown).to.be.false;
  expect(to.isShown).to.be.true;
  expectToBeHidden(from);
  expectToBeShown(to);

  await ctrl.hide();
  ctrl.switchTo(from);
  await ctrl.show();
  expect(from.isShown).to.be.true;
  expect(to.isShown).to.be.false;
  expectToBeShown(from);
  expectToBeHidden(to);
}

describe('Dynamic Global and Local Overlay Controller switching', () => {
  describe('.contentTemplate switches', () => {
    let globalWithTemplate;
    let globalWithTemplate1;
    let localWithTemplate;
    let localWithTemplate1;

    beforeEach(async () => {
      const invokerNode = await fixture('<button>Invoker</button>');
      globalWithTemplate = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      globalWithTemplate1 = overlays.add(
        new GlobalOverlayController({
          contentTemplate: () => html`
            <p>Content</p>
          `,
        }),
      );
      localWithTemplate = new LocalOverlayController({
        contentTemplate: () => html`
          <p>Content</p>
        `,
        invokerNode,
      });
      localWithTemplate1 = new LocalOverlayController({
        contentTemplate: () => html`
          <p>Content</p>
        `,
        invokerNode,
      });
    });

    afterEach(() => {
      overlays.teardown();
    });

    it(`can switch from localWithTemplate to globalWithTemplate and back`, async () => {
      await canSwitchBetween(localWithTemplate, globalWithTemplate);
    });

    it(`can switch from localWithTemplate to localWithTemplate1 and back`, async () => {
      await canSwitchBetween(localWithTemplate, localWithTemplate1);
    });

    it(`can switch from globalWithTemplate to localWithTemplate and back`, async () => {
      await canSwitchBetween(globalWithTemplate, localWithTemplate);
    });

    it(`can switch from globalWithTemplate to globalWithTemplate1 and back`, async () => {
      await canSwitchBetween(globalWithTemplate, globalWithTemplate1);
    });
  });

  // do we want to support this?
  describe.skip('.contentNode switches', () => {
    let globalWithNodes;
    let globalWithNodes1;
    let localWithNodes;
    let localWithNodes1;

    beforeEach(async () => {
      const invokerNode = await fixture('<button>Invoker</button>');
      const contentNode = await fixture(`<p>Content</p>`);
      globalWithNodes = new GlobalOverlayController({
        contentNode,
      });
      globalWithNodes1 = new GlobalOverlayController({
        contentNode,
      });

      localWithNodes = new LocalOverlayController({
        contentNode,
        invokerNode,
      });
      localWithNodes1 = new LocalOverlayController({
        contentNode,
        invokerNode,
      });
    });

    afterEach(() => {
      overlays.teardown();
    });

    it(`can switch from localWithNodes to globalWithNodes and back`, async () => {
      await canSwitchBetween(localWithNodes, globalWithNodes);
    });

    it(`can switch from localWithNodes to localWithNodes1 and back`, async () => {
      await canSwitchBetween(localWithNodes, localWithNodes1);
    });

    it(`can switch from globalWithNodes to localWithNodes and back`, async () => {
      await canSwitchBetween(globalWithNodes, localWithNodes);
    });

    it(`can switch from globalWithNodes to globalWithNodes1 and back`, async () => {
      await canSwitchBetween(globalWithNodes, globalWithNodes1);
    });
  });

  // do we want to support this?
  describe.skip('.contentTemplate/.contentNode switches', () => {
    let globalWithTemplate;
    let localWithTemplate;
    let globalWithNodes;
    let localWithNodes;

    beforeEach(async () => {
      const invokerNode = await fixture('<button>Invoker</button>');
      const contentNode = await fixture(`<p>Content</p>`);
      globalWithTemplate = new GlobalOverlayController({
        contentTemplate: () => html`
          <p>Content</p>
        `,
      });
      localWithTemplate = new LocalOverlayController({
        contentTemplate: () => html`
          <p>Content</p>
        `,
        invokerNode,
      });
      globalWithNodes = new GlobalOverlayController({
        contentNode,
      });
      localWithNodes = new LocalOverlayController({
        contentNode,
        invokerNode,
      });
    });

    afterEach(() => {
      overlays.teardown();
    });

    it(`can switch from localWithNodes to globalWithTemplate and back`, async () => {
      await canSwitchBetween(localWithNodes, globalWithTemplate);
    });

    it(`can switch from localWithTemplate to globalWithNodes and back`, async () => {
      await canSwitchBetween(localWithTemplate, globalWithNodes);
    });

    it(`can switch from globalWithTemplate to localWithNodes and back`, async () => {
      await canSwitchBetween(globalWithTemplate, localWithNodes);
    });

    it(`can switch from globalWithNodes to localWithTemplate and back`, async () => {
      await canSwitchBetween(globalWithNodes, localWithTemplate);
    });
  });
});
