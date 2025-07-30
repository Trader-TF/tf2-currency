import {
  round,
  toScrap,
  toRefined,
  fromKeysToCurrency,
  isEqual,
  isBigger,
  isSmaller,
  isBiggerOrEqual,
  isSmallerOrEqual,
  pluralizeKeys,
  toWeapons,
  toRefinedFromWeapons,
  w,
  fixMetal,
  isWeaponizedCurrency,
  isClassicCurrency,
  compareTo,
} from './currency.helper';
import { CurrencyError } from './currency.error';
import { ICurrency, IWeaponizedCurrency } from './currency.interface';

export class Currency implements ICurrency, IWeaponizedCurrency {
  public keys: number;

  public get metal() {
    return toRefinedFromWeapons(this.metalInWeapons);
  }

  public metalInWeapons: number;

  constructor(currency: Partial<ICurrency | IWeaponizedCurrency> = {}) {
    this.keys = currency.keys || 0;

    if (isWeaponizedCurrency(currency)) {
      this.metalInWeapons = currency.metalInWeapons || 0;
    } else if (isClassicCurrency(currency)) {
      this.metalInWeapons = toWeapons(fixMetal(currency.metal || 0));
    } else {
      this.metalInWeapons = 0;
    }
  }

  static fromScrap(scrap: number, conversion = 0) {
    const conversionInScrap = toScrap(conversion);
    const roundMethod = scrap < 0 ? Math.ceil : Math.floor;
    const keys = conversionInScrap ? roundMethod(scrap / conversionInScrap) : 0;
    const metalInScrap = scrap - keys * conversionInScrap;
    const metal = toRefined(metalInScrap);
    return new Currency({
      keys,
      metal,
    });
  }

  static fromWeapons(weapons: number, conversion = 0) {
    const conversionInWeapons = toWeapons(conversion);
    const roundMethod = weapons < 0 ? Math.ceil : Math.floor;
    const keys = conversionInWeapons
      ? roundMethod(weapons / conversionInWeapons)
      : 0;
    const metalInWeapons = weapons - keys * conversionInWeapons;
    return new Currency({ keys, metalInWeapons });
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

  toWeapons(conversion = 0) {
    if (this.keys && !conversion) {
      throw new CurrencyError(
        'Conversion value is required when keys are present.',
      );
    }

    const conversionInWeapons = toWeapons(conversion);
    const keysInWeapons = this.keys * conversionInWeapons;
    return keysInWeapons + this.metalInWeapons;
  }

  toScrap(conversion = 0) {
    return this.toWeapons(conversion) / 2;
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
    if (!this.keys && !this.metalInWeapons) {
      return '0 keys, 0 metal';
    }

    let currency = '';

    if (this.keys) {
      currency += pluralizeKeys(this.keys);
    }

    if (this.metalInWeapons) {
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

  /**
   * Returns a JSON representation of the currency with weapons instead of metal.
   * @returns JSON representation with keys and weapons.
   */
  toWeaponizedJSON(): IWeaponizedCurrency {
    return {
      keys: this.keys,
      metalInWeapons: this.metalInWeapons,
    };
  }

  addWeapons(value: number, conversion = 0) {
    const currentScrapValue = this.toWeapons(conversion);
    const total = currentScrapValue + value;
    const currency = Currency.fromWeapons(total, conversion);
    this.keys = currency.keys;
    this.metalInWeapons = currency.metalInWeapons;
    return this;
  }

  addScrap(value: number, conversion = 0) {
    return this.addWeapons(value * 2, conversion);
  }

  addMetal(value: number, conversion?: number) {
    return this.addWeapons(toWeapons(value), conversion);
  }

  addKeys(value: number, conversion: number) {
    return this.addCurrency(fromKeysToCurrency(value, conversion), conversion);
  }

  addCurrency(currency: ICurrency, conversion?: number) {
    return this.addWeapons(
      new Currency(currency).toWeapons(conversion),
      conversion,
    );
  }

  removeWeapons(value: number, conversion = 0) {
    return this.addWeapons(-value, conversion);
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

  compareTo(value: ICurrency): 1 | 0 | -1 {
    return compareTo(this, value);
  }

  wIsEqual(currency: IWeaponizedCurrency) {
    return w.isEqual(this, currency);
  }

  wIsBigger(currency: IWeaponizedCurrency) {
    return w.isBigger(this, currency);
  }

  wIsSmaller(currency: IWeaponizedCurrency) {
    return w.isSmaller(this, currency);
  }

  wIsBiggerOrEqual(currency: IWeaponizedCurrency) {
    return w.isBiggerOrEqual(this, currency);
  }

  wIsSmallerOrEqual(currency: IWeaponizedCurrency) {
    return w.isSmallerOrEqual(this, currency);
  }

  wCompareTo(value: IWeaponizedCurrency): 1 | 0 | -1 {
    return w.compareTo(this, value);
  }
}
