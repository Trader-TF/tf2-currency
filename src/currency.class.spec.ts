import { Currency } from './currency.class';
import {
  isEqual,
  isBigger,
  isSmaller,
  isBiggerOrEqual,
  isSmallerOrEqual,
  w,
  compareTo,
} from './currency.helper';

describe('Currency', () => {
  describe('constructor', () => {
    it('Creates an instance', () => {
      const currency = new Currency({
        keys: 12,
        metal: 23.88,
      });

      expect(currency).toHaveProperty('keys', 12);
      expect(currency).toHaveProperty('metalInWeapons', 430);
      expect(currency).toHaveProperty('metal', 23.88);
    });

    it('Keys are negative', () => {
      const currency = new Currency({
        keys: -12,
        metal: 23.88,
      });

      expect(currency).toHaveProperty('keys', -12);
      expect(currency).toHaveProperty('metal', 23.88);
      expect(currency).toHaveProperty('metalInWeapons', 430);
    });

    it('Metal is negative', () => {
      const currency = new Currency({
        keys: 12,
        metal: -23.88,
      });

      expect(currency).toHaveProperty('keys', 12);
      expect(currency).toHaveProperty('metal', -23.88);
      expect(currency).toHaveProperty('metalInWeapons', -430);
    });

    it('No metal present', () => {
      const currency = new Currency({ keys: 1 });

      expect(currency).toHaveProperty('keys', 1);
      expect(currency).toHaveProperty('metalInWeapons', 0);
    });
  });

  describe('fromWeapons', () => {
    it('With conversion', () => {
      const currency = Currency.fromWeapons(1005, 10);

      expect(currency).toHaveProperty('keys', 5);
      expect(currency).toHaveProperty('metalInWeapons', 105);
    });

    it('With conversion', () => {
      const currency = Currency.fromWeapons(1005);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metalInWeapons', 1005);
      expect(currency).toHaveProperty('metal', 55.83);
    });
  });

  describe('fromScrap', () => {
    it('Requires conversion', () => {
      const currency = Currency.fromScrap(1000, 62);

      expect(currency).toHaveProperty('keys', 1);
      expect(currency).toHaveProperty('metal', 49.11);
      expect(currency).toHaveProperty('metalInWeapons', 884);
    });

    it('Does not require conversion', () => {
      const currency = Currency.fromScrap(397);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 44.11);
      expect(currency).toHaveProperty('metalInWeapons', 794);
    });

    it('Has weapon value', () => {
      const currency = Currency.fromScrap(397.5);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 44.16);
      expect(currency).toHaveProperty('metalInWeapons', 795);
    });

    it('Negative with conversion and weapon value', () => {
      const currency = Currency.fromScrap(-1000.5, 62);

      expect(currency).toHaveProperty('keys', -1);
      expect(currency).toHaveProperty('metal', -49.16);
      expect(currency).toHaveProperty('metalInWeapons', -885);
    });
  });

  describe('fromKeys', () => {
    it('Requires conversion', () => {
      const currency = Currency.fromKeys(3.2, 62);

      expect(currency).toHaveProperty('keys', 3);
      expect(currency).toHaveProperty('metal', 12.44);
      expect(currency).toHaveProperty('metalInWeapons', 224);
    });

    it('Does not require conversion', () => {
      const currency = Currency.fromKeys(3);

      expect(currency).toHaveProperty('keys', 3);
      expect(currency).toHaveProperty('metal', 0);
      expect(currency).toHaveProperty('metalInWeapons', 0);
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
      expect(currency).toHaveProperty('metalInWeapons', -224);
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

    it('Has weapon value #1', () => {
      expect(
        new Currency({
          keys: 0,
          metalInWeapons: 101,
        }).toString(),
      ).toEqual('5.61 metal');
    });

    it('Has weapon value #2', () => {
      expect(
        new Currency({
          keys: 0,
          metalInWeapons: 1,
        }).toString(),
      ).toEqual('0.05 metal');
    });

    it('Has weapon value #3', () => {
      expect(
        new Currency({
          keys: 0,
          metalInWeapons: 261,
        }).toString(),
      ).toEqual('14.49 metal');
    });

    it('Has weapon value #3', () => {
      expect(
        new Currency({
          keys: 0,
          metalInWeapons: 265,
        }).toString(),
      ).toEqual('14.72 metal');
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

  describe('toWeaponizedJSON', () => {
    it('Gives correct form', () => {
      const currency = new Currency({
        keys: 53,
        metalInWeapons: 10,
      });

      expect(currency.toWeaponizedJSON()).toEqual({
        keys: 53,
        metalInWeapons: 10,
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
      expect(currency).toHaveProperty('metalInWeapons', 228);
    });

    it('Adds without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addScrap(365);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 72.66);
      expect(currency).toHaveProperty('metalInWeapons', 1308);
    });

    it('Adds with weapon value', () => {
      const currency = new Currency({
        keys: 53,
        metal: 32.11,
      });

      currency.addScrap(365.5, 60);

      expect(currency).toHaveProperty('keys', 54);
      expect(currency).toHaveProperty('metal', 12.72);
      expect(currency).toHaveProperty('metalInWeapons', 229);
    });

    it('Adds negative value', () => {
      const currency = new Currency({
        keys: -53,
        metal: -32.11,
      });

      currency.addScrap(-365.5, 60);

      expect(currency).toHaveProperty('keys', -54);
      expect(currency).toHaveProperty('metal', -12.72);
      expect(currency).toHaveProperty('metalInWeapons', -229);
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
      expect(currency).toHaveProperty('metalInWeapons', 228);
    });

    it('Adds without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addMetal(40.55);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 72.66);
      expect(currency).toHaveProperty('metalInWeapons', 1308);
    });

    it('Adds with weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.addMetal(40.61);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 72.72);
      expect(currency).toHaveProperty('metalInWeapons', 1309);
    });

    it('Adds negative value', () => {
      const currency = new Currency({
        keys: 0,
        metal: -32.11,
      });

      currency.addMetal(-40.61);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', -72.72);
      expect(currency).toHaveProperty('metalInWeapons', -1309);
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
      expect(currency).toHaveProperty('metalInWeapons', 146);
    });

    it('Adds negative value', () => {
      const currency = new Currency({
        keys: -53,
        metal: -32.11,
      });

      currency.addKeys(-1.6, 60);

      expect(currency).toHaveProperty('keys', -55);
      expect(currency).toHaveProperty('metal', -8.11);
      expect(currency).toHaveProperty('metalInWeapons', -146);
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
      expect(currency).toHaveProperty('metalInWeapons', 48);
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
      expect(currency).toHaveProperty('metalInWeapons', 1128);
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
      expect(currency).toHaveProperty('metalInWeapons', 1129);
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
      expect(currency).toHaveProperty('metalInWeapons', -1129);
    });
  });

  describe('removeWeapons', () => {
    it('Removes without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metalInWeapons: 10,
      });

      expect(currency.removeWeapons(5).toWeaponizedJSON()).toEqual({
        keys: 0,
        metalInWeapons: 5,
      });
    });

    it('Removes with conversion', () => {
      const currency = new Currency({
        keys: 12,
        metalInWeapons: 10,
      });

      expect(currency.removeWeapons(5, 50).toWeaponizedJSON()).toEqual({
        keys: 12,
        metalInWeapons: 5,
      });
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
      expect(currency).toHaveProperty('metalInWeapons', 928);
    });

    it('Removes without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeScrap(288);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 0.11);
      expect(currency).toHaveProperty('metalInWeapons', 2);
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
      expect(currency).toHaveProperty('metalInWeapons', 927);
    });

    it('Removes negative value', () => {
      const currency = new Currency({
        keys: -53,
        metal: -32.11,
      });

      currency.removeScrap(-365, 60);

      expect(currency).toHaveProperty('keys', -52);
      expect(currency).toHaveProperty('metal', -51.55);
      expect(currency).toHaveProperty('metalInWeapons', -928);
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
      expect(currency).toHaveProperty('metalInWeapons', 928);
    });

    it('Removes without conversion', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeMetal(32);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 0.11);
      expect(currency).toHaveProperty('metalInWeapons', 2);
    });

    it('Removes with weapon value', () => {
      const currency = new Currency({
        keys: 0,
        metal: 32.11,
      });

      currency.removeMetal(32.05);

      expect(currency).toHaveProperty('keys', 0);
      expect(currency).toHaveProperty('metal', 0.05);
      expect(currency).toHaveProperty('metalInWeapons', 1);
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
      expect(currency).toHaveProperty('metalInWeapons', 1010);
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
      expect(currency).toHaveProperty('metalInWeapons', 1010);
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
      expect(currency).toHaveProperty('metalInWeapons', 20);
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
      expect(currency).toHaveProperty('metalInWeapons', 19);
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

  describe('clone', () => {
    it('Clones the object', () => {
      const currency = new Currency({
        keys: 50,
        metal: 20,
      });
      const cloneCurrency = currency.clone();

      expect(cloneCurrency).toEqual(currency);
      expect(cloneCurrency).toBeInstanceOf(Currency);
    });
  });

  describe('isEmpty', () => {
    it('Is empty', () => {
      expect(
        new Currency({
          keys: 0,
          metal: 0,
        }).isEmpty(),
      ).toEqual(true);
    });

    it('Is not empty #1', () => {
      expect(
        new Currency({
          keys: -1,
          metal: -20,
        }).isEmpty(),
      ).toEqual(false);
    });

    it('Is not empty #2', () => {
      expect(
        new Currency({
          keys: 2,
          metal: 0,
        }).isEmpty(),
      ).toEqual(false);
    });
  });

  describe('w', () => {
    describe('isEqual', () => {
      it('Returns same result as isEqual helper', () => {
        const currency = new Currency({
          keys: 53,
          metalInWeapons: 32,
        });

        expect(
          currency.wIsEqual({
            keys: 53,
            metalInWeapons: 32,
          }),
        ).toEqual(
          w.isEqual(currency, {
            keys: 53,
            metalInWeapons: 32,
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

    describe('compareTo', () => {
      it('Returns same result as compareTo helper', () => {
        const currency = new Currency({
          keys: 53,
          metal: 32.11,
        });

        expect(
          currency.compareTo({
            keys: 53,
            metal: 32.11,
          }),
        ).toEqual(
          compareTo(currency, {
            keys: 53,
            metal: 32.11,
          }),
        );
      });
    });

    describe('wIsBigger', () => {
      it('Returns same result as w.isBigger helper', () => {
        const currency = new Currency({
          keys: 53,
          metalInWeapons: 11,
        });

        expect(
          currency.wIsBigger({
            keys: 53,
            metalInWeapons: 12,
          }),
        ).toEqual(
          w.isBigger(currency, {
            keys: 53,
            metalInWeapons: 12,
          }),
        );
      });
    });

    describe('wIsSmaller', () => {
      it('Returns same result as w.isSmaller helper', () => {
        const currency = new Currency({
          keys: 53,
          metalInWeapons: 11,
        });

        expect(
          currency.wIsSmaller({
            keys: 53,
            metalInWeapons: 12,
          }),
        ).toEqual(
          w.isSmaller(currency, {
            keys: 53,
            metalInWeapons: 12,
          }),
        );
      });
    });

    describe('wIsBiggerOrEqual', () => {
      it('Returns same result as w.isBiggerOrEqual helper', () => {
        const currency = new Currency({
          keys: 53,
          metalInWeapons: 11,
        });

        expect(
          currency.wIsBiggerOrEqual({
            keys: 53,
            metalInWeapons: 12,
          }),
        ).toEqual(
          w.isBiggerOrEqual(currency, {
            keys: 53,
            metalInWeapons: 12,
          }),
        );
      });
    });

    describe('wIsSmallerOrEqual', () => {
      it('Returns same result as w.isSmallerOrEqual helper', () => {
        const currency = new Currency({
          keys: 53,
          metalInWeapons: 11,
        });

        expect(
          currency.wIsSmallerOrEqual({
            keys: 53,
            metalInWeapons: 12,
          }),
        ).toEqual(
          w.isSmallerOrEqual(currency, {
            keys: 53,
            metalInWeapons: 12,
          }),
        );
      });
    });

    describe('wCompareTo', () => {
      it('Returns same result as w.compareTo helper', () => {
        const currency = new Currency({
          keys: 53,
          metalInWeapons: 11,
        });

        expect(
          currency.wCompareTo({
            keys: 53,
            metalInWeapons: 12,
          }),
        ).toEqual(
          w.compareTo(currency, {
            keys: 53,
            metalInWeapons: 12,
          }),
        );
      });
    });
  });
});
