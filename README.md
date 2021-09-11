# tf2-currency
Set of tools that manage operations with tf2 currency. Inspired by [tf2-currencies](https://github.com/Nicklason/node-tf2-currencies) made by Nicklason. Made as a drop in replacement for your plain currency object.

## Advantages over tf2-currencies
- Fully typed, written in typescript
- Throughly tested, over 100 tests
- More convinience methods for comparing/operating with currency

## Installation
`npm install tf2-currency` or via yarn `yarn add tf2-currency`

## Documentation

Following classes, types and functions are exported:
```ts
export {
    Currency, // Currency class that manages operations
    CurrencyError, // Error thrown by Currency class
    ICurrency, // Interface for currency
    c, // Create Currency object faster
    fixCurrency, // Fix partial currency objects
}
```
### Currency
#### Instantiation
##### new Currency(currency: ICurrency)
- `currency` represents plain currency object such as `{ keys: 12, metal: 52.11 }`

##### Currency.fromScrap(scrap: number, conversion?: number): Currency
Creates a Currency class from scrap value
- `scrap` value you are creating currency from
- `conversion` rate to be used to convert into keys

##### Currency.fromKeys(keys: number, conversion?: number): Currency
Creates a Currency class from key value
- `keys` floating point number to create currency from
- `conversion` rate to be used to convert into metal
    - Required if keys is not an integer

#### Currency.prototype.toScrap(conversion?: number): number
Converts currency to scrap
- `conversion` to covert keys to scrap
    - Required if keys are present

#### Currency.prototype.toKeys(conversion?: number): number
Converts currency to scrap
- `conversion` to covert metal to keys
    - Required if metal is present

#### Currency.prototype.toString(): string
Builds a currency string readable for humans

#### Currency.prototype.toJSON(): ICurrency
Returns plain currency object for json serialization

#### Currency.prototype.addScrap(scrap: number, conversion?: number): Currency
Adds scrap value to the currency
- `scrap` value you are adding to the currency
- `conversion` rate to be used to convert exceeding metal value into keys

#### Currency.prototype.addMetal(metal: number, conversion?: number): Currency
Adds metal value to the currency
- `metal` value you are adding to the currency
- `conversion` rate to be used to convert exceeding metal value into keys

#### Currency.prototype.addKeys(keys: number, conversion?: number): Currency
Adds key value to the currency
- `keys` value you are adding to the currency
- `conversion` rate to be used to convert exceeding metal value into keys
    - Required if keys is not an integer

#### Currency.prototype.addCurrency(currency: ICurrency, conversion?: number): Currency
Adds currency value to the currency
- `currency` value you are adding to the currency
- `conversion` rate to be used to convert exceeding metal value into keys

#### Currency.prototype.removeScrap(scrap: number, conversion?: number): Currency
Removes scrap value from the currency
- `scrap` value you are removing from the currency
- `conversion` rate to be used to convert key into scrap
    - Required when we go to negative values with scrap

#### Currency.prototype.removeMetal(metal: number, conversion?: number): Currency
Removes metal value from the currency
- `metal` value you are removing from the currency
- `conversion` rate to be used to convert key into metal
    - Required when we go to negative values with scrap

#### Currency.prototype.removeKeys(scrap: number, conversion?: number): Currency
Removes key value from the currency
- `keys` value you are removing from the currency
- `conversion` rate to be used to convert key decimal to metal
    - Required when we go to negative values with scrap or when keys is not an integer

#### Currency.prototype.removeCurrency(currency: ICurrency, conversion?: number): Currency
Removes currency value from the currency
- `currency` value you are removing from the currency
- `conversion` rate to be used to convert key into metal
    - Required when we go to negative values with scrap

#### Currency.prototype.isEqual(currency: ICurrency): boolean
Compares current currency object with supplied one
- `currency` we are comparing to

#### Currency.prototype.isBigger(currency: ICurrency): boolean
Compares current currency object with supplied one
- `currency` we are comparing to

#### Currency.prototype.isSmaller(currency: ICurrency): boolean
Compares current currency object with supplied one
- `currency` we are comparing to

#### Currency.prototype.isBiggerOrEqual(currency: ICurrency): boolean
Compares current currency object with supplied one
- `currency` we are comparing to

#### Currency.prototype.isSmallerOrEqual(currency: ICurrency): boolean
Compares current currency object with supplied one
- `currency` we are comparing to

### c(currency: Partial<ICurrency>): Currency
Creates `Currency` object
- `currency` from which we are creating the object

### fixCurrency(currency: Partial<ICurrency>): ICurrency
Fixes partial `currency` object
- `currency` we are fixing