import { Component, computed, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../core/services/currency.service';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss'
})
export class CurrencyConverterComponent {

  private currencyService = inject(CurrencyService);
  public currencies = this.currencyService.currencySymbols;
  
  amount = signal<number>(1000)
  selectedCurrency = signal<string>('USD')

  convertedAmount = computed(() => {
    const rate = this.currencyService.getRate(this.selectedCurrency());
    return this.amount() * rate;
  });

  constructor() {
    effect(() => {
      const a = this.amount();
      const c = this.selectedCurrency();
      const res = this.convertedAmount();
      console.log(`Convertito €${a} → ${c}${res.toFixed(2)}`);
    });
  }

  onAmountChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.amount.set(Number(val));
  }

  onCurrencyChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedCurrency.set(val);
  }
}
