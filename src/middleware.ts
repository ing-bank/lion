import type { MiddlewareHandler } from 'astro';
//import getInfo from '../docs/_data/site.cjs';
// console.log('test');
// console.log(getInfo);

export const onRequest: MiddlewareHandler = ({ locals }, next) => {
  //const info = getInfo();
  const info = {
    dir: 'ltr',
    lang: 'en-GB',
    name: 'Lion',
    description: 'Fundamental white label web components for building your design system',
    socialLinks: [
      {
        name: 'GitHub',
        url: 'https://github.com/ing-bank/lion',
      },
    ],
    gitSiteUrl: 'https://github.com/ing-bank/lion',
    gitBranch: 'master',
    helpUrl: 'https://github.com/ing-bank/lion/issues',
    logoAlt: 'Lion Logo',
    iconColorMaskIcon: '#3f93ce',
    iconColorMsapplicationTileColor: '#1d3557',
    iconColorThemeColor: '#1d3557',
    analytics: 'G-151V7YV71K',
  };
  Object.keys(info).forEach(infoKey => {
    locals[infoKey] = info[infoKey];
  });

  return next();
}
