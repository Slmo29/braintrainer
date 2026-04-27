# Famiglia 10 — Memoria Prospettica (2 esercizi)

**Dominio cognitivo**: Memoria
**Classificazione**: **MP (Memoria Prospettica)** — costrutto distinto da MBT e MLT. Il delay non è di ritenzione ma di mantenimento dell'intenzione prospettica durante un'attività cognitiva concorrente.

## Meccanica core

L'utente riceve un'**istruzione prospettica** (cosa fare quando si verificherà un evento specifico, o a intervalli regolari di tempo), poi svolge un task di attenzione selettiva come attività principale.

La risposta prospettica corretta è l'esecuzione dell'azione nel momento giusto — **non una scelta multipla**.

Fondamento: paradigma Event-based e Time-based Prospective Memory (Einstein & McDaniel, 1990).

## Struttura della sessione

**Singolo trial continuo per sessione**, articolato in 2 fasi:

**Fase 1 — Istruzione prospettica**: schermata con istruzione mostrata per **5 secondi** con esempio animato. L'utente conferma con **"Ho capito"** prima di procedere.

**Fase 2 — Task continuo**: l'utente svolge un task di attenzione selettiva — stimoli di categorie diverse scorrono sullo schermo, l'utente tocca ogni stimolo della **categoria target** designata per la sessione. Durante questo task il cue prospettico è embedded nello stream (Event-based) oppure l'utente monitora autonomamente il tempo (Time-based).

## Risposta prospettica

**Tasto "Ricordami" dedicato**, sempre visibile ma non prominente, distinto visivamente e funzionalmente dal tap del task distrattore (nessuna ambiguità tra le due risposte).

## Micro-progressione

**Non applicata** — la sessione è un singolo trial continuo. La progressione della difficoltà avviene esclusivamente attraverso i parametri della tabella livelli.

## Accuratezza

```
N_finestre_risposta_corrette / N_finestre_totali
```

**Nota**: ai livelli 1–4 con N_finestre = 3, i valori possibili sono 0%, 33%, 67%, 100% — granularità limitata ma accettabile perché la performance attesa a quei livelli è 100%.

## Timer di sessione

**Modello B — sessione a completamento** (vedi `shared/01-session-rules.md`). La sessione termina al completamento del trial (Fase 2 ha durata definita dalla tabella livelli).

---

## Esercizio 1 — Memoria Prospettica Event-based

**id JSON**: `memoria_prospettica_event_based`

### Istruzioni utente (Fase 1)

> *"Ricorda: [istruzione prospettica, es. 'Quando vedi una mela, tocca il tasto Ricordami']. Poi vedrai degli oggetti scorrere sullo schermo: tocca ogni [categoria distrattore] che vedi. Pronto? Tocca 'Ho capito' per iniziare."*

### Tabella livelli

| Lv | Durata (min) | N finestre | Salianza cue | ISI distrattore (ms) |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 2 | 3 | alta | 3000 |
| 2 | 2 | 3 | alta | 2800 |
| 3 | 3 | 3 | alta | 2500 |
| 4 | 3 | 4 | alta | 2500 |
| 5 | 3 | 4 | alta | 2200 |
| 6 | 4 | 4 | alta | 2000 |
| 7 | 4 | 4 | media | 2000 |
| 8 | 4 | 4 | media | 1800 |
| 9 | 5 | 5 | media | 1800 |
| 10 | 5 | 5 | media | 1600 |
| 11 | 5 | 5 | media | 1600 |
| 12 | 6 | 5 | media | 1500 |
| 13 | 6 | 5 | bassa | 1500 |
| 14 | 6 | 5 | bassa | 1400 |
| 15 | 7 | 6 | bassa | 1400 |
| 16 | 7 | 6 | bassa | 1300 |
| 17 | 7 | 6 | bassa | 1300 |
| 18 | 8 | 6 | bassa | 1200 |
| 19 | 8 | 6 | bassa | 1200 |
| 20 | 8 | 6 | bassa | 1100 |

### Definizione salianza cue

- **Alta (lv 1–6)**: cue categorialmente distinto dalla categoria distrattore (es. mezzo di trasporto in uno stream di animali e cibo).
- **Media (lv 7–12)**: cue nella stessa macro-categoria del distrattore ma distinguibile (es. frutto specifico in uno stream di cibo generico).
- **Bassa (lv 13–20)**: cue quasi identico ai distrattori target (es. animale della stessa specie con lieve variazione visiva, o animale categorialmente vicinissimo).

### Generazione stimoli

- **Pool**: Twemoji/Noto, 8 categorie semantiche (animali, cibo, oggetti casa, trasporti, natura, attrezzi, sport, abbigliamento).
- **Per ogni sessione**:
  - 1 categoria target per il task distrattore scelta casualmente
  - 1 cue prospettico (singolo item) da categoria diversa, con salianza coerente al livello
