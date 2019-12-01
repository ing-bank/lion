import { defineCE, unsafeStatic } from '@open-wc/testing';
import { LitElement } from '@lion/core';
import { runOverlayMixinSuite } from '../test-suites/OverlayMixin.suite.js';
import { OverlayMixin } from '../src/OverlayMixin.js';

const tagString = defineCE(class extends OverlayMixin(LitElement) {});
const tag = unsafeStatic(tagString);

runOverlayMixinSuite({
  tagString,
  tag,
});
