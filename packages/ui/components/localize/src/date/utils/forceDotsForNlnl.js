/**
 * @param {string[]} months
 */
export function forceDotsForNlnl(months) {
  return months.map(m => {
    if (m !== 'mei' && !m.endsWith('.')) {
      return `${m}.`;
    }
    return m;
  });
}
