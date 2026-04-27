# Famiglia 5 — Hayling Game (2 esercizi)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: inibizione risposta automatica.
**Fondamento**: Hayling Sentence Completion Test (Burgess & Shallice, 1997).

## Meccanica core

L'utente vede una **frase italiana con l'ultima parola mancante** e deve digitarla tramite tastiera QWERTY.

- **Modalità A (iniziazione)**: deve scrivere la parola che completa la frase **naturalmente**.
- **Modalità B (soppressione)**: deve scrivere una parola che **non ha nulla a che fare** con la frase, resistendo al completamento automatico.

## Input

**Tastiera QWERTY** standard mobile. Autocomplete leggero attivo (suggestion filtrata dal dizionario italiano) per ridurre errori di battitura — l'utente può ignorare il suggerimento e digitare liberamente.

## Validazione risposta

### Modalità A

La parola digitata viene confrontata con la **lista di completamenti attesi** per quella frase (pre-generata con il testo). Accettate **varianti morfologiche** (plurale, forma verbale coniugata).

### Modalità B

La parola digitata viene verificata come:

1. **parola italiana reale** (lookup su NVdB/dizionario)
2. **non presente nella blacklist semantica** della frase (lista pre-generata da LLM: campo semantico, sinonimi, iponimi, contesto)

Qualsiasi parola reale non in blacklist = risposta corretta.

## T.Lim per trial

**Fisso a 15000ms** per tutti i livelli e varianti (input libero richiede più tempo della selezione). È un **safety cap, non parametro di progressione**.

## Micro-progressione

Il parametro è la **band di difficoltà delle frasi** (1→2→3). Il trial bonus pesca una frase dalla band superiore rispetto alla base del livello.

- max +2 band oltre base
- I trial bonus non contano per l'accuratezza.

## Definizione band di difficoltà frasi

- **Band 1**: completamento automatico molto forte e univoco (es. *"Il sole tramonta a…"* → ovest). Resistere all'automatismo è immediato se si è attenti.
- **Band 2**: completamento automatico moderato, alcune alternative plausibili in competizione (es. *"Dopo la pioggia torna il…"* → sole / arcobaleno / sereno). Maggiore conflitto tra risposte competitive.
- **Band 3**: completamento automatico debole, più risposte in competizione (es. *"Il vecchio aprì lentamente il…"* → libro / cassetto / baule / porta — tutte plausibili). Massima difficoltà di soppressione.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

---

## Esercizio 1 — Hayling A+B (alternato)

**id JSON**: `hayling_ab`
**Costrutto**: inibizione + monitoraggio dell'obiettivo (l'utente deve sapere quale modalità è attiva per ogni trial).

### Struttura

I trial alternano modalità A e B. Ai livelli bassi ogni trial è etichettato ("Completa la frase" / "Parola diversa"). Ai livelli alti **l'etichetta sparisce** — l'utente decide autonomamente quale tipo di risposta dare.

### Cambio meccanica → schermata di avviso

Il livello **13** rimuove l'etichetta della modalità: cambio significativo che richiede la schermata di avviso descritta in `shared/02-trial-flow.md`.

### Istruzioni

**Lv 1–12, etichettato**:
> *"A ogni frase ti diremo se scrivere la parola giusta per completarla, oppure una parola qualsiasi che non c'entri nulla. Leggi l'indicazione e scrivi la tua risposta."*

**Lv 13–20, non etichettato**:
> *"Vedrai frasi incomplete. A volte scrivi la parola giusta per completarla, a volte una parola qualsiasi che non c'entri nulla. Decidi tu ogni volta."*

---

## Esercizio 2 — Hayling B-only

**id JSON**: `hayling_b_only`
**Costrutto**: inibizione pura — nessun trial di iniziazione, sempre soppressione.

### Istruzioni

> *"Vedrai frasi incomplete. Devi sempre scrivere una parola che non c'entri nulla con la frase. Non scrivere mai la parola che la completerebbe normalmente."*

