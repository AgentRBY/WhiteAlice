export function upFirstLetter(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

export function formatNames(text: string, separator = ' '): string {
  return text
    .split(separator)
    .map((character) => upFirstLetter(character))
    .join(separator);
}
