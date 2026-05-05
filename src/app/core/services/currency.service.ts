import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private rates = signal<Record<string, number>>({
    USD: 1.08,
    GBP: 0.86,
    CHF: 0.95,
    JPY: 162.5
  });

  public currencySymbols = computed(() => {
    const keys = Object.keys(this.rates());
    return keys.sort();
  });

  getRate(symbol: string): number {
    return this.rates()[symbol] || 0;
  }

  constructor() { }
}