Stessa tabella livelli dell'Esercizio 1.

---

## Tabella livelli (condivisa per entrambi gli esercizi)

| Lv | Band frasi | Etichetta modalità (solo A+B) | Trial |
| :---- | :---- | :---- | :---- |
| 1 | 1 | sì | 6 |
| 2 | 1 | sì | 6 |
| 3 | 1 | sì | 7 |
| 4 | 1 | sì | 7 |
| 5 | 1 | sì | 8 |
| 6 | 1 | sì | 8 |
| 7 | 2 | sì | 8 |
| 8 | 2 | sì | 8 |
| 9 | 2 | sì | 9 |
| 10 | 2 | sì | 9 |
| 11 | 2 | sì | 9 |
| 12 | 2 | sì | 9 |
| 13 | 3 | no | 10 |
| 14 | 3 | no | 10 |
| 15 | 3 | no | 10 |
| 16 | 3 | no | 10 |
| 17 | 3 | no | 10 |
| 18 | 3 | no | 10 |
| 19 | 3 | no | 10 |
| 20 | 3 | no | 10 |

## Generazione stimoli

- **Fonte**: LLM in pre-generazione, pool persistente revisionato editorialmente.
- **Etichette obbligatorie per ogni frase**: band di difficoltà (1/2/3), lista completamenti attesi (modalità A), blacklist semantica (modalità B), dominio semantico, complessità sintattica.
- **Requisito fondamentale**: ogni frase deve avere almeno **1 completamento automatico forte e riconoscibile**. Frasi ambigue scartate.
- **Non ripetizione**: una frase non si riusa entro 20 sessioni dello stesso esercizio.
- **Dataset minimo**: ~600 frasi distribuite equamente tra le 3 band (200 per band).

## JSON di configurazione esempio

```json
{
  "family": "hayling_game",
  "exercises": [
    {
      "id": "hayling_ab",
      "mode": "A_and_B",
      "cognitiveDomain": "FunzioniEsecutive",
      "inputType": "qwerty_keyboard",
      "autocomplete": "light_dictionary_suggestion",
      "timeLimitMs": 15000,
      "levelTable": {
        "1":  { "sentenceDifficultyBand": 1, "modeLabeled": true,  "trialsPerSession": 6 },
        "20": { "sentenceDifficultyBand": 3, "modeLabeled": false, "trialsPerSession": 10 }
      },
      "microProgression": {
        "parameter": "sentenceDifficultyBand",
        "increment": 1,
        "ceiling": 3,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "validation": {
        "modeA": "match_expected_completions_with_morphological_variants",
        "modeB": "real_word_check_plus_semantic_blacklist"
      },
      "stimulusGeneration": {
        "source": "LLM_pregenerated_pool",
        "minPoolSize": 600,
        "bandsDistribution": { "band1": 200, "band2": 200, "band3": 200 },
        "requiredLabels": ["band","completamenti_attesi","blacklist_semantica","dominio"],
        "qualityConstraint": "completamento_automatico_forte_obbligatorio",
        "noRepetitionWithinSessions": 20
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    },
    {
      "id": "hayling_b_only",
      "mode": "B_only",
      "cognitiveDomain": "FunzioniEsecutive",
      "inputType": "qwerty_keyboard",
      "autocomplete": "light_dictionary_suggestion",
      "timeLimitMs": 15000,
      "levelTable": {
        "1":  { "sentenceDifficultyBand": 1, "trialsPerSession": 6 },
        "20": { "sentenceDifficultyBand": 3, "trialsPerSession": 10 }
      },
      "microProgression": {
        "parameter": "sentenceDifficultyBand",
        "increment": 1,
        "ceiling": 3,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "validation": { "modeB": "real_word_check_plus_semantic_blacklist" },
      "stimulusGeneration": { "ref": "hayling_ab" },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    }
  ]
}
```
