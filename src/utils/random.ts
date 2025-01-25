/**
 * Generate a random number with range
 * @param {number[]} range - The start and end of the range.
 * @returns {number} Random number within specified range.
 */
export function randomRange(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}
