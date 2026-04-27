# Famiglia 7 — Updating WM (3 esercizi)

**Dominio cognitivo**: Funzioni Esecutive
**Classificazione**: aggiornamento della memoria di lavoro — uno dei tre componenti esecutivi classici di Miyake (insieme a inhibition e shifting).

> **Nota di catalogazione**: il GDD originale classifica Updating WM come Memoria. Riclassificato come Funzioni Esecutive perché "updating" è un costrutto esecutivo per definizione: la manipolazione attiva degli item in WM. Vedi `shared/07-catalog.md` sezione "Note di riclassificazione".
>
> **Modifica rispetto al GDD originale**: il GDD originale prevedeva 2 esercizi (`parole_immagini`, `numeri`) con la variante `parole_immagini` che cambiava tipo di stimolo intra-esercizio (parole ai livelli bassi → immagini ai livelli alti). Sono stati separati in 3 esercizi distinti per:
> - eliminare il cambio di stimolo intra-esercizio (più chiaro UX e clinicamente più pulito);
> - ottenere due misurazioni distinte: span con mediazione verbale (Parole) vs span puramente visivo (Immagini).

## Meccanica core

L'utente vede una **sequenza di stimoli** presentati uno alla volta e deve rispondere a una **domanda sull'intera sequenza** solo al termine.

La difficoltà richiede di **mantenere una rappresentazione attiva e aggiornata** di tutti gli elementi mentre arrivano.

## Struttura famiglia

3 esercizi distinti su 2 tabelle livelli:

- **Esercizi 1 e 2** (Parole + Immagini) condividono la **Tabella A** — stessa meccanica, cambia solo lo `stimulusType` (e di conseguenza il dataset). Sono varianti nel senso classico.
- **Esercizio 3** (Numeri) ha **Tabella B** separata — meccanica diversa basata su trasformazione numerica.

## Struttura trial (tutti e 3 gli esercizi)

```
Stimoli presentati uno alla volta
  → Pausa breve
  → Domanda + risposta
```

**Nessuna risposta durante la presentazione.**

## Micro-progressione

+1 elemento nella sequenza per trial bonus (max +2 oltre base). Stessa trasformazione/proprietà, sequenza più lunga → maggiore carico di aggiornamento.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

---

## Esercizi 1 e 2 — Updating WM Parole / Updating WM Immagini

**id JSON**: `updating_wm_parole`, `updating_wm_immagini`
**Costrutto**: aggiornamento WM su proprietà semantiche/percettive degli stimoli.

Le due varianti **condividono la stessa Tabella A**. Differiscono solo nel tipo di stimolo:

| ID JSON | Nome | stimulusType | Note |
| :---- | :---- | :---- | :---- |
| `updating_wm_parole` | Parole | `parole_con_icona` | Parola scritta + icona piccola affiancata. Mediazione verbale facilita il recupero della proprietà. |
| `updating_wm_immagini` | Immagini | `immagini_senza_label` | Solo emoji/icone vettoriali, nessuna parola. Richiede rappresentazione visiva pura. |

### Meccanica

Viene mostrata una sequenza di N item (oggetti/animali/luoghi) uno alla volta. A fine sequenza l'utente risponde a una **domanda su una proprietà** degli item (es. "Quale era il più grande?", "Quale era il più pesante?").

### Cue timing

- **Pre-cue (lv 1–12)**: la domanda sulla proprietà viene mostrata **PRIMA** della sequenza. L'utente sa già cosa deve tracciare e può focalizzare il confronto su una sola dimensione.
- **Post-cue (lv 13–20)**: la domanda arriva **DOPO** la sequenza. L'utente deve mantenere una rappresentazione ricca di tutti gli item su tutte le dimensioni.

### Risposta

