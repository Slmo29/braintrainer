# Famiglia 9 — Memoria Lista (4 esercizi)

**Dominio cognitivo**: Memoria
**Classificazione**: tutti e 4 gli esercizi sono **MLT** — delay 30s → 3min (tabella delay di `shared/04-memory-types.md`).

## Meccanica core

L'utente vede una lista di item presentati uno alla volta. Dopo un delay con task distrattore (palla rimbalzante) deve recuperare gli item della lista.

La famiglia misura **memoria episodica verbale e visiva**, con varianti di **rievocazione** e **riconoscimento** clinicamente distinte.

**Importanza clinica della distinzione rievocazione vs riconoscimento**: il confronto rievocazione/riconoscimento è un marcatore diagnostico — riconoscimento preservato + rievocazione deficitaria è un segnale precoce di declino mnestico.

## Struttura trial

```
Item presentati uno alla volta → Delay con task distrattore (palla) → Recupero
```

## Interferenza retroattiva (lv 14–20)

Dopo il delay e prima del recupero della lista A, viene mostrata brevemente una **lista B** (stessa modalità, N item diversi). L'utente deve ricordare la lista A — non B.

Misura la **resistenza all'interferenza retroattiva**.

## Micro-progressione

+1 item per trial bonus (max +2 oltre base). Regola standard.

## Timer di sessione

**Modello B — sessione a completamento** (vedi `shared/01-session-rules.md`). Durata stimata:

- ~5 min (lv 1–4)
- ~8 min (lv 9–13)
- ~12 min (lv 17–20)

## Tabella livelli (condivisa per tutti e 4 gli esercizi)

| Lv | N item | Speed (ms) | Delay | Interferenza | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 4 | 2000 | 30 s | no | 5 |
| 2 | 4 | 2000 | 30 s | no | 5 |
| 3 | 5 | 1800 | 30 s | no | 4 |
| 4 | 5 | 1800 | 30 s | no | 4 |
| 5 | 6 | 1600 | 1 min | no | 4 |
| 6 | 6 | 1600 | 1 min | no | 4 |
| 7 | 7 | 1500 | 1 min | no | 3 |
| 8 | 7 | 1500 | 1 min | no | 3 |
| 9 | 8 | 1400 | 1 min 30 s | no | 3 |
| 10 | 8 | 1400 | 1 min 30 s | no | 3 |
| 11 | 9 | 1300 | 1 min 30 s | no | 3 |
| 12 | 9 | 1300 | 1 min 30 s | no | 3 |
| 13 | 10 | 1200 | 2 min | no | 2 |
| 14 | 10 | 1200 | 2 min | sì | 2 |
| 15 | 10 | 1200 | 2 min | sì | 2 |
| 16 | 11 | 1100 | 2 min | sì | 2 |
| 17 | 11 | 1100 | 3 min | sì | 2 |
| 18 | 11 | 1100 | 3 min | sì | 2 |
| 19 | 12 | 1000 | 3 min | sì | 2 |
| 20 | 12 | 1000 | 3 min | sì | 2 |

### Cambio meccanica → schermata di avviso

Il livello **14** introduce l'interferenza retroattiva: cambio di meccanica significativo che richiede la schermata di avviso descritta in `shared/02-trial-flow.md`.

---

## Esercizio 1 — Parole non correlate, Rievocazione

**id JSON**: `memoria_lista_parole_rievocazione`
**Costrutto**: memoria episodica verbale — rievocazione libera di parole senza legame semantico.

### Istruzioni utente

> *"Leggi con attenzione le parole che appaiono una alla volta. Cerca di ricordarle tutte. Poi farai una breve attività, e dopo ti chiederemo di scrivere tutte le parole che ricordi."*

### Risposta

**Tastiera QWERTY** con autocomplete leggero filtrato su dizionario italiano.

L'utente digita ogni parola ricordata, conferma con invio, poi la successiva. Può inserirle in **qualsiasi ordine**. Quando non ricorda più nulla tappa **"Fine"**.

