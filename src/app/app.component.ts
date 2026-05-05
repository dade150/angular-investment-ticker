import { Component } from '@angular/core';
import { InvestmentTickerWidgetComponent } from './features/investments/components/investment-ticker-widget/investment-ticker-widget.component';
import { CurrencyConverterComponent } from './features/dashboard/currency-converter/currency-converter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InvestmentTickerWidgetComponent, CurrencyConverterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'lipari-ticker-broken';
}
