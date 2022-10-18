export function getRandomElement<T>(array: T[] | readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
