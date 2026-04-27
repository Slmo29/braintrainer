# Famiglia 17 — Flanker Task (gioco unico)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: inibizione interferenza periferica / attenzione selettiva spaziale.
**Fondamento**: Eriksen Flanker Task (1974). Incluso nell'ANT (Attention Network Test).

## Meccanica core

L'utente vede una **riga di frecce** al centro dello schermo. Deve rispondere alla **direzione della freccia centrale** ignorando le frecce flanker (laterali).

- **Trial congruenti**: tutte le frecce puntano nella stessa direzione.
- **Trial incongruenti**: le frecce flanker puntano in direzione opposta alla centrale.

## Risposta

**2 pulsanti fissi in basso** (◄ sinistra / ► destra), sempre visibili. Tap sul pulsante corrispondente alla direzione della freccia centrale.

## Micro-progressione

−100ms T.Lim per trial bonus (max −2 step, −200ms totale, floor 600ms). Regola standard.

## Tutorial

Mostra riga di frecce con freccia centrale evidenziata (cerchio o colore diverso). Testo: *"Guarda solo la freccia al centro. Tocca il pulsante nella sua direzione."* Esempio animato con trial congruente e incongruente.

## Istruzioni utente

> *"Guarda solo la freccia al centro della riga. Tocca il pulsante nella direzione verso cui punta — ignora le frecce ai lati."*

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## ISI

500ms standard (vedi `shared/02-trial-flow.md`). Nessuna deroga.

## Tabella livelli

| Lv | T.Lim (ms) | % incongruenti | N flanker | Timer |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 3000 | 20% | 2 (1 per lato) | 90s |
| 2 | 2800 | 20% | 2 | 90s |
| 3 | 2600 | 25% | 2 | 90s |
| 4 | 2400 | 25% | 2 | 90s |
| 5 | 2200 | 30% | 2 | 90s |
| 6 | 2000 | 30% | 4 (2 per lato) | 90s |
| 7 | 1900 | 35% | 4 | 90s |
| 8 | 1800 | 35% | 4 | 90s |
| 9 | 1700 | 40% | 4 | 90s |
| 10 | 1600 | 40% | 4 | 90s |
| 11 | 1500 | 45% | 4 | 120s |
| 12 | 1400 | 45% | 4 | 120s |
| 13 | 1300 | 50% | 4 | 120s |
| 14 | 1200 | 50% | 4 | 120s |
| 15 | 1100 | 55% | 4 | 120s |
| 16 | 1000 | 55% | 6 (3 per lato) | 120s |
| 17 | 950 | 60% | 6 | 120s |
| 18 | 900 | 60% | 6 | 120s |
| 19 | 850 | 65% | 6 | 120s |
| 20 | 800 | 70% | 6 | 120s |

**N flanker** cresce in 3 step: 2 (lv 1–5) → 4 (lv 6–15) → 6 (lv 16–20).

Ogni salto coincide con T.Lim ancora generoso così non si cumulano due aumenti di difficoltà nello stesso punto.

**Nota**: al lv 16 il salto a 6 flanker avviene con T.Lim 1000ms — sufficiente per elaborare lo stimolo centrale. L'esperienza è: più "rumore visivo" ai lati ma la freccia centrale rimane identificabile.

### Cambi di meccanica → schermata di avviso

I salti di N flanker (**lv 6**, **lv 16**) sono cambi visivi significativi che richiedono la schermata di avviso descritta in `shared/02-trial-flow.md`.

## Generazione stimoli

- **Stimoli generati programmaticamente** come SVG.
- **Stimolo centrale**: freccia → o ←, scelta casuale per ogni trial.
- **Flanker congruenti**: stessa direzione della centrale.
- **Flanker incongruenti**: direzione opposta alla centrale.
- **Proporzione congruenti/incongruenti** rispettata per **blocchi di 10 trial** (non randomizzazione pura per evitare sequenze anomale).
- **Vincolo non ripetizione**: nessuna sequenza di **3+ trial incongruenti consecutivi** (evita effetto anticipatorio).

## JSON di configurazione esempio

```json
{
  "family": "flanker_task",
  "exercises": [
    {
      "id": "flanker_frecce",
      "stimulusType": "frecce",
      "cognitiveDomain": "FunzioniEsecutive",
      "responseButtons": "fixed_left_right",
      "levelTable": {
        "1":  { "timeLimitMs": 3000, "incongruentRatio": 0.20, "nFlankers": 2, "sessionTimerS": 90 },
        "6":  { "timeLimitMs": 2000, "incongruentRatio": 0.30, "nFlankers": 4, "sessionTimerS": 90 },
        "16": { "timeLimitMs": 1000, "incongruentRatio": 0.55, "nFlankers": 6, "sessionTimerS": 120 },
        "20": { "timeLimitMs": 800,  "incongruentRatio": 0.70, "nFlankers": 6, "sessionTimerS": 120 }
      },
      "microProgression": {
        "parameter": "timeLimitMs",
        "increment": -100,
        "floor": 600,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "programmatic_svg",
        "sequenceConstraints": {
          "maxConsecutiveIncongruent": 2,
          "congruencyBalancedPerBlockOf": 10
        }
      }
    }
  ]
}
```
