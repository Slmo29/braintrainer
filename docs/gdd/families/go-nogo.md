# Famiglia 12 — Go/No-Go (2 esercizi)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: inibizione motoria selettiva.

## Meccanica core

Un flusso di stimoli appare sullo schermo uno alla volta. L'utente deve:

- **tappare i stimoli Go (target)**
- **ignorare i stimoli No-Go (non-target)**

Go e No-Go si distinguono per una **dimensione esplicita** (colore o categoria semantica) che diventa progressivamente meno ovvia, e poi si arricchisce di una seconda dimensione per congiunzione (lv 14–20).

## Note sul catalogo

Gioco 67 (variante lessicale) eliminato — costrutto coperto da Lexical Decision (Linguaggio) e Go/No-Go semantico.

La modalità multimodale (congiunzione) è integrata come progressione di difficoltà ai livelli alti di entrambi gli esercizi — **non esercizio separato**.

## Varianti

| ID JSON | Nome | stimulusType |
| :---- | :---- | :---- |
| `go_nogo_cromatico` | Cromatico | `forme_colorate` |
| `go_nogo_semantico` | Semantico | `immagini_categorizzate` |

## Struttura sessione

Flusso continuo di N stimoli. Ogni sessione = N blocchi (trial). Breve pausa tra blocchi.

## Go/No-Go ratio

**~80% go + ~20% no-go** (standard clinico). Rimane fisso per tutti i livelli — la difficoltà cresce per altri parametri, non per il ratio.

## Eccezioni alle regole comuni

- **Feedback risposta**: nessun feedback per risposta corretta (il flusso non si interrompe). Solo feedback visivo discreto per errore (flash rosso breve senza bloccare il flusso). Eccezione documentata in `shared/02-trial-flow.md`.
- **Timer di sessione**: **modello B — sessione a completamento** dei blocchi previsti (durata definita da `sequenceLength × isiMs`). Stimata: ~3 min (lv 1–6), ~5 min (lv 14–20).

## Micro-progressione

−50ms ISI per trial bonus. Condizione: **≥90% go corretti E ≥90% no-go corretti** negli ultimi 3 trial.

- max −2 step (−100ms totale)
- floor 600ms

## Tabella livelli (condivisa)

| Lv | SeqLen | ISI (ms) | Salianza distinzione | Regola | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 40 | 1500 | alta | singola | 4 |
| 2 | 50 | 1400 | alta | singola | 4 |
| 3 | 60 | 1300 | alta | singola | 4 |
| 4 | 70 | 1300 | alta | singola | 4 |
| 5 | 80 | 1200 | alta | singola | 4 |
| 6 | 90 | 1200 | media | singola | 4 |
| 7 | 100 | 1100 | media | singola | 4 |
| 8 | 100 | 1100 | media | singola | 4 |
| 9 | 110 | 1000 | media | singola | 3 |
| 10 | 120 | 1000 | media | singola | 3 |
| 11 | 120 | 950 | bassa | singola | 3 |
| 12 | 130 | 950 | bassa | singola | 3 |
| 13 | 140 | 900 | bassa | singola | 3 |
| 14 | 140 | 900 | alta | congiunzione | 3 |
| 15 | 150 | 850 | alta | congiunzione | 3 |
| 16 | 160 | 850 | media | congiunzione | 3 |
| 17 | 160 | 800 | media | congiunzione | 3 |
| 18 | 170 | 800 | media | congiunzione | 2 |
| 19 | 180 | 750 | bassa | congiunzione | 2 |
| 20 | 200 | 700 | bassa | congiunzione | 2 |

**Nota**: al lv 14 la salianza torna alta perché la congiunzione introduce una nuova regola più difficile — si ricomincia con distinzione evidente prima di renderla sottile.

### Cambio meccanica → schermata di avviso

Il livello **14** introduce la regola di congiunzione (2 dimensioni invece di 1): cambio significativo che richiede la schermata di avviso descritta in `shared/02-trial-flow.md`.

---

## Esercizio 1 — Go/No-Go Cromatico

**id JSON**: `go_nogo_cromatico`

### Istruzioni

**Regola singola (lv 1–13)**:
> *"Tocca solo i [colore Go, es. cerchi verdi]. Ignora i [colore No-Go, es. cerchi rossi]."*

**Congiunzione (lv 14–20)**:
> *"Tocca solo i [colore Go + forma Go, es. cerchi verdi]. Ignora tutto il resto."*

### Salianza distinzione

- **Alta**: colori primari nettamente distinti (verde vs rosso; blu vs arancio).
- **Media**: colori con contrasto moderato (verde vs giallo; blu vs viola).
- **Bassa**: colori simili (verde vs turchese; blu vs azzurro).

