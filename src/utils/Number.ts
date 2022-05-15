export function isNumber(text: string | number): boolean {
  return !Number.isNaN(Number(text));
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function percentToFraction(value: number) {
  return value / 100 + 1;
}
