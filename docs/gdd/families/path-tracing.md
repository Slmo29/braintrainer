# Famiglia 22 — Path Tracing (gioco unico)

**Dominio cognitivo**: Visuospaziale
**Classificazione**: pianificazione visuospaziale, navigazione spaziale, scanning visivo, coordinazione occhio-mano.
**Fondamento**: paradigma di navigazione labirintica, ispirato al Maze Test (Porteus, 1959).

> **Nota di catalogo**: Famiglia ridisegnata. **Mantenuto solo Path Tracing** (nuovo esercizio).
>
> **Eliminati**: Mental Rotation (generazione figure asimmetriche ruotate troppo complessa da implementare), Figure Ground, Block Design, Map Navigation, Perspective Taking (complessità implementativa eccessiva o ridondanza con altri costrutti).

## Meccanica core

L'utente vede un **labirinto** su schermo e deve **tracciare con il dito** il percorso dalla partenza all'uscita.

### Meccanica UI

L'utente trascina il dito lungo il percorso.

- **Partenza**: punto verde.
- **Uscita**: punto rosso.
- **Se tocca un muro**: il percorso si **resetta al punto di partenza** (non al punto di errore — così si penalizza la pianificazione impulsiva).
- **Nessun feedback intermedio** sul percorso — solo reset al muro.

## Istruzioni utente

> *"Traccia il percorso dalla partenza (punto verde) all'uscita (punto rosso) senza toccare i muri. Se tocchi un muro, riparti dall'inizio."*

## Tutorial

Labirinto **3×3 semplice** con percorso unico. Mostra **reset animato** quando si tocca un muro.

## Accuratezza

Score composto su 2 dimensioni:

- **Tempo impiegato** a completare il labirinto (misura primaria)
- **Numero di reset** (muri toccati) — penalità

Formula: `base_score - (reset_count × penalità)`

La promozione inter-livello usa il **tempo come misura primaria** (`completion_time ≤ targetTimeS`).

`promotionMetric: completion_time_le_targetTimeS` — stessa logica atipica di Word Chain e Word Chain Switching.

## Micro-progressione

−2000ms `targetTimeS` per trial bonus (max −2 step, floor 30s).

Il **labirinto rimane lo stesso** — l'utente ha meno tempo per completarlo.

## Timer di sessione

**Modello B — sessione a completamento** (vedi `shared/01-session-rules.md`).

Sessione = completamento del labirinto o scadenza T.Lim. Durata stimata:

- ~2 min (lv 1)
- ~5 min (lv 20)

## Tabella livelli

| Lv | Dimensione | Vicoli ciechi | T.Lim (s) | Soglia tempo (s) |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 4×4 | 0 | 60 | 45 |
| 2 | 4×4 | 1 | 60 | 40 |
| 3 | 4×4 | 2 | 60 | 35 |
| 4 | 5×5 | 1 | 75 | 55 |
| 5 | 5×5 | 2 | 75 | 50 |
| 6 | 5×5 | 3 | 75 | 45 |
| 7 | 5×5 | 4 | 75 | 40 |
| 8 | 6×6 | 2 | 90 | 65 |
| 9 | 6×6 | 3 | 90 | 60 |
| 10 | 6×6 | 4 | 90 | 55 |
| 11 | 6×6 | 5 | 90 | 50 |
| 12 | 7×7 | 3 | 105 | 75 |
| 13 | 7×7 | 4 | 105 | 70 |
| 14 | 7×7 | 5 | 105 | 65 |
| 15 | 7×7 | 6 | 105 | 60 |
| 16 | 8×8 | 4 | 120 | 85 |
| 17 | 8×8 | 5 | 120 | 80 |
| 18 | 8×8 | 6 | 120 | 75 |
| 19 | 8×8 | 7 | 120 | 70 |
| 20 | 8×8 | 8 | 120 | 65 |

### Cambi di meccanica → schermata di avviso

I cambi di **dimensione del labirinto** (lv 4, 8, 12, 16) sono cambi visivi significativi. Mantenere coerenza con `shared/02-trial-flow.md` mostrando un avviso "Il labirinto diventa più grande".

## Generazione labirinti

- **Algoritmo**: pre-generazione algoritmica usando `recursive backtracker` (alternativa: algoritmo di Prim).
- **Validazione**: ogni labirinto deve avere **almeno un percorso soluzione garantito**.
- **Pool**: ~10 labirinti per livello per evitare memorizzazione.
- **Non ripetizione**: stesso labirinto non usato nelle ultime 5 sessioni.

## JSON di configurazione esempio

```json
{
  "family": "visuospaziale",
  "exercises": [
    {
      "id": "path_tracing",
      "cognitiveDomain": "Visuospaziale",
      "inputType": "finger_drag",
      "resetOnWallTouch": "start_position",
      "levelTable": {
        "1":  { "mazeSize": "4x4", "deadEnds": 0, "timeLimitS": 60, "targetTimeS": 45 },
        "8":  { "mazeSize": "6x6", "deadEnds": 2, "timeLimitS": 90, "targetTimeS": 65 },
        "16": { "mazeSize": "8x8", "deadEnds": 4, "timeLimitS": 120, "targetTimeS": 85 },
        "20": { "mazeSize": "8x8", "deadEnds": 8, "timeLimitS": 120, "targetTimeS": 65 }
      },
      "microProgression": {
        "parameter": "targetTimeS",
        "increment": -2,
        "floor": 30,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "accuracyMetrics": ["completion_time", "wall_reset_count"],
      "promotionMetric": "completion_time_le_targetTimeS",
      "mazeGeneration": {
        "algorithm": "recursive_backtracker",
        "poolPerLevel": 10,
        "noRepetitionWithinSessions": 5,
        "guaranteedSolution": true
      },
      "sessionTimer": "no_fixed_timer"
    }
  ]
}
```
