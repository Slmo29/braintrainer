# Famiglia 6 — Pasat Light (gioco unico)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: WM aritmetica seriale — manipolazione attiva di numeri sotto pressione temporale.
**Fondamento**: Paced Serial Arithmetic Task (PASAT). Solo variante visiva — variante audio sospesa.

> **Nota di catalogazione**: il GDD originale classifica Pasat Light come Memoria. Riclassificato come Funzioni Esecutive perché misura primariamente working memory esecutiva (aggiornamento + calcolo concorrente). Vedi `shared/07-catalog.md` sezione "Note di riclassificazione".

## Meccanica core

L'utente vede **cifre che appaiono una alla volta** sullo schermo a intervalli regolari. Ad ogni nuova cifra deve calcolare mentalmente il risultato dell'operazione tra la **cifra corrente e quella immediatamente precedente**, e rispondere prima che appaia la cifra successiva.

Rispetto al PASAT classico (solo addizioni), PASAT Light introduce progressivamente tutte le operazioni aritmetiche, mantenendo la struttura seriale e il carico su WM.

## Struttura trial

La cifra appare per `isiMs`, poi viene sostituita dalla cifra successiva. L'utente deve rispondere **prima** che appaia la cifra successiva.

Se non risponde in tempo: trial marcato errato e la sequenza continua.

## Risposta

- **Lv 1–13**: **scelta multipla** (4 opzioni — risposta corretta + 3 distrattori plausibili: ±1, ±2 rispetto alla risposta, e un valore distante).
- **Lv 14–20**: **number pad** (tastiera numerica 0–9, risultati di 1–2 cifre). ISI compensato al passaggio (vedi tabella).

### Cambio meccanica → schermata di avviso

Il livello **14** introduce il number pad: cambio significativo che richiede la schermata di avviso descritta in `shared/02-trial-flow.md`.

## Eccezione a `ISI standard` (vedi `shared/02-trial-flow.md`)

