export function randomRange(range: [number, number]) {
    return Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
}
