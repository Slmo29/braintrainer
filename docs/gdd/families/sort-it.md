# Famiglia 4 — Sort It (2 varianti)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: flessibilità cognitiva e set shifting.
**Fondamento**: ispirato al Wisconsin Card Sorting Test (WCST) e al DCCS.

## Meccanica core

L'utente vede **carte stimolo** che appaiono una alla volta al centro dello schermo. Deve assegnarle alla **categoria corretta** (tap sulla carta → tap sul bin corretto) secondo la regola attiva.

La regola **può cambiare durante il trial**, richiedendo adattamento immediato.

## Varianti

Le 2 varianti **condividono la stessa tabella livelli e la stessa logica di progressione**. Differiscono nel tipo di stimolo e nelle dimensioni di sorting.

| ID JSON | Nome | stimulusType |
| :---- | :---- | :---- |
| `sort_it_percettivo` | Percettivo | `percettivo` |
| `sort_it_semantico` | Semantico | `semantico` |

## Meccanica UI

- **Tap carta** → la carta viene selezionata (selezione in corso).
- **Tap bin** → il bin si evidenzia, conferma il posizionamento.
- **Tap su bin diverso** = cambio selezione.

## Micro-progressione

Il parametro è `ruleSwitchEveryN` (N stimoli prima di un possibile cambio regola). Il trial bonus riduce questo valore di 1 (cambio regola più frequente).

- `increment = -1`
- `floor = 1`
- max −2 oltre base

**Nota**: ai livelli 1–3 (nessun cambio regola nella base, `ruleSwitchEveryN = null`), la micro-progressione **non si applica** — quei livelli sono intenzionalmente stabili per apprendimento della meccanica.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

### Eccezione pool minimo stimoli

Sort It è il caso speciale documentato in `shared/01-session-rules.md`: un singolo trial completo (`nCategories × stimuliPerCategory` carte) ai livelli alti può superare il timer di sessione.

- `pool_min = 3` (il sistema prepara 3 trial completi)
- la sessione termina al timer anche a metà di un trial

## Eccezioni a `feedback risposta` (vedi `shared/02-trial-flow.md`)

Sort It usa **3 modalità di feedback** che dipendono dal livello:

- **Full** (lv 1–6): dopo ogni carta, mostra corretto/errato + evidenzia visivamente il bin corretto (bin lampeggia in verde).
- **Reduced** (lv 7–13): dopo ogni carta, mostra solo corretto/errato (nessuna evidenziazione del bin corretto).
- **None** (lv 14–20): nessun feedback immediato per singola carta. L'utente vede solo il totale di accuratezza a fine trial.

## Cambio regola (esplicito vs implicito)

- **Esplicito** (lv 1–10): quando la regola cambia, un **banner testuale** appare brevemente (es. *"Nuova regola: ordina per FORMA"*). L'utente si adatta consapevolmente.
- **Implicito** (lv 11–20): nessun avviso. L'utente si accorge del cambio perché la sua risposta viene marcata come errata. Deve **inferire la nuova regola** dalle risposte successive.

### Cambi di meccanica → schermata di avviso

Sort It ha **2 cambi di meccanica significativi** che richiedono la schermata di avviso descritta in `shared/02-trial-flow.md`:

- **Lv 11**: passaggio da cambio regola **esplicito a implicito**.
- **Lv 14**: passaggio a **`feedbackType: none`**.

## Istruzioni utente

**Percettivo (lv 1–10, cambio esplicito)**:
> *"Ogni carta ha una caratteristica. Guarda la regola indicata in alto e metti la carta nella categoria giusta. La regola può cambiare: quando lo fa, te lo diciamo."*

**Percettivo (lv 11–20, cambio implicito)**:
> *"Ogni carta ha una caratteristica. Mettila nella categoria giusta. Se la regola cambia, capiscilo dai tuoi errori e adattati."*

**Semantico (lv 1–10, cambio esplicito)**:
> *"Ogni carta appartiene a una categoria. Guarda le categorie indicate e mettila in quella giusta. La regola può cambiare: quando lo fa, te lo diciamo."*

**Semantico (lv 11–20, cambio implicito)**:
> *"Ogni carta appartiene a una categoria. Mettila in quella giusta. Se la regola cambia, capiscilo dai tuoi errori e adattati."*

## Tabella livelli (condivisa)

| Lv | N cat. | Stim/cat. | Switch ogni N | Cambio regola | Feedback | T.Lim carta (ms) | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 2 | 3 | — | esplicito | full | — | 6 |
| 2 | 2 | 3 | — | esplicito | full | — | 6 |
| 3 | 2 | 4 | — | esplicito | full | — | 6 |
| 4 | 2 | 4 | 4 | esplicito | full | — | 7 |
| 5 | 2 | 4 | 4 | esplicito | full | — | 7 |
| 6 | 3 | 3 | 4 | esplicito | full | — | 7 |
| 7 | 3 | 3 | 3 | esplicito | reduced | — | 8 |
| 8 | 3 | 3 | 3 | esplicito | reduced | — | 8 |
| 9 | 3 | 4 | 3 | esplicito | reduced | — | 8 |
| 10 | 3 | 4 | 3 | esplicito | reduced | — | 8 |
| 11 | 3 | 4 | 3 | implicito | reduced | — | 8 |
| 12 | 3 | 4 | 2 | implicito | reduced | — | 8 |
| 13 | 4 | 3 | 2 | implicito | reduced | 15000 | 8 |
| 14 | 4 | 3 | 2 | implicito | none | 14000 | 8 |
| 15 | 4 | 3 | 2 | implicito | none | 13000 | 8 |
| 16 | 4 | 4 | 2 | implicito | none | 12000 | 8 |
| 17 | 4 | 4 | 2 | implicito | none | 11000 | 8 |
| 18 | 4 | 4 | 2 | implicito | none | 10000 | 8 |
| 19 | 4 | 4 | 2 | implicito | none | 9000 | 8 |
| 20 | 4 | 4 | 2 | implicito | none | 8000 | 8 |

