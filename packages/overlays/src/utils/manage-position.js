import { Debouncer } from './debounce.js';
import { animationFrame } from './async.js';
import { getPosition } from './get-position.js';

/* eslint-disable no-param-reassign */
const genericObservedEvents = ['resize', 'orentationchange'];
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
const elementAttributes = ['js-positioning-horizontal', 'js-positioning-vertical'];

/**
 * @param {HTMLElement} el
 * @param {HTMLElement} relEl
 * @param {number} viewportMargin
 * @param {number} verticalMargin
 * @param {number} horizontalMargin
 * @param {Config} config
 */
/* eslint-disable-next-line max-len */
function updatePosition(
  el,
  relEl,
  viewportMargin,
  verticalMargin,
  horizontalMargin,
  config,
  viewport,
) {
  // Reset width/height restrictions so that desired height/width can be calculated
  el.style.removeProperty('max-height');
  el.style.removeProperty('width');

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
  const position = getPosition(positionContext, config);

  el.style.top = `${position.top}px`;
  el.style.left = `${position.left}px`;
  el.style.maxHeight = `${position.maxHeight}px`;
  el.style.width = `${position.width}px`;
  el.setAttribute('js-positioning-horizontal', position.horizontalDir);
  el.setAttribute('js-positioning-vertical', position.verticalDir);
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
    placement = 'bottom right',
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
      minHeight,
      minWidth,
    };
    const params = [
      element,
      relativeTo,
      viewportMargin,
      verticalMargin,
      horizontalMargin,
      updateConfig,
      viewport,
    ];
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
  element.style.position = position;
  element.style.zIndex = position === 'absolute' ? '10' : '200';
  element.style.overflow = 'auto';
  element.style.boxSizing = 'border-box';
  relativeTo.style.boxSizing = 'border-box';
  handleUpdate();

  return { updatePosition: handleUpdate, disconnect };
}
