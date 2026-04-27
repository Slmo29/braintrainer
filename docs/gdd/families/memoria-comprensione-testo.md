# Famiglia 8 — Memoria e Comprensione del Testo (4 esercizi)

**Dominio cognitivo**: Memoria
**Classificazione**: esercizi 1, 2, 3 → MBT. Esercizio 4 → MLT.
**Sostituisce**: Memoria di Prosa (giochi originali 34–36).
**Fondamento**: Discourse Comprehension Assessment, Logical Memory (WMS-IV).

## Meccanica core

Il giocatore legge un testo narrativo breve, poi:

- risponde a domande sul contenuto (richiamo fattuale o inferenza), oppure
- ricostruisce la sequenza degli eventi del testo.

## Struttura famiglia

La famiglia contiene **4 esercizi distinti su 3 tabelle livelli**:

- **Esercizi 1 e 2** (Richiamo fattuale MBT + Inferenza pragmatica MBT) condividono la **Tabella A** — stessa meccanica UI, stesso parametro N domande.
- **Esercizio 3** (Ordine narrativo MBT) ha **Tabella B** separata — parametro N eventi, meccanica drag and drop.
- **Esercizio 4** (Richiamo fattuale differito MLT) ha **Tabella C** separata — aggiunge delay MLT.

## Accuratezza

Calcolata **per domanda** (non per trial), denominatore = N domande totali nella sessione.

Per Ordine narrativo: N posizioni corrette / N eventi totali per trial, media di sessione.

## Timer di sessione

**Modello B — sessione a completamento** (vedi `shared/01-session-rules.md`) per **tutte e 4 le varianti**. Durata stimata indicata nella tabella di ciascun esercizio.

## Micro-progressione (per tabella)

| Tabella | Esercizi | Parametro | Note |
| :---- | :---- | :---- | :---- |
| A | Fattuale MBT, Inferenza MBT | +1 domanda per trial bonus | max +2 oltre base, **ceiling 5 domande totali** |
| B | Ordine narrativo MBT | +1 evento da riordinare | max +2 oltre base |
| C | Fattuale differito MLT | +15 secondi di delay | max +30 secondi, non conta per accuratezza |

## Pool testi

**Unico pool** di testi narrativi pre-generati da LLM (vedi `shared/06-content-generation.md`). Ogni testo ha un flag `ordine_narrativo: bool` che indica se la sequenza causale è sufficientemente esplicita per essere usata nell'Esercizio 3.

Testi senza flag possono essere usati solo per esercizi 1, 2, 4.

## Regole operative di generazione domande (specifiche per variante)

- **Richiamo fattuale**: ogni domanda punta a una singola unità informativa del testo (chi/cosa/quando/dove/come/perché). I distrattori sostituiscono solo il valore target mantenendo il contesto invariato (es. domanda su "dove" → distrattori sono luoghi plausibili ma assenti nel testo).
- **Inferenza pragmatica**: la risposta corretta richiede la combinazione esplicita di **almeno due frasi** del testo, citate nel prompt di generazione. I distrattori sono ricavabili da una sola frase del testo (plausibili ma insufficienti).
- **Ordine narrativo**: il testo viene pre-scomposto in N **unità evento atomiche** (azione + soggetto, senza connettivi causali espliciti). Le card mostrate all'utente usano queste unità atomiche, non le frasi intere del testo. Le card extra (distrattori, lv 5+) descrivono eventi coerenti con il tema ma assenti nel testo.

---

## Esercizi 1 e 2 — Richiamo fattuale MBT / Inferenza pragmatica MBT

**id JSON**: `memoria_comprensione_fattuale_mbt`, `memoria_comprensione_inferenziale_mbt`
**Classificazione**: MBT — richiamo immediato dopo la lettura del testo.

### Istruzioni utente

**Richiamo fattuale**:
> *"Leggi con attenzione il testo. Poi rispondi alle domande selezionando la risposta corretta tra quelle proposte."*

**Inferenza pragmatica**:
> *"Leggi con attenzione il testo. Poi rispondi alle domande: le risposte non sono scritte direttamente nel testo, ma puoi ricavarle da quello che hai letto."*

### Tabella A (condivisa)