- **MC (lv 1–10)**: 4 opzioni — risposta corretta + 3 foil **NON presenti nella sequenza**. L'utente tappa l'item corretto.
- **Richiamo da item visti (lv 11–20)**: vengono mostrati tutti gli N item della sequenza in ordine casuale. **Nessun foil esterno** — l'utente deve identificare quale tra quelli visti risponde alla domanda. Molto più difficile perché tutti gli elementi sono familiari.

### Cambi di meccanica → schermata di avviso

Tabella A ha **3 cambi di meccanica significativi** che richiedono la schermata di avviso descritta in `shared/02-trial-flow.md`:

- **Lv 11**: passaggio risposta da MC a richiamo da item visti.
- **Lv 13**: passaggio da pre-cue a post-cue.
- **Lv 15**: proprietà miste (la proprietà richiesta varia tra trial).

### Proprietà per fascia di livello

- Lv 1–5: **dimensione** (grande/piccolo) — proprietà visiva, immediata.
- Lv 6–10: dimensione + **peso** (pesante/leggero).
- Lv 11–15: + **velocità** (veloce/lento), **temperatura** (caldo/freddo).
- Lv 16–20: + **valore** (costoso/economico). Proprietà miste, una scelta a caso per sessione.

### Istruzioni utente

**Pre-cue**:
> *"Guarda gli oggetti che appaiono uno alla volta. [Domanda mostrata prima] Al termine scegli la risposta giusta."*

**Post-cue**:
> *"Guarda gli oggetti che appaiono uno alla volta. Cerca di ricordare tutto. Al termine ti faremo una domanda."*

### Tabella A (condivisa Parole + Immagini)

| Lv | N stimoli | Speed (ms) | Proprietà | Cue | Risposta | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 4 | 2500 | dimensione | pre | MC | 5 |
| 2 | 4 | 2300 | dimensione | pre | MC | 5 |
| 3 | 5 | 2300 | dimensione | pre | MC | 5 |
| 4 | 5 | 2000 | dimensione | pre | MC | 6 |
| 5 | 5 | 2000 | dimensione | pre | MC | 6 |
| 6 | 6 | 1800 | dim + peso | pre | MC | 6 |
| 7 | 6 | 1800 | dim + peso | pre | MC | 7 |
| 8 | 6 | 1600 | dim + peso | pre | MC | 7 |
| 9 | 7 | 1600 | dim + peso | pre | MC | 7 |
| 10 | 7 | 1500 | dim + peso | pre | MC | 7 |
| 11 | 7 | 1500 | + vel + temp | pre | item visti | 8 |
| 12 | 8 | 1400 | + vel + temp | pre | item visti | 8 |
| 13 | 8 | 1400 | + vel + temp | post | item visti | 8 |
| 14 | 9 | 1300 | + vel + temp | post | item visti | 8 |
| 15 | 9 | 1300 | tutte | post | item visti | 8 |
| 16 | 10 | 1200 | tutte | post | item visti | 9 |
| 17 | 10 | 1200 | tutte | post | item visti | 9 |
| 18 | 11 | 1100 | tutte | post | item visti | 9 |
| 19 | 11 | 1100 | tutte | post | item visti | 9 |
| 20 | 12 | 1000 | tutte | post | item visti | 9 |

### Generazione stimoli

#### Parole

