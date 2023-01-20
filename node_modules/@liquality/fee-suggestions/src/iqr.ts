/**
 * Computes a quantile for a numeric array.
 * @param arr
 * @param prob
 * @param sorted
 * @returns
 */
export function quantile(arr: Array<number>, prob: number, sorted = true): number {
    const len = arr.length;

    if (!sorted) {
        arr = arr.sort(ascending);
    }

    if (prob === 0.0) {
        return arr[0];
    }

    if (prob === 1.0) {
        return arr[len - 1];
    }

    const vectorIndex = len * prob - 1;
    if (vectorIndex === Math.floor(vectorIndex)) {
        return (arr[vectorIndex] + arr[vectorIndex + 1]) / 2.0;
    }

    return arr[Math.ceil(vectorIndex)];
}

/**
 * 1st quartile or lower quartile basically separate the lowest 25% of data from the highest 75%.
 */
const LOWER_QUARTILE = 0.25;

/**
 * 3rd quartile or the upper quartile separate the highest 25% of data from the lowest 75%.
 */
const UPPER_QUARTILE = 0.75;

/**
 *
 * The IQR (Interquartile Range) describes the middle 50% of values when ordered from lowest to highest.
 * To find the interquartile range (IQR), ​first find the median (middle value) of the lower and upper half of the data.
 * These values are quartile 1 (Q1) and quartile 3 (Q3). The IQR is the difference between Q3 and Q1.
 * ----------------------------------
 * |                                |
 * |   25%    25%     25%     25%   |
 * |       Q1      Q2      Q3       |
 * ----------------------------------
 *               Median
 * @param arr
 * @returns
 */
export function iqr(arr: Array<number>): number[] {
    const sorted = arr.sort(ascending);
    const Q1 = quantile(sorted, LOWER_QUARTILE);
    const Q3 = quantile(sorted, UPPER_QUARTILE);
    const filtered = sorted.filter((n: number) => n <= Q3 && n >= Q1);
    return filtered;
}

function ascending(a: number, b: number) {
    return a - b;
}
