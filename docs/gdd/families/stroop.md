# Famiglia 15 — Stroop (1 esercizio)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: inibizione / controllo interferenza.

> **Nota di catalogo**: la variante Stroop Simon (Spaziale) prevista nel GDD è stata **eliminata** in favore del Flanker Task (Famiglia 17), che misura un costrutto di inibizione spaziale periferica più rilevante clinicamente e comparabile con l'ANT (Attention Network Test).

## Meccanica core

L'utente vede uno **stimolo con due dimensioni in conflitto** e deve rispondere a una sola dimensione ignorando l'altra.

La difficoltà cresce su 2 leve:

- riduzione del **T.Lim**
- aumento della **proporzione di trial incongruenti**

## Risposta

Sempre **scelta tra opzioni mostrate sotto lo stimolo** (tap sull'opzione corretta). Nessun input libero.

- **Lv 1–10**: 2 riquadri colorati in ordine casuale.
- **Lv 11–20**: 3 riquadri in ordine casuale.

## Micro-progressione

−200ms T.Lim per trial bonus (max −2 step, −400ms totale, floor 800ms). Regola standard.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## Tabella livelli

| Lv | T.Lim (ms) | % incongruenti | Timer sessione | Pool min |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 4000 | 20% | 90s | 22 |
| 2 | 3800 | 20% | 90s | 23 |
| 3 | 3600 | 25% | 90s | 24 |
| 4 | 3400 | 25% | 90s | 25 |
| 5 | 3200 | 30% | 90s | 26 |
| 6 | 3000 | 30% | 90s | 27 |
| 7 | 2800 | 35% | 90s | 28 |
| 8 | 2600 | 35% | 90s | 30 |
| 9 | 2400 | 40% | 90s | 32 |
| 10 | 2200 | 40% | 90s | 33 |
| 11 | 2000 | 45% | 120s | 46 |
| 12 | 1900 | 45% | 120s | 48 |
| 13 | 1800 | 50% | 120s | 50 |
| 14 | 1700 | 50% | 120s | 51 |
| 15 | 1600 | 55% | 120s | 53 |
| 16 | 1500 | 55% | 120s | 56 |
| 17 | 1400 | 60% | 120s | 58 |
| 18 | 1300 | 60% | 120s | 61 |
| 19 | 1200 | 65% | 120s | 63 |
| 20 | 1000 | 70% | 120s | 70 |

**Pool min** è già pre-calcolato secondo la formula di `shared/01-session-rules.md` (`pool_min = ceil(timer_ms / (T.Lim + 800ms)) + 3`).

---

## Esercizio 1 — Stroop Classico

**id JSON**: `stroop_classico`
**Costrutto**: interferenza lessicale-cromatica — inibizione della lettura automatica del colore della parola.

### Meccanica

Appare una **parola-colore** (es. "ROSSO") scritta in un colore diverso da quello che nomina (es. scritta in BLU). L'utente deve tappare il **colore dell'inchiostro** (BLU), ignorando il significato della parola.

- **Trial congruente**: "ROSSO" scritto in rosso → tappa rosso.
- **Trial incongruente**: "ROSSO" scritto in blu → tappa blu.

### Istruzioni utente

> *"Vedrai una parola scritta in un colore. Sotto troverai dei riquadri colorati. Tocca il riquadro del colore con cui è SCRITTA la parola — non quello che la parola dice."*

### Tutorial

Mostra la parola "BLU" scritta in rosso, freccia che indica il riquadro rosso, testo "Tocca questo colore". Poi l'utente tappa "Ho capito — Inizia".

### Note implementative

- Testo parola **sempre in maiuscolo** (leggibilità per 60+).
- Riquadri colorati posizionati in **ordine casuale per ogni trial** (evita apprendimento posizionale).
- **Opzioni**: colore corretto + distrattori casuali tra i colori attivi del livello, escluso quello corretto.
- Input attivo solo mentre lo stimolo è visibile e durante il T.Lim. Input durante ISI ignorato.

### Colori attivi

- **Lv 1–12**: rosso, blu, verde, giallo (4 colori).
- **Lv 13–20**: aggiunto arancio e viola (6 colori totali).

### Cambi di meccanica → schermata di avviso

- **Lv 11**: passaggio da 2 a 3 riquadri di risposta.
- **Lv 13**: passaggio da 4 a 6 colori attivi.

Entrambi i cambi richiedono la schermata di avviso descritta in `shared/02-trial-flow.md`.

### Generazione stimoli

Programmatica. Ogni trial = combinazione parola-colore × colore-inchiostro con vincolo congruenza/incongruenza del livello.

## JSON di configurazione esempio

```json
{
  "family": "stroop",
  "exercises": [
    {
      "id": "stroop_classico",
      "stimulusType": "parola_colore",
      "cognitiveDomain": "FunzioniEsecutive",
      "inputType": "tap_color_swatch",
      "levelTable": {
        "1":  { "timeLimitMs": 4000, "incongruentRatio": 0.20, "nColors": 4, "nOptions": 2, "timerSessionS": 90,  "poolMin": 22 },
        "13": { "timeLimitMs": 1800, "incongruentRatio": 0.50, "nColors": 6, "nOptions": 3, "timerSessionS": 120, "poolMin": 50 },
        "20": { "timeLimitMs": 1000, "incongruentRatio": 0.70, "nColors": 6, "nOptions": 3, "timerSessionS": 120, "poolMin": 70 }
      },
      "microProgression": {
        "parameter": "timeLimitMs",
        "increment": -200,
        "floor": 800,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "programmatic",
        "textAlwaysUppercase": true,
        "swatchOrderPerTrial": "random",
        "colorsLv1to12": ["rosso","blu","verde","giallo"],
        "colorsLv13to20": ["rosso","blu","verde","giallo","arancio","viola"]
      }
    }
  ]
}
```