**T.Lim carta** = millisecondi per posizionare ogni singola carta. Assente ai livelli bassi, introdotto dal lv 13.

## Stimoli e dimensioni di sorting

### Sort It — Percettivo

- **Stimoli**: forme geometriche (cerchio, quadrato, triangolo, stella, rombo) × colori (rosso, blu, verde, giallo, arancio) × dimensioni (grande, piccolo). Generati programmaticamente come SVG.
- **Attributi espliciti per ogni stimolo**: `{forma, colore, dimensione}`.
- **Dimensioni di sorting attive per livello**:
  - Lv 1–6: 1 dimensione attiva (es. ordina per colore).
  - Lv 7–13: 2 dimensioni possibili (es. colore o forma; la regola cambia tra le due).
  - Lv 14–20: 3 dimensioni possibili (colore, forma, dimensione; la regola ruota tra le tre).
- **Etichette bin**: regola attiva sempre dichiarata nei bin (es. bin etichettati "Rosso / Blu" oppure "Cerchio / Quadrato / Triangolo").
- **Dataset minimo**: N/A — generazione runtime da attributi.

### Sort It — Semantico

- **Stimoli**: parole o emoji Twemoji da 8 categorie semantiche: animali, cibo, attrezzi, veicoli, natura, abbigliamento, sport, arredo.
- **Ai livelli alti (13–20)**: categorie semanticamente vicine introdotte per aumentare la difficoltà (es. animali selvatici vs animali domestici; cibo vs oggetti cucina; sport vs giochi).
- **Frequenza lessicale per Parole**:
  - lv 1–8: FO
  - lv 9–15: FO + AU
  - lv 16–20: FO + AU + AD
- **Non ripetizione**: uno stimolo non si ripresenta entro 8 trial dello stesso esercizio.
- **Dataset minimo**: ~300 item con etichetta categoriale.

## JSON di configurazione esempio

```json
{
  "family": "sort_it",
  "exercises": [
    {
      "id": "sort_it_percettivo",
      "stimulusType": "percettivo",
      "cognitiveDomain": "FunzioniEsecutive",
      "ui": "tap_select_then_tap_bin",
      "levelTable": {
        "1":  { "nCategories": 2, "stimuliPerCategory": 3, "ruleSwitchEveryN": null, "ruleChangeCue": "esplicito", "feedbackType": "full",    "timeLimitPerCardMs": null,  "trialsPerSession": 6 },
        "20": { "nCategories": 4, "stimuliPerCategory": 4, "ruleSwitchEveryN": 2,    "ruleChangeCue": "implicito", "feedbackType": "none",    "timeLimitPerCardMs": 8000,  "trialsPerSession": 8 }
      },
      "microProgression": {
        "parameter": "ruleSwitchEveryN",
        "increment": -1,
        "floor": 1,
        "maxStepsOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false,
        "activatesFromLevel": 4
      },
      "stimulusGeneration": {
        "source": "programmatic_svg",
        "attributes": ["forma","colore","dimensione"],
        "activeDimensionsByLevel": {
          "lv1to6": ["colore"],
          "lv7to13": ["colore","forma"],
          "lv14to20": ["colore","forma","dimensione"]
        }
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    },
    {
      "id": "sort_it_semantico",
      "stimulusType": "semantico",
      "cognitiveDomain": "FunzioniEsecutive",
      "ui": "tap_select_then_tap_bin",
      "levelTable": {
        "1":  { "nCategories": 2, "stimuliPerCategory": 3, "ruleSwitchEveryN": null, "ruleChangeCue": "esplicito", "feedbackType": "full", "timeLimitPerCardMs": null, "trialsPerSession": 6 },
        "20": { "nCategories": 4, "stimuliPerCategory": 4, "ruleSwitchEveryN": 2,    "ruleChangeCue": "implicito", "feedbackType": "none", "timeLimitPerCardMs": 8000, "trialsPerSession": 8 }
      },
      "microProgression": {
        "parameter": "ruleSwitchEveryN",
        "increment": -1,
        "floor": 1,
        "maxStepsOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false,
        "activatesFromLevel": 4
      },
      "stimulusGeneration": {
        "source": "NVdB_italiano_and_twemoji",
        "categories": ["animali","cibo","attrezzi","veicoli","natura","abbigliamento","sport","arredo"],
        "highLevelCategories": ["animali_selvatici_vs_domestici","cibo_vs_cucina","sport_vs_giochi"],
        "frequencyBandByLevel": { "lv1to8": ["FO"], "lv9to15": ["FO","AU"], "lv16to20": ["FO","AU","AD"] },
        "minDataset": 300,
        "noRepetitionWithinTrials": 8
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    }
  ]
}
```