- **Fonte**: NVdB italiano (nomi concreti) + Twemoji per l'icona affiancata.
- Ogni stimolo è una **parola scritta accompagnata da una piccola icona/emoji** della stessa entità (l'icona è ausilio visivo, la parola è lo stimolo principale).
- **Frequenza lessicale**:
  - lv 1–10: FO
  - lv 11–20: FO + AU
- **Esclusioni**: parolacce, omografi, nomi propri.

#### Immagini

- **Fonte**: solo Twemoji/Noto Emoji (categorizzate).
- Ogni stimolo è una **emoji/icona vettoriale senza alcun label testuale**.

#### Vincoli comuni a entrambe le varianti

- **Etichette obbligatorie per ogni stimolo**: valori ordinali per tutte le proprietà.
  - Esempio nave: dimensione=10, peso=10, velocità=7, temperatura=freddo, valore=8
  - Esempio penna: dimensione=1, peso=1, velocità=0, temperatura=neutro, valore=2
- **Scala**: 1–10 per proprietà quantitative.
- **Proprietà qualitative** (temperatura): scala ordinale (freddo < neutro < caldo).
- **Vincolo trial**: la risposta corretta deve essere **univoca** (nessun pareggio tra item sulla proprietà richiesta).
- **Dataset minimo**: ~200 item con metadati di proprietà completi e validati. **Stessi item** possono essere usati per entrambe le varianti (cambiano solo per come vengono presentati).
- **Non ripetizione**: un item non si riusa entro 8 trial dello stesso esercizio.

---

## Esercizio 3 — Updating WM Numeri

**id JSON**: `updating_wm_numeri`
**Costrutto**: aggiornamento WM numerico con trasformazione attiva.

### Meccanica

Viene mostrata una sequenza di N cifre una alla volta. A fine sequenza l'utente deve **riprodurre la sequenza trasformata** secondo la regola del livello.

Esempio: regola "+1 a ogni cifra" → sequenza `5-9-2` → risposta `6-10-3`.

### Risposta

- **MC (lv 1–10)**: 4 opzioni con sequenze complete trasformate (es. `6-10-3` vs `5-8-2` vs `7-9-4` vs `6-10-4`). L'utente tappa la sequenza corretta.
- **Number pad (lv 11–20)**: l'utente digita ogni cifra trasformata in ordine usando tastiera numerica 0–9. Un campo per ogni cifra della sequenza originale.

### Trasformazione per fascia di livello

- Lv 1–5: **+1** a ogni cifra (cifre 1–8, risultati 2–9).
- Lv 6–9: **−1** a ogni cifra (cifre 2–9, risultati 1–8).
- Lv 10–13: **+2 o −2** (alternato tra trial; cifre 2–7, risultati 0–9).
- Lv 14–16: **×2** (solo cifre 1–4, risultati 2–8).
- Lv 17–20: **trasformazione alternata per posizione** (cifre in posizione dispari +1, cifre in posizione pari −1).

### Cambi di meccanica → schermata di avviso

Updating WM Numeri ha **5 cambi di trasformazione** che richiedono schermata di avviso (vedi `shared/02-trial-flow.md`): lv 6, lv 10, lv 14, lv 17. Anche il passaggio a number pad al **lv 11** è un cambio significativo.

### Istruzioni utente

**Lv 1–10 (MC)**:
> *"Guarda i numeri che appaiono uno alla volta. Alla fine, scegli la sequenza trasformata corretta secondo la regola: [regola mostrata]."*

**Lv 11–20 (NP)**:
> *"Guarda i numeri uno alla volta. Alla fine scrivi ogni numero trasformato secondo la regola: [regola mostrata]."*

### Tabella B

| Lv | N cifre | Speed (ms) | Trasformazione | Risposta | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 3 | 2500 | +1 | MC | 5 |
| 2 | 3 | 2300 | +1 | MC | 5 |
| 3 | 4 | 2300 | +1 | MC | 5 |
| 4 | 4 | 2000 | +1 | MC | 6 |
| 5 | 4 | 2000 | +1 | MC | 6 |
| 6 | 5 | 1800 | −1 | MC | 6 |
| 7 | 5 | 1800 | −1 | MC | 7 |
| 8 | 5 | 1600 | +2/−2 | MC | 7 |
| 9 | 6 | 1600 | +2/−2 | MC | 7 |
| 10 | 6 | 1500 | +2/−2 | MC | 7 |
| 11 | 6 | 1500 | ×2 | NP | 8 |
| 12 | 7 | 1400 | ×2 | NP | 8 |
| 13 | 7 | 1400 | ×2 | NP | 8 |
| 14 | 8 | 1300 | alt. per posizione | NP | 8 |
| 15 | 8 | 1300 | alt. per posizione | NP | 8 |
| 16 | 9 | 1200 | alt. per posizione | NP | 9 |
| 17 | 9 | 1200 | ×2 + alt. | NP | 9 |
| 18 | 10 | 1100 | ×2 + alt. | NP | 9 |
| 19 | 10 | 1100 | ×2 + alt. | NP | 9 |
| 20 | 10 | 1000 | ×2 + alt. | NP | 9 |

### Generazione sequenze

- **Cifre** generate programmaticamente nel range compatibile con la trasformazione del livello.
- **Per MC**: 3 sequenze distrattore generate **modificando 1–2 cifre** della risposta corretta.
- **Non ripetizione**: stessa sequenza non si riusa entro 10 sessioni.

---

## JSON di configurazione esempio

```json
{
  "family": "updating_wm",
  "sharedLevelTable_AB": {
    "1":  { "nStimuli": 4,  "presentationSpeedMs": 2500, "properties": ["dimensione"],     "cueTiming": "pre",  "responseType": "MC",          "trialsPerSession": 5 },
    "13": { "nStimuli": 8,  "presentationSpeedMs": 1400, "properties": ["dim","peso","vel","temp"], "cueTiming": "post", "responseType": "items_seen",  "trialsPerSession": 8 },
    "20": { "nStimuli": 12, "presentationSpeedMs": 1000, "properties": ["all"],             "cueTiming": "post", "responseType": "items_seen",  "trialsPerSession": 9 }
  },
  "exercises": [
    {
      "id": "updating_wm_parole",
      "stimulusType": "parole_con_icona",
      "cognitiveDomain": "FunzioniEsecutive",
      "microProgression": {
        "parameter": "nStimuli",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "NVdB_italiano_and_twemoji",
        "presentation": "parola_scritta_con_icona_affiancata",
        "frequencyBandByLevel": { "lv1to10": ["FO"], "lv11to20": ["FO","AU"] },
        "requiredMetadata": ["dimensione","peso","velocita","temperatura","valore"],
        "constraint": "risposta_univoca_per_proprieta",
        "minDataset": 200,
        "noRepetitionWithinTrials": 8
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    },
    {
      "id": "updating_wm_immagini",
      "stimulusType": "immagini_senza_label",
      "cognitiveDomain": "FunzioniEsecutive",
      "microProgression": {
        "parameter": "nStimuli",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "twemoji_noto",
        "presentation": "emoji_senza_label",
        "requiredMetadata": ["dimensione","peso","velocita","temperatura","valore"],
        "constraint": "risposta_univoca_per_proprieta",
        "minDataset": 200,
        "noRepetitionWithinTrials": 8
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    },
    {
      "id": "updating_wm_numeri",
      "stimulusType": "numeri",
      "cognitiveDomain": "FunzioniEsecutive",
      "levelTable": {
        "1":  { "nDigits": 3,  "presentationSpeedMs": 2500, "transformation": "+1",        "responseType": "MC", "trialsPerSession": 5 },
        "11": { "nDigits": 6,  "presentationSpeedMs": 1500, "transformation": "x2",        "responseType": "NP", "trialsPerSession": 8 },
        "20": { "nDigits": 10, "presentationSpeedMs": 1000, "transformation": "x2_alt_pos","responseType": "NP", "trialsPerSession": 9 }
      },
      "microProgression": {
        "parameter": "nDigits",
        "increment": 1,
        "maxOverBase": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "programmatic",
        "digitRangeByTransformation": {
          "+1": [1,8], "-1": [2,9], "+2": [2,7], "-2": [3,9], "x2": [1,4], "alt_pos": [2,8]
        },
        "MC_distractors": "modify_1_to_2_digits_of_correct_sequence"
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    }
  ]
}
```
