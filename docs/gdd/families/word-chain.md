# Famiglia — Word Chain (gioco unico)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: sequenziamento, scanning visivo, velocità di elaborazione.
**Fondamento**: ispirato al principio del Trail Making Test A (Reitan, 1958) — meccanica diversa, stesso costrutto.

> **Nota di catalogazione**: il riepilogo del catalogo nel GDD originale classifica Word Chain come Attenzione, ma la scheda dettagliata e il JSON di configurazione lo classificano come Funzioni Esecutive. Si è scelto Funzioni Esecutive come fonte di verità (è la classificazione presente nelle specifiche di sviluppo). Vedi `shared/07-catalog.md` sezione "Note di riclassificazione".

## Meccanica core

L'utente vede una **griglia di parole** in ordine casuale. Deve **tapparle in sequenza seguendo l'ordine alfabetico della loro lettera iniziale** (A → B → C → D…).

Ogni parola tappata nell'ordine corretto si evidenzia; un tap sbagliato non viene accettato (no effetto visivo negativo, evita frustrazione — la parola semplicemente non viene accettata e l'utente deve trovare quella giusta).

## Meccanica UI

- Griglia di parole disposte casualmente nello spazio.
- Tap sulla parola con la lettera iniziale corretta in sequenza alfabetica.
- **Tap errato**: nessun effetto visivo negativo, la parola non viene accettata.
- **Tap corretto**: la parola si evidenzia con colore diverso e mostra il **numero d'ordine** (1, 2, 3...).

## Tutorial

Griglia piccola (5 parole) con **freccia animata** che indica la sequenza A → B → C.

## Micro-progressione

−2000ms `targetTimeS` per trial bonus (max −2 step, floor 15s). Regola standard di `shared/03-progression.md`.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## Accuratezza

**Tempo impiegato per completare la sequenza + errori di tap**.

Promozione basata sul **completamento entro la soglia tempo del livello** (`targetTimeS`). Cioè: il trial è "corretto" se `tempo_completamento ≤ targetTimeS`.

## Istruzioni utente

> *"Tocca le parole nell'ordine alfabetico della loro prima lettera: prima quella che inizia per A, poi per B, poi per C, e così via."*

## Tabella livelli

| Lv | N parole | T.Lim (s) | Soglia tempo (s) | Distanza semantica |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 5 | 40 | 30 | alta (categorie diverse) |
| 2 | 6 | 45 | 33 | alta |
| 3 | 7 | 50 | 37 | alta |
| 4 | 7 | 50 | 35 | alta |
| 5 | 8 | 55 | 40 | alta |
| 6 | 8 | 55 | 38 | media |
| 7 | 9 | 60 | 44 | media |
| 8 | 9 | 60 | 42 | media |
| 9 | 10 | 65 | 48 | media |
| 10 | 10 | 65 | 46 | media |
| 11 | 12 | 75 | 55 | media |
| 12 | 12 | 75 | 53 | media |
| 13 | 13 | 80 | 58 | bassa |
| 14 | 13 | 80 | 56 | bassa |
| 15 | 14 | 85 | 62 | bassa |
| 16 | 15 | 90 | 65 | bassa |
| 17 | 16 | 95 | 68 | bassa |
| 18 | 17 | 100 | 72 | bassa |
| 19 | 18 | 105 | 76 | bassa |
| 20 | 20 | 110 | 80 | bassa |

## Distanza semantica

- **Alta**: parole da categorie molto diverse (es. animale, colore, veicolo, frutto, mestiere) — facili da distinguere visivamente per categoria.
- **Media**: parole da 2–3 categorie miste — alcune coppie simili.
- **Bassa**: tutte le parole dalla stessa categoria semantica (es. tutti animali, tutti cibi) — massimo carico di scanning perché le parole si somigliano visivamente e semanticamente.

## Nota implementativa: copertura alfabeto

Ogni lettera dell'alfabeto italiano (21 lettere) deve essere rappresentata almeno una volta nel pool di parole.

Le lettere **J, K, W, X, Y** usate solo per parole di uso comune (es. "jeans", "kiwi", "web").

## Generazione stimoli

- **Fonte**: NVdB italiano, nomi concreti.
- **Per ogni trial**: selezione di N parole con lettere iniziali consecutive nell'alfabeto italiano (es. per N=5: A, B, C, D, E — o qualsiasi finestra di 5 lettere consecutive).
- **Frequenza lessicale**:
  - lv 1–10: FO
  - lv 11–20: FO + AU
- **Distanza semantica garantita per livello**:
  - lv 1–5: categorie diverse (alta)
  - lv 6–12: miste (media)
  - lv 13–20: stessa categoria (bassa)
- **Non ripetizione**: stessa combinazione di parole non usata entro 10 sessioni.
- **Dataset minimo**: ~600 parole con lettera iniziale e categoria semantica etichettate, **almeno 20 per lettera**.

## JSON di configurazione esempio

```json
{
  "family": "word_chain",
  "exercises": [
    {
      "id": "word_chain_alfabetico",
      "cognitiveDomain": "FunzioniEsecutive",
      "inputType": "tap_sequential",
      "levelTable": {
        "1":  { "nWords": 5,  "timeLimitS": 40,  "targetTimeS": 30, "semanticDistance": "alta",  "sessionTimerS": 90 },
        "13": { "nWords": 13, "timeLimitS": 80,  "targetTimeS": 58, "semanticDistance": "bassa", "sessionTimerS": 120 },
        "20": { "nWords": 20, "timeLimitS": 110, "targetTimeS": 80, "semanticDistance": "bassa", "sessionTimerS": 120 }
      },
      "microProgression": {
        "parameter": "targetTimeS",
        "increment": -2,
        "floor": 15,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "sequenceRule": "alphabetical_by_initial_letter",
      "tapFeedback": { "correct": "highlight_with_order_number", "incorrect": "no_effect" },
      "stimulusGeneration": {
        "source": "NVdB_italiano",
        "letterCoverage": "consecutive_alphabet_window",
        "frequencyBandByLevel": { "lv1to10": ["FO"], "lv11to20": ["FO","AU"] },
        "semanticDistanceByLevel": {
          "lv1to5": "alta", "lv6to12": "media", "lv13to20": "bassa"
        },
        "minDataset": 600,
        "noRepetitionWithinSessions": 10
      },
      "promotionMetric": "completion_time_le_targetTimeS"
    }
  ]
}
```
