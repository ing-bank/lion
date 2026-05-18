/* eslint-disable no-unused-expressions */
/* eslint-disable lit/attribute-value-entities */
import { expect, fixture as _fixture, html, aTimeout, waitUntil } from '@open-wc/testing';
import { setViewport, sendMouse, resetMouse, sendKeys } from '@web/test-runner-commands';
import '@lion/ui/define/lion-navigation-bar.js';
import { css } from 'lit';
import { getDeepActiveElement } from '@lion/ui/overlays.js';

/**
 * @typedef {import('lit').TemplateResult} TemplateResult
 */

/**
 * We don't know if the element overflowed by X from the window.
 * Hence we use the very left point of the element
 * @param {*} element
 * @returns
 */
function getCoordinates(element) {
  const { x, y, height } = element.getBoundingClientRect();

  return {
    x: Math.floor(x + window.pageXOffset),
    y: Math.floor(y + window.pageYOffset + height / 2),
  };
}

/**
 * no items go under More button on 1300px viewport width. All items render in the main nav
 */
const menuWith3Items = [
  {
    title: '1 Test test test test test test test test',
    sub: [
      {
        title: '1.1 Test test test test',
        link: '1.1.test-test-test-test',
        sub: [
          {
            title: '1.1.1 Test test test test',
            link: '1.1.1.test-test-test-test',
          },
        ],
      },
    ],
  },
  {
    title: '2 Test test test test test test test test',
    sub: [
      {
        title: '2.1 Test test test test',
        link: '2.1.test-test-test-test',
      },
    ],
  },
  {
    title: '3 Test test test test test test test test',
    sub: [
      {
        title: '3.1 Test test test test',
        link: '3.1.test-test-test-test',
      },
    ],
  },
];

/**
 * 1 last item goes under More button on 1300px viewport width
 */
const menuWith4Items = [
  ...menuWith3Items,
  {
    title: '4 Test test test test test test test test',
    sub: [
      {
        title: '4.1 Test test test test',
        sub: [
          {
            title: '4.1.1 Test test test test',
            link: '4.1.1.test-test-test-test',
          },
        ],
      },
    ],
  },
];

/**
 * 2 last item goes under More button on 1300px viewport width
 */
const menuWith5Items = [
  ...menuWith4Items,
  {
    title: '5 Test test test test test test test test',
    sub: [
      {
        title: '5.1 Test test test test',
        link: '5.1.test-test-test-test',
      },
    ],
  },
];

const secondaryMenu = [
  {
    title: 'Back to old website',
    link: 'https://www.ingwb.com',
    target: '_self',
    trackid: 'backToOldWebsite',
  },
];

const ctaPrimary = {
  id: 'cta-primary',
  label: 'Log in',
  href: '#login',
};

const ctaSecondary = {
  id: 'cta-secondary',
  label: 'Open an account',
  href: '#open-account',
};