**Timeout automatico a 90 secondi** dalla comparsa della tastiera — se l'utente non tappa "Fine" entro 90s, la fase di rievocazione termina automaticamente.

**Accuratezza** = parole corrette / N item lista.

### Feedback (deroga a `shared/02-trial-flow.md`)

Nessun feedback per singola parola durante l'inserimento. Riepilogo a fine rievocazione (N parole corrette su M inserite).

### Generazione stimoli

- **Fonte**: NVdB italiano.
- **Vincolo lista**: parole da categorie semantiche distinte — nessuna parola della stessa categoria nella stessa lista (non correlate).
- **Frequenza lessicale**:
  - lv 1–8: FO
  - lv 9–15: FO + AU
  - lv 16–20: FO + AU + AD
- **Non ripetizione**: una parola non si riusa entro 15 sessioni dello stesso esercizio.
- **Dataset minimo**: ~500 parole categorizzate per dominio semantico.

---

## Esercizio 2 — Immagini miste, Rievocazione

**id JSON**: `memoria_lista_immagini_rievocazione`
**Costrutto**: memoria episodica visiva — rievocazione di immagini senza mediazione verbale ai livelli alti.

### Istruzioni utente

> *"Guarda le immagini che appaiono una alla volta. Cerca di ricordarle tutte. Poi farai una breve attività, e dopo ti mostreremo molte immagini: tocca tutte quelle che hai visto prima."*

### Risposta

**Pool grid ampio** (~40 immagini totali, di cui N corrette e ~28 foil visualmente simili per macro-categoria).

L'utente scorre la griglia e tappa tutte le immagini che ricorda dalla lista.

**Importante**: la griglia non deve rinfrescare la memoria — i foil devono essere sufficientemente numerosi da rendere impossibile il riconoscimento senza sforzo mnestico attivo.

**Accuratezza** = immagini corrette tappate / N item lista.

### Generazione stimoli

- **Fonte**: Twemoji/Noto Emoji, 8+ categorie semantiche.
- **Per ogni trial**: item scelti da categorie diverse (miste). Foil: emoji della stessa macro-categoria degli item corretti ma mai mostrate nella lista.
- **Non ripetizione**: un'immagine non si riusa entro 10 sessioni.
- **Dataset minimo**: ~300 emoji categorizzate.

---

## Esercizio 3 — Riconoscimento parole

**id JSON**: `memoria_lista_parole_riconoscimento`
**Costrutto**: memoria episodica verbale — riconoscimento.

### Istruzioni utente

> *"Leggi con attenzione le parole che appaiono una alla volta. Poi farai una breve attività. Dopo ti mostreremo molte parole: tocca tutte quelle che hai visto prima."*

### Risposta

**Griglia** con N item corretti + M foil. L'utente tappa tutti quelli visti nella lista. Foil diventano progressivamente più simili semanticamente agli item corretti con il livello.

| Lv | N foil | Tipo foil |
| :---- | :---- | :---- |
| 1–4 | 4 | semanticamente distanti |
| 5–8 | 6 | semi-correlati (stessa area tematica) |
| 9–13 | 8 | correlati (stessa categoria) |
| 14–17 | 10 | molto correlati (sinonimi, iponimi) |
| 18–20 | 12 | quasi-sinonimi o forme morfologiche simili |

### Generazione stimoli

Stessa fonte di Esercizio 1. Foil selezionati dal NVdB per livello di similarità semantica con gli item corretti.

---

## Esercizio 4 — Riconoscimento immagini

**id JSON**: `memoria_lista_immagini_riconoscimento`
**Costrutto**: memoria episodica visiva — riconoscimento. Confrontabile con Esercizio 3 per profilo memoria visiva vs verbale.

### Istruzioni utente

> *"Guarda le immagini una alla volta. Poi farai una breve attività. Dopo ti mostreremo molte immagini: tocca tutte quelle che hai visto prima."*

### Risposta

