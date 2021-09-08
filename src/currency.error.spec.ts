import { CurrencyError } from './currency.error';

describe('CurrencyError', () => {
  it('Creates an error with said message and has correct name', () => {
    const message = 'Supplied key value is negative';
    const error = new CurrencyError(message);

    expect(error).toHaveProperty('message', message);
    expect(error.name).toEqual('CurrencyError');
    expect(error.stack?.includes('CurrencyError')).toBeTruthy();
  });
});
