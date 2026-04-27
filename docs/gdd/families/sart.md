# Famiglia 11 — SART (gioco unico)

**Dominio cognitivo**: Attenzione
**Classificazione**: Attenzione sostenuta + inibizione della risposta automatica.
**Fondamento**: Sustained Attention to Response Task (Robertson et al., 1997).

## Meccanica core

Un flusso di stimoli (cifre 1–9) appare sullo schermo uno alla volta a ritmo costante. L'utente deve **tappare ogni stimolo TRANNE uno specifico target** designato all'inizio della sessione (es. il numero 3).

Quando appare il target, deve **inibire la risposta automatica** e non tappare.

## Stimolo target

**Un'unica cifra** (es. 3), comunicata chiaramente prima di ogni sessione con esempio animato. Rimane la stessa per tutta la sessione. **Cambia tra sessioni diverse** (selezione casuale, esclusa la cifra dell'ultima sessione).

## Accuratezza

Misure cliniche distinte:

- **Commission errors**: % target tappati erroneamente — **misura clinica principale** (fallimento di inibizione).
- **Omission errors**: % non-target non tappati — misura secondaria (cali di attenzione).

L'accuratezza valutativa per la promozione/retrocessione è basata principalmente sui commission errors.

## Struttura sessione

N **blocchi (trial)**, ognuno = un flusso completo di stimoli. Breve pausa tra blocchi (2 secondi).

## Eccezioni alle regole comuni

- **ISI**: non si applica l'ISI standard 500ms — l'ISI è il parametro stesso del compito (vedi tabella livelli, decresce con il livello). Eccezione documentata in `shared/02-trial-flow.md`.
- **Feedback risposta**: nessun feedback per risposta corretta (il flusso non si interrompe). Solo feedback visivo discreto per errore (flash rosso breve senza bloccare il flusso). Eccezione documentata in `shared/02-trial-flow.md`.
- **Timer di sessione**: **modello B — sessione a completamento** dei blocchi previsti. Durata stimata: ~3–4 min (lv 1–8), ~5–6 min (lv 9–20).

## Masking (lv 10+)

A partire dal lv 10, dopo ogni stimolo appare brevemente una **maschera visiva** (`#######`) che impedisce la persistenza retinica. Rende impossibile la strategia di "attendere il contorno" senza elaborare lo stimolo.

### Cambio meccanica → schermata di avviso

Il livello **10** introduce il masking: cambio significativo che richiede la schermata di avviso descritta in `shared/02-trial-flow.md`.

## Micro-progressione

−50ms ISI per trial bonus, scattante ogni 3 trial con **0 commission errors e ≥95% non-target corretti**.

- Max −2 step (−100ms totale)
- Floor 700ms

I trial bonus non contano per l'accuratezza inter-livello.

## Istruzioni utente

> *"Vedrai comparire dei numeri uno alla volta. Toccali tutti TRANNE il [target — es. 3]. Quando appare [target], non toccare. Rispondi il più velocemente possibile."*

## Tabella livelli

| Lv | SeqLen | ISI (ms) | Target freq | Masking | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 50 | 1500 | 20% | no | 3 |
| 2 | 60 | 1400 | 20% | no | 3 |
| 3 | 70 | 1300 | 15% | no | 3 |
| 4 | 80 | 1300 | 15% | no | 3 |
| 5 | 90 | 1200 | 12% | no | 3 |
| 6 | 100 | 1200 | 12% | no | 3 |
| 7 | 100 | 1100 | 10% | no | 3 |
| 8 | 120 | 1100 | 10% | no | 3 |
| 9 | 120 | 1000 | 10% | no | 3 |
| 10 | 130 | 1000 | 10% | 200 ms | 3 |
| 11 | 140 | 950 | 8% | 200 ms | 3 |
| 12 | 140 | 950 | 8% | 200 ms | 3 |
| 13 | 150 | 900 | 8% | 250 ms | 3 |
| 14 | 150 | 900 | 7% | 250 ms | 3 |
| 15 | 160 | 850 | 7% | 250 ms | 2 |
| 16 | 170 | 850 | 6% | 300 ms | 2 |
| 17 | 170 | 800 | 6% | 300 ms | 2 |
| 18 | 180 | 800 | 5% | 300 ms | 2 |
| 19 | 180 | 750 | 5% | 350 ms | 2 |
| 20 | 200 | 700 | 5% | 350 ms | 2 |

**Target frequency** = proporzione di stimoli target nella sequenza (target più rari = maggiore accumulo di risposta automatica = più difficile inibire quando appaiono).

## Generazione stimoli

- **Cifre 1–9** generate programmaticamente.
- **Target**: una cifra scelta casualmente per la sessione (esclusa ogni volta la stessa dell'ultima sessione).
- **Vincoli sequenza**:
  - garantisce la `targetFrequency` del livello distribuendo i target in modo pseudo-casuale
  - target **non consecutivi**
  - mai due target a distanza < 5 posizioni (per evitare effetti di priming)
- **Dataset minimo**: N/A — generazione runtime.

## JSON di configurazione esempio

```json
{
  "family": "sart",
  "exercises": [
    {
      "id": "sart_numerico",
      "stimulusType": "numeri_1_9",
      "cognitiveDomain": "Attenzione",
      "levelTable": {
        "1":  { "sequenceLength": 50,  "isiMs": 1500, "targetFrequency": 0.20, "maskingMs": null, "trialsPerSession": 3 },
        "10": { "sequenceLength": 130, "isiMs": 1000, "targetFrequency": 0.10, "maskingMs": 200,  "trialsPerSession": 3 },
        "20": { "sequenceLength": 200, "isiMs": 700,  "targetFrequency": 0.05, "maskingMs": 350,  "trialsPerSession": 2 }
      },
      "targetSelection": {
        "pool": [1,2,3,4,5,6,7,8,9],
        "rule": "random_per_session_no_consecutive_repeat"
      },
      "sequenceConstraints": {
        "targetSpacing": "min_5_non_targets_between_targets"
      },
      "microProgression": {
        "parameter": "isiMs",
        "increment": -50,
        "floor": 700,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCondition": "0_commission_errors_and_ge95pct_nontargets_correct",
        "bonusCountsForAccuracy": false
      },
      "accuracyMetrics": ["commission_error_rate", "omission_error_rate"],
      "sessionTimer": "no_fixed_timer"
    }
  ]
}
```