- **Comparizione cue**: il cue appare `N_finestre` volte nell'arco della sessione a intervalli **pseudo-casuali non predicibili** dall'utente.

---

## Esercizio 2 — Memoria Prospettica Time-based

**id JSON**: `memoria_prospettica_time_based`

### Istruzioni utente (Fase 1)

> *"Ricorda: [istruzione temporale, es. 'Tocca il tasto Ricordami ogni 2 minuti']. Poi vedrai degli oggetti scorrere sullo schermo: tocca ogni [categoria] che vedi. L'orologio in alto ti aiuterà a tenere traccia del tempo. Pronto? Tocca 'Ho capito' per iniziare."*

### Tabella livelli

| Lv | Intervallo | N finestre | Tolleranza (s) | Visibilità orologio | ISI distrattore (ms) |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 30 s | 3 | ±20 | piena | 3000 |
| 2 | 30 s | 3 | ±20 | piena | 2800 |
| 3 | 30 s | 3 | ±20 | piena | 2500 |
| 4 | 30 s | 3 | ±20 | piena | 2500 |
| 5 | 1 min | 3 | ±20 | piena | 2200 |
| 6 | 1 min | 3 | ±20 | piena | 2000 |
| 7 | 1 min | 3 | ±20 | ridotta | 2000 |
| 8 | 1 min 30 s | 3 | ±10 | ridotta | 1800 |
| 9 | 1 min 30 s | 3 | ±10 | ridotta | 1800 |
| 10 | 1 min 30 s | 3 | ±10 | ridotta | 1600 |
| 11 | 2 min | 4 | ±10 | ridotta | 1600 |
| 12 | 2 min | 4 | ±10 | ridotta | 1500 |
| 13 | 2 min | 4 | ±10 | assente | 1500 |
| 14 | 2 min | 4 | ±5 | assente | 1400 |
| 15 | 2 min | 4 | ±5 | assente | 1400 |
| 16 | 2 min | 4 | ±5 | assente | 1300 |
| 17 | 2 min | 4 | ±5 | assente | 1300 |
| 18 | 2 min | 4 | ±5 | assente | 1200 |
| 19 | 2 min | 4 | ±5 | assente | 1200 |
| 20 | 2 min | 4 | ±5 | assente | 1100 |

**Durata sessione stimata**: lv 1 ~1.5 min, lv 11–20 ~8 min.

### Definizione visibilità orologio

- **Piena (lv 1–6)**: orologio con secondi sempre visibile.
- **Ridotta (lv 7–12)**: orologio mostra solo i minuti (no secondi); scompare e ricompare ogni 30 secondi per 2 secondi.
- **Assente (lv 13–20)**: nessun orologio — l'utente monitora il tempo esclusivamente tramite stima interna.

### Generazione stimoli distrattore

Stesse regole dell'Esercizio 1 (pool Twemoji, categoria target casuale per sessione). **Nessun cue prospettico** embedded nello stream.

---

## JSON di configurazione esempio

```json
{
  "family": "memoria_prospettica",
  "exercises": [
    {
      "id": "memoria_prospettica_event_based",
      "classification": "MP",
      "cognitiveDomain": "Memoria",
      "sessionStructure": "single_continuous_trial",
      "levelTable": {
        "1":  { "durationMin": 2, "nWindows": 3, "cueSalience": "alta",  "distractorISIMs": 3000 },
        "20": { "durationMin": 8, "nWindows": 6, "cueSalience": "bassa", "distractorISIMs": 1100 }
      },
      "microProgression": null,
      "prospectiveResponse": "dedicated_button",
      "distractorTask": { "type": "selective_attention", "stimulusPool": "twemoji_categorized" },
      "accuracyUnit": "windows_correct_over_total",
      "sessionTimer": "no_fixed_timer"
    },
    {
      "id": "memoria_prospettica_time_based",
      "classification": "MP",
      "cognitiveDomain": "Memoria",
      "sessionStructure": "single_continuous_trial",
      "levelTable": {
        "1":  { "intervalS": 30,  "nWindows": 3, "toleranceS": 20, "clockVisibility": "piena",   "distractorISIMs": 3000 },
        "20": { "intervalS": 120, "nWindows": 4, "toleranceS": 5,  "clockVisibility": "assente", "distractorISIMs": 1100 }
      },
      "microProgression": null,
      "prospectiveResponse": "dedicated_button",
      "distractorTask": { "type": "selective_attention", "stimulusPool": "twemoji_categorized" },
      "accuracyUnit": "windows_correct_within_tolerance_over_total",
      "sessionTimer": "no_fixed_timer"
    }
  ]
}
```
