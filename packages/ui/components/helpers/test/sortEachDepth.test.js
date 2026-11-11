import { expect } from '@open-wc/testing';
import { sortEachDepth } from '@lion/ui/helpers.js';

/**
 * Builds the `[id, { kind }]` tuples Storybook passes to `storySort`.
 * @param {string} kind
 * @returns {[string, { kind: string }]}
 */
const story = kind => [kind, { kind }];

/**
 * @param {string[][]} orderPerDepth
 * @param {string[]} kinds
 */
const sortKinds = (orderPerDepth, kinds) =>
  kinds
    .map(story)
    .sort(sortEachDepth(orderPerDepth))
    .map(([kind]) => kind);

describe('sortEachDepth', () => {
  it('returns 0 for stories of the same kind', () => {
    expect(sortEachDepth([])(story('A/B'), story('A/B'))).to.equal(0);
  });

  it('orders the first level according to the given order', () => {
    expect(sortKinds([['Intro', 'Forms', 'Buttons']], ['Buttons', 'Forms', 'Intro'])).to.eql([
      'Intro',
      'Forms',
      'Buttons',
    ]);
  });

  it('puts unknown names at the place of "..."', () => {
    expect(sortKinds([['Intro', '...', 'System']], ['System', 'Other', 'Intro'])).to.eql([
      'Intro',
      'Other',
      'System',
    ]);
  });

  it('sorts unknown names alphabetically at the place of "...abc"', () => {
    expect(sortKinds([['Intro', '...abc']], ['Zeta', 'Alpha', 'Intro'])).to.eql([
      'Intro',
      'Alpha',
      'Zeta',
    ]);
  });

  it('orders each depth with its own order', () => {
    expect(
      sortKinds(
        [['Forms'], ['Overview', '...']],
        ['Forms/Input', 'Forms/Overview', 'Forms/Select'],
      ),
    ).to.eql(['Forms/Overview', 'Forms/Input', 'Forms/Select']);
  });

  it('terminates for kinds that only differ by a trailing slash', () => {
    const compare = sortEachDepth([['A'], ['B']]);
    expect(compare(story('A/B'), story('A/B/'))).to.equal(0);
    expect(compare(story('A/B/'), story('A/B'))).to.equal(0);
  });

  it('throws when "..." and "...abc" are both used on the first level', () => {
    expect(() => sortEachDepth([['...', '...abc']])(story('A'), story('B'))).to.throw(
      'You need to use either "..." or "...abc" for each level.',
    );
  });

  it('throws when "..." and "...abc" are both used on a deeper level', () => {
    expect(() => sortEachDepth([['A'], ['...', '...abc']])(story('A/B'), story('A/C'))).to.throw(
      'You need to use either "..." or "...abc" for each level.',
    );
  });
});
