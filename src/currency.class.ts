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
} from './currency.helper';
import { CurrencyError } from './currency.error';
import { ICurrency } from './currency.interface';

export class Currency implements ICurrency {
  public keys: number;
  public metal: number;

  constructor(currency: Partial<ICurrency>) {
    this.keys = currency.keys || 0;
    if (this.keys < 0) {
      throw new CurrencyError('Supplied key value is negative.');
    }

    this.metal = fixMetal(currency.metal || 0);
    if (this.metal < 0) {
      throw new CurrencyError('Supplied metal value is negative.');
    }
  }

  static fromScrap(scrap: number, conversion: number = 0) {
    const conversionInScrap = toScrap(conversion);
    const keys = conversionInScrap ? Math.floor(scrap / conversionInScrap) : 0;
    const metalInScrap = scrap - keys * conversionInScrap;
    const metal = toRefined(metalInScrap);
    return new Currency({
      keys,
      metal,
    });
  }

  static fromKeys(value: number, conversion: number = 0) {
    return new Currency(fromKeysToCurrency(value, conversion));
  }

  toScrap(conversion: number = 0) {
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

  toKeys(conversion: number = 0) {
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
      currency += `${this.keys} key${this.keys > 1 ? 's' : ''}`;
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

  addScrap(value: number, conversion: number = 0) {
    const metalInScrap = toScrap(this.metal);
    let metalToAppend = metalInScrap + value;
    if (conversion) {
      const conversionInScrap = toScrap(conversion);
      const extraKeys = Math.floor(metalToAppend / conversionInScrap);
      metalToAppend -= extraKeys * conversionInScrap;
      this.keys += extraKeys;
    }
    this.metal = toRefined(metalToAppend);
    return this;
  }

  addMetal(value: number, conversion?: number) {
    return this.addScrap(toScrap(value), conversion);
  }

  addKeys(value: number, conversion?: number) {
    return this.addCurrency(fromKeysToCurrency(value, conversion), conversion);
  }

  addCurrency(currency: ICurrency, conversion?: number) {
    this.addMetal(currency.metal, conversion);
    this.keys += currency.keys;

    return this;
  }

  removeScrap(value: number, conversion?: number) {
    const metalInScrap = toScrap(this.metal);
    const resultScrap = round(metalInScrap - value);
    if (resultScrap < 0) {
      if (!conversion) {
        throw new CurrencyError(
          'You have to supply conversion value when metal is negative.',
        );
      }

      if (!this.keys) {
        throw new CurrencyError('Cannot remove said value.');
      }

      const conversionInScrap = toScrap(conversion);
      this.keys--;
      this.metal = toRefined(conversionInScrap + resultScrap);
      return this;
    }

    this.metal = toRefined(resultScrap);
    return this;
  }

  removeMetal(value: number, conversion?: number) {
    return this.removeScrap(toScrap(value), conversion);
  }

  removeKeys(value: number, conversion?: number) {
    return this.removeCurrency(
      fromKeysToCurrency(value, conversion),
      conversion,
    );
  }

  removeCurrency(currency: ICurrency, conversion?: number) {
    this.removeMetal(currency.metal, conversion);

    this.keys -= currency.keys;
    if (this.keys < 0) {
      throw new CurrencyError('Cannot remove said value.');
    }

    return this;
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
