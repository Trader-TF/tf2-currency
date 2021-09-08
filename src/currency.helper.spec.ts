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
} from './currency.helper';

describe('CurrencyHelper', () => {
  describe('round', () => {
    it('Rounds with default decimal', () => {
      expect(round(52.11111111)).toEqual(52.11);
    });

    it('Rounds with 4 decimal numbers', () => {
      expect(round(52.11111111, 4)).toEqual(52.1111);
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
        fromKeysToCurrency(1.2)
      } catch (e) {
        err = e;
      }

      expect(err).toBeInstanceOf(Error);
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
        isEqual({ keys: 21, metal: 52.11 }, { keys: 22, metal: 52.11 }),
      ).toEqual(false);
    });

    it('Is not bigger #2', () => {
      expect(
        isEqual({ keys: 22, metal: 52.11 }, { keys: 22, metal: 52 }),
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
});