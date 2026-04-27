# Famiglia 1 — Sequence Tap (4 esercizi distinti)

**Dominio cognitivo**: Memoria
**Classificazione**: tutti e 4 gli esercizi sono **MBT** (richiamo immediato senza delay). Il carico di working memory negli esercizi backward deriva dall'inversione mentale, non dal delay.
**Struttura famiglia**: caso di **deroga al principio "una sola tabella per famiglia"**. La famiglia contiene 4 esercizi distinti, ciascuno con la propria tabella livelli e i propri parametri di carico, perché misurano costrutti cognitivi diversi (span MBT puro vs WM verbale-esecutiva). I 4 esercizi sono trattati dal sistema come **unità separate** ai fini di selezione giornaliera, progressione e tracking delle metriche.

## Meccanica core

Il giocatore vede una sequenza di stimoli presentati uno alla volta e deve riprodurla tappando nell'ordine corretto (forward) o inverso (backward), oppure deve riprodurre in ordine inverso le lettere di una singola parola mostrata brevemente.

Ispirato al Digit Span del WAIS-IV e al Corsi Block-Tapping Test.

## Timer di sessione

- 90 secondi (livelli 1–10)
- 120 secondi (livelli 11–20)

**Caveat**: per Numeri Forward livelli 19–20 con 10 trial completi il tempo richiesto può eccedere 120s. Il sistema termina la sessione allo scadere del timer e valuta solo i trial completati.

## Micro-progressione (per esercizio)

Regola standard di `shared/03-progression.md` (max +2 oltre base, trial bonus non valutativi).

| Esercizio | Parametro micro-progressione |
| :---- | :---- |
| Numeri Forward | +1 elemento di sequenza |
| Numeri Backward | +1 elemento di sequenza |
| Parole Forward | +1 elemento di sequenza |
| Parole Backward | +1 lettera nella parola |

---

## Esercizio 1 — Sequence Tap Numeri Forward

**id JSON**: `sequence_tap_numeri_forward`
**Costrutto**: MBT — span fonologico per cifre.

### Istruzioni utente

> *"Memorizza la sequenza di numeri che apparirà sullo schermo, uno alla volta. Quando la sequenza è finita, tocca i numeri nell'ordine in cui sono apparsi."*

### Tabella livelli

| Lv | SeqLen | Speed (ms) | T.Lim (ms) | Trial |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 3 | 2000 | — | 5 |
| 2 | 3 | 2000 | — | 5 |
| 3 | 3 | 1800 | — | 5 |
| 4 | 4 | 1800 | — | 6 |
| 5 | 4 | 1700 | — | 6 |
| 6 | 4 | 1600 | — | 7 |
| 7 | 5 | 1600 | — | 7 |
| 8 | 5 | 1500 | — | 8 |
| 9 | 5 | 1400 | — | 8 |
| 10 | 6 | 1400 | — | 8 |
| 11 | 6 | 1300 | — | 9 |
| 12 | 6 | 1200 | — | 9 |
| 13 | 7 | 1200 | — | 10 |
| 14 | 7 | 1100 | — | 10 |
| 15 | 8 | 1100 | — | 10 |
| 16 | 8 | 1000 | — | 10 |
| 17 | 9 | 1000 | — | 10 |
| 18 | 9 | 900 | 8000 | 10 |
| 19 | 10 | 900 | 7000 | 10 |
| 20 | 10 | 800 | 6000 | 10 |

### Generazione stimoli

- **Fonte**: cifre 0–9 generate programmaticamente.
- **Vincoli**:
  - nessuna ripetizione consecutiva all'interno della stessa sequenza
  - nessuna sequenza monotona crescente o decrescente di lunghezza ≥3 (es. evitare 1-2-3, 9-8-7)
- **Dataset minimo**: N/A — generazione runtime.

---

## Esercizio 2 — Sequence Tap Numeri Backward

**id JSON**: `sequence_tap_numeri_backward`
**Costrutto**: WM verbale-esecutiva su contenuto numerico.

### Istruzioni utente

> *"Memorizza la sequenza di numeri che apparirà sullo schermo, uno alla volta. Quando la sequenza è finita, tocca i numeri in ordine inverso, partendo dall'ultimo che hai visto."*

### Tabella livelli

| Lv | SeqLen | Speed (ms) | T.Lim (ms) | Trial |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 2 | 2000 | — | 5 |
| 2 | 2 | 1800 | — | 5 |
| 3 | 3 | 1800 | — | 5 |
| 4 | 3 | 1700 | — | 6 |
| 5 | 3 | 1600 | — | 6 |
| 6 | 4 | 1600 | — | 7 |
| 7 | 4 | 1500 | — | 7 |
| 8 | 4 | 1400 | — | 8 |
| 9 | 5 | 1400 | — | 8 |
| 10 | 5 | 1300 | — | 8 |
| 11 | 5 | 1200 | — | 9 |
| 12 | 6 | 1200 | — | 9 |
| 13 | 6 | 1100 | — | 9 |
| 14 | 6 | 1000 | — | 10 |
| 15 | 7 | 1000 | — | 10 |
| 16 | 7 | 900 | — | 10 |
| 17 | 7 | 900 | — | 10 |
| 18 | 8 | 900 | 10000 | 10 |
| 19 | 8 | 800 | 9000 | 10 |
| 20 | 8 | 800 | 7000 | 10 |

