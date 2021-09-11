import {
  round,
  toScrap,
  toRefined,
  fixMetal,
  fromKeysToCurrency,
  isEqual,
  isBigger,
  isSmaller,
  isBiggerOrEqual,
  isSmallerOrEqual,
  pluralizeKeys,
} from './currency.helper';
import { CurrencyError } from './currency.error';
import { ICurrency } from './currency.interface';

export class Currency implements ICurrency {
  public keys: number;
  public metal: number;

  constructor(currency: Partial<ICurrency>) {
    this.keys = currency.keys || 0;
    this.metal = fixMetal(currency.metal || 0);
  }

  static fromScrap(scrap: number, conversion = 0) {
    const conversionInScrap = toScrap(conversion);
    const rounding = scrap < 0 ? Math.ceil : Math.floor;
    const keys = conversionInScrap ? rounding(scrap / conversionInScrap) : 0;
    const metalInScrap = scrap - keys * conversionInScrap;
    const metal = toRefined(metalInScrap);
    return new Currency({
      keys,
      metal,
    });
  }

  static fromKeys(value: number, conversion = 0) {
    return new Currency(fromKeysToCurrency(value, conversion));
  }

  clone() {
    return new Currency(this);
  }

  isEmpty() {
    return this.keys === 0 && this.metal === 0;
  }

  toScrap(conversion = 0) {
    if (this.keys && !conversion) {
      throw new CurrencyError(
        'Conversion value is required when keys are present.',
      );
    }

    const conversionInScrap = toScrap(conversion);
    const metalInScrap = toScrap(this.metal);
    const keysInScrap = this.keys * conversionInScrap;
    return keysInScrap + metalInScrap;
  }

  toKeys(conversion = 0) {
    if (this.metal && !conversion) {
      throw new CurrencyError(
        'Conversion value is required when metal is present.',
      );
    }

    const conversionInScrap = toScrap(conversion);
    const metalInScrap = toScrap(this.metal);
    const metalInKeys = conversion
      ? round(metalInScrap / conversionInScrap)
      : 0;

    return this.keys + metalInKeys;
  }

  toString() {
    if (!this.keys && !this.metal) {
      return '0 keys, 0 metal';
    }

    let currency = '';

    if (this.keys) {
      currency += pluralizeKeys(this.keys);
    }

    if (this.metal) {
      if (currency) {
        currency += ', ';
      }

      currency += `${this.metal} metal`;
    }

    return currency;
  }

  toJSON() {
    return {
      keys: this.keys,
      metal: this.metal,
    };
  }

  addScrap(value: number, conversion = 0) {
    const currentScrapValue = this.toScrap(conversion);
    const total = currentScrapValue + value;
    const currency = Currency.fromScrap(total, conversion);
    this.keys = currency.keys;
    this.metal = currency.metal;
    return this;
  }

  addMetal(value: number, conversion?: number) {
    return this.addScrap(toScrap(value), conversion);
  }

  addKeys(value: number, conversion: number) {
    return this.addCurrency(fromKeysToCurrency(value, conversion), conversion);
  }

  addCurrency(currency: ICurrency, conversion?: number) {
    return this.addScrap(
      new Currency(currency).toScrap(conversion),
      conversion,
    );
  }

  removeScrap(value: number, conversion?: number) {
    return this.addScrap(-value, conversion);
  }

  removeMetal(value: number, conversion?: number) {
    return this.addMetal(-value, conversion);
  }

  removeKeys(value: number, conversion: number) {
    return this.addKeys(-value, conversion);
  }

  removeCurrency(currency: ICurrency, conversion?: number) {
    return this.addCurrency(
      {
        keys: -currency.keys,
        metal: -currency.metal,
      },
      conversion,
    );
  }

  isEqual(currency: ICurrency) {
    return isEqual(this, currency);
  }

  isBigger(currency: ICurrency) {
    return isBigger(this, currency);
  }

  isSmaller(currency: ICurrency) {
    return isSmaller(this, currency);
  }

  isBiggerOrEqual(currency: ICurrency) {
    return isBiggerOrEqual(this, currency);
  }

  isSmallerOrEqual(currency: ICurrency) {
    return isSmallerOrEqual(this, currency);
  }
}
