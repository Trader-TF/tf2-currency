export class CurrencyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CurrencyError';
    }
}
