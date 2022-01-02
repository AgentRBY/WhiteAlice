export function upFirstLetter(text: string): string {
  return text[0].toUpperCase() + text.slice(1);
}

export function upAllFirstLatter(text: string): string {
  return text
    .split(' ')
    .map((word) => upFirstLetter(word))
    .join(' ');
}

export function formatNames(text: string, separator = ' '): string {
  return text
    .split(separator)
    .map((character) => upFirstLetter(character))
    .join(separator);
}
