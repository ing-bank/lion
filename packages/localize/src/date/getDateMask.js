import { localize} from '../localize.js';
import { formatDate } from './formatDate.js';
import { getDateFormatBasedOnLocale } from './getDateFormatBasedOnLocale.js';

const loaded = localize.loadNamespace({
  'lion-localize': (locale) => {
    return import(`../../translations/${locale}.js`);
  },
});

export async function getDateMask({ locale }) {
  const dateFormatParts = getDateFormatBasedOnLocale(locale).split('-');
  const separator = formatDate(new Date('2000-01-01'), { locale }).replace(/\d/g, '')[0];

  await loaded;
  const dateMask = dateFormatParts.map((p) =>
    localize.msg(`lion-localize:${p}Char`, {}, { locale }).repeat(p === 'year' ? 4 : 2),
  ).join(separator).toUpperCase();
  console.log(dateMask);
  return dateMask;
}