| Lv | N frasi | N domande | N opzioni | Freq lessicale | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 3 | 1 | 3 | FO | 4 |
| 2 | 3 | 1 | 3 | FO | 4 |
| 3 | 4 | 1 | 3 | FO | 4 |
| 4 | 4 | 2 | 3 | FO | 5 |
| 5 | 4 | 2 | 3 | FO+AU | 5 |
| 6 | 5 | 2 | 3 | FO+AU | 5 |
| 7 | 5 | 2 | 4 | FO+AU | 5 |
| 8 | 5 | 2 | 4 | FO+AU | 5 |
| 9 | 6 | 2 | 4 | FO+AU | 5 |
| 10 | 6 | 3 | 4 | FO+AU | 5 |
| 11 | 6 | 3 | 4 | AU | 5 |
| 12 | 7 | 3 | 4 | AU | 5 |
| 13 | 7 | 3 | 4 | AU | 5 |
| 14 | 7 | 3 | 4 | AU+AD | 5 |
| 15 | 8 | 3 | 4 | AU+AD | 5 |
| 16 | 8 | 3 | 4 | AU+AD | 5 |
| 17 | 8 | 3 | 4 | AD | 5 |
| 18 | 9 | 3 | 4 | AD | 5 |
| 19 | 9 | 3 | 4 | AD | 5 |
| 20 | 10 | 3 | 4 | AD | 5 |

**Durata stimata sessione**: ~2–3 min (lv 1–5), ~4–5 min (lv 10–15), ~6 min (lv 16–20).

---

## Esercizio 3 — Ordine narrativo MBT

**id JSON**: `memoria_comprensione_ordine_narrativo`
**Classificazione**: MBT — ricostruzione immediata della sequenza narrativa.

### Meccanica UI

L'utente legge il testo, poi vede N **card (unità evento atomiche)** in ordine random in un'area sorgente. Trascina le card nell'ordine narrativo corretto in N slot.

Ai livelli alti sono presenti card extra (**distrattori**) che non appartengono al testo — l'utente le ignora o le lascia nell'area sorgente.

### Istruzioni utente

> *"Leggi con attenzione il testo. Poi metti in ordine i pezzi della storia trascinandoli nella sequenza corretta."*

### Tabella B

| Lv | N eventi | N distrattori | Freq lessicale | Trial |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 3 | 0 | FO | 4 |
| 2 | 3 | 0 | FO | 4 |
| 3 | 4 | 0 | FO | 4 |
| 4 | 4 | 0 | FO | 4 |
| 5 | 4 | 1 | FO+AU | 5 |
| 6 | 5 | 1 | FO+AU | 5 |
| 7 | 5 | 1 | FO+AU | 5 |
| 8 | 5 | 2 | FO+AU | 5 |
| 9 | 6 | 2 | FO+AU | 5 |
| 10 | 6 | 2 | FO+AU | 5 |
| 11 | 6 | 2 | AU | 5 |
| 12 | 7 | 2 | AU | 5 |
| 13 | 7 | 3 | AU | 5 |
| 14 | 7 | 3 | AU+AD | 5 |
| 15 | 8 | 3 | AU+AD | 5 |
| 16 | 8 | 3 | AU+AD | 5 |
| 17 | 8 | 3 | AD | 5 |
| 18 | 9 | 3 | AD | 5 |
| 19 | 9 | 3 | AD | 5 |
| 20 | 10 | 3 | AD | 5 |

**Durata stimata sessione**: ~2–3 min (lv 1–5), ~5–6 min (lv 16–20).

---

## Esercizio 4 — Richiamo fattuale differito MLT *(nuovo)*

**id JSON**: `memoria_comprensione_fattuale_mlt`
**Classificazione**: MLT — il testo viene letto, poi c'è un delay con task distrattore, poi le domande.
**Fondamento**: Logical Memory differito del WMS-IV.

### Istruzioni utente

> *"Leggi con attenzione il testo: dovrai rispondere ad alcune domande su di esso dopo una breve pausa. Poi farai una piccola attività. Al termine ti faremo alcune domande su quello che hai letto."*

**Nota clinica**: l'istruzione avverte l'utente **prima** della lettura che sarà testato dopo il delay — requisito clinico per una misura valida di memoria prospettica e ritenzione.

### Tabella C

| Lv | N frasi | N domande | N opzioni | Freq lessicale | Delay | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 3 | 1 | 3 | FO | 30 s | 3 |
| 2 | 3 | 1 | 3 | FO | 30 s | 3 |
| 3 | 4 | 1 | 3 | FO | 30 s | 3 |
| 4 | 4 | 2 | 3 | FO | 30 s | 3 |
| 5 | 4 | 2 | 3 | FO+AU | 1 min | 3 |
| 6 | 5 | 2 | 3 | FO+AU | 1 min | 3 |
| 7 | 5 | 2 | 4 | FO+AU | 1 min | 3 |
| 8 | 5 | 2 | 4 | FO+AU | 1 min | 3 |
| 9 | 6 | 2 | 4 | FO+AU | 1 min 30 s | 2 |
| 10 | 6 | 3 | 4 | FO+AU | 1 min 30 s | 2 |
| 11 | 6 | 3 | 4 | AU | 1 min 30 s | 2 |
| 12 | 7 | 3 | 4 | AU | 1 min 30 s | 2 |
| 13 | 7 | 3 | 4 | AU | 2 min | 2 |
| 14 | 7 | 3 | 4 | AU+AD | 2 min | 2 |
| 15 | 8 | 3 | 4 | AU+AD | 2 min | 2 |
| 16 | 8 | 3 | 4 | AU+AD | 2 min | 2 |
| 17 | 8 | 3 | 4 | AD | 3 min | 2 |
| 18 | 9 | 3 | 4 | AD | 3 min | 2 |
| 19 | 9 | 3 | 4 | AD | 3 min | 2 |
| 20 | 10 | 3 | 4 | AD | 3 min | 2 |

