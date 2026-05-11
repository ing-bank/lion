---
title: 'Menu: Extensions'
parts:
  - Menu
  - Extensions
eleventyNavigation:
  key: 'Menu: Extensions'
  order: 10
  parent: Menu
  title: Extensions
---

# Menu: Extensions

```js script
import { html } from 'lit';
import '@lion/ui/define/lion-navigation-bar.js';

// N.B. data structure designed to be compatible with existing extension layer
// TODO: maybe refactor api and bridge

const menuData = [
    {
      title: 'Products',
      link: 'products',
      sub: [
        {
          title: 'Payments',
          link: 'payments-collections',
          sub: [
            { title: 'Payments & Collections', link: '#' },
            { title: 'Merchant Commerce Solutions', link: 'merchant-commerce-solutions' },
            { title: 'Instant Payments', link: 'instant-payments' },
            { title: 'SEPA Direct Debit', link: 'SEPA-direct-debit' },
            { title: 'SEPA Credit Transfer', link: 'SEPA-credit-transfer' },
            { title: 'International Credit Transfer', link: 'international-credit-transfer' },
            { title: 'Account Reporting', link: 'account-deporting' },
          ],
        },
        {
          title: 'Savings',
          link: 'savings-collection',
          sub: [
            { title: 'Liquidity & Cash Management', link: 'liquidity-cash-management' },
            { title: 'Physcial Cash Management', link: 'physcial-cash-management' },
            { title: 'Notional Cash Management', link: 'notional-cash-management' },
            { title: 'Virtual Cash Management', link: 'virtual-cash-management' },
            { title: 'Liquidity Management', link: 'liquidity-management' },
            { title: 'Excess Cash', link: 'excess-cash' },
          ],
        },
        {
          title: 'Investing',
          link: 'investing-collection',
          sub: [
            { title: 'Digital Banking Services', link: 'home' },
            { title: 'InsideBusiness', link: 'home' },
            { title: 'Connectivity Solutions', link: 'connectivity-solutions' },
          ],
        },
        {
          title: 'Mortgages',
          link: 'mortgages-collections',
          sub: [
            { title: 'Payments & Collections', link: '#' },
            { title: 'Merchant Commerce Solutions', link: 'merchant-commerce-solutions' },
            { title: 'Instant Payments', link: 'instant-payments' },
            { title: 'SEPA Direct Debit', link: 'SEPA-direct-debit' },
            { title: 'SEPA Credit Transfer', link: 'SEPA-credit-transfer' },
            { title: 'International Credit Transfer', link: 'international-credit-transfer' },
            { title: 'Account Reporting', link: 'account-deporting' },
          ],
        },
        {
          title: 'Loans',
          link: 'loans-collection',
          sub: [
            { title: 'Liquidity & Cash Management', link: 'liquidity-cash-management' },
            { title: 'Physcial Cash Management', link: 'physcial-cash-management' },
            { title: 'Notional Cash Management', link: 'notional-cash-management' },
            { title: 'Virtual Cash Management', link: 'virtual-cash-management' },
            { title: 'Liquidity Management', link: 'liquidity-management' },
            { title: 'Excess Cash', link: 'excess-cash' },
          ],
        },
        {
          title: 'Insurances',
          link: 'insurances-collection',
          sub: [
            { title: 'Digital Banking Services', link: 'home' },
            { title: 'InsideBusiness', link: 'home' },
            { title: 'Connectivity Solutions', link: 'connectivity-solutions' },
          ],
        },
        {
          title: 'Digital banking',
          link: 'digital-banking',
        },
      ],
    },
    {
      title: "Who it's for",
      link: 'who',
      sub: [
        {
          title: 'Parents & kids',
          link: 'parents-kids',
          sub: [
            { title: 'Child current account', link: '#child-current' },
            { title: 'Youth current account', link: '#youth-current' },
            { title: 'Child savings account', link: '#child-savings' },
          ],
        },
        {
          title: 'Students',
          link: 'students',
          sub: [
            { title: 'Student account', link: '#student-account' },
            { title: 'Smart payments', link: '#smart-payments' },
            { title: 'Smart savings', link: '#smart-savings' },
            { title: 'Smart banking', link: '#smart-banking' },
            { title: 'Smart for now', link: '#smart-for-now' },
            { title: 'Smart for later', link: '#smart-for-later' },
          ],
        },
        {
          title: "I'm an expat",
          link: 'expat',
          sub: [
            { title: 'Open a Dutch banking account', link: '#open' },
            { title: 'Investments', link: '#investments' },
            { title: 'Mortgage', link: '#mortgage' },
            { title: 'Health insurance', link: '#insurance' },
          ],
        },
      ],
    },
    {
      title: 'Themes',
      link: 'themes',
      sub: [
        {
          title: 'Living',
          link: 'living-collections',
          sub: [
            { title: 'Payments & Collections', link: '#' },
            { title: 'Merchant Commerce Solutions', link: 'merchant-commerce-solutions' },
            { title: 'Instant Payments', link: 'instant-payments' },
            { title: 'SEPA Direct Debit', link: 'SEPA-direct-debit' },
            { title: 'SEPA Credit Transfer', link: 'SEPA-credit-transfer' },
            { title: 'International Credit Transfer', link: 'international-credit-transfer' },
            { title: 'Account Reporting', link: 'account-deporting' },
          ],
        },
        {
          title: 'Wealth',
          link: 'wealth-collections',
          sub: [
            { title: 'Liquidity & Cash Management', link: 'liquidity-cash-management' },
            { title: 'Physcial Cash Management', link: 'physcial-cash-management' },
            { title: 'Notional Cash Management', link: 'notional-cash-management' },
            { title: 'Virtual Cash Management', link: 'virtual-cash-management' },
            { title: 'Liquidity Management', link: 'liquidity-management' },
            { title: 'Excess Cash', link: 'excess-cash' },
          ],
        },
      ],
    },
    {
      title: 'Loyalty shop',
      link: '#points',
    },
    {
      title: 'Make an appointment',
      link: '#appointment',
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
  }

  const ctaSecondary = {
    id: 'cta-secondary',
    label: 'Open an account',
    href: '#open-account',
  }

  // N.B. these should be provided via api call
  const suggestions = ['A', 'B', 'C', 'D'];
```


```js preview-story
export const navigationBar = () => {
  return html`<lion-navigation-bar .menuItems="${menuData}" .menuSupportItems="${secondaryMenu}" .ctaPrimary="${ctaPrimary}" .ctaSecondary="${ctaSecondary}" .suggestions="${suggestions}"> .prefilledSuggestion="${suggestions[0]}"</lion-navigation-bar>`;
};
```
