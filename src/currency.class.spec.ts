import { Currency } from './currency.class';
import {
  isEqual,
  isBigger,
  isSmaller,
  isBiggerOrEqual,
  isSmallerOrEqual,
} from './currency.helper';

describe('Currency', () => {
  describe('constructor', () => {
    it('Creates an instance', () => {
      const currency = new Currency({
        keys: 12,
        metal: 23.88,
      });

      expect(currency).toHaveProperty('keys', 12);
      expect(currency).toHaveProperty('metal', 23.88);
    });

    it('Keys are negative', () => {
      const currency = new Currency({
        keys: -12,
        metal: 23.88,
      });

      expect(currency).toHaveProperty('keys', -12);
      expect(currency).toHaveProperty('metal', 23.88);
    });

    it('Metal is negative', () => {
      const currency = new Currency({
        keys: 12,
        metal: -23.88,
      });

      expect(currency).toHaveProperty('keys', 12);
      expect(currency).toHaveProperty('metal', -23.88);
    });
  });

  describe('fromScrap', () => {
    it('Requires conversion', () => {
      const currency = Currency.fromScrap(1000, 62);

      expect(currency).toHaveProperty('keys', 1);
      expect(currency).toHaveProperty('metal', 49.11);
    });

    it('Does not require conversion', () => {
      const currency = Currency.fromScrap(397);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 44.11);
    });

    it('Has weapon value', () => {
      const currency = Currency.fromScrap(397.5);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 44.16);
    });

    it('Negative with conversion and weapon value', () => {
      const currency = Currency.fromScrap(-1000.5, 62);

      expect(currency).toHaveProperty('keys', -1);
      expect(currency).toHaveProperty('metal', -49.16);
    });
  });

  describe('fromKeys', () => {
    it('Requires conversion', () => {
      const currency = Currency.fromKeys(3.2, 62);

      expect(currency).toHaveProperty('keys', 3);
      expect(currency).toHaveProperty('metal', 12.44);
    });

    it('Does not require conversion', () => {
      const currency = Currency.fromKeys(3);

      expect(currency).toHaveProperty('keys', 3);
      expect(currency).toHaveProperty('metal', 0);
    });

    it('Throws an exception because of missing conversion', () => {
      try {
        const currency = Currency.fromKeys(3.22);
        expect(currency).not.toBeDefined();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Negative key value', () => {
      const currency = Currency.fromKeys(-3.2, 62);

      expect(currency).toHaveProperty('keys', -3);
      expect(currency).toHaveProperty('metal', -12.44);
    });
  });

  describe('toScrap', () => {
    it('Converts with conversion', () => {
      const currency = new Currency({
        keys: 12,
        metal: 32.66,
      });

      expect(currency.toScrap(62)).toEqual(6990);
    });

    it('Converts without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.66,
      });

      expect(currency.toScrap()).toEqual(294);
    });

    it('Throws an error because of no conversion', () => {
      try {
        const currency = new Currency({
          keys: 12,
          metal: 32.66,
        });

        currency.toScrap();
        expect(currency).not.toBeDefined();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Has weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.72,
      });

      expect(currency.toScrap()).toEqual(294.5);
    });

    it('Has negative value', () => {
      const currency = new Currency({
        keys: -1,
        metal: -32.72,
      });

      expect(currency.toScrap(60)).toEqual(-834.5);
    });
  });

  describe('toKeys', () => {
    it('Converts with conversion', () => {
      const currency = new Currency({
        keys: 12,
        metal: 32.66,
      });

      expect(currency.toKeys(62)).toEqual(12.53);
    });

    it('Converts without conversion', () => {
      const currency = new Currency({
        keys: 13,
        metal: 0,
      });

      expect(currency.toKeys()).toEqual(13);
    });

    it('Throws an error because of no conversion', () => {
      try {
        const currency = new Currency({
          keys: 12,
          metal: 32.66,
        });

        currency.toKeys();
        expect(currency).not.toBeDefined();
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('Converts negative value', () => {
      const currency = new Currency({
        keys: -12,
        metal: -32.66,
      });

      expect(currency.toKeys(62)).toEqual(-12.53);
    });
  });

  describe('toString', () => {
    it('Keys and metal', () => {
      expect(
        new Currency({
          keys: 12,
          metal: 53.22,
        }).toString(),
      ).toEqual('12 keys, 53.22 metal');
    });

    it('1 key', () => {
      expect(
        new Currency({
          keys: 1,
          metal: 0,
        }).toString(),
      ).toEqual('1 key');
    });

    it('Just metal', () => {
      expect(
        new Currency({
          keys: 0,
          metal: 53.22,
        }).toString(),
      ).toEqual('53.22 metal');
    });

    it('0 keys, 0 metal', () => {
      expect(
        new Currency({
          keys: 0,
          metal: 0,
        }).toString(),
      ).toEqual('0 keys, 0 metal');
    });
  });

  describe('toJSON', () => {
    it('Converts via JSON.stringify', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      expect(JSON.parse(JSON.stringify(currency))).toEqual({
        keys: 53,
        metal: 32.11,
      });
    });
  });

  describe('addScrap', () => {
    it('Adds with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.addScrap(365, 60);

      expect(currency).toHaveProperty('keys', 54);
      expect(currency).toHaveProperty('metal', 12.66);
    });

    it('Adds without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addScrap(365);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 72.66);
    });

    it('Adds with weapon value', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.addScrap(365.5, 60);

      expect(currency).toHaveProperty('keys', 54);
      expect(currency).toHaveProperty('metal', 12.72);
    });

    it('Adds negative value', () => {
      const currency = new Currency({
        keys: -53,
        metal: -32.11,
      });

      currency.addScrap(-365.5, 60);

      expect(currency).toHaveProperty('keys', -54);
      expect(currency).toHaveProperty('metal', -12.72);
    });
  });

  describe('addMetal', () => {
    it('Adds with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.addMetal(40.55, 60);

      expect(currency).toHaveProperty('keys', 54);
      expect(currency).toHaveProperty('metal', 12.66);
    });

    it('Adds without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addMetal(40.55);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 72.66);
    });

    it('Adds with weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addMetal(40.61);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 72.72);
    });

    it('Adds negative value', () => {
      const currency = new Currency({
        keys: 0,
        metal: -32.11,
      });

      currency.addMetal(-40.61);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', -72.72);
    });
  });

  describe('addKeys', () => {
    it('Adds with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.addKeys(1.6, 60);

      expect(currency).toHaveProperty('keys', 55);
      expect(currency).toHaveProperty('metal', 8.11);
    });

    it('Adds negative value', () => {
      const currency = new Currency({
        keys: -53,
        metal: -32.11,
      });

      currency.addKeys(-1.6, 60);

      expect(currency).toHaveProperty('keys', -55);
      expect(currency).toHaveProperty('metal', -8.11);
    });
  });

  describe('addCurrency', () => {
    it('Adds with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.addCurrency(
        {
          keys: 3,
          metal: 30.55,
        },
        60,
      );

      expect(currency).toHaveProperty('keys', 57);
      expect(currency).toHaveProperty('metal', 2.66);
    });

    it('Adds without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addCurrency({
        keys: 0,
        metal: 30.55,
      });

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 62.66);
    });

    it('Adds with weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addCurrency({
        keys: 0,
        metal: 30.61,
      });

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 62.72);
    });

    it('Adds negative currency', () => {
      const currency = new Currency({
        keys: 0,
        metal: -32.11,
      });

      currency.addCurrency({
        keys: 0,
        metal: -30.61,
      });

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', -62.72);
    });
  });

  describe('removeScrap', () => {
    it('Removes with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.removeScrap(365, 60);

      expect(currency).toHaveProperty('keys', 52);
      expect(currency).toHaveProperty('metal', 51.55);
    });

    it('Removes without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeScrap(288);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 0.11);
    });

    it('Throws for no conversion', () => {
      let err;
      try {
        const currency = new Currency({
          keys: 53,
          metal: 32.11,
        });

        currency.removeScrap(365);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });

    it('Removes with weapon value', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.removeScrap(365.5, 60);

      expect(currency).toHaveProperty('keys', 52);
      expect(currency).toHaveProperty('metal', 51.49);
    });

    it('Removes negative value', () => {
      const currency = new Currency({
        keys: -53,
        metal: -32.11,
      });

      currency.removeScrap(-365, 60);

      expect(currency).toHaveProperty('keys', -52);
      expect(currency).toHaveProperty('metal', -51.55);
    });
  });

  describe('removeMetal', () => {
    it('Removes with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.removeMetal(40.55, 60);

      expect(currency).toHaveProperty('keys', 52);
      expect(currency).toHaveProperty('metal', 51.55);
    });

    it('Removes without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeMetal(32);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 0.11);
    });

    it('Removes with weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeMetal(32.05);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 0.05);
    });
  });

  describe('removeKeys', () => {
    it('Removes with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.removeKeys(3.6, 60);

      expect(currency).toHaveProperty('keys', 49);
      expect(currency).toHaveProperty('metal', 56.11);
    });
  });

  describe('removeCurrency', () => {
    it('Removes with conversion', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.removeCurrency(
        {
          keys: 2,
          metal: 36,
        },
        60,
      );

      expect(currency).toHaveProperty('keys', 50);
      expect(currency).toHaveProperty('metal', 56.11);
    });

    it('Removes without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeCurrency({
        keys: 0,
        metal: 31,
      });

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 1.11);
    });

    it('Throws for no keys', () => {
      let err;
      try {
        const currency = new Currency({
          keys: 0,
          metal: 32.11,
        });

        currency.removeCurrency({
          keys: 2,
          metal: 31,
        });
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });

    it('Removes with weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeCurrency({
        keys: 0,
        metal: 31.05,
      });

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 1.05);
    });
  });

  describe('isEqual', () => {
    it('Returns same result as isEqual helper', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      expect(
        currency.isEqual({
          keys: 53,
          metal: 32.11,
        }),
      ).toEqual(
        isEqual(currency, {
          keys: 53,
          metal: 32.11,
        }),
      );
    });
  });

  describe('isBigger', () => {
    it('Returns same result as isBigger helper', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      expect(
        currency.isBigger({
          keys: 53,
          metal: 32.11,
        }),
      ).toEqual(
        isBigger(currency, {
          keys: 53,
          metal: 32.11,
        }),
      );
    });
  });

  describe('isSmaller', () => {
    it('Returns same result as isSmaller helper', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      expect(
        currency.isSmaller({
          keys: 53,
          metal: 32.11,
        }),
      ).toEqual(
        isSmaller(currency, {
          keys: 53,
          metal: 32.11,
        }),
      );
    });
  });

  describe('isBiggerOrEqual', () => {
    it('Returns same result as isBiggerOrEqual helper', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      expect(
        currency.isBiggerOrEqual({
          keys: 53,
          metal: 32.11,
        }),
      ).toEqual(
        isBiggerOrEqual(currency, {
          keys: 53,
          metal: 32.11,
        }),
      );
    });
  });

  describe('isSmallerOrEqual', () => {
    it('Returns same result as isSmallerOrEqual helper', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      expect(
        currency.isSmallerOrEqual({
          keys: 53,
          metal: 32.11,
        }),
      ).toEqual(
        isSmallerOrEqual(currency, {
          keys: 53,
          metal: 32.11,
        }),
      );
    });
  });
});
