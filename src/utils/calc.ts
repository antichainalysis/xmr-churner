export function calculateAmuRange(totalBalance: number): [number, number] {
    let minRange: number;
    let maxRange: number;

    if (totalBalance < 100) {
        minRange = Math.floor(totalBalance * 0.1); // 10% of total as min
        maxRange = Math.floor(totalBalance * 0.3); // 30% of total as max
    } else if (totalBalance < 1000) {
        const percentage = Math.random() * (0.3 - 0.1) + 0.1; // Random 10%-30% range
        const rangeSize = totalBalance * percentage;

        minRange = Math.floor(rangeSize * 0.5); // 50% of range size as min
        maxRange = Math.floor(rangeSize * 1.5); // 150% of range size as max

        maxRange = Math.min(maxRange, 160); // cap to 160 max
    } else {
        const percentage = Math.random() * (0.15 - 0.05) + 0.05; // Random 5%-15% range
        const rangeSize = totalBalance * percentage;

        minRange = Math.floor(rangeSize * 0.6); // 60% of range size as min
        maxRange = Math.floor(rangeSize * 1.2); // 120% of range size as max

        // 4 figs
        if (totalBalance >= 1000 && totalBalance < 10000) {
            minRange = Math.floor(Math.random() * (150 - 100) + 150); // Random min between 150 and 200
            maxRange = Math.floor(Math.random() * (250 - 150) + 150); // Random max between 150 and 250
        }

        // 5 figs
        if (totalBalance >= 10000 && totalBalance < 100000) {
            minRange = Math.floor(Math.random() * (300 - 200) + 200); // Random min between 200 and 250
            maxRange = Math.floor(Math.random() * (500 - 300) + 300); // Random max between 300 and 500
        }
    }

    minRange = Math.max(1, minRange);
    maxRange = Math.max(minRange + 1, maxRange);
  
    return [
        minRange, 
        maxRange
    ];
}
