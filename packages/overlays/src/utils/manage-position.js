import { Debouncer } from './debounce.js';
import { animationFrame } from './async.js';
import { getPosition } from './get-position.js';

/* eslint-disable no-param-reassign */
const genericObservedEvents = ['resize', 'orientationchange'];
const observedFixedEvents = ['scroll'];
const elementStyleProps = [
  'position',
  'z-index',
  'overflow',
  'box-sizing',
  'top',
  'left',
  'max-height',
  'width',
];
const elementAttributes = ['position'];

/**
 * @param {HTMLElement} el
 * @param {HTMLElement} relEl
 * @param {number} viewportMargin
 * @param {number} verticalMargin
 * @param {number} horizontalMargin
 * @param {Config} config
 * @param {Viewport} viewport
 */
/* eslint-disable-next-line max-len */
export function updatePosition(el, relEl, config = {}, viewport = document.documentElement) {
  const { viewportMargin = 16, verticalMargin = 8, horizontalMargin = 8 } = config;

  // Reset width/height restrictions so that desired height/width can be calculated
  el.style.removeProperty('max-height');
  el.style.removeProperty('width');

  el.style.position = config.position;
  el.style.zIndex = config.position === 'absolute' ? '10' : '200';
  el.style.overflow = 'auto';
  el.style.boxSizing = 'border-box';
  relEl.style.boxSizing = 'border-box';

  const elRect = el.getBoundingClientRect();
  const relRect = relEl.getBoundingClientRect();
  const positionContext = {
    relEl,
    elRect,
    relRect,
    viewportMargin,
    verticalMargin,
    horizontalMargin,
    viewport,
  };

  const placement = getPosition(positionContext, config);
  el.style.top = `${placement.top}px`;
  el.style.left = `${placement.left}px`;
  el.style.maxHeight = `${placement.maxHeight}px`;
  el.style.width = `${placement.width}px`;
  el.setAttribute('position', placement.position);

  // If the width / height are explicitly or inline styled, take the style.
  // If not, take the relRect dimensions.
  el.setAttribute('invoker-width', positionContext.relRect.width);
  el.setAttribute('invoker-height', positionContext.relRect.height);
}

/**
 * Manages the positions of an element relative to another element. The element is positioned
 * in the direction which has the most available space around the other element. The element's
 * width/height is cut off where it overflows the viewport.
 *
 * The positioned element's position is updated to account for viewport changes.
 *
 * Call updatePosition() to manually trigger a position update.
 * Call disconnect() on the returned handler to stop managing the position.
 *
 * @param {HTMLElement} element The element to position relatively.
 * @param {HTMLElement} relativeTo The element to position relatively to.
 * @param {Config} config
 * @param {Viewport} viewport
 */
// eslint-disable-next-line max-len
export function managePosition(
  element,
  relativeTo,
  config = {},
  viewport = document.documentElement,
) {
  const {
    viewportMargin = 16,
    verticalMargin = 8,
    horizontalMargin = 8,
    placement = 'right-of-bottom',
    position = 'absolute',
    minHeight,
    minWidth,
  } = config;
  const observedEvents =
    position === 'absolute'
      ? genericObservedEvents
      : [...genericObservedEvents, ...observedFixedEvents];
  let debouncer;

  function handleUpdate() {
    const updateConfig = {
      placement,
      position,
      viewportMargin,
      verticalMargin,
      horizontalMargin,
      minHeight,
      minWidth,
    };
    const params = [element, relativeTo, updateConfig, viewport];
    updatePosition(...params);
  }

  function handleUpdateEvent() {
    debouncer = Debouncer.debounce(debouncer, animationFrame, handleUpdate);
  }

  // Cleans up listeners, properties and attributes
  function disconnect() {
    observedEvents.forEach(e =>
      window.removeEventListener(e, handleUpdateEvent, { capture: true, passive: true }),
    );

    elementStyleProps.forEach(prop => {
      element.style.removeProperty(prop);
    });

    elementAttributes.forEach(attr => {
      element.removeAttribute(attr);
    });

    relativeTo.style.removeProperty('box-sizing');
  }

  observedEvents.forEach(e =>
    window.addEventListener(e, handleUpdateEvent, { capture: true, passive: true }),
  );
  handleUpdate();

  return { updatePosition: handleUpdate, disconnect };
}