PASAT Light **non usa l'ISI standard 500ms**. La cifra successiva appare automaticamente allo scadere dell'ISI di presentazione del livello (l'ISI è il **parametro stesso del compito**, non un gap di pausa). Eccezione documentata in `shared/02-trial-flow.md`.

## Micro-progressione

+1 operazione nella sequenza per trial bonus (stesso ritmo, sequenza più lunga). Max +2 oltre base.

## Regole di generazione sequenze

- **Sottrazioni**: generate solo quando il risultato è ≥0 (cifra precedente ≥ cifra corrente).
- **Divisioni**: generate solo quando il risultato è un **intero esatto**.
- **Moltiplicazioni e divisioni**: introdotte in proporzione crescente (lv 11: 20% operazioni complesse; lv 20: 50%).
- Le operazioni all'interno di una sequenza vengono assegnate casualmente rispettando le proporzioni del livello.
- L'operazione da applicare è indicata visivamente accanto alla cifra (es. `×7` — applica moltiplicazione con 7).

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## Istruzioni utente

**Lv 1–13 (scelta multipla)**:
> *"Vedrai dei numeri apparire uno alla volta. Ogni volta che appare un numero, calcola [operazione] tra quel numero e il precedente e scegli il risultato tra le opzioni. Vai il più veloce possibile."*

**Lv 14–20 (number pad)**:
> *"Vedrai dei numeri apparire uno alla volta. Ogni volta calcola [operazione] tra quel numero e il precedente e scrivi il risultato. Vai il più veloce possibile."*

## Tutorial

Mostra 3 cifre in sequenza con la regola `+`: appare "4", poi "7" → risultato 11 evidenziato tra le opzioni.

## Tabella livelli

| Lv | ISI (ms) | Operazioni | Range cifre | SeqLen | Risposta | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 2500 | + | 1–9 | 6 | MC | 5 |
| 2 | 2200 | + | 1–9 | 6 | MC | 5 |
| 3 | 2000 | + | 1–9 | 7 | MC | 5 |
| 4 | 1800 | + | 1–9 | 7 | MC | 6 |
| 5 | 1600 | + | 1–9 | 8 | MC | 6 |
| 6 | 1400 | + | 1–9 | 8 | MC | 6 |
| 7 | 1400 | +/− | 1–9 | 8 | MC | 6 |
| 8 | 1300 | +/− | 1–9 | 9 | MC | 7 |
| 9 | 1200 | +/− | 1–9 | 9 | MC | 7 |
| 10 | 1100 | +/− | 1–9 | 9 | MC | 7 |
| 11 | 1100 | +/−/× | 1–9 | 10 | MC | 8 |
| 12 | 1000 | +/−/× | 1–9 | 10 | MC | 8 |
| 13 | 1000 | +/−/× | 1–9 | 10 | MC | 8 |
| 14 | 1200 | +/−/× | 1–12 | 11 | NP | 8 |
| 15 | 1100 | +/−/×/÷ | 1–12 | 11 | NP | 8 |
| 16 | 1000 | +/−/×/÷ | 1–12 | 12 | NP | 9 |
| 17 | 1000 | +/−/×/÷ | 1–12 | 12 | NP | 9 |
| 18 | 900 | +/−/×/÷ | 1–20 | 13 | NP | 9 |
| 19 | 900 | +/−/×/÷ | 1–20 | 13 | NP | 10 |
| 20 | 800 | +/−/×/÷ | 1–20 | 14 | NP | 10 |

**Note alla tabella**:
- ISI sale a 1200ms al lv 14 (compensazione passaggio a number pad), poi riprende a scendere.
- MC = scelta multipla (4 opzioni); NP = number pad (0–9).

## Generazione sequenze

- **Cifre** generate programmaticamente nel range del livello.
- **Operazione** assegnata per ogni step secondo le **proporzioni del livello**:
  - lv 7–10: 50% addizioni, 50% sottrazioni
  - lv 11–13: 40% +, 40% −, 20% ×
  - lv 15–20: 25% ciascuna (con vincoli di divisibilità per ÷)
- **Per scelta multipla**: 3 distrattori = `risposta±1`, `risposta±2`, valore distante (fuori range ±5). Target sempre presente tra le opzioni (regola di `shared/05-ui-conventions.md`).
- **Per number pad**: l'utente tappa le cifre del risultato.
  - Risultati massimi: lv 14–17 fino a 144 (12×12); lv 18–20 fino a 400 (20×20).
  - Per ÷: risultati sempre ≤ 20.
- **Non ripetizione**: sequenza identica (stessa serie di cifre e operazioni) non si ripresenta entro 10 sessioni.

## JSON di configurazione esempio

```json
{
  "family": "pasat_light",
  "exercises": [
    {
      "id": "pasat_light_visivo",
      "stimulusType": "visual",
      "cognitiveDomain": "FunzioniEsecutive",
      "levelTable": {
        "1":  { "isiMs": 2500, "operations": ["+"],            "digitRange": [1,9],  "sequenceLength": 6,  "responseType": "multiple_choice", "trialsPerSession": 5 },
        "14": { "isiMs": 1200, "operations": ["+","-","*"],    "digitRange": [1,12], "sequenceLength": 11, "responseType": "number_pad",      "trialsPerSession": 8 },
        "20": { "isiMs": 800,  "operations": ["+","-","*","/"],"digitRange": [1,20], "sequenceLength": 14, "responseType": "number_pad",      "trialsPerSession": 10 }
      },
      "operationProportionsByLevel": {
        "lv1to6":   { "+": 1.0 },
        "lv7to10":  { "+": 0.5, "-": 0.5 },
        "lv11to13": { "+": 0.4, "-": 0.4, "*": 0.2 },
        "lv14":     { "+": 0.33, "-": 0.33, "*": 0.34 },
        "lv15to20": { "+": 0.25, "-": 0.25, "*": 0.25, "/": 0.25 }
      },
      "generationConstraints": {
        "subtraction": "result_ge_0",
        "division": "integer_result_only",
        "multipleChoice": { "distractors": ["result+1","result-1","result+2","result-2","distant_value"] }
      },
      "microProgression": {
        "parameter": "sequenceLength",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    }
  ]
}
```