### Congiunzione (lv 14–20)

La regola richiede la **co-presenza di 2 attributi** (colore + forma). Es.:

- go = verde E cerchio
- no-go = verde E quadrato, rosso E cerchio, rosso E quadrato

### Generazione stimoli

Forme geometriche (cerchio, quadrato, triangolo, stella) × colori, generati programmaticamente come SVG.

---

## Esercizio 2 — Go/No-Go Semantico

**id JSON**: `go_nogo_semantico`

### Istruzioni

**Regola singola (lv 1–13)**:
> *"Tocca solo [categoria Go, es. gli animali]. Ignora [categoria No-Go, es. gli oggetti]."*

**Congiunzione (lv 14–20)**:
> *"Tocca solo [sotto-categoria Go, es. gli animali domestici]. Ignora tutto il resto."*

### Salianza distinzione

- **Alta**: categorie semanticamente distanti (animali vs strumenti; cibo vs veicoli).
- **Media**: categorie nella stessa area (animali vs piante; cibo vs bevande).
- **Bassa**: sotto-categorie vicine (animali domestici vs animali selvatici; frutta vs verdura).

### Congiunzione (lv 14–20)

La regola richiede **categoria + proprietà**:

- go = animale E domestico
- no-go = animale E selvatico, oggetto qualsiasi

### Generazione stimoli

- **Fonte**: Twemoji/Noto Emoji per immagini + NVdB per variante parole.
- **Frequenza lessicale**:
  - lv 1–8: FO
  - lv 9–15: FO + AU
  - lv 16–20: FO + AU + AD
- **Etichette obbligatorie**: categoria, sotto-categoria, proprietà.
- **Dataset minimo**: ~200 item categorizzati con attributi.

## JSON di configurazione esempio

```json
{
  "family": "go_nogo",
  "exercises": [
    {
      "id": "go_nogo_cromatico",
      "stimulusType": "forme_colorate",
      "cognitiveDomain": "FunzioniEsecutive",
      "goNoGoRatio": { "go": 0.80, "nogo": 0.20 },
      "levelTable": {
        "1":  { "sequenceLength": 40,  "isiMs": 1500, "saliency": "alta",  "rule": "singola",      "trialsPerSession": 4 },
        "14": { "sequenceLength": 140, "isiMs": 900,  "saliency": "alta",  "rule": "congiunzione", "trialsPerSession": 3 },
        "20": { "sequenceLength": 200, "isiMs": 700,  "saliency": "bassa", "rule": "congiunzione", "trialsPerSession": 2 }
      },
      "ruleDefinitionByLevel": {
        "lv1to13": { "dimensions": ["colore"], "goExample": "verde", "nogoExample": "rosso" },
        "lv14to20": { "dimensions": ["colore","forma"], "goExample": "verde+cerchio", "nogoExample": "tutto_il_resto" }
      },
      "microProgression": {
        "parameter": "isiMs",
        "increment": -50,
        "floor": 600,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCondition": "ge90pct_go_correct_and_ge90pct_nogo_correct",
        "bonusCountsForAccuracy": false
      },
      "sessionTimer": "no_fixed_timer"
    },
    {
      "id": "go_nogo_semantico",
      "stimulusType": "immagini_categorizzate",
      "cognitiveDomain": "FunzioniEsecutive",
      "goNoGoRatio": { "go": 0.80, "nogo": 0.20 },
      "levelTable": {
        "1":  { "sequenceLength": 40,  "isiMs": 1500, "saliency": "alta",  "rule": "singola",      "trialsPerSession": 4 },
        "14": { "sequenceLength": 140, "isiMs": 900,  "saliency": "alta",  "rule": "congiunzione", "trialsPerSession": 3 },
        "20": { "sequenceLength": 200, "isiMs": 700,  "saliency": "bassa", "rule": "congiunzione", "trialsPerSession": 2 }
      },
      "ruleDefinitionByLevel": {
        "lv1to13": { "dimensions": ["categoria"], "goExample": "animali", "nogoExample": "oggetti" },
        "lv14to20": { "dimensions": ["categoria","proprieta"], "goExample": "animali_domestici", "nogoExample": "tutto_il_resto" }
      },
      "microProgression": {
        "parameter": "isiMs",
        "increment": -50,
        "floor": 600,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCondition": "ge90pct_go_correct_and_ge90pct_nogo_correct",
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "twemoji_noto_and_NVdB",
        "requiredMetadata": ["categoria","sotto_categoria","proprieta"],
        "frequencyBandByLevel": { "lv1to8": ["FO"], "lv9to15": ["FO","AU"], "lv16to20": ["FO","AU","AD"] },
        "minDataset": 200
      },
      "sessionTimer": "no_fixed_timer"
    }
  ]
}
```
