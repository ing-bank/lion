import { expect } from '@open-wc/testing';
import { updateNavData } from './updateNavData.js';

describe('updateNavData', () => {
  it('adds `active` state for current url', () => {
    const myNavData = { items: [{ name: 'myName', url: '/my-url' }] };
    updateNavData(myNavData, { activePath: '/my-url' });
    expect(myNavData).to.deep.equal({ items: [{ name: 'myName', url: '/my-url', active: true }] });

    const mySecondNavData = {
      items: [
        { name: 'myName', url: '/my-url' },
        { name: 'mySecondName', url: '/my-second-url' },
      ],
    };
    updateNavData(mySecondNavData, { activePath: '/my-second-url' });
    expect(mySecondNavData).to.deep.equal({
      items: [
        { name: 'myName', url: '/my-url' },
        { name: 'mySecondName', url: '/my-second-url', active: true },
      ],
    });
  });

  it('adds `hasActiveChild` state to parent of current url', () => {
    const myNestedNavData = {
      items: [
        {
          name: 'myName',
          nextLevel: { items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item' }] },
        },
      ],
    };
    updateNavData(myNestedNavData, { activePath: '/my-url/next-level-item' });
    expect(myNestedNavData).to.deep.equal({
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item', active: true }],
          },
        },
      ],
    });
  });

  it('resets all state when {shouldReset:true} provided', () => {
    const myActiveNavData = {
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item', active: true }],
          },
        },
      ],
    };
    updateNavData(myActiveNavData, { shouldReset: true });
    expect(myActiveNavData).to.deep.equal({
      items: [
        {
          name: 'myName',
          nextLevel: {
            items: [{ name: 'nextLevelItem', url: '/my-url/next-level-item' }],
          },
        },
      ],
    });
  });

  it('does not reset state when of a newly set active parent', () => {
    const myActiveNavData = {
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [
              {
                name: 'l1Item',
                url: '/my-url/l1-item',
                hasActiveChild: true,
                nextLevel: {
                  items: [
                    {
                      name: 'l2Item',
                      url: '/my-url/l1-item/l2-item',
                      active: true,
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    };
    // When we set our parent to active, we should not reset the state
    const parentOfActive = myActiveNavData.items[0].nextLevel.items[0];

    updateNavData(myActiveNavData, { shouldReset: true, activeItem: parentOfActive });

    expect(myActiveNavData).to.deep.equal({
      items: [
        {
          name: 'myName',
          hasActiveChild: true,
          nextLevel: {
            items: [
              {
                name: 'l1Item',
                active: true,
                url: '/my-url/l1-item',
                nextLevel: {
                  items: [
                    {
                      name: 'l2Item',
                      url: '/my-url/l1-item/l2-item',
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });
});
