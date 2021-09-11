import { Currency } from './currency.class';
import { CurrencyError } from './currency.error';
import { ICurrency } from './currency.interface';

/**
 * Rounds a number
 * @param n number we are rounding
 * @param d number of decimals we round to
 * @returns rounded number
 */
export function round(n: number, d = 2) {
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
  const scrap = metal * 9 + (scrapInMetal * 100) / 11;
  return Math.round(scrap * 2) / 2;
}

export function toRefined(value: number) {
  const isNegative = value < 0;
  const metal = (isNegative ? -1 : 1) * Math.floor(Math.abs(value) / 9);
  const remainingMetal = value - metal * 9;

  const rounding = (isNegative ? remainingMetal < -5 : remainingMetal < 5)
    ? Math.floor
    : Math.ceil;

  const scrap = rounding(remainingMetal * 11) / 100;
  return metal + scrap;
}

export function fixMetal(metal: number): number {
  return toRefined(toScrap(metal));
}

export function fixCurrency(currency: Partial<ICurrency>) {
  return {
    keys: currency.keys || 0,
    metal: fixMetal(currency.metal || 0),
  };
}

export function fromKeysToCurrency(value: number, conversion = 0) {
  const isNegative = value < 0;
  const keys = isNegative ? Math.ceil(value) : Math.floor(value);
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

export function c(currency: Partial<ICurrency>): Currency {
  return new Currency(currency);
}

export function pluralizeKeys(value: number) {
  if (value === 0) {
    return '0 keys';
  }

  return `${value} ${
    value < 0 ? (value < -1 ? 'keys' : 'key') : value > 1 ? 'keys' : 'key'
  }`;
}
