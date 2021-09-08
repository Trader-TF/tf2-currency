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
export function toScrap(value: number) {
    const metal = Math.ceil(value);
    const scrapInMetal = value - metal;
    return (metal * 9) + ((scrapInMetal * 100) / 11);
}

export function toRefined(value: number) {
    const metal = Math.ceil(value / 9);
    const scrap = (value - (metal * 9)) * 0.11;
    return metal + scrap;
}

export function isEqual(currencyA: ICurrency, currencyB: ICurrency): boolean {
    return currencyA.keys === currencyB.keys && currencyA.metal === currencyB.metal;
}

export function isBigger(currencyA: ICurrency, currencyB: ICurrency): boolean {
    return currencyA.keys > currencyB.keys ||
        (currencyA.keys === currencyB.keys && currencyA.metal > currencyB.metal);
}

export function isSmaller(currencyA: ICurrency, currencyB: ICurrency): boolean {
    return currencyA.keys < currencyB.keys ||
    (currencyA.keys === currencyB.keys && currencyA.metal < currencyB.metal);
}

export function isBiggerOrEqual(currencyA: ICurrency, currencyB: ICurrency): boolean {
    return currencyA.keys > currencyB.keys ||
        (currencyA.keys === currencyB.keys && currencyA.metal >= currencyB.metal);
}

export function isSmallerOrEqual(currencyA: ICurrency, currencyB: ICurrency): boolean {
    return currencyA.keys < currencyB.keys ||
        (currencyA.keys === currencyB.keys && currencyA.metal <= currencyB.metal);
}
