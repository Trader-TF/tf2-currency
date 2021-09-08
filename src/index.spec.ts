import * as Exports from './index';
import { ICurrency } from './index';

describe('Index', () => {
  it('Exports right classes and functions', () => {
    expect(Exports).toHaveProperty('Currency');
    expect(Exports).toHaveProperty('CurrencyError');
  });

  it('Export ICurrency interface', () => {
    const currency: ICurrency = {
      keys: 12,
      metal: 46.44,
    };

    expect(currency).toBeDefined();
  });
});