**Durata stimata sessione**: ~3 min (lv 1–4), ~7 min (lv 9–12), ~10–12 min (lv 17–20).

---

## Generazione stimoli (valida per tutti e 4 gli esercizi)

### Testi

- **Fonte**: LLM in pre-generazione (pool persistente, revisionato editorialmente prima del rilascio).
- **Requisiti narrativi**: ogni testo deve essere narrativo (soggetto, azione, tempo, luogo identificabili) e contenere almeno **6 unità informative discrete** etichettate (chi, cosa, quando, dove, come, perché) — come da `shared/06-content-generation.md`.
- **Frequenza lessicale del testo**: coerente con la fascia dichiarata nella tabella livelli.
- **Validazione automatica**:
  - indice GULPEASE ≥50 per lv 1–10, ≥40 per lv 11–20
  - nessuna informazione esterna al testo nelle domande
- **Flag `ordine_narrativo`**: `true` per testi con sequenza causale esplicita e scomponibile in eventi atomici ordinati — questi testi sono utilizzabili per tutti e 4 gli esercizi. Testi senza flag usabili solo per esercizi 1, 2, 4.
- **Dataset minimo**: ~200 testi (di cui ~120 con flag `ordine_narrativo`), suddivisi per fascia di complessità lessicale e numero di frasi.
- **Non ripetizione**: un testo non si riusa entro 30 sessioni dello stesso esercizio.

### Domande e distrattori

- Generati in fase di pre-popolamento dallo stesso LLM che genera il testo, nell'**ordine obbligatorio**: testo → unità informative etichettate → domande → distrattori.
- **Validazione automatica**: ogni distrattore deve essere confutabile con almeno una frase del testo.

---

## JSON di configurazione esempio

```json
{
  "family": "memoria_comprensione_testo",
  "exercises": [
    {
      "id": "memoria_comprensione_fattuale_mbt",
      "recallType": "factual",
      "classification": "MBT",
      "levelTable": {
        "1":  { "nSentences": 3, "nQuestions": 1, "nOptions": 3, "lexicalBand": "FO", "trialsPerSession": 4 },
        "20": { "nSentences": 10, "nQuestions": 3, "nOptions": 4, "lexicalBand": "AD", "trialsPerSession": 5 }
      },
      "microProgression": {
        "parameter": "nQuestions",
        "increment": 1,
        "maxOverBase": 2,
        "ceiling": 5,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "accuracyUnit": "per_question",
      "sessionTimer": "no_fixed_timer"
    },
    {
      "id": "memoria_comprensione_ordine_narrativo",
      "recallType": "narrative_order",
      "classification": "MBT",
      "levelTable": {
        "1":  { "nEvents": 3, "nDistractors": 0, "lexicalBand": "FO", "trialsPerSession": 4 },
        "20": { "nEvents": 10, "nDistractors": 3, "lexicalBand": "AD", "trialsPerSession": 5 }
      },
      "microProgression": {
        "parameter": "nEvents",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "accuracyUnit": "per_position",
      "sessionTimer": "no_fixed_timer"
    },
    {
      "id": "memoria_comprensione_fattuale_mlt",
      "recallType": "factual",
      "classification": "MLT",
      "levelTable": {
        "1":  { "nSentences": 3, "nQuestions": 1, "nOptions": 3, "lexicalBand": "FO", "delayS": 30, "trialsPerSession": 3 },
        "20": { "nSentences": 10, "nQuestions": 3, "nOptions": 4, "lexicalBand": "AD", "delayS": 180, "trialsPerSession": 2 }
      },
      "microProgression": {
        "parameter": "delayS",
        "increment": 15,
        "maxOverBase": 30,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "accuracyUnit": "per_question",
      "delayTask": "bouncing_ball_tap",
      "sessionTimer": "no_fixed_timer"
    }
  ]
}
```

L'esercizio `memoria_comprensione_inferenziale_mbt` ha struttura analoga al `memoria_comprensione_fattuale_mbt`: stessa `levelTable` (Tabella A), stessa `microProgression`. Differisce solo per `recallType: "inferential"` e per le regole di generazione domande (vedi sezione "Regole operative di generazione domande").
