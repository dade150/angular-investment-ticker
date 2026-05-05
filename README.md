# 🏝️ Lipari Ticker — Broken Edition

Widget **Ticker Investimenti** costruito con **Angular 19 Standalone + Signals**.
Contiene **3 bug intenzionali** da trovare e correggere.

---

## Avvio

```bash
npm install
ng serve
```

Apri `http://localhost:4200`.

---

## 🐛 3 FIX MISSIONS

### MISSIONE 1 — Prezzi congelati (Bug #1)
> **I prezzi si congelano dopo il primo tick.**
> Controlla l'immutabilità nel servizio — il `.update()` restituisce una nuova reference?

**File:** `src/app/features/investments/services/investment-ticker.service.ts`
**Metodo:** `_startSimulation()`

---

### MISSIONE 2 — CPU al 100% e log infiniti (Bug #2)
> **CPU al 100% e log infiniti.**
> C'è un effect che scrive su un signal che sta leggendo?

**File:** `src/app/features/investments/components/investment-ticker-widget/investment-ticker-widget.component.ts`
**Field:** `_buggyEffect`

---

### MISSIONE 3 — Filtro non reattivo (Bug #3)
> **Il filtro non funziona — `filterText` sembra corretto ma `viewModel` non reagisce.**
> Stai leggendo il signal `filter` con le parentesi `()`?

**File:** `src/app/features/investments/components/investment-ticker-widget/investment-ticker-widget.component.ts`
**Field:** `viewModel` (computed)

---

## Struttura

```
src/
├── app/
│   ├── app.component.ts
│   ├── app.component.html
│   └── features/investments/
│       ├── services/
│       │   └── investment-ticker.service.ts
│       └── components/investment-ticker-widget/
│           ├── investment-ticker-widget.component.ts
│           ├── investment-ticker-widget.component.html
│           └── investment-ticker-widget.component.scss
├── main.ts
└── styles.scss
```

---

## Tecnologie

- Angular **19** — Standalone Components
- Angular **Signals** (`signal`, `computed`, `effect`)
- `ChangeDetectionStrategy.OnPush`
- `@for` / `@if` / `@empty` (Angular control flow)
- `DecimalPipe`, `DatePipe`

---

## Bonus Mission — Feature da Implementare (opzionale, ~1 ora)

Una volta risolti i 3 bug, implementa la seguente feature per consolidare i concetti del giorno.

### Riepilogo di portafoglio con Signal derivati

Il widget mostra i singoli ticker ma non fornisce nessuna visione aggregata del portafoglio in tempo reale.

**Cosa implementare:**

Aggiungi al widget un pannello di riepilogo che mostri, aggiornandosi in tempo reale a ogni tick:

- Il valore totale del portafoglio (somma di `prezzo × quantità` per tutti i titoli).
- Il numero di titoli attualmente in guadagno (variazione positiva rispetto al prezzo iniziale).
- Il numero di titoli attualmente in perdita.
- Il titolo con la variazione percentuale più alta in assoluto (in positivo o negativo).

Tutti i valori del pannello devono essere `computed` Signal derivati dagli stessi Signal esistenti nel servizio — nessun campo separato con stato proprio, nessuna sottoscrizione a Observable aggiuntiva.

Il pannello di riepilogo deve rispettare la stessa strategia `OnPush` del widget esistente: nessun rilevamento di cambiamenti per polling.

**Criteri di accettazione:**

- Il pannello mostra i 4 valori descritti, aggiornati automaticamente a ogni tick del simulatore.
- Tutti i valori sono derivati tramite `computed()` da Signal già esistenti nel servizio.
- L'applicazione non introduce nessuna sottoscrizione Observable aggiuntiva né uso di `setInterval` separato.
- Con il filtro attivo, il totale e i contatori riflettono solo i titoli visibili.
- Nessun bug risolto in precedenza viene reintrodotto.

---

*LipariBank Prompt Bootcamp — Advanced Reactive State con Signals — Day 02*
