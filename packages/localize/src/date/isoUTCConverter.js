/**
 * To parse a string into the UTC Date format
 *
 * @param string
 * @returns {Date}
 */
const parseISOString = s => {
  const b = s.split(/\D+/);
  // eslint-disable-next-line no-plusplus
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
};

/**
 * To parse a date into the ISO Format
 *
 * @param date
 * @returns {Date}
 */
const isoFormatDMY = d => {
  const pad = n => {
    return (n < 10 ? '0' : '') + n;
  };
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
};

export { parseISOString, isoFormatDMY };
