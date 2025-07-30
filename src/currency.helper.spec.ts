import {
  round,
  toScrap,
  toRefined,
  fixMetal,
  fixCurrency,
  fromKeysToCurrency,
  isEqual,
  isBigger,
  isSmaller,
  isBiggerOrEqual,
  isSmallerOrEqual,
  c,
  w,
  compareTo,
  toWeapons,
} from './currency.helper';
import { Currency } from './currency.class';
import { pluralizeKeys } from '.';

describe('CurrencyHelper', () => {
  describe('round', () => {
    it('Rounds with default decimal', () => {
      expect(round(52.11111111)).toEqual(52.11);
    });

    it('Rounds with 4 decimal numbers', () => {
      expect(round(52.11111111, 4)).toEqual(52.1111);
    });

    it('Rounds negative with default decimal', () => {
      expect(round(-52.11111111)).toEqual(-52.11);
    });

    it('Rounds negative with 4 decimal numbers', () => {
      expect(round(-52.11111111, 4)).toEqual(-52.1111);
    });
  });

  describe('toScrap', () => {
    it('Converts refined to scrap #1', () => {
      expect(toScrap(14)).toEqual(14 * 9);
    });

    it('Converts refined to scrap #2', () => {
      expect(toScrap(14.22)).toEqual(14 * 9 + 2);
    });

    it('Converts refined to scrap #3', () => {
      expect(toScrap(14.88)).toEqual(14 * 9 + 8);
    });

    it('Converts refined to scrap #4', () => {
      expect(toScrap(14.99)).toEqual(14 * 9 + 9);
    });

    it('Converts refined to scrap #5', () => {
      expect(toScrap(0.77)).toEqual(7);
    });

    it('Converts weapon value #1', () => {
      expect(toScrap(0.16)).toEqual(1.5);
    });

    it('Converts weapon value #2', () => {
      expect(toScrap(0.61)).toEqual(5.5);
    });

    it('Negative converts refined to scrap #1', () => {
      expect(toScrap(-14)).toEqual(14 * -9);
    });

    it('Negative converts refined to scrap #2', () => {
      expect(toScrap(-14.22)).toEqual(-14 * 9 - 2);
    });

    it('Negative converts refined to scrap #3', () => {
      expect(toScrap(-14.88)).toEqual(-14 * 9 - 8);
    });

    it('Negative converts refined to scrap #4', () => {
      expect(toScrap(-14.99)).toEqual(-14 * 9 - 9);
    });

    it('Negative converts refined to scrap #5', () => {
      expect(toScrap(-0.77)).toEqual(-7);
    });

    it('Negative converts weapon value #1', () => {
      expect(toScrap(-0.16)).toEqual(-1.5);
    });

    it('Negative converts weapon value #2', () => {
      expect(toScrap(-0.61)).toEqual(-5.5);
    });
  });

  describe('toWeapons', () => {
    it('Converts int refined to weapons', () => {
      expect(toWeapons(14)).toEqual(14 * 18);
    });

    it('Converts refined with scrap to weapons', () => {
      expect(toWeapons(14.55)).toEqual(14 * 18 + 10);
    });

    it('Converts refined with weapons to weapons #1', () => {
      expect(toWeapons(14.72)).toEqual(14 * 18 + 13);
    });

    it('Converts refined with weapons to weapons #2', () => {
      expect(toWeapons(14.05)).toEqual(14 * 18 + 1);
    });

    it('Converts refined with weapons to weapons #3', () => {
      expect(toWeapons(14.49)).toEqual(14 * 18 + 9);
    });
  });

  describe('toRefined', () => {
    it('Converts scrap to refined #1', () => {
      expect(toRefined(14 * 9)).toEqual(14);
    });

    it('Converts scrap to refined #2', () => {
      expect(toRefined(14 * 9 + 2)).toEqual(14.22);
    });

    it('Converts scrap to refined #3', () => {
      expect(toRefined(14 * 9 + 8)).toEqual(14.88);
    });

    it('Converts scrap to refined #4', () => {
      expect(toRefined(14 * 9 + 9)).toEqual(15);
    });

    it('Converts scrap to refined #5', () => {
      expect(toRefined(7)).toEqual(0.77);
    });

    it('Converts weapon value #1', () => {
      expect(toRefined(5.5)).toEqual(0.61);
    });

    it('Negative converts weapon value #2', () => {
      expect(toRefined(-1.5)).toEqual(-0.16);
    });

    it('Negative converts scrap to refined #1', () => {
      expect(toRefined(-14 * 9)).toEqual(-14);
    });

    it('Negative converts scrap to refined #2', () => {
      expect(toRefined(-14 * 9 - 2)).toEqual(-14.22);
    });

    it('Negative converts scrap to refined #3', () => {
      expect(toRefined(-14 * 9 - 8)).toEqual(-14.88);
    });

    it('Negative converts scrap to refined #4', () => {
      expect(toRefined(-14 * 9 - 9)).toEqual(-15);
    });

    it('Negative converts scrap to refined #5', () => {
      expect(toRefined(-7)).toEqual(-0.77);
    });

    it('Negative converts weapon value #1', () => {
      expect(toRefined(-5.5)).toEqual(-0.61);
    });

    it('Negative converts weapon value #2', () => {
      expect(toRefined(-1.5)).toEqual(-0.16);
    });

    it('Test 1.66', () => {
      expect(toRefined(15)).toEqual(1.66);
    });

    it('Test -1.66', () => {
      expect(toRefined(-15)).toEqual(-1.66);
    });
  });

  describe('fixMetal', () => {
    it('Fixes input metal', () => {
      expect(fixMetal(53.44444)).toEqual(53.44);
    });

    it('Keeps same value', () => {
      expect(fixMetal(12.88)).toEqual(12.88);
    });

    it('Transfers .99 to 1', () => {
      expect(fixMetal(1.99)).toEqual(2);
    });

    it('Rounds weapon values up', () => {
      expect(fixMetal(0.6)).toEqual(0.61);
    });

    it('Rounds weapon values down', () => {
      expect(fixMetal(0.17)).toEqual(0.16);
    });

    it('Rounds negative weapon values up', () => {
      expect(fixMetal(-0.6)).toEqual(-0.61);
    });

    it('Rounds negative weapon values down', () => {
      expect(fixMetal(-0.17)).toEqual(-0.16);
    });
  });

  describe('fixCurrency', () => {
    it('Fixes currency metal input', () => {
      expect(
        fixCurrency({
          metal: 0.17,
        }),
      ).toEqual({
        keys: 0,
        metal: 0.16,
      });
    });

    it('Fixes keys input', () => {
      expect(
        fixCurrency({
          keys: 15,
        }),
      ).toEqual({
        keys: 15,
        metal: 0,
      });
    });
  });

  describe('fromKeysToCurrency', () => {
    it('Converts with conversion', () => {
      expect(fromKeysToCurrency(1.2, 62)).toEqual({
        keys: 1,
        metal: 12.44,
      });
    });

    it('Converts without conversion', () => {
      expect(fromKeysToCurrency(3)).toEqual({
        keys: 3,
        metal: 0,
      });
    });

    it('Throw error', () => {
      let err;
      try {
        fromKeysToCurrency(1.2);
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
    });

    it('Coverts negative key value', () => {
      expect(fromKeysToCurrency(-3)).toEqual({
        keys: -3,
        metal: 0,
      });
    });

    it('Coverts negative key value with conversion', () => {
      expect(fromKeysToCurrency(-1.2, 62)).toEqual({
        keys: -1,
        metal: -12.44,
      });
    });
  });

  describe('isEqual', () => {
    it('Is equal', () => {
      expect(
        isEqual({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52.11 }),
      ).toEqual(true);
    });

    it('Is not equal', () => {
      expect(
        isEqual({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(false);
    });
  });

  describe('isBigger', () => {
    it('Is bigger', () => {
      expect(
        isBigger({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(true);
    });

    it('Is not bigger #1', () => {
      expect(
        isBigger({ keys: 21, metal: 52.11 }, { keys: 22, metal: 52.11 }),
      ).toEqual(false);
    });

    it('Is not bigger #2', () => {
      expect(
        isBigger({ keys: 22, metal: 52 }, { keys: 22, metal: 52.11 }),
      ).toEqual(false);
    });
  });

  describe('isSmaller', () => {
    it('Is smaller', () => {
      expect(
        isSmaller({ keys: 22, metal: 52 }, { keys: 22, metal: 52.11 }),
      ).toEqual(true);
    });

    it('Is not smaller #1', () => {
      expect(
        isSmaller({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52.11 }),
      ).toEqual(false);
    });

    it('Is not smaller #2', () => {
      expect(
        isSmaller({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(false);
    });
  });

  describe('isBiggerOrEqual', () => {
    it('Is bigger #1', () => {
      expect(
        isBiggerOrEqual({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(true);
    });

    it('Is bigger #2', () => {
      expect(
        isBiggerOrEqual({ keys: 23, metal: 52 }, { keys: 22, metal: 52 }),
      ).toEqual(true);
    });

    it('Is equal', () => {
      expect(
        isBiggerOrEqual({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52.11 }),
      ).toEqual(true);
    });

    it('Is not bigger or equal #1', () => {
      expect(
        isBiggerOrEqual({ keys: 22, metal: 51.88 }, { keys: 22, metal: 52 }),
      ).toEqual(false);
    });

    it('Is not bigger or equal #2', () => {
      expect(
        isBiggerOrEqual({ keys: 21, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(false);
    });
  });

  describe('isSmallerOrEqual', () => {
    it('Is smaller #1', () => {
      expect(
        isSmallerOrEqual({ keys: 21, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(true);
    });

    it('Is smaller #2', () => {
      expect(
        isSmallerOrEqual({ keys: 22, metal: 51.88 }, { keys: 22, metal: 52 }),
      ).toEqual(true);
    });

    it('Is equal', () => {
      expect(
        isSmallerOrEqual(
          { keys: 22, metal: 52.11 },
          { keys: 22, metal: 52.11 },
        ),
      ).toEqual(true);
    });

    it('Is not smaller or equal #1', () => {
      expect(
        isSmallerOrEqual({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52 }),
      ).toEqual(false);
    });

    it('Is not smaller or equal #2', () => {
      expect(
        isSmallerOrEqual({ keys: 23, metal: 52 }, { keys: 22, metal: 52 }),
      ).toEqual(false);
    });
  });

  describe('compareTo', () => {
    it('Is Equal', () => {
      expect(
        compareTo({ keys: 12, metal: 20 }, { keys: 12, metal: 20 }),
      ).toEqual(0);
    });

    it('Is Smaller', () => {
      expect(
        compareTo({ keys: 12, metal: 19 }, { keys: 12, metal: 20 }),
      ).toEqual(-1);
    });

    it('Is Equal', () => {
      expect(
        compareTo({ keys: 12, metal: 21 }, { keys: 12, metal: 20 }),
      ).toEqual(1);
    });
  });

  describe('c', () => {
    it('Creates Currency object', () => {
      expect(c({ keys: 12, metal: 12 })).toEqual(
        new Currency({
          keys: 12,
          metal: 12,
        }),
      );
    });
  });

  describe('pluralizeKeys', () => {
    it('Negative plural', () => {
      expect(pluralizeKeys(-5)).toEqual('-5 keys');
    });

    it('Negative singular', () => {
      expect(pluralizeKeys(-1)).toEqual('-1 key');
    });

    it('0', () => {
      expect(pluralizeKeys(0)).toEqual('0 keys');
    });

    it('Positive plural', () => {
      expect(pluralizeKeys(5)).toEqual('5 keys');
    });

    it('Positive plural', () => {
      expect(pluralizeKeys(1)).toEqual('1 key');
    });
  });

  describe('weaponized', () => {
    describe('isEqual', () => {
      it('Is equal', () => {
        expect(
          w.isEqual(
            { keys: 22, metalInWeapons: 631 },
            { keys: 22, metalInWeapons: 631 },
          ),
        ).toEqual(true);
      });

      it('Is not equal', () => {
        expect(
          w.isEqual(
            { keys: 22, metalInWeapons: 532 },
            { keys: 22, metalInWeapons: 123 },
          ),
        ).toEqual(false);
      });
    });

    describe('isBigger', () => {
      it('Is bigger', () => {
        expect(
          w.isBigger(
            { keys: 22, metalInWeapons: 532 },
            { keys: 22, metalInWeapons: 531 },
          ),
        ).toEqual(true);
      });

      it('Is not bigger #1', () => {
        expect(
          w.isBigger(
            { keys: 21, metalInWeapons: 233 },
            { keys: 22, metalInWeapons: 110 },
          ),
        ).toEqual(false);
      });

      it('Is not bigger #2', () => {
        expect(
          w.isBigger(
            { keys: 22, metalInWeapons: 533 },
            { keys: 22, metalInWeapons: 533 },
          ),
        ).toEqual(false);
      });
    });

    describe('isSmaller', () => {
      it('Is smaller', () => {
        expect(
          w.isSmaller(
            { keys: 22, metalInWeapons: 123 },
            { keys: 22, metalInWeapons: 289 },
          ),
        ).toEqual(true);
      });

      it('Is not smaller #1', () => {
        expect(
          w.isSmaller(
            { keys: 22, metalInWeapons: 219 },
            { keys: 22, metalInWeapons: 190 },
          ),
        ).toEqual(false);
      });

      it('Is not smaller #2', () => {
        expect(
          w.isSmaller(
            { keys: 22, metalInWeapons: 123 },
            { keys: 22, metalInWeapons: 123 },
          ),
        ).toEqual(false);
      });
    });

    describe('isBiggerOrEqual', () => {
      it('Is bigger #1', () => {
        expect(
          w.isBiggerOrEqual(
            { keys: 22, metalInWeapons: 125 },
            { keys: 22, metalInWeapons: 124 },
          ),
        ).toEqual(true);
      });

      it('Is equal', () => {
        expect(
          w.isBiggerOrEqual(
            { keys: 22, metalInWeapons: 100 },
            { keys: 22, metalInWeapons: 100 },
          ),
        ).toEqual(true);
      });

      it('Is not bigger or equal #1', () => {
        expect(
          w.isBiggerOrEqual(
            { keys: 22, metalInWeapons: 90 },
            { keys: 22, metalInWeapons: 100 },
          ),
        ).toEqual(false);
      });
    });

    describe('isSmallerOrEqual', () => {
      it('Is smaller #1', () => {
        expect(
          w.isSmallerOrEqual(
            { keys: 21, metalInWeapons: 90 },
            { keys: 22, metalInWeapons: 100 },
          ),
        ).toEqual(true);
      });

      it('Is equal', () => {
        expect(
          w.isSmallerOrEqual(
            { keys: 22, metalInWeapons: 100 },
            { keys: 22, metalInWeapons: 100 },
          ),
        ).toEqual(true);
      });

      it('Is not smaller or equal #1', () => {
        expect(
          w.isSmallerOrEqual(
            { keys: 22, metalInWeapons: 100 },
            { keys: 22, metalInWeapons: 90 },
          ),
        ).toEqual(false);
      });
    });

    describe('compareTo', () => {
      it('Is Equal', () => {
        expect(
          w.compareTo(
            { keys: 12, metalInWeapons: 20 },
            { keys: 12, metalInWeapons: 20 },
          ),
        ).toEqual(0);
      });

      it('Is Smaller', () => {
        expect(
          w.compareTo(
            { keys: 12, metalInWeapons: 19 },
            { keys: 12, metalInWeapons: 20 },
          ),
        ).toEqual(-1);
      });

      it('Is Equal', () => {
        expect(
          w.compareTo(
            { keys: 12, metalInWeapons: 21 },
            { keys: 12, metalInWeapons: 20 },
          ),
        ).toEqual(1);
      });
    });
  });
});
