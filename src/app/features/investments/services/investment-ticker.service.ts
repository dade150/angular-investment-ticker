import { Injectable, signal } from '@angular/core';

// ─── Domain types ──────────────────────────────────────────────────────────
export type TickerSymbol = 'ENI' | 'ISP' | 'UCG' | 'AAPL' | 'MSFT';

export interface TickerPrice {
  price: number;
  delta: number;
  ts:    number;
}

// ─── Seed prices ───────────────────────────────────────────────────────────
const INITIAL_PRICES: Record<TickerSymbol, number> = {
  ENI:   14.20,
  ISP:    3.45,
  UCG:    7.82,
  AAPL: 189.50,
  MSFT: 412.30,
};

const SYMBOLS: TickerSymbol[] = ['ENI', 'ISP', 'UCG', 'AAPL', 'MSFT'];

// ─── Service ───────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class InvestmentTickerService {

  private readonly _prices = signal<Record<TickerSymbol, TickerPrice>>(
    this._buildInitial(),
  );

  readonly prices = this._prices.asReadonly();

  private _intervalId: ReturnType<typeof setInterval> | null = null;

  // ── Public API ────────────────────────────────────────────────────────

  connect(): void {
    if (this._intervalId !== null) return;
    this._intervalId = setInterval(() => this._startSimulation(), 1000);
  }

  disconnect(): void {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  // ── Private helpers ───────────────────────────────────────────────────

  private _buildInitial(): Record<TickerSymbol, TickerPrice> {
    const result = {} as Record<TickerSymbol, TickerPrice>;
    for (const sym of SYMBOLS) {
      result[sym] = { price: INITIAL_PRICES[sym], delta: 0, ts: Date.now() };
    }
    return result;
  }

  private _startSimulation(): void {
  this._prices.update(current => {
    const nextState = { ...current };

    for (const symbol of SYMBOLS) {
      const prev = nextState[symbol].price;
      const change = (Math.random() - 0.5) * prev * 0.02;
      const nextPrice = parseFloat((prev + change).toFixed(2));
      const delta = parseFloat((nextPrice - prev).toFixed(4));

      // 2. Creiamo un NUOVO oggetto per ogni simbolo (nuova referenza interna)
      nextState[symbol] = {
        ...nextState[symbol],
        price: nextPrice,
        delta: delta,
        ts: Date.now()
      };
    }

    return nextState;
  });
}
}
