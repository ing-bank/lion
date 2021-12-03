/**
 * @desc Can be called from a button click handler in order to let the end user download a file
 * @param {string} filename like 'overview.csv'
 * @param {string} content for instance a csv file
 */
export function downloadFile(filename, content) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
