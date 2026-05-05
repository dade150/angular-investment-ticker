import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import {
  InvestmentTickerService,
  TickerSymbol,
} from '../../services/investment-ticker.service';

// ─── View model ─────────────────────────────────────────────────────────────
export interface TickerRow {
  symbol: TickerSymbol;
  price:  number;
  delta:  number;
  ts:     number;
}

const PORTFOLIO_QUANTITIES: Record<TickerSymbol, number> = {
  ENI: 100,
  ISP: 100,
  UCG: 100,
  AAPL: 100,
  MSFT: 100
};

// ─── Component ──────────────────────────────────────────────────────────────
@Component({
  selector: 'app-investment-ticker-widget',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './investment-ticker-widget.component.html',
  styleUrl:    './investment-ticker-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class InvestmentTickerWidgetComponent implements OnDestroy {

  private readonly _ticker = inject(InvestmentTickerService);

  // ── Signals ────────────────────────────────────────────────────────────
  readonly filter = signal<string>('');
  readonly sortBy = signal<'symbol' | 'price' | 'delta'>('symbol');

  // ── Computed ───────────────────────────────────────────────────────────
  readonly viewModel = computed<TickerRow[]>(() => {
    
    const filterText = this.filter().trim().toUpperCase();

    const sortKey = this.sortBy();
    const prices  = this._ticker.prices();

    const rows: TickerRow[] = (Object.keys(prices) as TickerSymbol[])
      .map(sym => ({ symbol: sym, ...prices[sym] }))
      .filter(r => r.symbol.includes(filterText));

    return rows.sort((a, b) => {
      if (sortKey === 'symbol') return a.symbol.localeCompare(b.symbol);
      if (sortKey === 'price')  return b.price - a.price;
      return b.delta - a.delta;
    });
  });

  readonly totalValue = computed(() => {
    return this.viewModel().reduce((acc, row) => {
      const qty = PORTFOLIO_QUANTITIES[row.symbol] || 0;
      return acc + (row.price * qty);
    }, 0);
  });

  readonly stats = computed(() => {
    const rows = this.viewModel();
    return {
      gain: rows.filter(r => r.delta > 0).length,
      loss: rows.filter(r => r.delta < 0).length
    };
  });

  readonly topMover = computed(() => {
    const rows = this.viewModel();
    if (rows.length === 0) return null;

    return rows.reduce((prev, current) => {
      return Math.abs(current.delta) > Math.abs(prev.delta) ? current : prev;
    });
  });

  /** Effect: connette il servizio e lo disconnette al destroy */
  private readonly _connectEffect = effect((onCleanup) => {
    this._ticker.connect();
    onCleanup(() => this._ticker.disconnect());
  });

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnDestroy(): void {
    this._ticker.disconnect();
  }

  // ── Public methods (usati dal template) ────────────────────────────────
  setFilter(value: string): void {
    this.filter.set(value.toUpperCase());
  }

  setSortBy(key: 'symbol' | 'price' | 'delta'): void {
    this.sortBy.set(key);
  }
}
