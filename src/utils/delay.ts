import { randomRange } from './random';

/**
 * Random delay within the given range.
 * @param {number[]} delayRange - Minimum and maximum delay in milliseconds
 */
export function randomDelay(delayRange: [number, number]) {
  return new Promise((r) => {
    const ms = randomRange(delayRange);

    console.log('waiting', Math.floor(ms / (60 * 1000)), 'minutes');

    setTimeout(r, ms);
  });
}
