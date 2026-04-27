# Famiglia 19 — Verbal Fluency (2 esercizi)

**Dominio cognitivo**: Linguaggio
**Classificazione**: accesso lessicale, fluenza verbale.
**Fondamento**: test FAS (fluenza fonemica) e Controlled Oral Word Association Test (fluenza semantica).

> **Nota di catalogo**: DCCS (Dimensional Change Card Sort, giochi 59–61) eliminato — ridondante con Sort It (Famiglia 4) che già copre il costrutto di flessibilità cognitiva con cambio di regola.

## Meccanica core

L'utente ha un **tempo limitato** per scrivere quante più parole possibile appartenenti a:

- una **categoria semantica** (fluenza semantica), oppure
- che iniziano con una **lettera specifica** (fluenza fonemica)

Input QWERTY con autocomplete leggero. Ogni sessione = **1 trial** (una categoria o una lettera).

## Struttura sessione

**Modello B — sessione a completamento** (vedi `shared/01-session-rules.md`).

Una sessione = una finestra temporale unica. L'utente vede la categoria o lettera assegnata e ha `timeLimitS` secondi per digitare quante più parole possibile. Sessione termina al timeout della finestra (timeout massimo aggiuntivo: 90s di inattività sulla tastiera).

## Validazione parole

- **Lookup su NVdB/dizionario italiano** (più Wikizionario it filtrato per termini estesi).
- **Duplicati** all'interno dello stesso trial **non contati**.
- **Varianti morfologiche** della stessa parola **non conteggiate separatamente** (es. "cane" e "cani" = 1 parola tramite lemmatizzazione).
- **Nomi propri non accettati** (salvo esercizi specifici).
- **Score** = parole valide uniche digitate nel trial.

## Autocomplete

Suggestion **leggera filtrata sulla categoria/lettera** del trial — aiuta a ridurre errori di battitura ma **non suggerisce parole non ancora digitate parzialmente** (per non aiutare il recupero, che è proprio ciò che si misura).

## Micro-progressione

−5s `timeLimitS` per trial bonus (max −2 step, floor 30s). Il trial bonus è la **stessa categoria/lettera con meno tempo** — stesso contenuto, pressione maggiore.

## Accuratezza

**Non applicabile nel senso tradizionale** (corretto/errato per trial). La misura è lo **score** (N parole valide).

La promozione inter-livello si basa sul raggiungimento di una **soglia di score minima** per il livello (definita nella tabella).

- Score ≥ soglia → considerato corretto per la regola standard di promozione (`shared/03-progression.md`)
- Soglia non raggiunta in 2 sessioni consecutive → retrocessione candidata

`promotionLogic: score_ge_threshold_counts_as_correct_for_interlevel_rule`

## Timer di sessione

**Modello B**: nessun timer fisso. Durata = T.Lim del livello + eventuale timeout QWERTY (max 90s).

---

## Esercizio 1 — Verbal Fluency Semantica

**id JSON**: `verbal_fluency_semantica`
**Costrutto**: accesso lessicale per categoria semantica. Misura la ricchezza del vocabolario semantico e la velocità di recupero.

### Istruzioni utente

> *"Scrivi quante più [categoria] riesci in [N] secondi. Ogni parola su una riga diversa. Non ripetere le parole."*

### Categorie per fascia di livello

- **Lv 1–5**: categorie molto ampie (animali, cibi, oggetti di casa, mezzi di trasporto, capi di abbigliamento).
- **Lv 6–10**: categorie medie (frutti, verdure, mobili, sport, professioni).
- **Lv 11–15**: categorie più specifiche (animali del mare, strumenti musicali, città italiane, verdure a foglia, sport invernali).
- **Lv 16–20**: categorie ristrette o contestuali (animali che iniziano per C, cibi che si mangiano freddi, oggetti di metallo, professioni sanitarie).

### Tabella livelli

| Lv | T.Lim (s) | Soglia score | Categoria |
| :---- | :---- | :---- | :---- |
| 1 | 60 | 5 | molto ampia |
| 2 | 60 | 6 | molto ampia |
| 3 | 60 | 7 | molto ampia |
| 4 | 55 | 7 | molto ampia |
| 5 | 55 | 8 | molto ampia |
| 6 | 55 | 8 | media |
| 7 | 50 | 9 | media |
| 8 | 50 | 9 | media |
| 9 | 50 | 10 | media |
| 10 | 50 | 10 | media |
| 11 | 45 | 10 | specifica |
| 12 | 45 | 11 | specifica |
| 13 | 45 | 11 | specifica |
| 14 | 45 | 12 | specifica |
| 15 | 40 | 12 | specifica |
| 16 | 40 | 12 | ristretta |
| 17 | 40 | 13 | ristretta |
| 18 | 40 | 13 | ristretta |
| 19 | 35 | 14 | ristretta |
| 20 | 35 | 14 | ristretta |

---

## Esercizio 2 — Verbal Fluency Fonemica