**Note cliniche**: T.Lim più generoso del Forward perché l'inversione mentale richiede tempo aggiuntivo. Span max 8 (vs 10 del Forward), in linea con norme WAIS-IV per Backward Digit Span.

### Generazione stimoli

Come Numeri Forward (cifre 0–9, stessi vincoli).

---

## Esercizio 3 — Sequence Tap Parole Forward

**id JSON**: `sequence_tap_parole_forward`
**Costrutto**: MBT verbale — span per parole (componente lessico-fonologica).

### Istruzioni utente

> *"Memorizza la sequenza di parole che apparirà sullo schermo, una alla volta. Quando la sequenza è finita, tocca le parole nell'ordine in cui sono apparse."*

### Tabella livelli

| Lv | SeqLen | Speed (ms) | T.Lim (ms) | Trial |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 2 | 2500 | — | 5 |
| 2 | 2 | 2300 | — | 5 |
| 3 | 3 | 2300 | — | 5 |
| 4 | 3 | 2100 | — | 6 |
| 5 | 3 | 2000 | — | 6 |
| 6 | 4 | 2000 | — | 7 |
| 7 | 4 | 1900 | — | 7 |
| 8 | 4 | 1800 | — | 7 |
| 9 | 5 | 1800 | — | 8 |
| 10 | 5 | 1700 | — | 8 |
| 11 | 5 | 1600 | — | 8 |
| 12 | 6 | 1600 | — | 9 |
| 13 | 6 | 1500 | — | 9 |
| 14 | 6 | 1500 | — | 9 |
| 15 | 7 | 1400 | — | 10 |
| 16 | 7 | 1400 | — | 10 |
| 17 | 7 | 1300 | — | 10 |
| 18 | 8 | 1300 | 10000 | 10 |
| 19 | 8 | 1200 | 9000 | 10 |
| 20 | 8 | 1200 | 8000 | 10 |

**Note cliniche**: Velocità di presentazione più lenta dei numeri (parola = lettura). Span max 8 (vs 10 dei numeri), coerente con la maggiore complessità fonologica.

### Generazione stimoli

- **Fonte**: NVdB italiano (con integrazione Wikizionario it per livelli alti).
- **Lunghezza parola**: 4–6 caratteri (lv 1–7), 4–7 (lv 8–14), 4–8 (lv 15–20).
- **Fascia di frequenza per livello**:
  - lv 1–7: solo FO (fondamentale)
  - lv 8–14: FO + AU (alto uso)
  - lv 15–20: FO + AU + AD (alta disponibilità) + Wikizionario per termini rari
- **Filtro grammaticale**: nomi concreti preferiti; evitare verbi astratti, funtori, articoli.
- **Esclusioni**: parolacce, regionalismi, omografi, nomi propri.
- **Non ripetizione**: una parola non si ripete entro 10 trial successivi nello stesso esercizio.
- **Dataset minimo effettivo**: ~500 nomi concreti filtrati dall'NVdB stratificati per fascia di frequenza.

---

## Esercizio 4 — Sequence Tap Parole Backward

**id JSON**: `sequence_tap_parole_backward`
**Costrutto**: WM verbale + inibizione (richiamo lettere parola in ordine inverso).
**Nota storica**: confluisce qui la meccanica precedentemente proposta come "Spelling a Rovescio".

### Istruzioni utente

> *"Una parola apparirà sullo schermo per qualche istante, poi scomparirà. Tocca le sue lettere in ordine inverso, partendo dall'ultima."*

### Meccanica specifica

La parola viene mostrata **intera** per il tempo di esposizione del livello, poi scompare. L'utente vede una **tastiera** (configurazione variabile per livello — vedi sotto) e deve toccare le lettere in ordine inverso.

### Tabella livelli

| Lv | LunghParola | Espo (ms) | T.Lim (ms) | Tastiera | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 3 | 3000 | 15000 | tutte le lettere parola, occorrenze separate | 5 |
| 2 | 3 | 2800 | 14000 | tutte le lettere parola, occorrenze separate | 5 |
| 3 | 4 | 2800 | 14000 | tutte le lettere parola, occorrenze separate | 5 |
| 4 | 4 | 2500 | 13000 | tutte le lettere parola, occorrenze separate | 6 |
| 5 | 5 | 2500 | 12000 | tutte le lettere parola, occorrenze separate | 6 |
| 6 | 5 | 2200 | 12000 | tutte le lettere parola, occorrenze separate | 6 |
| 7 | 6 | 2200 | 11000 | lettere uniche parola + 4 distrattori | 7 |
| 8 | 6 | 2000 | 11000 | lettere uniche parola + 4 distrattori | 7 |
| 9 | 7 | 2000 | 10000 | lettere uniche parola + 6 distrattori | 7 |
| 10 | 7 | 1800 | 10000 | lettere uniche parola + 6 distrattori | 8 |
| 11 | 7 | 1800 | 9000 | lettere uniche parola + 8 distrattori | 8 |
| 12 | 8 | 1600 | 9000 | lettere uniche parola + 8 distrattori | 8 |
| 13 | 8 | 1600 | 9000 | alfabeto completo (26 lettere) | 8 |
| 14 | 9 | 1400 | 8000 | alfabeto completo | 9 |
| 15 | 9 | 1400 | 8000 | alfabeto completo | 9 |
| 16 | 10 | 1300 | 8000 | alfabeto completo | 9 |
| 17 | 10 | 1300 | 7000 | alfabeto completo | 10 |
| 18 | 11 | 1200 | 7000 | alfabeto completo | 10 |
| 19 | 11 | 1200 | 7000 | alfabeto completo | 10 |
| 20 | 12 | 1100 | 7000 | alfabeto completo | 10 |

