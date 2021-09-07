/**
 * Rounds a number
 * @param n number we are rounding
 * @param d number of decimals we round to
 * @returns rounded number
 */
export function round(n: number, d: number = 2) {
    const factor = Math.pow(10, d);
    return Math.round(n * factor) / factor;
}

/**
 * Converts refined to scrap.
 * @param value in refined
 */
export function toScrap(value: string) {
    return round(value * 9);
}

export function isEqual(currencyA: ICurrency, currencyB: ICurrency) {
    return currencyA.keys === currencyB.keys && currencyA.metal === currencyB.metal;
}

//...