**id JSON**: `verbal_fluency_fonemica`
**Costrutto**: accesso lessicale per iniziale fonemica. Misura la velocità di recupero lessicale basata su pattern fonologico — **più sensibile al declino frontale** rispetto alla fluenza semantica.

### Istruzioni utente

> *"Scrivi quante più parole che iniziano con la lettera [X] riesci in [N] secondi. Ogni parola su una riga diversa. Non ripetere le parole. Niente nomi propri."*

### Lettere per fascia di livello

- **Lv 1–7**: lettere molto frequenti nell'italiano (A, E, S, C, R, P, M) — molte parole disponibili.
- **Lv 8–13**: lettere medie (B, D, F, G, L, T, V).
- **Lv 14–20**: lettere poco frequenti (N, O, I, Z, Q, H) — meno parole disponibili, maggiore sforzo di recupero.

### Tabella livelli

| Lv | T.Lim (s) | Soglia score | Lettere pool |
| :---- | :---- | :---- | :---- |
| 1 | 60 | 4 | A, E, S |
| 2 | 60 | 5 | A, E, S |
| 3 | 60 | 6 | A, E, S, C |
| 4 | 55 | 6 | A, E, S, C, R |
| 5 | 55 | 7 | A, E, S, C, R, P |
| 6 | 55 | 7 | A, E, S, C, R, P, M |
| 7 | 50 | 8 | A, E, S, C, R, P, M |
| 8 | 50 | 8 | B, D, F, G |
| 9 | 50 | 9 | B, D, F, G, L |
| 10 | 50 | 9 | B, D, F, G, L, T |
| 11 | 45 | 9 | B, D, F, G, L, T, V |
| 12 | 45 | 10 | B, D, F, G, L, T, V |
| 13 | 45 | 10 | B, D, F, G, L, T, V |
| 14 | 45 | 10 | N, O, I |
| 15 | 40 | 11 | N, O, I, Z |
| 16 | 40 | 11 | N, O, I, Z |
| 17 | 40 | 12 | N, O, I, Z, Q |
| 18 | 40 | 12 | N, O, I, Z, Q |
| 19 | 35 | 12 | N, O, I, Z, Q, H |
| 20 | 35 | 13 | N, O, I, Z, Q, H |

Lettera assegnata casualmente dal pool del livello, **diversa dalla sessione precedente**.

---

## Generazione stimoli

- **Categorie semantiche**: lista pre-definita di ~60 categorie classificate per ampiezza (molto ampia / media / specifica / ristretta), revisionata editorialmente.
- **Lettere**: pool definito per livello come da tabella sopra.
- **Non ripetizione**: stessa categoria/lettera non usata nelle ultime 5 sessioni dello stesso esercizio.
- **Validazione parole**: dizionario italiano NVdB + dizionario esteso (Wikizionario it filtrato). Varianti morfologiche raggruppate tramite lemmatizzazione.

## JSON di configurazione esempio

```json
{
  "family": "verbal_fluency",
  "exercises": [
    {
      "id": "verbal_fluency_semantica",
      "type": "semantic",
      "cognitiveDomain": "Linguaggio",
      "inputType": "qwerty_keyboard",
      "autocomplete": "light_filtered_by_category",
      "sessionStructure": "single_trial",
      "levelTable": {
        "1":  { "timeLimitS": 60, "scoreThreshold": 5,  "categoryBand": "molto_ampia" },
        "11": { "timeLimitS": 45, "scoreThreshold": 10, "categoryBand": "specifica" },
        "20": { "timeLimitS": 35, "scoreThreshold": 14, "categoryBand": "ristretta" }
      },
      "microProgression": {
        "parameter": "timeLimitS",
        "increment": -5,
        "floor": 30,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "validation": {
        "source": "NVdB_plus_wiktionary_it",
        "lemmatization": true,
        "rejectProperNouns": true,
        "rejectDuplicatesWithinTrial": true
      },
      "promotionLogic": "score_ge_threshold_counts_as_correct_for_interlevel_rule"
    },
    {
      "id": "verbal_fluency_fonemica",
      "type": "phonemic",
      "cognitiveDomain": "Linguaggio",
      "inputType": "qwerty_keyboard",
      "autocomplete": "light_filtered_by_initial_letter",
      "sessionStructure": "single_trial",
      "levelTable": {
        "1":  { "timeLimitS": 60, "scoreThreshold": 4,  "letterPool": ["A","E","S"] },
        "14": { "timeLimitS": 45, "scoreThreshold": 10, "letterPool": ["N","O","I"] },
        "20": { "timeLimitS": 35, "scoreThreshold": 13, "letterPool": ["N","O","I","Z","Q","H"] }
      },
      "microProgression": {
        "parameter": "timeLimitS",
        "increment": -5,
        "floor": 30,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "validation": {
        "source": "NVdB_plus_wiktionary_it",
        "lemmatization": true,
        "rejectProperNouns": true,
        "rejectDuplicatesWithinTrial": true
      },
      "letterSelection": "random_from_pool_no_repeat_last_5_sessions",
      "promotionLogic": "score_ge_threshold_counts_as_correct_for_interlevel_rule"
    }
  ]
}
```
