// Turns a url segment or folder name into a label: 'checkbox-group' -> 'Checkbox Group'
export function humanise(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
