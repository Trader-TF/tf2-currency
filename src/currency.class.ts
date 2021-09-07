import { toScrap } from './currency.helper';
import { CurrencyError } from './currency.error';
import { ICurrency } from './currency.interface';

export class Currency implements ICurrency {
    public keys: number;
    public metal: number;

    constructor(currency: ICurrency) {
        if (currency.keys < 0) {
            throw new CurrencyError('Supplied key value is negative');
        }
        this.keys = currency.keys;

        if (currency.metal < 0) {
            throw new CurrencyError('Supplied metal value is negative');
        }
        this.metal = currency.metal;
    }

    static fromScrap(scrap: number, conversion: number) {

    }

    static fromKeys(keys: number, conversion: number) {

    }

    toScrap(conversion?: number) {
        if (this.keys && !conversion) {
            throw new CurrencyError('Conversion value is required when keys are present.');
        }

        const conversionInScrap = toScrap(conversion);
        const metalInScrap = toScrap(this.metal);
        const keysInScrap = this.keys * conversionInScrap;

        return keysInScrap + metalInScrap;
    }

    toKeys(conversion?: number) {
        if (this.metal && !conversion) {
            throw new CurrencyError('Conversion value is required when metal is present.');
        }

        const conversionInScrap = toScrap(conversion);
        const metalInScrap = toScrap(this.metal);
        const metalInKeys = Math.round(metalInScrap / conversionInScrap * 100) / 100;

        return this.keys + metalInKeys;
    }

    toString() {
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
        }
    }

    addScrap() {

    }

    addMetal() {

    }

    addKeys() {

    }

    addCurrency() {

    }

    removeScrap() {

    }

    removeMetal() {

    }

    removeKeys() {
        
    }

    removeCurrency() {

    }

    isEqual() {

    }

    isBigger() {

    }

    isSmaller() {

    }
}
