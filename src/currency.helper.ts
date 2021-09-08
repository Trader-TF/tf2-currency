import { CurrencyError } from '.';
import { ICurrency } from './currency.interface';

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
  const metal = Math.floor(value);
  const scrapInMetal = round(value - metal);
  return metal * 9 + (scrapInMetal * 100) / 11;
}

export function toRefined(value: number) {
  const metal = Math.floor(value / 9);
  const scrap = ((value - metal * 9) * 11) / 100;
  return metal + scrap;
}

export function fromKeysToCurrency(value: number, conversion = 0) {
  const keys = Math.floor(value);
  const metalInKeys = round(value - keys);
  if (metalInKeys && !conversion) {
    throw new CurrencyError(
      'Conversion value is required when metal is present.',
    );
  }

  const conversionInScrap = toScrap(conversion);
  const scrap = Math.round(metalInKeys * conversionInScrap);
  const metal = toRefined(scrap);

  return {
    keys,
    metal,
  };
}

export function isEqual(currencyA: ICurrency, currencyB: ICurrency): boolean {
  return (
    currencyA.keys === currencyB.keys && currencyA.metal === currencyB.metal
  );
}

export function isBigger(currencyA: ICurrency, currencyB: ICurrency): boolean {
  return (
    currencyA.keys > currencyB.keys ||
    (currencyA.keys === currencyB.keys && currencyA.metal > currencyB.metal)
  );
}

export function isSmaller(currencyA: ICurrency, currencyB: ICurrency): boolean {
  return (
    currencyA.keys < currencyB.keys ||
    (currencyA.keys === currencyB.keys && currencyA.metal < currencyB.metal)
  );
}

export function isBiggerOrEqual(
  currencyA: ICurrency,
  currencyB: ICurrency,
): boolean {
  return (
    currencyA.keys > currencyB.keys ||
    (currencyA.keys === currencyB.keys && currencyA.metal >= currencyB.metal)
  );
}

export function isSmallerOrEqual(
  currencyA: ICurrency,
  currencyB: ICurrency,
): boolean {
  return (
    currencyA.keys < currencyB.keys ||
    (currencyA.keys === currencyB.keys && currencyA.metal <= currencyB.metal)
  );
}