describe.only('More button', () => {
    afterEach(async () => {
    await resetMouse();
    });

    const getMoreButton = el =>
    /** @type {HTMLElement} */ (el.shadowRoot.querySelector('.more-button-item button'));
    const getMoreButtonDropdownItems = el =>
    /** @type {HTMLElement} */ (
        el.shadowRoot.querySelectorAll('.more-button-dropdown .first-level__item ')
    );

    const getButtonInFirstGroupItemOfMoreButtonMenu = el =>
    el.shadowRoot.querySelector('.more-button-dropdown .first-level__item button');

    const getFirstLevelItemsBeforeMoreButton = el =>
    /** @type {NodeListOf<HTMLElement>} */ (
        el.shadowRoot?.querySelectorAll(
        '.first-level__item:not(.more-button-item .first-level__item)',
        )
    );

    /**
     *
     * Sometimes when an element is in the DOM but hidden because of
     * different reasons (e.g. `display: none`, `visibility: hidden`,
     * an element is overlapped by another DIV),then element.checkVisibility()
     * might not always work as we expect.
     *
     * As a workaround we emit a `mouseup` event in the middle of the element
     * by its coordinates and see if the element catches the event.
     * If it does, we assume the element is visible on the page.
     *
     * Note, we don't use 'move' type, because it is unstanble and it does not
     * emmit mouseenter event in some cases.
     *
     * Note, we don't use 'click' type, because it has side effects
     * of clicking on the element which we don't want
     *
     * Note, we use `event.composedPath()[0]` instead of
     * event.composedPath().includes(element) because in some cases
     * like when the More button menu is hidden and we click at the position where
     * we expect the Li element to be rendered if the More button menu is open,
     * then in fact we click on the `l2 menu` which is a child of the Li element which is hidden.
     * In that case event.composedPath() will include the Li element even if it is hidden,
     * because the array list contains all element up to `body`
     *
     * @param {HTMLElement | null} element Note the element should have no chilren.
     * It should be the one where `mouseup` event start from.
     * It's important because we do exact comparison
     * @returns `true` if the element receives the right click event within 50ms,
     *  and `false` otherwise
     */
    const isVisible = async element => {
    let visible = false;

    if (!element) {
        return Promise.resolve(false);
    }

    const handleEvent = event => {
        visible = event.composedPath()[0] === element;
    };

    element?.addEventListener('mouseup', handleEvent);
    const { x, y } = getCoordinates(element);
    await sendMouse({ type: 'move', position: [x, y] });
    await sendMouse({ type: 'up' });

    return new Promise(resolve => {
        const timeoutHandle = setTimeout(() => {
        resetMouse();
        clearTimeout(timeoutHandle);
        element.removeEventListener('mouseup', handleEvent);
        resolve(visible);
        }, 50);
    });
    };

    const isMoreButtonMenuVisible = el =>
    isVisible(getButtonInFirstGroupItemOfMoreButtonMenu(el));

    it.skip('should show 3 items in the main nav and render `More` button', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    expect(getFirstLevelItemsBeforeMoreButton(el).length).to.equal(3);
    });

    it.skip('should show L2-L3 menu when clicking on an L1 in the main menu', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);
    const firstLevelFirstItem = el.shadowRoot.querySelector('.first-level__item');
    const firstLevelFirstItemButton = firstLevelFirstItem.querySelector(
        'button.menu-item--level-1',
    );
    firstLevelFirstItemButton.click();
    await aTimeout(100);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = firstLevelFirstItemButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(l2DropdownFirstItem).not.to.equal(null);
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);
    await aTimeout(10);
    });

    it.skip('should show 2 items in the more menu when clicking on `More` button', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);
    const moreButton = getMoreButton(el);
    moreButton.click();
    await aTimeout(100);
    const itemsInMoreMenu = getMoreButtonDropdownItems(el);

    expect(await isVisible(itemsInMoreMenu[0].querySelector('button'))).to.equal(true);
    expect(itemsInMoreMenu.length).to.equal(2);
    });

    it.skip('should open and then close More button menu when clicking 2 times on the More button', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);
    const moreButton = getMoreButton(el);
    moreButton.focus();
    moreButton.click();
    await aTimeout(100);
    const itemsInMoreMenu = getMoreButtonDropdownItems(el);
    const firstItemInMoreMenu = itemsInMoreMenu[0].querySelector('button');

    const isMenuVisibleAfterClickingMoreButtonOnce = await isVisible(firstItemInMoreMenu);
    expect(isMenuVisibleAfterClickingMoreButtonOnce).to.equal(true);
    expect(itemsInMoreMenu.length).to.equal(2);

    const { x, y } = getCoordinates(getMoreButton(el));
    await sendMouse({ type: 'click', position: [x, y] });
    const isMenuVisibleAfterClickingMoreButtonTwice = await isVisible(firstItemInMoreMenu);
    expect(isMenuVisibleAfterClickingMoreButtonTwice).to.equal(false);
    });

    it.skip('should show 2 items in the more menu when clicking on `More` button', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);
    const moreButton = getMoreButton(el);
    moreButton.click();
    await aTimeout(100);
    const itemsInMoreMenu = getMoreButtonDropdownItems(el);
    const firstItemInMoreMenu = itemsInMoreMenu[0];

    expect(await isVisible(firstItemInMoreMenu.querySelector('button'))).to.equal(true);
    expect(itemsInMoreMenu.length).to.equal(2);
    });

    it.skip('should show 3 items in the main menu and no `More` button', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith3Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);
    const moreButton = getMoreButton(el);

    await aTimeout(100);
    expect(moreButton).to.be.null;
    });

    it.skip('should remove `More` button when making font smaller', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith4Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);

    await waitUntil(() => getMoreButton(el)?.checkVisibility());
    const firstLevelItems = getFirstLevelItemsBeforeMoreButton(el);

    /**
     * Make font smaller for first level items to force
     * the menu render all 4 items and no `More` button
     */
    firstLevelItems.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.querySelector('.menu-item__title').style.fontSize = '12px';
    });
    el?.dispatchEvent(new CustomEvent('resize', { composed: true, bubbles: true }));

    await aTimeout(100);
    expect(getMoreButton(el)).to.be.null;
    });

    it.skip('should add `More` button when making font larger', async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith3Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    await aTimeout(100);
    expect(getMoreButton(el)).to.be.null;

    const firstLevelItems = getFirstLevelItemsBeforeMoreButton(el);

    /**
     * Wait 150+ ms before dispatching `resize` event to trigger recalculation of visible items.
     * Note 150ms is part of API ATM. There is a debounce feature for it.
     */
    await aTimeout(200);

    /**
     * Make font smaller for first level items to force
     * the menu render all 4 items and no `More` button
     */
    firstLevelItems.forEach(item => {
        // eslint-disable-next-line no-param-reassign
        item.querySelector('.menu-item__title').style.fontSize = '25px';
    });
    el?.dispatchEvent(new CustomEvent('resize', { composed: true, bubbles: true }));

    await aTimeout(100);
    expect(getMoreButton(el)).not.to.be.null;
    });

    it.skip(`[
        {
        action: 'Click on More button',
        expectation: 'more button menu is shown, l2 menu is hidden'
        },
        {
        action: 'Inside more button menu, click on L1 item that has L2',
        expectation: 'more button menu is hidden, l2 menu is shown'
        }
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    // click on More button
    await aTimeout(100);
    const moreButton = getMoreButton(el);
    moreButton.click();
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // click on L1 inside More button menu that has L2
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    l1ItemWithChildrenUnderMoreButton.click();
    await aTimeout(100);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(l2DropdownFirstItem).not.to.equal(null);
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);
    expect(l2DropdownFirstItem?.textContent.trim()).to.equal('4.1 Test test test test');
    await aTimeout(100);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);
    });

    it.skip(`[
    {
        action: 'Click on More button',
        expectation: 'more button menu is shown, l2 menu is hidden'
    },
    {
        action: 'Inside more button menu, click on L1 item that has L2',
        expectation: 'more button menu is hidden, l2 menu is shown'
    },
    {
        action: 'Click on More button',
        expectation: 'more button menu is shown, l2 menu is hidden'
    },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    // click on More button
    await aTimeout(100);
    getMoreButton(el).click();

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // click on L1 inside More button menu that has L2
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    l1ItemWithChildrenUnderMoreButton.click();
    await aTimeout(100);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(l2DropdownFirstItem).not.to.equal(null);
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);
    expect(l2DropdownFirstItem?.textContent.trim()).to.equal('4.1 Test test test test');
    await aTimeout(100);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // click on More button
    getMoreButton(el).click();
    await aTimeout(100);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure l2 menu is NOT visible
    expect(
        await isVisible(
        l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
            '.menu-item.menu-item--level-2',
        ),
        ),
    ).to.equal(false);
    await aTimeout(100);
    });

    it.skip(`[
        {
        action: 'Focus last visible L1 item in the main menu',
        },
        {
        action: 'Hit Tab',
        expectation: '
            more button menu is shown,
            the first L1 item in the more button menu is focused,
        '
        },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    getMoreButton(el).parentNode.previousElementSibling.querySelector('button').focus();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure the first L1 inside More button menu is focused
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    expect(getDeepActiveElement() === l1ItemWithChildrenUnderMoreButton).to.equal(true);
    await aTimeout(100);
    });

    it.skip(`[
        {
        action: 'Click on the L1 item that has children in the main menu',
        expectation: '
            L2 menu is shown,
        '
        },
        {
        action: 'Hit Tab many times so that the focus goes through all L2 and L3 items
        under the L1 item and finally reaches the More button',
        expectation: '
            L2 menu stays open,
        '
        },
        {
        action: 'When the Tab stays on the last L1 item before More button
            and then we hit Tab again to get into More button menu',
        expectation: '
            L2 menu from L1 that we clicked at the very first step is closed,
            More button menu is shown
        '
        },

    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    const lastVisibleL1Item = getMoreButton(el).parentNode.previousElementSibling;
    const lastVisibleL1ItemButton = lastVisibleL1Item.querySelector('button');
    lastVisibleL1ItemButton.focus();
    lastVisibleL1ItemButton.click();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure l2 menu is hidden
    const l2DropdownFirstItem = lastVisibleL1Item.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(await isVisible(l2DropdownFirstItem)).to.equal(false);
    });

    it.skip(`[
        {
        action: 'Focus last visible L1 item in the main menu',
        },
        {
        action: 'Hit Tab',
        expectation: '
            more button menu is shown,
            the first L1 item in the more button menu is focused,
        '
        },
        {
        action: 'Click on More button',
        expectation: '
            more button menu is hidden
        '
        },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    getMoreButton(el).parentNode.previousElementSibling.querySelector('button').focus();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure the first L1 inside More button menu is focused
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    expect(getDeepActiveElement() === l1ItemWithChildrenUnderMoreButton).to.equal(true);
    await aTimeout(10);

    // click on More button again
    const { x, y } = getCoordinates(getMoreButton(el));
    await sendMouse({ type: 'click', position: [x, y] });

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);
    });

    it.skip(`[
        {
        action: 'Focus last visible L1 item in the main menu',
        },
        {
        action: 'Hit Tab',
        expectation: '
            more button menu is shown,
            the first L1 item in the more button menu is focused,
        '
        },
        {
        action: 'Hit Shift + Tab',
        expectation: '
            more button menu is hidden,
            the last visible L1 item in the main menu is focused,
        '
        },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    getMoreButton(el).parentNode.previousElementSibling.querySelector('button').focus();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure the first L1 inside More button menu is focused
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    expect(getDeepActiveElement() === l1ItemWithChildrenUnderMoreButton).to.equal(true);
    await aTimeout(10);

    // hit Shift + Tab
    await sendKeys({
        down: 'Shift',
    });
    await sendKeys({
        press: 'Tab',
    });
    await sendKeys({
        up: 'Shift',
    });
    await aTimeout(10);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // make sure the last visible L1 item in the main menu is focused
    expect(
        getDeepActiveElement() ===
        getMoreButton(el).parentNode.previousElementSibling.querySelector('button'),
    ).to.equal(true);
    });

    it.skip(`[
        {
        action: 'Focus last visible L1 item in the main menu',
        },
        {
        action: 'Hit Tab',
        expectation: '
            more button menu is shown,
            the first L1 item in the more button menu is focused,
        '
        },
        {
        action: 'Hit Enter',
        expectation: '
            more button menu is hidden,
            l2 menu is show,
        '
        },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    getMoreButton(el).parentNode.previousElementSibling.querySelector('button').focus();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure the first L1 inside More button menu is focused
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    expect(getDeepActiveElement() === l1ItemWithChildrenUnderMoreButton).to.equal(true);
    await aTimeout(10);

    // hit Enter
    await sendKeys({
        press: 'Enter',
    });
    await aTimeout(10);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);
    });

    it.skip(`[
        {
        action: 'Focus last visible L1 item in the main menu',
        },
        {
        action: 'Hit Tab',
        expectation: '
            more button menu is shown,
            the first L1 item in the more button menu is focused,
        '
        },
        {
        action: 'Hit Enter',
        expectation: '
            more button menu is hidden,
            l2 menu is show,
        '
        },
        {
        action: 'Hit Shitft + Tab',
        expectation: '
            more button menu is show,
            l2 menu is hidden,
        '
        },
        {
        action: 'Hit Shift + Tab',
        expectation: '
            more button menu is hidden,
            the last visible L1 item in the main menu is focused,
        '
        },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    getMoreButton(el).parentNode.previousElementSibling.querySelector('button').focus();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure the first L1 inside More button menu is focused
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    expect(getDeepActiveElement() === l1ItemWithChildrenUnderMoreButton).to.equal(true);
    await aTimeout(10);

    // hit Enter
    await sendKeys({
        press: 'Enter',
    });
    await aTimeout(10);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);

    // hit Shift + Tab
    await sendKeys({
        down: 'Shift',
    });
    await sendKeys({
        press: 'Tab',
    });
    await sendKeys({
        up: 'Shift',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure l2 menu is hidden
    expect(
        await isVisible(
        l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
            '.menu-item.menu-item--level-2',
        ),
        ),
    ).to.equal(false);

    // hit Shift + Tab
    await sendKeys({
        down: 'Shift',
    });
    await sendKeys({
        press: 'Tab',
    });
    await sendKeys({
        up: 'Shift',
    });
    await aTimeout(10);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // make sure the last visible L1 item in the main menu is focused
    expect(
        getDeepActiveElement() ===
        getMoreButton(el).parentNode.previousElementSibling.querySelector('button'),
    ).to.equal(true);
    });

    it.skip(`[
        {
        action: 'Focus last visible L1 item in the main menu',
        },
        {
        action: 'Hit Tab',
        expectation: '
            more button menu is shown,
            the first L1 item in the more button menu is focused,
        '
        },
        {
        action: 'Hit Tab',
        expectation: '
            the SECOND L1 item in the more button menu is focused,
        '
        },
        {
        action: 'Hit Enter',
        expectation: '
            more button menu is hidden,
            l2 menu is show,
        '
        },
        {
        action: 'Hit Shift + Tab',
        expectation: '
            more button menu is show,
            l2 menu is hidden,
            the PARENT L1 item under the More button is focused, not the first one
        '
        }
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');
    await aTimeout(100);

    // focus last visible L1 item in the main menu
    getMoreButton(el).parentNode.previousElementSibling.querySelector('button').focus();
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure the first L1 inside More button menu is focused
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    expect(
        getDeepActiveElement() ===
        firstItemInMoreMenu.querySelector('button.menu-item.menu-item--level-1'),
    ).to.equal(true);
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure the SECOND L1 inside More button menu is focused
    expect(
        getDeepActiveElement() === getMoreButtonDropdownItems(el)[1].querySelector('button'),
    ).to.equal(true);
    await aTimeout(10);

    // hit Enter
    await sendKeys({
        press: 'Enter',
    });
    await aTimeout(10);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // make sure l2 menu is visible
    const secondL1UnderMoreButton = getMoreButtonDropdownItems(el)[1];
    const l2DropdownFirstItem = secondL1UnderMoreButton.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);

    // hit Shift + Tab
    await sendKeys({
        down: 'Shift',
    });
    await sendKeys({
        press: 'Tab',
    });
    await sendKeys({
        up: 'Shift',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure l2 menu is hidden
    expect(await isVisible(l2DropdownFirstItem)).to.equal(false);

    // make sure the SECOND L1 inside More button menu is focused
    expect(
        getDeepActiveElement() === getMoreButtonDropdownItems(el)[1].querySelector('button'),
    ).to.equal(true);
    await aTimeout(10);
    });

    it.skip(`[
    {
        action: 'Click on More button',
        expectation: 'more button menu is shown, l2 menu is hidden'
    },
    {
        action: 'Inside more button menu, click on L1 item that has L2',
        expectation: 'more button menu is hidden, l2 menu is shown'
    },
    {
        action: 'Hit Shift + Tab',
        expectation: '
        more button menu is show,
        l2 menu is hidden,
        the first L1 item under the More button is focused
        '
    },
    {
        action: 'Tab',
        expectation: '
        the SECOND L1 item under the More button is focused,
        the l2 menu is still hidden
        '
    },
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    // click on More button
    await aTimeout(100);
    const moreButton = getMoreButton(el);
    moreButton.click();
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // click on L1 inside More button menu that has L2
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    l1ItemWithChildrenUnderMoreButton.click();
    await aTimeout(100);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(l2DropdownFirstItem).not.to.equal(null);
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);
    expect(l2DropdownFirstItem?.textContent.trim()).to.equal('4.1 Test test test test');
    await aTimeout(100);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // hit Shift + Tab
    await sendKeys({
        down: 'Shift',
    });
    await sendKeys({
        press: 'Tab',
    });
    await sendKeys({
        up: 'Shift',
    });
    await aTimeout(10);

    // make sure More button menu is visible
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // make sure l2 menu is hidden
    expect(await isVisible(l2DropdownFirstItem)).to.equal(false);

    // make sure the SECOND L1 inside More button menu is focused
    expect(
        getDeepActiveElement() === getMoreButtonDropdownItems(el)[0].querySelector('button'),
    ).to.equal(true);
    await aTimeout(10);

    // hit Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure the SECOND L1 inside More button menu is focused
    expect(
        getDeepActiveElement() === getMoreButtonDropdownItems(el)[1].querySelector('button'),
    ).to.equal(true);
    await aTimeout(10);

    // make sure l2 menu is hidden
    expect(await isVisible(l2DropdownFirstItem)).to.equal(false);
    });

    it.skip(`[
    {
        action: 'Click on More button',
        expectation: 'more button menu is shown, l2 menu is hidden'
    },
    {
        action: 'Inside more button menu, click on L1 item that has L2, that has L3',
        expectation: 'more button menu is hidden, l2 menu is shown, first L2 item is focused'
    },
    {
        action: 'Tab',
        expectation: '
        First L3 item is focused
        '
    }
    ]`, async () => {
    await setViewport({ width: 1300, height: 768 });

    const navBarContainerCss = css`
        .relatively-positioned-parent {
        position: relative;
        }
        .navigation-bar__container {
        display: flex;
        flex-direction: column;
        width: auto;
        max-width: 1280px;
        border: 1px solid black;
        }
    `;

    const wrapper = await fixture(
        html`
        <div class="relatively-positioned-parent">
            <style>
            ${navBarContainerCss}
            </style>
            <div class="navigation-bar__container">
            <ing-menu-bar .menu=${menuWith5Items}></ing-menu-bar>
            </div>
        </div>
        `,
    );
    const el = wrapper.querySelector('ing-menu-bar');

    // click on More button
    await aTimeout(100);
    const moreButton = getMoreButton(el);
    moreButton.click();
    expect(await isMoreButtonMenuVisible(el)).to.equal(true);

    // click on L1 inside More button menu that has L2
    const firstItemInMoreMenu = getMoreButtonDropdownItems(el)[0];
    const l1ItemWithChildrenUnderMoreButton = firstItemInMoreMenu.querySelector(
        '.menu-item.menu-item--level-1',
    );
    l1ItemWithChildrenUnderMoreButton.click();
    await aTimeout(100);

    // make sure l2 menu is visible
    const l2DropdownFirstItem = l1ItemWithChildrenUnderMoreButton.parentNode.querySelector(
        '.menu-item.menu-item--level-2',
    );
    expect(l2DropdownFirstItem).not.to.equal(null);
    expect(await isVisible(l2DropdownFirstItem)).to.equal(true);
    expect(l2DropdownFirstItem?.textContent.trim()).to.equal('4.1 Test test test test');
    await aTimeout(100);

    // make sure More button menu is hidden
    expect(await isMoreButtonMenuVisible(el)).to.equal(false);

    // Tab
    await sendKeys({
        press: 'Tab',
    });
    await aTimeout(10);

    // make sure the first L3 item is focused
    const firstL3Item = l2DropdownFirstItem.parentNode.querySelector(
        'a.menu-item.menu-item--level-3.tabindex-element',
    );
    expect(getDeepActiveElement() === firstL3Item).to.equal(true);
    });
});