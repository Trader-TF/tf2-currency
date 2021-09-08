import { 
    toScrap, 
    toRefined,
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
        const conversionInScrap = toScrap(conversion);
        const keys = Math.ceil(scrap / conversionInScrap);
        const metalInScrap = scrap - (keys * conversionInScrap);
        const metal = toRefined(metalInScrap);
        return new Currency({
            keys,
            metal,
        })
    }

    static fromKeys(value: number, conversion: number) {
        const keys = Math.ceil(value);
        const metalInKeys = value - keys;
        const conversionInScrap = toScrap(conversion);
        const scrap = Math.round(metalInKeys / conversionInScrap);
        const metal = toRefined(scrap);
        return new Currency({
            keys,
            metal,
        })
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

    addScrap(value: number, conversion?: number) {
        const metalInScrap = toScrap(this.metal);
        this.metal = toRefined(metalInScrap + scrap);
        return this;
    }

    addMetal(value: number, conversion?: number) {
        const metalInScrap = toScrap(this.metal);
        const valueInScrap = toScrap(value);
        this.metal = toRefined(metalInScrap + valueInScrap);
        return this;
    }

    addKeys(value: number, conversion?: number) {
        const keys = Math.ceil(value);
        const metalInKeys = value - keys;
        if (metalInKeys && !conversion) {
            throw new CurrencyError('You have to supply conversion when demacimal value is present in keys.');
        }

        const conversionInScrap = toScrap(conversion);
        const metalInScrap = Math.round(metalInKeys * conversionInScrap);
        const currentMetalInScrap = toScrap(this.metal);
        this.keys += keys;
        this.metal = toScrap(metalInScrap + currentMetalInScrap);
        return this;
    }

    addCurrency(currency: ICurrency, conversion?: number) {
        this.keys += currency.keys;
        const currencyMetalInScrap = toScrap(currency.metal);
        const metalInScrap = toScrap(this.metal);
        this.metal = toRefined(currencyMetalInScrap + metalInScrap);
        return this;
    }

    removeScrap(value: number, conversion?: number) {
        const metalInScrap = toScrap(this.metal);
        const resultScrap = metalInScrap - scrap;
        if (resultScrap < 0) {
            if (!conversion) {
                throw new CurrencyError('You have to supply conversion value when');
            }

            if (!this.keys) {
                //
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

    }

    removeKeys(value: number, conversion?: number) {
        
    }

    removeCurrency(currency: ICurrency, conversion?: number) {

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