**Griglia** con N item corretti + M foil (stessa logica di Esercizio 3 ma con immagini). Foil diventano visivamente più simili agli item corretti con il livello.

| Lv | N foil | Tipo foil |
| :---- | :---- | :---- |
| 1–4 | 4 | categoria diversa |
| 5–8 | 6 | stessa macro-categoria |
| 9–13 | 8 | stessa sotto-categoria |
| 14–20 | 10–12 | visivamente molto simili (stessa specie/oggetto variante) |

### Generazione stimoli

Stessa fonte di Esercizio 2.

---

## JSON di configurazione esempio

```json
{
  "family": "memoria_lista",
  "sharedLevelTable": {
    "1":  { "nItems": 4,  "presentationSpeedMs": 2000, "delayS": 30,  "interference": false, "trialsPerSession": 5 },
    "14": { "nItems": 10, "presentationSpeedMs": 1200, "delayS": 120, "interference": true,  "trialsPerSession": 2 },
    "20": { "nItems": 12, "presentationSpeedMs": 1000, "delayS": 180, "interference": true,  "trialsPerSession": 2 }
  },
  "exercises": [
    {
      "id": "memoria_lista_parole_rievocazione",
      "stimulusType": "parole_non_correlate",
      "classification": "MLT",
      "cognitiveDomain": "Memoria",
      "responseType": "qwerty_free_recall",
      "autocomplete": "light_dictionary_suggestion",
      "accuracyUnit": "correct_words_over_n_items",
      "stimulusGeneration": {
        "source": "NVdB_italiano",
        "constraint": "no_same_category_within_list",
        "frequencyBandByLevel": { "lv1to8": ["FO"], "lv9to15": ["FO","AU"], "lv16to20": ["FO","AU","AD"] },
        "minDataset": 500,
        "noRepetitionWithinSessions": 15
      }
    },
    {
      "id": "memoria_lista_immagini_rievocazione",
      "stimulusType": "immagini_miste",
      "classification": "MLT",
      "cognitiveDomain": "Memoria",
      "responseType": "pool_grid_recall",
      "poolGridSize": 40,
      "accuracyUnit": "correct_images_tapped_over_n_items",
      "stimulusGeneration": {
        "source": "twemoji_noto",
        "constraint": "mixed_categories",
        "foilRule": "same_macro_category_as_targets",
        "minDataset": 300,
        "noRepetitionWithinSessions": 10
      }
    },
    {
      "id": "memoria_lista_parole_riconoscimento",
      "stimulusType": "parole_non_correlate",
      "classification": "MLT",
      "cognitiveDomain": "Memoria",
      "responseType": "recognition_grid",
      "foilsByLevel": {
        "lv1to4": { "n": 4, "type": "semantically_distant" },
        "lv5to8": { "n": 6, "type": "semi_related" },
        "lv9to13": { "n": 8, "type": "same_category" },
        "lv14to17": { "n": 10, "type": "synonyms_hyponyms" },
        "lv18to20": { "n": 12, "type": "near_synonyms_morphological" }
      },
      "accuracyUnit": "correct_hits_over_n_items"
    },
    {
      "id": "memoria_lista_immagini_riconoscimento",
      "stimulusType": "immagini_miste",
      "classification": "MLT",
      "cognitiveDomain": "Memoria",
      "responseType": "recognition_grid",
      "foilsByLevel": {
        "lv1to4": { "n": 4, "type": "different_category" },
        "lv5to8": { "n": 6, "type": "same_macro_category" },
        "lv9to13": { "n": 8, "type": "same_subcategory" },
        "lv14to20": { "n": 10, "type": "visually_similar_variant" }
      },
      "accuracyUnit": "correct_hits_over_n_items"
    }
  ],
  "microProgression": {
    "parameter": "nItems",
    "increment": 1,
    "maxOverBase": 2,
    "trialsBeforeBonus": 3,
    "bonusCountsForAccuracy": false
  },
  "delayTask": "bouncing_ball_tap",
  "sessionTimer": "no_fixed_timer"
}
```
