# Famiglia — Word Chain Switching (gioco unico)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: set shifting, flessibilità cognitiva.
**Fondamento**: ispirato al principio del Trail Making Test B (Reitan, 1958) — meccanica diversa, stesso costrutto.

## Meccanica core

L'utente vede una **griglia di parole** appartenenti a 2 (lv 1–15) o 3 (lv 16–20) categorie semantiche diverse. Deve tapparle **alternando categoria per categoria**:

- prima una parola della categoria A
- poi una della categoria B
- poi di nuovo A, poi B (e ai livelli alti: A → B → C → A → B → C…)

Nessun ordine alfabetico — solo alternanza di categoria.

## Meccanica UI

Griglia di parole **color-coded per categoria** (es. parole blu = categoria A, parole rosse = categoria B).

- **Lv 1–5**: parole esplicitamente etichettate con la categoria + colore.
- **Lv 6–15**: solo il colore come cue (no etichetta testuale).
- **Lv 16–20**: 3 colori per 3 categorie.

**Tap corretto**: parola evidenziata con numero d'ordine.
**Tap sbagliato (categoria errata)**: nessun effetto negativo, l'utente deve trovare quella giusta.

## Tutorial

Griglia piccola (6 parole, 2 categorie), freccia animata che mostra l'alternanza A → B → A → B.

## Micro-progressione

−2000ms `targetTimeS` per trial bonus (max −2 step, floor 15s). Regola standard.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## Accuratezza

**Tempo di completamento + errori di categoria**.

Promozione basata sul **completamento entro la soglia tempo** del livello (`targetTimeS`).

Stessa logica atipica di Word Chain (`shared/07-catalog.md` — `promotionMetric: completion_time_le_targetTimeS`).

## Istruzioni utente

**Lv 1–5**:
> *"Tocca le parole alternando categoria: prima un [animale], poi un [frutto], poi di nuovo un [animale], e così via."*

**Lv 6–15**:
> *"Tocca le parole alternando colore: prima una parola blu, poi una rossa, poi di nuovo blu, e così via."*

**Lv 16–20**:
> *"Tocca le parole alternando colore: blu → rosso → verde → blu → rosso → verde…"*

## Tabella livelli

| Lv | N parole | N categorie | T.Lim (s) | Soglia (s) | Distanza sem. | Cue categoria |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 6 | 2 | 40 | 30 | alta | etichetta + colore |
| 2 | 6 | 2 | 40 | 28 | alta | etichetta + colore |
| 3 | 8 | 2 | 50 | 37 | alta | etichetta + colore |
| 4 | 8 | 2 | 50 | 35 | alta | etichetta + colore |
| 5 | 10 | 2 | 60 | 44 | alta | etichetta + colore |
| 6 | 10 | 2 | 60 | 42 | alta | solo colore |
| 7 | 10 | 2 | 60 | 40 | media | solo colore |
| 8 | 12 | 2 | 70 | 51 | media | solo colore |
| 9 | 12 | 2 | 70 | 49 | media | solo colore |
| 10 | 12 | 2 | 70 | 47 | media | solo colore |
| 11 | 14 | 2 | 80 | 58 | media | solo colore |
| 12 | 14 | 2 | 80 | 56 | media | solo colore |
| 13 | 14 | 2 | 80 | 54 | bassa | solo colore |
| 14 | 16 | 2 | 90 | 65 | bassa | solo colore |
| 15 | 16 | 2 | 90 | 63 | bassa | solo colore |
| 16 | 15 | 3 | 95 | 68 | alta | solo colore |
| 17 | 15 | 3 | 95 | 66 | alta | solo colore |
| 18 | 18 | 3 | 105 | 75 | media | solo colore |
| 19 | 18 | 3 | 105 | 73 | media | solo colore |
| 20 | 21 | 3 | 115 | 82 | bassa | solo colore |

**Nota**: al lv 16 N parole torna a 15 (da 16) perché con 3 categorie le parole devono essere divisibili per 3 — si mantiene carico cognitivo comparabile.

### Cambi di meccanica → schermata di avviso

- **Lv 6**: rimozione etichetta testuale, solo cue colore.
- **Lv 16**: passaggio da 2 a 3 categorie.

Entrambi i cambi richiedono la schermata di avviso descritta in `shared/02-trial-flow.md`.

## Distanza semantica

- **Alta**: categorie molto distanti (animali vs strumenti musicali; cibi vs veicoli).
- **Media**: categorie nella stessa area (frutta vs verdura; animali domestici vs selvatici).
- **Bassa**: categorie sovrapposte semanticamente (cibi vs piante; attrezzi vs oggetti casa).

## Generazione stimoli

- **Fonte**: NVdB italiano, nomi concreti.
- **Coppie/triple di categorie** selezionate per distanza semantica coerente al livello.
- **Vincolo divisibilità**: N parole sempre divisibile per N categorie (per garantire alternanza bilanciata).
- **Frequenza lessicale**:
  - lv 1–10: FO
  - lv 11–20: FO + AU
- **Non ripetizione**: stessa combinazione categorie non usata entro 8 sessioni.
- **Dataset minimo**: ~500 parole categorizzate, **almeno 30 per categoria**.

## JSON di configurazione esempio

```json
{
  "family": "word_chain_switching",
  "exercises": [
    {
      "id": "word_chain_switching_categoriale",
      "cognitiveDomain": "FunzioniEsecutive",
      "inputType": "tap_sequential_alternating",
      "levelTable": {
        "1":  { "nWords": 6,  "nCategories": 2, "timeLimitS": 40,  "targetTimeS": 30, "semanticDistance": "alta",  "categoryCue": "label_and_color", "sessionTimerS": 90 },
        "6":  { "nWords": 10, "nCategories": 2, "timeLimitS": 60,  "targetTimeS": 42, "semanticDistance": "alta",  "categoryCue": "color_only",      "sessionTimerS": 90 },
        "16": { "nWords": 15, "nCategories": 3, "timeLimitS": 95,  "targetTimeS": 68, "semanticDistance": "alta",  "categoryCue": "color_only",      "sessionTimerS": 120 },
        "20": { "nWords": 21, "nCategories": 3, "timeLimitS": 115, "targetTimeS": 82, "semanticDistance": "bassa", "categoryCue": "color_only",      "sessionTimerS": 120 }
      },
      "microProgression": {
        "parameter": "targetTimeS",
        "increment": -2,
        "floor": 15,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "switchingRule": "alternating_category_AB_or_ABC",
      "tapFeedback": { "correct": "highlight_with_order_number", "incorrect": "no_effect" },
      "stimulusGeneration": {
        "source": "NVdB_italiano",
        "nWordsPerCategory": "nWords_divided_by_nCategories",
        "frequencyBandByLevel": { "lv1to10": ["FO"], "lv11to20": ["FO","AU"] },
        "semanticDistanceByLevel": {
          "lv1to7": "alta", "lv8to15": "media_to_bassa", "lv16to20": "alta_then_bassa"
        },
        "minDataset": 500,
        "noRepetitionWithinSessions": 8
      },
      "promotionMetric": "completion_time_le_targetTimeS"
    }
  ]
}
```