### Logica della tastiera (3 fasce)

**Lv 1–6 (assistita)**: vengono mostrate **tutte le lettere della parola**, con ogni occorrenza come tasto separato (es. CASA → 4 tasti C, A, S, A in ordine random). L'utente vede quante lettere ci sono e quali, senza dover gestire conteggio + inibizione contemporaneamente.

**Lv 7–12 (mista)**: vengono mostrate le **lettere uniche** della parola (es. CASA → C, A, S) più N **distrattori** (4, 6 o 8). Per parole con lettere ripetute, l'utente tappa la stessa lettera più volte (tap multipli accettati).

I distrattori sono lettere foneticamente o visivamente vicine, **non scelti casualmente**:

- foneticamente vicine: B↔P, D↔T, M↔N, F↔V, S↔Z, C↔G, L↔R
- visivamente simili: E↔F, M↔W, U↔V

**Lv 13–20 (piena inibizione)**: alfabeto completo (26 lettere). Tap multipli accettati per lettere ripetute.

### Cambio meccanica → schermata di avviso

I cambi di tastiera (lv 7, lv 13) sono **cambi di meccanica significativi** e richiedono la schermata di avviso descritta in `shared/02-trial-flow.md` prima della prima sessione al nuovo livello.

### Generazione stimoli

- **Fonte**: NVdB italiano.
- **Lunghezza parola**: come da tabella livelli (3–12 caratteri).
- **Fascia di frequenza per livello**:
  - lv 1–10: solo FO
  - lv 11–20: FO + AU
- **Filtro grammaticale**: nomi concreti.
- **Esclusioni**: parolacce, monosillabiche, parole con caratteri accentati (è, ò, ì, à, ù) per chiarezza tastiera, omografi, nomi propri.
- **Non ripetizione**: una parola non si ripete entro 10 trial successivi nello stesso esercizio.
- **Distrattori (lv 7–12)**: generati al momento della selezione della parola usando matrice di vicinanza fonetica/visiva predefinita.
- **Dataset minimo effettivo**: ~400 nomi concreti filtrati per coprire tutta la gamma di lunghezze 3–12.

---

## JSON di configurazione esempio

```json
{
  "family": "sequence_tap",
  "exercises": [
    {
      "id": "sequence_tap_numeri_forward",
      "stimulusType": "numeri",
      "mode": "forward",
      "construct": "MBT_span_fonologico",
      "classification": "MBT",
      "levelTable": {
        "1":  { "sequenceLength": 3,  "presentationSpeedMs": 2000, "timeLimitMs": null, "trialsPerSession": 5 },
        "20": { "sequenceLength": 10, "presentationSpeedMs": 800,  "timeLimitMs": 6000, "trialsPerSession": 10 }
      },
      "microProgression": {
        "parameter": "sequenceLength",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "programmatic_digits_0_9",
        "constraints": ["no_consecutive_repetition", "no_monotone_sequences_len_ge_3"]
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    },
    {
      "id": "sequence_tap_parole_backward",
      "stimulusType": "parola_singola",
      "mode": "backward_letters",
      "construct": "WM_verbale_inibizione",
      "classification": "MBT",
      "levelTable": {
        "1":  { "wordLength": 3,  "exposureMs": 3000, "timeLimitMs": 15000, "keyboard": "word_letters_separate", "trialsPerSession": 5 },
        "20": { "wordLength": 12, "exposureMs": 1100, "timeLimitMs": 7000,  "keyboard": "alphabet_full",         "trialsPerSession": 10 }
      },
      "microProgression": {
        "parameter": "wordLength",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "NVdB_italiano",
        "frequencyBandByLevel": { "lv1to10": ["FO"], "lv11to20": ["FO","AU"] },
        "grammaticalFilter": ["nome_concreto"],
        "exclusions": ["parolacce","monosillabiche","caratteri_accentati","omografi","nomi_propri"],
        "distractorRules": { "lv7to12": "phonetic_or_visual_neighbor_matrix" },
        "noRepetitionWithinTrials": 10
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    }
  ]
}
```

Per gli esercizi `sequence_tap_numeri_backward` e `sequence_tap_parole_forward` la struttura è analoga; differiscono solo nei valori della `levelTable` e nei parametri di `stimulusGeneration` (riferirsi alle tabelle e ai criteri sopra).
